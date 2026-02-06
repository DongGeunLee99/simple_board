import datetime

from repositories import post_repository
from utils.security import *

def update_not_img(subject: str, content: str, post_id: str):
    created_at = datetime.datetime.now()
    post_repository.update_not_img(subject, content, created_at, post_id)
    return "완료"


def search(text: str):
    return post_repository.search_by_subject(text)


def search_paging_count(text: str):
    return post_repository.count_search(text)


def search_myPost(text: str, userId: str, pageWhere: int, pageNum: int):
    return post_repository.search_by_my_subject(text, tokenCheck(userId)['id'], pageWhere, pageNum)


def search_likePost(text: str, userId: str, pageWhere: int, pageNum: int):
    return post_repository.search_by_like_subject(text, tokenCheck(userId)['id'], pageWhere, pageNum)


def search_list_paged(text: str, page_where: int, page_num: int):
    return post_repository.search_list_paged(text, page_where, page_num)


def paging_count():
    return post_repository.count_all()


def list_paged(page_where: int, page_num: int, userId: str):
    if userId:
        return post_repository.list_paged_in_user(page_where, page_num, tokenCheck(userId)['id'])
    else:
        return post_repository.list_paged(page_where, page_num)



def mylist_paged(page_where: int, page_num: int, user_id: str):
    return post_repository.list_by_user_paged(tokenCheck(user_id)['id'], page_where, page_num)


def mypaging_count(user_id: str):
    return post_repository.count_by_user(tokenCheck(user_id)['id'])


def get_by_id(post_id: str):
    post_data = post_repository.get_by_id(post_id)
    post_data[0][0] = tokenEncode(post_data[0][0])
    return post_data


def create_post(user_id: str, subject: str, content: str, image_path: str):
    created_at = datetime.datetime.now()
    post_repository.insert(subject, content, created_at, image_path, tokenCheck(user_id)['id'])
    return image_path


def update_post(subject: str, content: str, image_path: str, post_id: str):
    created_at = datetime.datetime.now()
    post_repository.update_with_image(subject, content, created_at, image_path, post_id)
    return image_path


def delete_post(post_id: str):
    post_repository.delete(post_id)
    return "완료"


def nextPost_Select(postCreatedAt: str):
    return post_repository.nextPostSelect(postCreatedAt)


def prevPost_Select(postCreatedAt: str):
    return post_repository.prevPostSelect(postCreatedAt)


def nextMyPost_Select(postCreatedAt: str, userId: str):
    return post_repository.nextMyPostSelect(postCreatedAt, tokenCheck(userId)['id'])


def prevMyPost_Select(postCreatedAt: str, userId: str):
    return post_repository.prevMyPostSelect(postCreatedAt, tokenCheck(userId)['id'])


def nextLikePost_Select(postCreatedAt: str, userId: str):
    return post_repository.nextLikePostSelect(postCreatedAt, tokenCheck(userId)['id'])


def prevLikePost_Select(postCreatedAt: str, userId: str):
    return post_repository.prevLikePostSelect(postCreatedAt, tokenCheck(userId)['id'])

#######################################################################
def nextSearchPost_Select(postCreatedAt: str, text:str):
    return post_repository.nextSearchPostSelect(postCreatedAt, text)


def prevSearchPost_Select(postCreatedAt: str, text:str):
    return post_repository.prevSearchPostSelect(postCreatedAt, text)


def nextSearchMyPost_Select(postCreatedAt: str, userId: str, text:str):
    return post_repository.nextSearchMyPostSelect(postCreatedAt, tokenCheck(userId)['id'], text)


def prevSearchMyPost_Select(postCreatedAt: str, userId: str, text:str):
    return post_repository.prevSearchMyPostSelect(postCreatedAt, tokenCheck(userId)['id'], text)


def nextSearchLikePost_Select(postCreatedAt: str, userId: str, text:str):
    return post_repository.nextSearchLikePostSelect(postCreatedAt, tokenCheck(userId)['id'], text)


def prevSearchLikePost_Select(postCreatedAt: str, userId: str, text:str):
    return post_repository.prevSearchLikePostSelect(postCreatedAt, tokenCheck(userId)['id'], text)