"""유저 비즈니스 로직."""
from repositories import user_repository
from utils.security import *


def check_password(user_id_data: str, user_pw: str) -> bool:
    db_user_pw = user_repository.find_by_pw(user_id_data)
    if passWordCheck(user_pw, db_user_pw):
        user = user_repository.find_by_id_and_password(user_id_data)
        return user is not None


def get_user_info(user_id: str):
    return user_repository.find_by_id(tokenCheck(user_id)['id'])


def check_user_id_exists(user_id: str) -> bool:
    return user_repository.count_by_user_id_data(user_id) > 0


def check_user_name_exists(user_name: str) -> bool:
    return user_repository.count_by_user_name_data(user_name) > 0


def signup(user_id_data: str, user_pw_data: str, user_birthday: str, user_name: str, user_email: str):
    user_repository.insert_user(
        user_id_data, passWordEncode(user_pw_data), user_birthday, user_name, user_email
    )
    return "회원가입 완료"


def user_update(user_id: str, user_pw: str, user_birthday: str, user_name: str, user_email: str):
    rowcount = user_repository.update_user(
        passWordEncode(user_pw), user_birthday, user_name, user_email, tokenCheck(user_id)['id']
    )
    if rowcount == 0:
        return {"success": False, "message": "해당 유저가 존재하지 않습니다."}
    return {"success": True, "message": "회원정보 수정 완료"}


def login(user_id_data: str, user_pw_data: str):
    db_user_pw = user_repository.find_by_pw(user_id_data)
    if passWordCheck(user_pw_data, db_user_pw):
        # user_id = user_repository.find_for_login(user_id_data)[0]
        # user_token = tokenEncode(user_id)
        # tokenEncode(user_repository.find_for_login(user_id_data)[0])
        return {"token": tokenEncode(user_repository.find_for_login(user_id_data)[0])}

