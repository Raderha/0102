# 환경 변수 및 설정 관리

from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()

# Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("경고: GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. AI 분석 API는 Mock 응답을 반환할 수 있습니다.")

# CORS 설정
CORS_ORIGINS = ["*"]

