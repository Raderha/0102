# Firestore 데이터베이스 초기화 및 연결

import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import Client

# 전역 변수로 Firestore 클라이언트 저장
firestore_db: Client | None = None

def init_firestore():
    """
    Firestore를 초기화하고 전역 firestore_db 변수에 클라이언트를 저장합니다.
    """
    global firestore_db
    
    try:
        # 서비스 계정 키 파일을 사용해 Firebase Admin SDK 초기화
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        firestore_db = firestore.client()
        print("Firestore 초기화 성공!")
        return firestore_db
    except FileNotFoundError:
        print("경고: serviceAccountKey.json 파일을 찾을 수 없습니다. DB 연동 기능이 작동하지 않습니다.")
        return None
    except Exception as e:
        print(f"Firestore 초기화 실패: {e}")
        return None

def get_firestore_db() -> Client | None:
    """
    Firestore 클라이언트를 반환합니다.
    """
    return firestore_db

# 앱 시작 시 초기화
init_firestore()

