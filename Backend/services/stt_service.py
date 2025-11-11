# STT (음성 인식) 서비스

from fastapi import UploadFile, HTTPException
from models import STTResponse

async def analyze_speech_mock(audio_file: UploadFile) -> STTResponse:
    """
    [임시 Mock 버전] 음성 파일 업로드 및 텍스트 변환 시뮬레이션
    
    Args:
        audio_file: 업로드된 음성 파일
    
    Returns:
        STTResponse: 변환된 텍스트를 포함한 응답
    
    Raises:
        HTTPException: 지원하지 않는 파일 형식인 경우
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

