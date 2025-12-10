import firebase_admin
from firebase_admin import credentials, firestore
import os

# 전역 DB 클라이언트 변수
db = None

def initialize_db():
    """Firestore DB 초기화 (Singleton 패턴)"""
    global db
    try:
        if not firebase_admin._apps:
            # 1. 로컬: 키 파일이 존재하면 사용
            if os.path.exists("serviceAccountKey.json"):
                cred = credentials.Certificate("serviceAccountKey.json")
                firebase_admin.initialize_app(cred)
                print("✅ Firestore: 로컬 키 파일(serviceAccountKey.json)로 연결됨")
            else:
                # 2. 클라우드(배포): ADC(자동 인증) 사용
                firebase_admin.initialize_app()
                print("✅ Firestore: 클라우드 환경(ADC)으로 연결됨")
        
        db = firestore.client()
        return db
    except Exception as e:
        print(f"❌ Firestore 초기화 실패: {e}")
        raise e

def get_db():
    """DB 객체 가져오기 (의존성 주입용)"""
    if db is None:
        return initialize_db()
    return db