from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from firebase_admin import firestore
from typing import List, Optional # Optional 추가

from app.database import get_db
from app.models import BoardPostCreate, BoardPostResponse, SimpleResponse

router = APIRouter(prefix="/api/board", tags=["Board"])

# 1. 게시글 목록 조회 (카테고리 필터 추가됨)
@router.get("/", response_model=List[BoardPostResponse])
async def get_board_posts(
    limit: int = 20, 
    category: Optional[str] = Query(None, description="직종 카테고리 필터 (예: IT 개발 직군)")
):
    db = get_db()
    try:
        # 기본: board 컬렉션 참조
        posts_ref = db.collection("board")
        
        # ⭐ [핵심] 카테고리(직종)가 선택되었다면? -> 그 직종만 골라내기!
        if category and category != "전체":
            # 'job_field'가 입력받은 'category'와 똑같은 것만 찾음
            posts_ref = posts_ref.where(field_path="job_field", op_string="==", value=category)
        
        # 최신순 정렬 및 가져오기
        # (주의: where와 order_by를 같이 쓰면 Firebase 콘솔에서 '색인(Index)'을 만들어줘야 할 수도 있음.
        # 에러가 뜨면 로그에 나오는 링크를 클릭 한번만 해주면 됨)
        stream = posts_ref.order_by("created_at", direction=firestore.Query.DESCENDING).limit(limit).stream()
        
        result = []
        for doc in stream:
            data = doc.to_dict()
            result.append(BoardPostResponse(
                post_id=doc.id,
                user_id=data.get("user_id"),
                writer_name=data.get("writer_name"),
                job_field=data.get("job_field"),
                question=data.get("question"),
                answer=data.get("answer"),
                feedback_summary=data.get("feedback_summary"),
                created_at=data.get("created_at"),
                views=data.get("views", 0)
            ))
        return result
    except Exception as e:
        print(f"게시판 조회 오류: {e}")
        return []

# 2. 게시글 작성 (기존 동일)
@router.post("/", response_model=SimpleResponse)
async def create_board_post(post: BoardPostCreate):
    db = get_db()
    try:
        new_post_data = post.model_dump()
        new_post_data["created_at"] = datetime.now().isoformat()
        new_post_data["views"] = 0
        
        db.collection("board").add(new_post_data)
        
        return SimpleResponse(status="success", message="게시글이 등록되었습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"게시글 등록 실패: {str(e)}")

# 3. 게시글 상세 조회 (기존 동일)
@router.get("/{post_id}", response_model=BoardPostResponse)
async def get_board_post_detail(post_id: str):
    db = get_db()
    try:
        post_ref = db.collection("board").document(post_id)
        post_doc = post_ref.get()
        
        if not post_doc.exists:
            raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
            
        data = post_doc.to_dict()
        
        post_ref.update({"views": firestore.Increment(1)})
        
        return BoardPostResponse(
            post_id=post_id,
            **data,
            views=data.get("views", 0) + 1
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"상세 조회 실패: {str(e)}")