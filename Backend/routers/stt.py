# STT (음성 인식) 라우터

from fastapi import APIRouter, UploadFile, File
from models import STTResponse
from services import stt_service

router = APIRouter(prefix="/api/stt", tags=["stt"])

@router.post("/analyze", response_model=STTResponse)
async def analyze_speech_mock(audio_file: UploadFile = File(...)):
    """
    [임시 Mock 버전] 음성 파일 업로드 및 텍스트 변환 시뮬레이션
    """
    return await stt_service.analyze_speech_mock(audio_file)

