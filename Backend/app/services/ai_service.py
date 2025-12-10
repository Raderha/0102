import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
import json
import os
import ast # ⭐ [추가됨] 파이썬 문법으로 리스트를 해석하는 강력한 도구

model = None

def init_ai():
    global model
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    
    if not project_id and os.path.exists("serviceAccountKey.json"):
        try:
            with open("serviceAccountKey.json") as f:
                data = json.load(f)
                project_id = data.get("project_id")
        except:
            pass
            
    try:
        vertexai.init(project=project_id, location="asia-northeast3")
        model = GenerativeModel("gemini-2.5-flash")
        print(f"✅ Vertex AI (Gemini 2.5) 초기화 완료")
    except Exception as e:
        print(f"❌ AI 초기화 실패: {e}")

# ⭐ [핵심 기능] AI의 이상한 답변에서 리스트만 발라내는 함수
def parse_ai_list_response(text: str) -> list:
    """
    AI 응답 텍스트에서 JSON 리스트([...]) 부분을 찾아 파싱합니다.
    1. json.loads 시도
    2. 실패 시 ast.literal_eval 시도 (홑따옴표 등 처리)
    3. 실패 시 괄호 짝 맞추기로 재추출 후 시도
    """
    text = text.strip()
    # 마크다운 제거
    text = text.replace("```json", "").replace("```python", "").replace("```", "").strip()

    # 1차 시도: 그냥 파싱해보기
    try:
        return json.loads(text)
    except:
        pass

    # 2차 시도: 가장 먼저 나오는 '[' 부터 가장 마지막에 나오는 ']' 까지 잘라서 시도
    start_idx = text.find('[')
    end_idx = text.rfind(']')
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        candidate = text[start_idx : end_idx + 1]
        try:
            return json.loads(candidate)
        except:
            # JSON 실패 시 Python 문법으로 해석 시도 (AI가 홑따옴표 쓸 때 유용)
            try:
                return ast.literal_eval(candidate)
            except:
                pass

    # 3차 시도: 괄호 짝 맞추기 (Stack) - 뒤에 붙은 쓰레기 값 제거용
    if start_idx != -1:
        count = 0
        for i in range(start_idx, len(text)):
            if text[i] == '[':
                count += 1
            elif text[i] == ']':
                count -= 1
                if count == 0:
                    # 짝이 딱 맞는 지점 발견!
                    clean_candidate = text[start_idx : i + 1]
                    try:
                        return json.loads(clean_candidate)
                    except:
                        try:
                            return ast.literal_eval(clean_candidate)
                        except:
                            break
                            
    print(f"⚠️ 파싱 최종 실패. 원본: {text}")
    return ["질문 생성에 실패했습니다. 다시 시도해주세요."]

async def analyze_resume_text(text: str) -> str:
    prompt = f"이력서 내용: {text[:4000]}\n\n채용 담당자로서 이 이력서의 핵심 역량 키워드 5개를 콤마(,)로 구분하여 한 줄로 요약해주세요."
    response = model.generate_content(prompt)
    return response.text.strip()

async def generate_interview_questions(job_field: str, keywords: str) -> list:
    prompt = f"""
    직종: {job_field}, 키워드: {keywords}
    위 정보를 바탕으로 면접 질문 5개를 생성하세요.
    응답은 반드시 Python List 형식이어야 합니다. 예: ["질문1", "질문2"]
    다른 말은 하지 마세요.
    """
    config = GenerationConfig(response_mime_type="application/json")
    response = model.generate_content(prompt, generation_config=config)
    
    # ⭐ 강력해진 파서 사용
    return parse_ai_list_response(response.text)

async def evaluate_answer(question: str, answer_text: str) -> dict:
    prompt = f"""
    당신은 면접관입니다. 다음 질문과 답변을 분석하여 JSON으로 응답하세요.
    질문: {question}
    답변: {answer_text}
    
    <JSON 스키마>
    {{
        "relevance_score": (1~5점 정수),
        "logic_score": (1~5점 정수),
        "improvement_advice": "(구체적인 개선 조언)",
        "follow_up_question": "(꼬리 질문 1개)"
    }}
    """
    config = GenerationConfig(response_mime_type="application/json")
    response = model.generate_content(prompt, generation_config=config)
    
    # JSON 파싱 시도 (객체는 {} 로 감싸져 있으므로 간단히 처리)
    try:
        text = response.text.strip().replace("```json", "").replace("```", "")
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return json.loads(text[start : end + 1])
        return json.loads(text)
    except:
        return {
            "relevance_score": 0, 
            "logic_score": 0, 
            "improvement_advice": "AI 응답을 처리하는 중 오류가 발생했습니다.", 
            "follow_up_question": "-"
        }