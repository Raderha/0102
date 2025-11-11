# Pydantic 응답 모델 정의

from pydantic import BaseModel

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

