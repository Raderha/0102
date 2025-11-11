# 면접 라우터 (분석, 기록 조회)

from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Path
import json
from datetime import datetime
from google.genai.errors import APIError
from firebase_admin import firestore
from models import InterviewAnalysisResponse, InterviewHistory, InterviewHistoryItem, Feedback
from database import get_firestore_db
from services import gemini_service, stt_service

router = APIRouter(prefix="/api/interview", tags=["interview"])

@router.post("/analyze", response_model=InterviewAnalysisResponse)
async def analyze_interview(
    question: str = Form(...), 
    audio_file: UploadFile = File(...),
    user_id: str = Form("default_user") 
):
    """
    면접 질문과 음성 답변을 받아 Gemini로 분석 피드백을 받고 Firestore에 저장합니다.
    """
    
    # 1. STT 결과 처리 (Mock STT 함수 호출)
    mock_stt_response = await stt_service.analyze_speech_mock(audio_file)
    transcribed_text = mock_stt_response.transcribed_text
    
    # 2. Gemini API 호출을 위한 프롬프트 정의
    system_prompt = f"""
    당신은 IT 기업의 소프트웨어 엔지니어링 면접관입니다.
    다음 질문과 (가상의) 구직자 답변을 분석하고, 한국어로 구체적인 피드백을 JSON 형식으로만 출력하세요.

    <요청된 JSON 형식>:
    {{
        "relevance_score": (1~5점 정수),
        "logic_score": (1~5점 정수),
        "improvement_advice": "(구체적인 개선 조언 100자 이상)",
        "follow_up_question": "(이 답변을 바탕으로 던질 수 있는 가장 날카로운 꼬리 질문 1개)"
    }}

    ---
    면접 질문: {question}
    구직자 답변: {transcribed_text}
    ---
    
    반드시 JSON 형식만 출력하며, JSON 외의 다른 설명 텍스트는 포함하지 마세요.
    """
    
    try:
        json_string = gemini_service.generate_content(system_prompt, response_mime_type="application/json")
        raw_feedback_data = json.loads(json_string)
        feedback_model = Feedback(**raw_feedback_data)
        
        # 3. Firestore에 결과 저장
        firestore_db = get_firestore_db()
        timestamp = datetime.now().isoformat()
        record_data = {
            "question": question,
            "transcribed_text": transcribed_text,
            "feedback": feedback_model.model_dump(), 
            "user_id": user_id,
            "timestamp": timestamp
        }
        
        if firestore_db:
            firestore_db.collection("interviews").add(record_data)
        else:
            print("경고: Firestore가 초기화되지 않아 DB 저장을 건너뜁니다.")

        return InterviewAnalysisResponse(
            status="success",
            question=question,
            transcribed_text=transcribed_text,
            feedback=feedback_model,
            user_id=user_id,
            timestamp=timestamp
        )

    except APIError as e:
        print(f"Gemini API 호출 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail="Gemini API 오류 발생. 무료 사용 한도를 초과했거나 키 문제일 수 있습니다.")
    except Exception as e:
        print(f"Gemini 분석 중 기타 오류 발생: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"서버 내부 오류: {type(e).__name__}: {str(e)}")

@router.get("/{user_id}", response_model=InterviewHistory)
async def get_interview_history(user_id: str = Path(...)):
    """
    특정 사용자 ID의 모든 면접 기록을 조회합니다.
    """
    firestore_db = get_firestore_db()
    if not firestore_db:
        raise HTTPException(status_code=500, detail="DB 서버가 초기화되지 않았습니다.")

    try:
        # Firestore 쿼리: user_id가 일치하는 모든 문서 조회
        query = firestore_db.collection("interviews").where("user_id", "==", user_id).order_by("timestamp", direction=firestore.Query.DESCENDING).get()
        
        records = []
        for doc in query:
            data = doc.to_dict()
            
            # DB에 저장된 데이터를 응답 모델에 맞춥니다.
            record = InterviewHistoryItem(
                interview_id=doc.id, 
                status="success",
                question=data.get('question', 'N/A'),
                transcribed_text=data.get('transcribed_text', 'N/A'),
                feedback=Feedback(**data.get('feedback', {})),
                user_id=data.get('user_id', 'N/A'),
                timestamp=data.get('timestamp', 'N/A')
            )
            records.append(record)

        return InterviewHistory(
            status="success",
            count=len(records),
            records=records
        )

    except Exception as e:
        print(f"DB 조회 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail=f"DB 조회 중 오류 발생: {str(e)}")

