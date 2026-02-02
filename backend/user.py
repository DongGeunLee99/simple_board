from fastapi import APIRouter

from db import cursor, conn
from models import PwCheckRequest, UserCheckRequest, SignupRequest, UserUpdateRequest, LoginRequest

router = APIRouter()


@router.post("/mysqlPwCheck")
async def mysqlPwCheck(body: PwCheckRequest):
    cursor.execute(
        "SELECT * FROM postdbuser WHERE id = %s AND userPwData = %s",
        (body.userId, body.userPw)
    )
    user = cursor.fetchone()

    if user:
        print("True", user)
        return True
    else:
        print("", body.userId, body.userPw)
        print("False", user)
        return False


@router.post("/mysqlUserInfo")
async def mysqlUserInfo(body: UserCheckRequest):
    cursor.execute(
        "SELECT * FROM postdbuser WHERE id = %s",
        (body.userId)
    )
    user = cursor.fetchone()

    if user:
        print("True", user)
        return user
    else:
        print("False", user)
        return False


# 유저 아이디 중복 확인
@router.get("/checkUserId")
async def check_user_id(userId: str):
    cursor.execute(
        "SELECT COUNT(*) FROM postdbuser WHERE userIdData = %s",
        (userId)
    )
    result = cursor.fetchone()

    return {"exists": result[0] > 0}


# 유저 닉네임 중복 확인
@router.get("/checkUserName")
async def check_user_name(userName: str):
    cursor.execute(
        "SELECT COUNT(*) FROM postdbuser WHERE userNameData = %s",
        (userName)
    )
    result = cursor.fetchone()

    return {"exists": result[0] > 0}


# 유저 회원가입
@router.post("/signup")
async def signup(data: SignupRequest):
    cursor.execute(
        """
        INSERT INTO postdbuser
        (userIdData, userPwData, userBirthdayData, userNameData, userEmailData)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            data.userIdData,
            data.userPwData,
            data.userBirthdayData,
            data.userNameData,
            data.userEmailData,
        )
    )
    conn.commit()

    return "회원가입 완료"


@router.post("/userUpdate")
async def userUpdate(data: UserUpdateRequest):
    cursor.execute(
        """
        UPDATE postdbuser
        SET
            userPwData = %s,
            userBirthdayData = %s,
            userNameData = %s,
            userEmailData = %s
        WHERE id = %s
        """,
        (
            data.userPwData,
            data.userBirthdayData,
            data.userNameData,
            data.userEmailData,
            data.userId,
        )
    )
    conn.commit()

    if cursor.rowcount == 0:
        return {"success": False, "message": "해당 유저가 존재하지 않습니다."}

    return {"success": True, "message": "회원정보 수정 완료"}


# 유저 로그인
@router.post("/login")
async def login(data: LoginRequest):
    cursor.execute(
        """
        SELECT id, userBirthdayData, userNameData, userEmailData
        FROM postdbuser
        WHERE userIdData = %s
        AND userPwData = %s
        """,
        (
            data.userIdData,
            data.userPwData,
        )
    )
    user = cursor.fetchone()

    return {"user": user}
