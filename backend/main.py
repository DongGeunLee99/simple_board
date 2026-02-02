from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from image import router as image_router
from post import router as post_router
from user import router as user_router
from like import router as like_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000",  # 허용할 Origin 리스트 (필수)
    allow_credentials=True,                 # 쿠키/세션 등 인증정보 허용
    allow_methods=["*"],                    # 모든 HTTP 메서드 허용 (GET, POST 등)
    allow_headers=["*"],                    # 모든 요청 헤더 허용 (Authorization 등)
)

app.include_router(image_router)
app.include_router(post_router)
app.include_router(user_router)
app.include_router(like_router)
