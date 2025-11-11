# 헬스 체크 라우터

from fastapi import APIRouter
from models import HealthCheckResponse

router = APIRouter(prefix="/api", tags=["health"])

@router.get("/health", response_model=HealthCheckResponse)
def health_check():
    """ 서버 상태 체크 API """
    return HealthCheckResponse(status="OK", message="Backend server is running smoothly.")

