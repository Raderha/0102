# 이력서 라우터 (업로드, 질문 생성)

from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Query
import json
import io
from datetime import datetime
from pypdf import PdfReader
from models import ResumeAnalysis, QuestionListResponse
from database import get_firestore_db
from firebase_admin import firestore
from services import gemini_service

router = APIRouter(prefix="/api", tags=["resume"])

@router.post("/resume/upload", response_model=ResumeAnalysis)
async def upload_resume(
    user_id: str = Form(...),
    job_field: str = Form(...),
    resume_file: UploadFile = File(...)
):
    """
    UC2-REQ-1/2/3: PDF를 업로드 받아 텍스트 추출, AI 분석 및 DB에 저장합니다.
    """
    firestore_db = get_firestore_db()
    if not firestore_db:
         raise HTTPException(status_code=500, detail="DB 서비스가 초기화되지 않았습니다.")
    
    if not resume_file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="PDF 형식 파일만 지원합니다.")

    try:
        # 1. 파일 내용 읽기 및 텍스트 추출
        file_content = await resume_file.read()
        pdf_reader = PdfReader(io.BytesIO(file_content))
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() or ""
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="PDF에서 텍스트를 추출할 수 없습니다. 이미지 기반 PDF일 수 있습니다.")
        
        # 2. Gemini를 이용한 핵심 역량 키워드 추출 (UC3-REQ-2)
        analysis_prompt = f"""
        당신은 전문 채용 담당자입니다. 아래 이력서 텍스트를 분석하여, 해당 구직자의 핵심 역량 및 주요 키워드를 5가지 이내로 콤마(,)로 구분하여 한 줄로 요약해 주세요.
        이력서 내용: {extracted_text[:4000]} # 최대 4000자만 분석
        """
        
        analysis_keywords = gemini_service.generate_content(analysis_prompt)
        
        # 3. Firestore에 이력서 정보 저장 (RESUME 테이블 대체)
        timestamp = datetime.now().isoformat()
        resume_data = {
            "file_name": resume_file.filename,
            "extracted_text": extracted_text[:10000],
            "analysis_keywords": analysis_keywords,
            "job_field": job_field,
            "uploaded_at": timestamp
        }
        
        # 사용자별 서브컬렉션에 저장
        firestore_db.collection("users").document(user_id).collection("resumes").add(resume_data)

        # 4. 사용자 프로필 업데이트 (희망 직종)
        firestore_db.collection("users").document(user_id).update({"desiredJob": job_field})
        
        return ResumeAnalysis(
            user_id=user_id,
            job_field=job_field,
            analysis_keywords=analysis_keywords
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이력서 처리 중 서버 오류 발생: {str(e)}")

@router.get("/question/generate", response_model=QuestionListResponse)
async def generate_questions(user_id: str = Query(...)):
    """
    UC3-REQ-3: 사용자 이력서 분석 결과를 바탕으로 맞춤 면접 질문 리스트를 생성합니다.
    """
    firestore_db = get_firestore_db()
    if not firestore_db:
         raise HTTPException(status_code=500, detail="DB 서비스가 초기화되지 않았습니다.")

    try:
        # 1. Firestore에서 최신 이력서 및 사용자 정보 로드
        resume_query = firestore_db.collection("users").document(user_id).collection("resumes").order_by("uploaded_at", direction=firestore.Query.DESCENDING).limit(1).get()
        user_doc_ref = firestore_db.collection("users").document(user_id).get()
        
        if not user_doc_ref.exists:
             raise HTTPException(status_code=404, detail="사용자 정보를 찾을 수 없습니다.")
        
        user_doc = user_doc_ref.to_dict()
        
        if not resume_query:
            raise HTTPException(status_code=404, detail="업로드된 이력서가 없습니다. 먼저 이력서를 업로드하세요.")

        latest_resume = resume_query[0].to_dict()
        job_field = user_doc.get("desiredJob", "소프트웨어 엔지니어")
        keywords = latest_resume.get("analysis_keywords", "경험")

        # 2. Gemini를 이용한 맞춤 질문 리스트 생성
        question_prompt = f"""
        당신은 전문 면접 출제자입니다. 다음 키워드와 직종을 기반으로 구직자에게 질문할 면접 질문 5개를 생성하세요.
        - 직종: {job_field}
        - 핵심 키워드: {keywords}
        
        질문은 반드시 다음 JSON 형식의 Python list[str] 형태의 문자열로만 응답해야 합니다.
        ["질문 1", "질문 2", "질문 3", "질문 4", "질문 5"]
        """
        
        response_text = gemini_service.generate_content(question_prompt, response_mime_type="application/json")
        question_list = json.loads(response_text)
        
        return QuestionListResponse(
            status="success",
            question_list=question_list,
            analysis_summary=ResumeAnalysis(
                user_id=user_id, 
                job_field=job_field,
                analysis_keywords=keywords
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"질문 생성 중 서버 오류 발생: {str(e)}")

