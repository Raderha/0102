from fastapi import APIRouter, HTTPException
from firebase_admin import auth, firestore
from app.database import get_db
# ⭐ RecentScore 등 필요한 모델 모두 import
from app.models import UserProfile, UserUpdate, SimpleResponse, MyPageStats, RecentScore

router = APIRouter(prefix="/api/users", tags=["User (MyPage)"])

# 1. 내 정보 조회
@router.get("/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    db = get_db()
    user_ref = db.collection("users").document(user_id).get()
    
    if not user_ref.exists:
        raise HTTPException(status_code=404, detail="사용자 정보를 찾을 수 없습니다.")
    
    data = user_ref.to_dict()
    return UserProfile(
        user_id=user_id,
        email=data.get("email", ""),
        name=data.get("name", "이름 없음"),
        job_field=data.get("desiredJob", "미지정"),
        joined_at=data.get("created_at", "")
    )

# 2. 내 정보 수정 (이름, 직무)
@router.put("/{user_id}", response_model=SimpleResponse)
async def update_user_profile(user_id: str, update_data: UserUpdate):
    db = get_db()
    
    fields_to_update = {}
    if update_data.name:
        fields_to_update["name"] = update_data.name
    if update_data.job_field:
        fields_to_update["desiredJob"] = update_data.job_field
    
    if not fields_to_update:
        return SimpleResponse(status="success", message="변경할 내용이 없습니다.")

    try:
        db.collection("users").document(user_id).update(fields_to_update)
        return SimpleResponse(status="success", message="회원 정보가 수정되었습니다.")
    except Exception as e:
        print(f"정보 수정 오류: {e}")
        raise HTTPException(status_code=500, detail="정보 수정 실패")

# 3. 회원 탈퇴 (DB 삭제 + Auth 계정 삭제)
@router.delete("/{user_id}", response_model=SimpleResponse)
async def delete_user_account(user_id: str):
    db = get_db()
    try:
        # 1. Firestore 데이터 삭제
        db.collection("users").document(user_id).delete()
        
        # 2. Firebase Auth 계정 삭제
        auth.delete_user(user_id)
        
        return SimpleResponse(status="success", message="계정이 영구적으로 삭제되었습니다.")
    except Exception as e:
        print(f"탈퇴 오류: {e}")
        raise HTTPException(status_code=500, detail=f"회원 탈퇴 처리 중 오류: {str(e)}")

# -------------------------------------------------------------------
# [UC-7] 마이페이지 대시보드 통계 API (최신 업데이트)
# -------------------------------------------------------------------
@router.get("/{user_id}/stats", response_model=MyPageStats)
async def get_mypage_stats(user_id: str):
    db = get_db()
    
    try:
        # 1. 사용자 정보(직종) 가져오기
        user_doc_ref = db.collection("users").document(user_id).get()
        user_job = "미지정"
        if user_doc_ref.exists:
            user_job = user_doc_ref.to_dict().get("desiredJob", "미지정")

        # 2. 전체 통계 계산 (기존 로직 유지)
        interviews_col = db.collection("users").document(user_id).collection("interviews")
        all_interviews = interviews_col.stream()
        
        count_questions = 0
        sum_score = 0
        
        for doc in all_interviews:
            data = doc.to_dict()
            result = data.get("analysis_result", {})
            r_score = result.get("relevance_score", 0)
            l_score = result.get("logic_score", 0)
            
            sum_score += (r_score + l_score)
            count_questions += 1

        # 3. 이력서 수 계산 (기존 로직 유지)
        resumes_ref = db.collection("users").document(user_id).collection("resumes").stream()
        count_reports = len(list(resumes_ref))

        # 4. ⭐ [핵심 추가] 가장 최근 5개 질문의 점수 가져오기
        # created_at 기준 최신순 정렬 -> 5개만 가져오기
        recent_docs = interviews_col.order_by("created_at", direction=firestore.Query.DESCENDING).limit(5).stream()
        
        recent_score_list = []
        for doc in recent_docs:
            data = doc.to_dict()
            result = data.get("analysis_result", {})
            
            # 점수 합산 (적절성 + 논리성)
            score_val = (result.get("relevance_score", 0) + result.get("logic_score", 0))/2.0
            
            # 날짜 포맷팅 (YYYY-MM-DDT... -> YYYY-MM-DD)
            raw_date = data.get("created_at", "")
            formatted_date = raw_date.split("T")[0] if "T" in raw_date else raw_date

            recent_score_list.append(RecentScore(
                timestamp=formatted_date,
                score=score_val,
                question=data.get("question", "질문 없음")
            ))
        
        # 그래프는 보통 과거 -> 현재 순서로 그리므로 리스트를 뒤집어 줌 (선택 사항)
        recent_score_list.reverse()

        # 5. 최종 결과 반환
        return MyPageStats(
            total_questions=count_questions,
            total_score=sum_score,
            submitted_reports=count_reports,
            job_field=user_job,             # 추가됨
            recent_scores=recent_score_list # 추가됨
        )

    except Exception as e:
        print(f"통계 조회 오류: {e}")
        # 에러 발생 시 안전하게 기본값 반환
        return MyPageStats(
            total_questions=0, total_score=0, submitted_reports=0, 
            job_field="알 수 없음", recent_scores=[]
        )