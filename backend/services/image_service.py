"""이미지 저장/경로 조회 서비스."""
from repositories import image_repository


def save_image(img_file):
    """이미지 파일 저장 후 파일명 반환."""
    return image_repository.save_image_file(img_file)


def get_image_path(file_name: str):
    """이미지 파일 경로 반환."""
    return image_repository.get_image_path(file_name)


def image_exists(file_name: str) -> bool:
    """이미지 파일 존재 여부."""
    return image_repository.image_file_exists(file_name)


def get_upload_dir():
    return image_repository.get_upload_dir()
