from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.image_router import router as image_router
from api.like_router import router as like_router
from api.post_router import router as post_router
from api.user_router import router as user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image_router)
app.include_router(post_router)
app.include_router(user_router)
app.include_router(like_router)
