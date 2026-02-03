"""유저 API 라우터."""
from fastapi import APIRouter

from models import (
    LoginRequest,
    PwCheckRequest,
    SignupRequest,
    UserCheckRequest,
    UserUpdateRequest,
)
from services import user_service

router = APIRouter()


@router.post("/mysqlPwCheck")
async def mysql_pw_check(body: PwCheckRequest):
    return user_service.check_password(body.userId, body.userPw)


@router.post("/mysqlUserInfo")
async def mysql_user_info(body: UserCheckRequest):
    user = user_service.get_user_info(body.userId)
    return user if user else False


@router.get("/checkUserId")
async def check_user_id(userId: str):
    exists = user_service.check_user_id_exists(userId)
    return {"exists": exists}


@router.get("/checkUserName")
async def check_user_name(userName: str):
    exists = user_service.check_user_name_exists(userName)
    return {"exists": exists}


@router.post("/signup")
async def signup(data: SignupRequest):
    return user_service.signup(
        data.userIdData,
        data.userPwData,
        data.userBirthdayData,
        data.userNameData,
        data.userEmailData,
    )


@router.post("/userUpdate")
async def user_update(data: UserUpdateRequest):
    return user_service.user_update(
        data.userId,
        data.userPwData,
        data.userBirthdayData,
        data.userNameData,
        data.userEmailData,
    )


@router.post("/login")
async def login(data: LoginRequest):
    return user_service.login(data.userIdData, data.userPwData)
