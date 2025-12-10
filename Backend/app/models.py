from pydantic import BaseModel
from typing import List, Optional, Any

# -------------------------------------------------------------------
# [공통 응답 모델]
# -------------------------------------------------------------------
class SimpleResponse(BaseModel):
    status: str
    message: str

# -------------------------------------------------------------------
# [UC-1] 인증 (회원가입/로그인)
# -------------------------------------------------------------------
class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    desiredJob: Optional[str] = None 

class UserLogin(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    status: str
    message: str
    user_id: Optional[str] = None
    job_field: Optional[str] = None

# -------------------------------------------------------------------
# [UC-2, 3] 이력서 및 질문 생성
# -------------------------------------------------------------------
class ResumeAnalysisResult(BaseModel):
    user_id: str
    job_field: str
    analysis_keywords: str

class QuestionListResponse(BaseModel):
    status: str
    question_list: List[str]
    analysis_summary: ResumeAnalysisResult

# -------------------------------------------------------------------
# [UC-5] 면접 분석
# -------------------------------------------------------------------
class AnalysisDetail(BaseModel):
    relevance_score: int      # 적절성 점수 (1~5)
    logic_score: int          # 논리성 점수 (1~5)
    improvement_advice: str   # 개선 조언
    follow_up_question: str   # 꼬리 질문

class InterviewResponse(BaseModel):
    status: str
    question: str
    transcribed_text: str     # STT 결과
    feedback: AnalysisDetail  # AI 분석 결과
    timestamp: str

# -------------------------------------------------------------------
# [UC-7] 면접 기록 조회
# -------------------------------------------------------------------
class InterviewHistoryItem(BaseModel):
    interview_id: str
    question: str
    transcribed_text: str
    feedback: AnalysisDetail
    timestamp: str

class InterviewHistory(BaseModel):
    status: str
    count: int
    records: List[InterviewHistoryItem]

# -------------------------------------------------------------------
# [UC-7] 마이페이지 (사용자 정보 관리)
# -------------------------------------------------------------------
class UserProfile(BaseModel):
    user_id: str
    email: str
    name: str
    job_field: str  # DB의 desiredJob
    joined_at: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    job_field: Optional[str] = None # 직무 변경

# -------------------------------------------------------------------
# [UC-7] 마이페이지 대시보드 통계 (그래프 데이터 포함) - ⭐ 수정됨
# -------------------------------------------------------------------
# 최근 점수 상세 (그래프용)
class RecentScore(BaseModel):
    timestamp: str  # 날짜 (YYYY-MM-DD)
    score: float      # 점수 합계
    question: str   # 툴팁용 질문 내용

class MyPageStats(BaseModel):
    total_questions: int      # 총 답변한 질문 수
    total_score: int          # 총 점수
    submitted_reports: int    # 제출한 이력서 수
    job_field: str            # 사용자 직종 (추가됨)
    recent_scores: List[RecentScore] # 최근 5개 점수 (추가됨)

# -------------------------------------------------------------------
# [UC-8] 공유 게시판
# -------------------------------------------------------------------
class BoardPostCreate(BaseModel):
    user_id: str
    writer_name: str
    job_field: str
    question: str
    answer: str
    feedback_summary: str 

class BoardPostResponse(BoardPostCreate):
    post_id: str
    created_at: str
    views: int = 0