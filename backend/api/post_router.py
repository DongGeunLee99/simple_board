"""게시글 API 라우터."""
from fastapi import APIRouter, File, Form, UploadFile

from models import UpdateNonImgRequest
from services import image_service, post_service

router = APIRouter()


@router.post("/mysqlUpdateNotImg")
async def mysql_update_not_img(body: UpdateNonImgRequest):
    return post_service.update_not_img(body.subject, body.content, body.postId)


@router.get("/mysqlSearch")
async def mysql_search(text: str):
    return post_service.search(text)


@router.get("/mysqlSearchPaging")
async def mysql_search_paging(text: str):
    return post_service.search_paging_count(text)


@router.get("/mysqlSearchMyPost")
async def mysql_search(text: str, userId: str, pageWhere: int, pageNum: int):
    return post_service.search_myPost(text, userId, pageWhere, pageNum)


@router.get("/mysqlSearchLikePost")
async def mysql_search(text: str, userId: str, pageWhere: int, pageNum: int):
    return post_service.search_likePost(text, userId, pageWhere, pageNum)


@router.get("/mysqlSearchList")
async def mysql_search_list(text: str, pageWhere: int, pageNum: int):
    return post_service.search_list_paged(text, pageWhere, pageNum)


@router.get("/paging")
async def paging():
    return post_service.paging_count()


@router.get("/list")
async def list_posts(pageWhere: int, pageNum: int, userId: str):
    return post_service.list_paged(pageWhere, pageNum, userId)


@router.get("/mylist")
async def mylist(pageWhere: int, pageNum: int, userId: str):
    return post_service.mylist_paged(pageWhere, pageNum, userId)


@router.get("/mypaging")
async def mypaging(userId: str):
    return post_service.mypaging_count(userId)


@router.get("/mysqlSelect")
async def mysql_select(postId: str):
    return post_service.get_by_id(postId)


@router.post("/mysqlInsert")
async def mysql_insert(
    userId: str = Form(...),
    subject: str = Form(...),
    content: str = Form(...),
    files: UploadFile = File(...),
    postId: str = Form(...),
):
    image_path = image_service.save_image(files)
    return post_service.create_post(userId, subject, content, image_path)


@router.post("/mysqlUpdate")
async def mysql_update(
    subject: str = Form(...),
    content: str = Form(...),
    files: UploadFile = File(...),
    postId: str = Form(...),
):
    image_path = image_service.save_image(files)
    return post_service.update_post(subject, content, image_path, postId)


@router.get("/mysqlDelete")
async def mysql_delete(postId: str):
    return post_service.delete_post(postId)


@router.get("/nextPostSelect")
async def nextPostSelect(postCreatedAt: str):
    return post_service.nextPost_Select(postCreatedAt)

@router.get("/prevPostSelect")
async def prevPostSelect(postCreatedAt: str):
    return post_service.prevPost_Select(postCreatedAt)


@router.get("/nextMyPostSelect")
async def nextPostSelect(postCreatedAt: str, userId: str):
    return post_service.nextMyPost_Select(postCreatedAt, userId)

@router.get("/prevMyPostSelect")
async def prevPostSelect(postCreatedAt: str, userId: str):
    return post_service.prevMyPost_Select(postCreatedAt, userId)


@router.get("/nextLikePostSelect")
async def nextPostSelect(postCreatedAt: str, userId: str):
    return post_service.nextLikePost_Select(postCreatedAt, userId)

@router.get("/prevLikePostSelect")
async def prevPostSelect(postCreatedAt: str, userId: str):
    return post_service.prevLikePost_Select(postCreatedAt, userId)

#######################################################################
@router.get("/nextSearchPostSelect")
async def nextSearchPostSelect(postCreatedAt: str, text: str):
    return post_service.nextSearchPost_Select(postCreatedAt, text)

@router.get("/prevSearchPostSelect")
async def prevSearchPostSelect(postCreatedAt: str, text: str):
    return post_service.prevSearchPost_Select(postCreatedAt, text)


@router.get("/nextSearchMyPostSelect")
async def nextSearchMyPostSelect(postCreatedAt: str, userId: str, text: str):
    return post_service.nextSearchMyPost_Select(postCreatedAt, userId, text)

@router.get("/prevSearchMyPostSelect")
async def prevSearchMyPostSelect(postCreatedAt: str, userId: str, text: str):
    return post_service.prevSearchMyPost_Select(postCreatedAt, userId, text)


@router.get("/nextSearchLikePostSelect")
async def nextSearchLikePostSelect(postCreatedAt: str, userId: str, text: str):
    return post_service.nextSearchLikePost_Select(postCreatedAt, userId, text)

@router.get("/prevSearchLikePostSelect")
async def prevSearchLikePostSelect(postCreatedAt: str, userId: str, text: str):
    return post_service.prevSearchLikePost_Select(postCreatedAt, userId, text)