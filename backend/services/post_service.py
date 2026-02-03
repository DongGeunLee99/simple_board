"""게시글 비즈니스 로직."""
import datetime

from repositories import post_repository


def update_not_img(subject: str, content: str, post_id: str):
    created_at = datetime.datetime.now()
    post_repository.update_not_img(subject, content, created_at, post_id)
    return "완료"


def search(text: str):
    return post_repository.search_by_subject(text)


def search_paging_count(text: str):
    return post_repository.count_search(text)


def search_list_paged(text: str, page_where: int, page_num: int):
    return post_repository.search_list_paged(text, page_where, page_num)


def paging_count():
    return post_repository.count_all()


def list_paged(page_where: int, page_num: int):
    return post_repository.list_paged(page_where, page_num)


def mylist_paged(page_where: int, page_num: int, user_id: str):
    return post_repository.list_by_user_paged(user_id, page_where, page_num)


def mypaging_count(user_id: str):
    return post_repository.count_by_user(user_id)


def get_by_id(post_id: str):
    return post_repository.get_by_id(post_id)


def create_post(user_id: str, subject: str, content: str, image_path: str):
    created_at = datetime.datetime.now()
    post_repository.insert(subject, content, created_at, image_path, user_id)
    return image_path


def update_post(subject: str, content: str, image_path: str, post_id: str):
    created_at = datetime.datetime.now()
    post_repository.update_with_image(subject, content, created_at, image_path, post_id)
    return image_path


def delete_post(post_id: str):
    post_repository.delete(post_id)
    return "완료"
