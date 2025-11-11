# 인증 라우터 (회원가입, 로그인)

from fastapi import APIRouter, HTTPException
from datetime import datetime
from firebase_admin import auth
from models import UserCredentials, AuthResponse
from database import get_firestore_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse)
async def register_user(creds: UserCredentials):
    """
    회원가입 API: Firebase Auth에 사용자 계정을 생성하고 Firestore에 기본 정보를 저장합니다.
    """
    firestore_db = get_firestore_db()
    if not firestore_db:
         raise HTTPException(status_code=500, detail="DB 서비스가 초기화되지 않았습니다.")
    
    if not creds.email or not creds.password or not creds.name:
        raise HTTPException(status_code=400, detail="이메일, 비밀번호, 이름은 필수 항목입니다.")

    try:
        # 1. Firebase Authentication에 사용자 생성 (UC1-REQ-3: 비밀번호 암호화 저장)
        user = auth.create_user(email=creds.email, password=creds.password, display_name=creds.name)
        
        # 2. Firestore USER 컬렉션에 기본 정보 저장 
        user_data = {
            "email": user.email,
            "name": creds.name,
            "desiredJob": "미지정",
            "created_at": datetime.now().isoformat(),
            "role": "user"
        }
        firestore_db.collection("users").document(user.uid).set(user_data)
        
        return AuthResponse(
            status="success",
            message="회원가입 및 사용자 데이터 저장이 완료되었습니다.",
            user_id=user.uid
        )
    except Exception as e:
        # UC1-REQ-2: 계정 중복 확인 처리
        if 'email-already-exists' in str(e):
            raise HTTPException(status_code=409, detail="이미 등록된 이메일(ID)입니다.")
        raise HTTPException(status_code=500, detail=f"회원가입 오류: {str(e)}")

@router.post("/login", response_model=AuthResponse)
async def login_user(creds: UserCredentials):
    """
    로그인 API: 사용자 인증을 시뮬레이션하고 user_id를 반환합니다.
    """
    firestore_db = get_firestore_db()
    if not firestore_db:
         raise HTTPException(status_code=500, detail="DB 서비스가 초기화되지 않았습니다.")

    if not creds.email or not creds.password:
        raise HTTPException(status_code=400, detail="이메일과 비밀번호는 필수 항목입니다.")
    
    try:
        # 이메일로 Firestore에서 사용자 문서 ID 찾기 (인증 시뮬레이션)
        user_ref = firestore_db.collection("users").where("email", "==", creds.email).limit(1).get()
        if not user_ref:
            raise HTTPException(status_code=401, detail="잘못된 이메일 또는 비밀번호입니다.")
            
        user_doc = user_ref[0].to_dict()
        user_id = user_ref[0].id
        
        # 참고: 실제 비밀번호 검증은 클라이언트 SDK가 담당하지만, 
        # 백엔드에서는 DB에서 사용자 ID를 찾아 반환하는 것으로 시뮬레이션합니다.

        return AuthResponse(
            status="success",
            message=f"{user_doc.get('name', '사용자')}님, 로그인 성공!",
            user_id=user_id
        )
    except Exception:
        # UC1-REQ-5: 로그인 실패 처리
        raise HTTPException(status_code=401, detail="잘못된 이메일 또는 비밀번호입니다. 계정을 확인해주세요.")

