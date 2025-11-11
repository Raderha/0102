# Gemini API 서비스

from google import genai
from google.genai import types
from google.genai.errors import APIError
import config

# Gemini 클라이언트 초기화
gemini_client = genai.Client(api_key=config.GEMINI_API_KEY)

def generate_content(prompt: str, response_mime_type: str = "text/plain") -> str:
    """
    Gemini API를 사용하여 콘텐츠를 생성합니다.
    
    Args:
        prompt: 생성할 콘텐츠에 대한 프롬프트
        response_mime_type: 응답 형식 (기본값: "text/plain", JSON은 "application/json")
    
    Returns:
        생성된 텍스트 콘텐츠
    
    Raises:
        APIError: Gemini API 호출 중 오류 발생 시
    """
    config_obj = types.GenerateContentConfig(
        response_mime_type=response_mime_type,
    ) if response_mime_type != "text/plain" else None
    
    response = gemini_client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=config_obj
    )
    
    return response.text.strip()

