"""이미지 API 라우터."""
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from services import image_service

router = APIRouter()


@router.get("/images/{file_name}")
def get_image(file_name: str):
    if not image_service.image_exists(file_name):
        raise HTTPException(status_code=404, detail="File not found")
    file_path = image_service.get_image_path(file_name)
    return FileResponse(file_path)
