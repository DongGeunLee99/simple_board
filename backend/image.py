import os
import shutil
import uuid
from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi import APIRouter

from db import cursor, conn

router = APIRouter()

UPLOAD_DIR = r"static\images"


def saveImg(imgFile):
    random_uuid = uuid.uuid4()
    imgFile.filename = f"{random_uuid}.png"

    file_path = os.path.join(UPLOAD_DIR, imgFile.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(imgFile.file, buffer)

    return imgFile.filename


@router.get("/images/{file_name}")
def get_image(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)
