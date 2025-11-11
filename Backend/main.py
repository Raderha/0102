# JobReady 백엔드 통합 서버 (FastAPI + Gemini + Firestore)
# FastAPI 앱 초기화 및 라우터 등록

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config
import database  # Firestore 초기화를 위해 import

# 라우터 import
from routers import health, auth, resume, interview, stt

# FastAPI 앱 생성
app = FastAPI(
    title="JobReady AI Interview Platform",
    description="AI 면접 준비 플랫폼 백엔드 API",
    version="1.0.0"
)

# CORS 설정 추가 (프론트엔드와 통신을 위해 필수)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(stt.router)

# 기본 엔드포인트
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Interview Platform Backend"}
