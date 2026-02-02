from pydantic import BaseModel


class UpdateNonImgRequest(BaseModel):
    subject: str
    content: str
    postId: str


class PwCheckRequest(BaseModel):
    userId: str
    userPw: str


class UserCheckRequest(BaseModel):
    userId: str


class SignupRequest(BaseModel):
    userIdData: str
    userPwData: str
    userBirthdayData: str
    userNameData: str
    userEmailData: str


class UserUpdateRequest(BaseModel):
    userId: str
    userPwData: str
    userBirthdayData: str
    userNameData: str
    userEmailData: str


class LoginRequest(BaseModel):
    userIdData: str
    userPwData: str
