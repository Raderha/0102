# JobReady 백엔드 통합 서버 (FastAPI + Gemini + Firestore)
# 이 파일은 회원가입/로그인, 이력서 분석, 질문 생성, 면접 분석 및 DB 저장을 모두 처리합니다.

from dotenv import load_dotenv
import os
import tempfile
import json
import io
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Path, Query
from pydantic import BaseModel
from pydantic_core import PydanticCustomError

# PDF 처리 라이브러리 (이력서 업로드용)
from pypdf import PdfReader 

# Gemini API (AI 분석)
from google import genai
from google.genai import types
from google.genai.errors import APIError

# CORS (프론트엔드 연동)
from fastapi.middleware.cors import CORSMiddleware 

# Firestore (데이터베이스) 및 Auth (인증)
import firebase_admin
from firebase_admin import credentials, firestore, auth
from google.cloud.firestore import Client # 타입 힌트용


# ------------------------------------------------------
# 1. 환경 변수 로드 및 API Key 설정
# ------------------------------------------------------
load_dotenv()

# 환경 변수에서 Key를 불러옵니다.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("경고: GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. AI 분석 API는 Mock 응답을 반환할 수 있습니다.")

# Gemini 클라이언트 초기화
gemini_client = genai.Client(api_key=GEMINI_API_KEY)


# ------------------------------------------------------
# 2. Firestore 초기화 및 연결
# ------------------------------------------------------
try:
    # 서비스 계정 키 파일을 사용해 Firebase Admin SDK 초기화
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    firestore_db: Client = firestore.client()
    print("Firestore 초기화 성공!")
except FileNotFoundError:
    print("경고: serviceAccountKey.json 파일을 찾을 수 없습니다. DB 연동 기능이 작동하지 않습니다.")
except Exception as e:
    print(f"Firestore 초기화 실패: {e}")


# ------------------------------------------------------
# 3. Pydantic 응답 모델 정의
# ------------------------------------------------------

# 헬스 체크 응답 모델
class HealthCheckResponse(BaseModel):
    status: str
    message: str

# 인증 응답 모델 (UC-1)
class UserCredentials(BaseModel):
    email: str
    password: str
    name: str | None = None

class AuthResponse(BaseModel):
    status: str
    message: str
    user_id: str | None = None

# 이력서 분석 모델 (UC-2)
class ResumeAnalysis(BaseModel):
    user_id: str
    job_field: str
    analysis_keywords: str

# 질문 목록 모델 (UC-3)
class QuestionListResponse(BaseModel):
    status: str
    question_list: list[str]
    analysis_summary: ResumeAnalysis

# STT (음성 인식) 응답 모델 (UC-4)
class STTResponse(BaseModel):
    status: str
    filename: str
    transcribed_text: str

# 면접 분석 피드백 모델 (UC-5)
class Feedback(BaseModel):
    relevance_score: int
    logic_score: int
    improvement_advice: str
    follow_up_question: str

# 면접 분석 전체 응답 모델 (DB 저장 시 사용)
class InterviewAnalysisResponse(BaseModel):
    status: str
    question: str
    transcribed_text: str
    feedback: Feedback
    user_id: str = "default_user" 
    timestamp: str 
    
# DB 기록 목록 응답 모델 (UC-7)
class InterviewHistoryItem(InterviewAnalysisResponse):
    interview_id: str
    
class InterviewHistory(BaseModel):
    status: str
    count: int
    records: list[InterviewHistoryItem]


# ------------------------------------------------------
# 4. FastAPI 앱 및 미들웨어
# ------------------------------------------------------
app = FastAPI()

# CORS 설정 추가 (프론트엔드와 통신을 위해 필수)
origins = ["*"]  
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------
# 5. 기본 엔드포인트
# ------------------------------------------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Interview Platform Backend"}

@app.get("/api/health", response_model=HealthCheckResponse)
def health_check():
    """ 서버 상태 체크 API """
    return HealthCheckResponse(status="OK", message="Backend server is running smoothly.")


# -------------------------------------------------------------------
# 6. STT 엔드포인트: Mock 버전 (UC-4)
# -------------------------------------------------------------------
@app.post("/api/stt/analyze", response_model=STTResponse)
async def analyze_speech_mock(audio_file: UploadFile = File(...)):
    """
    [임시 Mock 버전] 음성 파일 업로드 및 텍스트 변환 시뮬레이션
    """
    if not audio_file.filename or not audio_file.filename.lower().endswith((".mp3", ".wav", ".m4a", ".ogg")):
        raise HTTPException(status_code=400, detail="지원하지 않거나 파일명이 없는 형식입니다. (mp3, wav, m4a, ogg 지원)")

    await audio_file.read() # 파일 내용을 읽어 소비합니다. 

    mock_transcribed_text = "Mock: 프론트엔드 팀원들을 위해 AI 면접 준비 플랫폼 개발을 성공적으로 완수하겠습니다!"
    
    return STTResponse(
        status="mock_success",
        filename=audio_file.filename,
        transcribed_text=mock_transcribed_text
    )


# -------------------------------------------------------------------
# 7. 면접 답변 분석 및 피드백 API (UC-5)
# -------------------------------------------------------------------
@app.post("/api/interview/analyze", response_model=InterviewAnalysisResponse)
async def analyze_interview(
    question: str = Form(...), 
    audio_file: UploadFile = File(...),
    user_id: str = Form("default_user") 
):
    """
    면접 질문과 음성 답변을 받아 Gemini로 분석 피드백을 받고 Firestore에 저장합니다.
    """
    
    # 1. STT 결과 처리 (Mock STT 함수 호출)
    mock_stt_response = await analyze_speech_mock(audio_file)
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
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=system_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        json_string = response.text.strip()
        raw_feedback_data = json.loads(json_string)
        feedback_model = Feedback(**raw_feedback_data)
        
        # 3. Firestore에 결과 저장
        timestamp = datetime.now().isoformat()
        record_data = {
            "question": question,
            "transcribed_text": transcribed_text,
            "feedback": feedback_model.model_dump(), 
            "user_id": user_id,
            "timestamp": timestamp
        }
        
        if 'firestore_db' in globals():
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


# -------------------------------------------------------------------
# 8. 면접 기록 조회 API (UC-7)
# -------------------------------------------------------------------
@app.get("/api/interviews/{user_id}", response_model=InterviewHistory)
async def get_interview_history(user_id: str = Path(...)):
    """
    특정 사용자 ID의 모든 면접 기록을 조회합니다.
    """
    if 'firestore_db' not in globals():
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


# -------------------------------------------------------------------
# 9. 회원가입 및 로그인 API (UC-1)
# -------------------------------------------------------------------
@app.post("/api/auth/register", response_model=AuthResponse)
async def register_user(creds: UserCredentials):
    """
    회원가입 API: Firebase Auth에 사용자 계정을 생성하고 Firestore에 기본 정보를 저장합니다.
    """
    if 'firestore_db' not in globals():
         raise HTTPException(status_code=500, detail="DB 서비스가 초기화되지 않았습니다.")
    
    if not creds.email or not creds.password or not creds.name:
        raise HTTPException(status_code=400, detail="이메일, 비밀번호, 이름은 필수 항목입니다.")

    try:
        # 1. Firebase Authentication에 사용자 생성 (UC1-REQ-3: 비밀번호 암호화 저장)
        user = auth.create_user(email=creds.email, password=creds.password, display_name=creds.name)
        
        # 2. Firestore USER 컬렉션에 기본 정보 저장 
        user_data = {
            "email": user.email,
            "name": creds.name,
            "desiredJob": "미지정",
            "created_at": datetime.now().isoformat(),
            "role": "user"
        }
        firestore_db.collection("users").document(user.uid).set(user_data)
        
        return AuthResponse(
            status="success",
            message="회원가입 및 사용자 데이터 저장이 완료되었습니다.",
            user_id=user.uid
        )
    except Exception as e:
        # UC1-REQ-2: 계정 중복 확인 처리
        if 'email-already-exists' in str(e):
            raise HTTPException(status_code=409, detail="이미 등록된 이메일(ID)입니다.")
        # --- 🚨 구문 오류 수정 🚨 ---
        # status-code -> status_code로 변경
        raise HTTPException(status_code=500, detail=f"회원가입 오류: {str(e)}")

@app.post("/api/auth/login", response_model=AuthResponse)
async def login_user(creds: UserCredentials):
    """
    로그인 API: 사용자 인증을 시뮬레이션하고 user_id를 반환합니다.
    """
    if 'firestore_db' not in globals():
         raise HTTPException(status_code=500, detail="DB 서비스가 초기화되지 않았습니다.")

    if not creds.email or not creds.password:
        raise HTTPException(status_code=400, detail="이메일과 비밀번호는 필수 항목입니다.")
    
    try:
        # 이메일로 Firestore에서 사용자 문서 ID 찾기 (인증 시뮬레이션)
        user_ref = firestore_db.collection("users").where("email", "==", creds.email).limit(1).get()
        if not user_ref:
            raise HTTPException(status_code=401, detail="잘못된 이메일 또는 비밀번호입니다.")
            
        user_doc = user_ref[0].to_dict()
        user_id = user_ref[0].id
        
        # 참고: 실제 비밀번호 검증은 클라이언트 SDK가 담당하지만, 
        # 백엔드에서는 DB에서 사용자 ID를 찾아 반환하는 것으로 시뮬레이션합니다.

        return AuthResponse(
            status="success",
            message=f"{user_doc.get('name', '사용자')}님, 로그인 성공!",
            user_id=user_id
        )
    except Exception:
        # UC1-REQ-5: 로그인 실패 처리
        raise HTTPException(status_code=401, detail="잘못된 이메일 또는 비밀번호입니다. 계정을 확인해주세요.")


# -------------------------------------------------------------------
# 10. 이력서 업로드 및 맞춤 질문 생성 API (UC-2, UC-3)
# -------------------------------------------------------------------

@app.post("/api/resume/upload", response_model=ResumeAnalysis)
async def upload_resume(
    user_id: str = Form(...),
    job_field: str = Form(...),
    resume_file: UploadFile = File(...)
):
    """
    UC2-REQ-1/2/3: PDF를 업로드 받아 텍스트 추출, AI 분석 및 DB에 저장합니다.
    """
    if 'firestore_db' not in globals():
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
        
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=analysis_prompt
        )
        analysis_keywords = response.text.strip()
        
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

@app.get("/api/question/generate", response_model=QuestionListResponse)
async def generate_questions(user_id: str = Query(...)):
    """
    UC3-REQ-3: 사용자 이력서 분석 결과를 바탕으로 맞춤 면접 질문 리스트를 생성합니다.
    """
    if 'firestore_db' not in globals():
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
        
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=question_prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        
        question_list = json.loads(response.text.strip())
        
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