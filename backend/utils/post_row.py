IMAGE_BASE_URL = "http://localhost:8000/images/"

def _row_to_list_with_image_url(rows, image_col_index=3):
    """결과 행들의 이미지 경로 컬럼을 전체 URL로 변환."""
    rows = list(rows)
    for idx in range(len(rows)):
        row = list(rows[idx])
        if row[image_col_index]:
            row[image_col_index] = IMAGE_BASE_URL + row[image_col_index]
        rows[idx] = list(row)
    return rows

