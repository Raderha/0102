from openai import OpenAI
import io
import os

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# ⭐ [수정] filename 인자를 추가로 받습니다!
async def transcribe_audio(audio_content: bytes, filename: str) -> str:
    """
    [OpenAI Whisper API - 동적 확장자 지원]
    - 프론트엔드가 보낸 파일명(확장자)을 그대로 사용하여 호환성 극대화
    """
    try:
        file_size = len(audio_content)
        print(f"🎤 [STT Debug] 파일명: {filename} / 크기: {file_size} bytes")

        if file_size < 100:
            return "오류: 녹음 파일이 비어있습니다."

        # 바이트 데이터를 파일 객체로 변환
        audio_file = io.BytesIO(audio_content)
        
        # ⭐ [핵심] 원래 파일명(확장자)을 그대로 적용!
        # (예: "recording.m4a" -> OpenAI가 M4A로 인식함)
        audio_file.name = filename 

        transcript = client.audio.transcriptions.create(
            model="whisper-1", 
            file=audio_file, 
            language="ko"
        )

        return transcript.text

    except Exception as e:
        print(f"❌ Whisper STT 에러: {e}")
        return f"STT 변환 실패: {str(e)}"