from fastapi import APIRouter, HTTPException
from firebase_admin import auth
from datetime import datetime
import requests # API 요청을 위해 필요
import os

from app.database import get_db
from app.models import UserRegister, UserLogin, AuthResponse

# 라우터 설정 (URL 앞에 /api/auth가 자동으로 붙음)
router = APIRouter(prefix="/api/auth", tags=["Auth"])

# ⭐ [중요] 아까 firebaseConfig 안에서 찾은 apiKey를 따옴표 안에 넣으세요!
# (보안을 위해 나중에는 os.getenv("FIREBASE_WEB_API_KEY")로 변경하는 것을 권장합니다)
FIREBASE_WEB_API_KEY = "AIzaSyDFpuxuTdnGDTeG0RRrHsWAf3XMBKjGGw0"

# -------------------------------------------------------------------
# [UC-1] 회원가입
# -------------------------------------------------------------------
@router.post("/register", response_model=AuthResponse)
async def register_user(creds: UserRegister):
    db = get_db()
    try:
        # 1. Firebase Authentication에 사용자 생성 (비밀번호 암호화 저장)
        user = auth.create_user(
            email=creds.email, 
            password=creds.password, 
            display_name=creds.name
        )
        
        # 2. Firestore DB에 사용자 정보 추가 저장
        # 프론트엔드에서 desiredJob을 보냈으면 저장, 안 보냈으면 "미지정"
        job_field = creds.desiredJob if creds.desiredJob else "미지정"

        user_data = {
            "email": user.email, 
            "name": creds.name, 
            "desiredJob": job_field,
            "role": "user",
            "created_at": datetime.now().isoformat()
        }
        
        # 문서 ID를 User UID와 동일하게 설정하여 저장
        db.collection("users").document(user.uid).set(user_data)
        
        return AuthResponse(status="success", message="회원가입 및 데이터 저장이 완료되었습니다.", user_id=user.uid)
        
    except Exception as e:
        # 이미 존재하는 이메일 처리
        if 'email-already-exists' in str(e):
            raise HTTPException(status_code=409, detail="이미 등록된 이메일(ID)입니다.")
        print(f"회원가입 오류: {e}")
        raise HTTPException(status_code=500, detail=f"회원가입 처리 중 오류가 발생했습니다.")

# -------------------------------------------------------------------
# [UC-1] 로그인 (비밀번호 검증 + 직종 정보 반환)
# -------------------------------------------------------------------
@router.post("/login", response_model=AuthResponse)
async def login_user(creds: UserLogin):
    db = get_db()
    
    # 1. 비밀번호 검증 (Firebase REST API 사용)
    # 구글 서버에 이메일과 비밀번호를 보내서 맞는지 확인합니다.
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
    
    payload = {
        "email": creds.email,
        "password": creds.password,
        "returnSecureToken": True
    }
    
    try:
        res = requests.post(verify_url, json=payload)
        
        # 200 OK가 아니면 비밀번호가 틀린 것임
        if res.status_code != 200:
            print(f"❌ [Login Fail] 비밀번호 불일치: {res.text}")
            raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 잘못되었습니다.")
            
    except requests.exceptions.RequestException as e:
        print(f"API 요청 오류: {e}")
        raise HTTPException(status_code=500, detail="로그인 인증 서버 연결 실패")

    # 2. 비밀번호가 맞다면, DB에서 사용자 상세 정보 가져오기
    try:
        user_ref = db.collection("users").where("email", "==", creds.email).limit(1).get()
        
        if not user_ref:
            # 인증은 됐는데 DB에 정보가 없는 희귀한 경우
            raise HTTPException(status_code=404, detail="회원 정보를 찾을 수 없습니다.")
        
        user_doc = user_ref[0].to_dict()
        user_id = user_ref[0].id
        
        # DB에 있는 'desiredJob'을 가져옴 (없으면 '미지정')
        user_job = user_doc.get('desiredJob', '미지정')
        
        return AuthResponse(
            status="success", 
            message=f"{user_doc.get('name', '사용자')}님, 로그인 성공!", 
            user_id=user_id,
            job_field=user_job  # <--- ⭐ 프론트엔드 로컬 스토리지 저장을 위해 추가됨!
        )
    except Exception as e:
        print(f"로그인 처리 중 오류: {e}")
        raise HTTPException(status_code=500, detail="로그인 처리 중 서버 오류 발생")