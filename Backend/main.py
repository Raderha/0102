from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import time
import os

# .env 파일 로드
load_dotenv()

from app.database import initialize_db
from app.services.ai_service import init_ai
# ⭐ [수정] users, board 추가됨
from app.routers import interview, auth, users, board 

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 서버 시작: 리소스 초기화 중...")
    try:
        initialize_db()
        init_ai()
        print("✨ 초기화 완료: 서버가 준비되었습니다.")
    except Exception as e:
        print(f"❌ 초기화 중 치명적 오류 발생: {e}")
    yield
    print("👋 서버 종료: 리소스 정리")

app = FastAPI(
    title="JobReady Backend",
    version="2.1.0", # 버전 업!
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http:localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⭐ [수정] 라우터 4개 모두 등록
app.include_router(auth.router)
app.include_router(interview.router)
app.include_router(users.router)  # 마이페이지
app.include_router(board.router)  # 게시판

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"📡 {request.method} {request.url.path} - {response.status_code} ({process_time:.4f}s)")
    return response

@app.get("/")
def read_root():
    return {"message": "JobReady AI Platform Backend (Final Version)"}

@app.get("/health")
def health_check():
    return {"status": "OK", "timestamp": time.time()}