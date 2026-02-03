"""이미지 파일 저장/경로 조회 (파일 시스템 액세스)."""
import os
import shutil
import uuid


UPLOAD_DIR = os.path.join("static", "images")


def get_upload_dir():
    return UPLOAD_DIR


def save_image_file(img_file) -> str:
    """업로드 파일을 저장하고 파일명 반환."""
    random_uuid = uuid.uuid4()
    filename = f"{random_uuid}.png"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(img_file.file, buffer)
    return filename


def get_image_path(file_name: str) -> str:
    """파일명에 해당하는 전체 경로 반환."""
    return os.path.join(UPLOAD_DIR, file_name)


def image_file_exists(file_name: str) -> bool:
    """파일 존재 여부."""
    return os.path.isfile(get_image_path(file_name))
