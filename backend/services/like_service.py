"""좋아요 비즈니스 로직."""
from repositories import like_repository


def toggle_like(user_id: int, post_id: int) -> dict:
    exists = like_repository.count_like(user_id, post_id)
    if exists > 0:
        like_repository.delete_like(user_id, post_id)
        return {"liked": False}
    like_repository.insert_like(user_id, post_id)
    return {"liked": True}


def list_liked_posts(user_id: str, page_where: int, page_num: int):
    return like_repository.list_liked_posts_paged(user_id, page_where, page_num)


def liked_paging_count(user_id: str):
    return like_repository.count_liked_by_user(user_id)


def check_liked(user_id: str, post_id: str) -> bool:
    row = like_repository.find_like(user_id, post_id)
    return row is not None
