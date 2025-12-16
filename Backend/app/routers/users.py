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
    
    # 기본값 초기화
    user_job = "미지정"
    count_questions = 0
    sum_score = 0
    count_reports = 0
    recent_score_list = []
    
    try:
        print(f"📊 [MyPage Stats] 사용자 통계 조회 시작: user_id={user_id}")
        
        # 1. 사용자 정보(직종) 가져오기
        try:
            user_doc_ref = db.collection("users").document(user_id).get()
            if user_doc_ref.exists:
                user_data = user_doc_ref.to_dict()
                user_job = user_data.get("desiredJob", "미지정")
                print(f"   ✅ 사용자 정보 조회 성공: 직종={user_job}")
            else:
                print(f"   ⚠️ 사용자 문서가 존재하지 않음: user_id={user_id}")
        except Exception as e:
            print(f"   ⚠️ 사용자 정보 조회 중 오류: {e}")

        # 2. 전체 통계 계산
        try:
            interviews_col = db.collection("users").document(user_id).collection("interviews")
            all_interviews = interviews_col.stream()
            
            for doc in all_interviews:
                try:
                    data = doc.to_dict()
                    result = data.get("analysis_result", {})
                    if isinstance(result, dict):
                        r_score = float(result.get("relevance_score", 0) or 0)
                        l_score = float(result.get("logic_score", 0) or 0)
                        sum_score += (r_score + l_score)
                        count_questions += 1
                except Exception as e:
                    print(f"   ⚠️ 면접 문서 처리 중 오류 (doc_id={doc.id}): {e}")
                    continue

            print(f"   📈 면접 통계: 총 질문 수={count_questions}, 총 점수={sum_score}")
        except Exception as e:
            print(f"   ⚠️ 면접 통계 조회 중 오류: {e}")

        # 3. 이력서 수 계산
        try:
            resumes_ref = db.collection("users").document(user_id).collection("resumes").stream()
            count_reports = len(list(resumes_ref))
            print(f"   📄 이력서 수: {count_reports}")
        except Exception as e:
            print(f"   ⚠️ 이력서 수 조회 중 오류: {e}")

        # 4. 최근 5개 질문의 점수 가져오기
        try:
            interviews_col = db.collection("users").document(user_id).collection("interviews")
            # 정렬 쿼리 시도
            try:
                recent_docs = interviews_col.order_by("created_at", direction=firestore.Query.DESCENDING).limit(5).stream()
            except Exception as order_error:
                print(f"   ⚠️ 정렬 쿼리 실패 (인덱스 없을 수 있음): {order_error}")
                # 정렬 실패 시 전체 조회
                recent_docs = interviews_col.stream()
            
            all_scores = []
            for doc in recent_docs:
                try:
                    data = doc.to_dict()
                    result = data.get("analysis_result", {})
                    
                    if isinstance(result, dict):
                        r_score = float(result.get("relevance_score", 0) or 0)
                        l_score = float(result.get("logic_score", 0) or 0)
                        score_val = (r_score + l_score) / 2.0
                        
                        raw_date = data.get("created_at", "")
                        formatted_date = raw_date.split("T")[0] if "T" in raw_date else raw_date

                        all_scores.append({
                            "timestamp": formatted_date,
                            "score": score_val,
                            "question": data.get("question", "질문 없음")
                        })
                except Exception as e:
                    print(f"   ⚠️ 최근 점수 처리 중 오류: {e}")
                    continue
            
            # 날짜 기준으로 정렬 (과거 -> 현재)
            all_scores.sort(key=lambda x: x["timestamp"])
            
            # 최근 5개만 유지
            recent_scores_sorted = all_scores[-5:] if len(all_scores) > 5 else all_scores
            
            recent_score_list = [
                RecentScore(
                    timestamp=item["timestamp"],
                    score=item["score"],
                    question=item["question"]
                )
                for item in recent_scores_sorted
            ]
            
            print(f"   📊 최근 점수 개수: {len(recent_score_list)}")
        except Exception as e:
            print(f"   ⚠️ 최근 점수 조회 중 오류: {e}")

        # 5. 최종 결과 반환
        result = MyPageStats(
            total_questions=count_questions,
            total_score=sum_score,
            submitted_reports=count_reports,
            job_field=user_job,
            recent_scores=recent_score_list
        )
        
        print(f"   ✅ 통계 조회 완료: 질문={result.total_questions}, 점수={result.total_score}, 이력서={result.submitted_reports}, 직종={result.job_field}")
        return result

    except Exception as e:
        print(f"❌ [MyPage Stats] 통계 조회 중 치명적 오류: {e}")
        import traceback
        traceback.print_exc()
        # 에러 발생 시 안전하게 기본값 반환 (하지만 user_job은 이미 설정됨)
        return MyPageStats(
            total_questions=count_questions,
            total_score=sum_score,
            submitted_reports=count_reports,
            job_field=user_job if user_job != "미지정" else "알 수 없음",
            recent_scores=recent_score_list
        )