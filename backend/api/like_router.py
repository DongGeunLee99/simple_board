"""좋아요 API 라우터."""
from fastapi import APIRouter

from services import like_service

router = APIRouter()


@router.get("/postgood")
async def postgood(userId: int, postId: int):
    return like_service.toggle_like(userId, postId)


@router.get("/postgoodlist")
async def postgoodlist(pageWhere: int, pageNum: int, userId: str):
    return like_service.list_liked_posts(userId, pageWhere, pageNum)


@router.get("/postgoodpaging")
async def postgoodpaging(userId: str):
    return like_service.liked_paging_count(userId)


@router.get("/postgoodcheck")
async def postgoodcheck(userId: str, postId: str):
    return like_service.check_liked(userId, postId)
