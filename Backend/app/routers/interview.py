# app/routers/interview.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Path
from datetime import datetime
from pypdf import PdfReader
from firebase_admin import firestore
import io

# DB 및 모델 임포트
from app.database import get_db
# 모델 파일 분리 여부에 따라 경로는 app.models 또는 app.models.interview 등으로 맞춰주세요.
# (여기서는 기존 통합 models.py 기준으로 작성했습니다.)
from app.models import (
    ResumeAnalysisResult, QuestionListResponse, InterviewResponse, 
    AnalysisDetail, InterviewHistory, InterviewHistoryItem, SimpleResponse
)
from app.services import ai_service, stt_service

router = APIRouter(prefix="/api", tags=["Interview"])

# -------------------------------------------------------------------
# [UC-2] 이력서 업로드
# -------------------------------------------------------------------
@router.post("/resume/upload", response_model=ResumeAnalysisResult)
async def upload_resume(
    user_id: str = Form(...),
    job_field: str = Form("미지정"),
    resume_file: UploadFile = File(...)
):
    # 1. PDF 형식 검증
    if not resume_file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="PDF 파일만 지원합니다.")

    # 2. 텍스트 추출
    try:
        content = await resume_file.read()
        pdf = PdfReader(io.BytesIO(content))
        text = "".join([page.extract_text() or "" for page in pdf.pages])
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="PDF에서 텍스트를 추출할 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF 처리 중 오류: {str(e)}")

    # 3. AI 이력서 분석
    try:
        keywords = await ai_service.analyze_resume_text(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 분석 실패: {str(e)}")
    
    # 4. DB 저장
    db = get_db()
    resume_data = {
        "file_name": resume_file.filename,
        "extracted_text": text[:10000],
        "analysis_keywords": keywords,
        "job_field": job_field,
        "uploaded_at": datetime.now().isoformat()
    }
    
    db.collection("users").document(user_id).collection("resumes").add(resume_data)
    db.collection("users").document(user_id).update({"desiredJob": job_field})
    
    return ResumeAnalysisResult(user_id=user_id, job_field=job_field, analysis_keywords=keywords)


# -------------------------------------------------------------------
# [UC-3] 맞춤 질문 생성
# -------------------------------------------------------------------
@router.get("/question/generate", response_model=QuestionListResponse)
async def generate_questions(user_id: str):
    db = get_db()
    
    # 최근 이력서 조회
    resumes = db.collection("users").document(user_id).collection("resumes")\
                .order_by("uploaded_at", direction="DESCENDING").limit(1).get()
    
    if not resumes:
        raise HTTPException(status_code=404, detail="등록된 이력서가 없습니다.")
        
    resume_data = resumes[0].to_dict()
    job = resume_data.get("job_field", "IT 개발 직군")
    if job == "미지정": 
        job = "IT 개발 직군"

    # AI 질문 생성
    try:
        questions = await ai_service.generate_interview_questions(
            job,
            resume_data.get("analysis_keywords", "열정, 협업")
        )
        
        # 세션 저장 (나중에 분석할 때 쓰임)
        session_data = {
            "questions": questions,
            "created_at": datetime.now().isoformat(),
            "job_field": job
        }
        db.collection("users").document(user_id).collection("sessions").document("latest").set(session_data)

    except Exception as e:
        print(f"질문 생성 오류: {e}")
        raise HTTPException(status_code=500, detail="질문 생성 실패")
    
    return QuestionListResponse(
        status="success", 
        question_list=questions,
        analysis_summary=ResumeAnalysisResult(
            user_id=user_id,
            job_field=job,
            analysis_keywords=resume_data.get("analysis_keywords")
        )
    )


# -------------------------------------------------------------------
# [UC-5] 면접 분석 (⭐ 핵심 수정: 에러 발생 시 DB 저장 원천 차단)
# -------------------------------------------------------------------
@router.post("/interview/analyze", response_model=InterviewResponse)
async def analyze_interview(
    question_index: int = Form(...),
    audio_file: UploadFile = File(...),
    user_id: str = Form(...),
    is_public: int = Form(0) 
):
    db = get_db()

    # 1. [검증] 질문 데이터 가져오기
    try:
        session_ref = db.collection("users").document(user_id).collection("sessions").document("latest").get()
        if not session_ref.exists:
            raise HTTPException(status_code=404, detail="질문 세션이 만료되었습니다. 다시 생성해주세요.")
        
        questions = session_ref.to_dict().get("questions", [])
        if question_index < 0 or question_index >= len(questions):
            raise HTTPException(status_code=400, detail="유효하지 않은 질문 번호입니다.")
            
        target_question = questions[question_index] 

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"DB 조회 오류: {e}")
        raise HTTPException(status_code=500, detail="서버 내부 오류 (DB 조회 실패)")

    # 2. [검증] STT 변환 (실패 시 여기서 즉시 종료 🛑)
    try:
        audio_content = await audio_file.read()
        transcribed_text = await stt_service.transcribe_audio(audio_content, audio_file.filename)
        
        # 텍스트가 비어있거나 에러 메시지가 포함된 경우 방어
        if not transcribed_text or "Error" in transcribed_text or "failed" in transcribed_text.lower():
             raise ValueError(f"변환된 텍스트가 유효하지 않습니다: {transcribed_text}")

    except Exception as e:
        print(f"❌ STT 오류 발생: {e}")
        # ⭐ 여기서 에러를 던져서, 아래쪽 DB 저장 코드가 실행되지 않게 함
        raise HTTPException(status_code=400, detail=f"음성 인식(STT) 실패: {str(e)}")
    
    # 3. [검증] AI 분석 (실패 시 여기서 즉시 종료 🛑)
    try:
        feedback_json = await ai_service.evaluate_answer(target_question, transcribed_text)
        feedback_obj = AnalysisDetail(**feedback_json)
    except Exception as e:
        print(f"❌ AI 분석 오류: {e}")
        # ⭐ AI 분석 실패 시에도 저장하지 않고 종료
        raise HTTPException(status_code=500, detail=f"AI 답변 분석 실패: {str(e)}")
    
    # =================================================================
    # ✅ 안전지대: 위 모든 단계(1,2,3)가 성공해야만 아래 코드가 실행됨
    # =================================================================

    # 4. 내 기록(Private)에 저장
    try:
        answer_data = {
            "question_index": question_index,
            "question": target_question,
            "transcribed_text": transcribed_text,
            "analysis_result": feedback_json,
            "created_at": datetime.now().isoformat(),
            "is_public": is_public
        }
        db.collection("users").document(user_id).collection("interviews").add(answer_data)
    except Exception as e:
        print(f"DB 저장 오류: {e}")
        raise HTTPException(status_code=500, detail="결과 저장 중 오류가 발생했습니다.")

    # 5. 게시판(Board) 자동 등록 (공개 설정 시)
    if is_public == 1:
        try:
            # 사용자 정보 조회 (이름/직무)
            user_doc = db.collection("users").document(user_id).get()
            writer_name = "익명"
            job_field = "미지정"
            
            if user_doc.exists:
                u_data = user_doc.to_dict()
                writer_name = u_data.get("name", "익명")
                job_field = u_data.get("desiredJob", "미지정")

            # 게시판 데이터 생성
            board_data = {
                "user_id": user_id,
                "writer_name": writer_name,
                "job_field": job_field,
                "question": target_question,
                "answer": transcribed_text,
                "feedback_summary": feedback_obj.improvement_advice,
                "created_at": datetime.now().isoformat(),
                "views": 0
            }
            db.collection("board").add(board_data)
            print(f"📢 [Board] 게시글 등록 성공: {writer_name}")

        except Exception as e:
            # 게시판 등록은 실패해도 사용자는 결과를 봐야 하므로 로그만 남김
            print(f"⚠️ 게시판 등록 실패: {e}")

    return InterviewResponse(
        status="success",
        question=target_question,
        transcribed_text=transcribed_text,
        feedback=feedback_obj,
        timestamp=answer_data["created_at"]
    )


# -------------------------------------------------------------------
# [UC-7] 면접 기록 조회
# -------------------------------------------------------------------
@router.get("/interviews/{user_id}", response_model=InterviewHistory)
async def get_interview_history(user_id: str = Path(...)):
    try:
        db = get_db()
        # 최신순 정렬
        query = db.collection("users").document(user_id).collection("interviews")\
                  .order_by("created_at", direction=firestore.Query.DESCENDING).get()
        
        records = []
        for doc in query:
            data = doc.to_dict()
            feedback_data = data.get('analysis_result', {})
            
            # 데이터 방어 로직 (옛날 데이터 호환성)
            if not feedback_data:
                feedback_data = {
                    "relevance_score": 0, "logic_score": 0,
                    "improvement_advice": "분석 데이터 없음", "follow_up_question": "-"
                }

            records.append(InterviewHistoryItem(
                interview_id=doc.id,
                question=data.get('question', ''),
                transcribed_text=data.get('transcribed_text', ''),
                feedback=AnalysisDetail(**feedback_data),
                timestamp=data.get('created_at', '')
            ))
            
        return InterviewHistory(status="success", count=len(records), records=records)
        
    except Exception as e:
        print(f"조회 오류: {e}")
        raise HTTPException(status_code=500, detail="기록 조회 실패")


# -------------------------------------------------------------------
# [UC-New] 과거 면접 기록 공유하기 (수동 공유)
# -------------------------------------------------------------------
@router.post("/interview/{interview_id}/share", response_model=SimpleResponse)
async def share_past_interview(
    interview_id: str = Path(..., description="공유할 기록 ID"),
    user_id: str = Form(..., description="사용자 ID")
):
    db = get_db()
    
    try:
        # 1. 기록 찾기
        doc_ref = db.collection("users").document(user_id).collection("interviews").document(interview_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="기록을 찾을 수 없습니다.")
            
        data = doc.to_dict()
        
        # 2. 사용자 정보 가져오기
        user_doc = db.collection("users").document(user_id).get()
        writer_name = "익명"
        job_field = "미지정"
        if user_doc.exists:
            u_data = user_doc.to_dict()
            writer_name = u_data.get("name", "익명")
            job_field = u_data.get("desiredJob", "미지정")
            
        # 3. 분석 내용 추출
        feedback_data = data.get("analysis_result", {})
        advice = feedback_data.get("improvement_advice", "내용 없음")

        # 4. 게시판에 복사
        board_data = {
            "user_id": user_id,
            "writer_name": writer_name,
            "job_field": job_field,
            "question": data.get("question", ""),
            "answer": data.get("transcribed_text", ""),
            "feedback_summary": advice,
            "created_at": datetime.now().isoformat(),
            "views": 0
        }
        
        db.collection("board").add(board_data)
        
        return SimpleResponse(status="success", message="게시판에 공유되었습니다.")

    except Exception as e:
        print(f"공유 오류: {e}")
        raise HTTPException(status_code=500, detail="공유 실패")