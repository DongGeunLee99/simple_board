"""게시글 데이터 액세스."""
from db import cursor, conn

IMAGE_BASE_URL = "http://localhost:8000/images/"


def _row_to_list_with_image_url(rows, image_col_index=3):
    """결과 행들의 이미지 경로 컬럼을 전체 URL로 변환."""
    rows = list(rows)
    for idx in range(len(rows)):
        row = list(rows[idx])
        if row[image_col_index]:
            row[image_col_index] = IMAGE_BASE_URL + row[image_col_index]
        rows[idx] = tuple(row)
    return rows


def update_not_img(subject: str, content: str, created_at, post_id: str):
    cursor.execute(
        """
        UPDATE postdbid
        SET subject = %s, content = %s, created_at = %s
        WHERE id = %s
        """,
        (subject, content, created_at, post_id),
    )
    conn.commit()


def search_by_subject(text: str):
    cursor.execute(
        """
        SELECT p.id, p.subject, p.created_at, p.image_path, u.userNameData
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.subject LIKE %s
        ORDER BY p.created_at DESC
        """,
        (f"%{text}%",),
    )
    return _row_to_list_with_image_url(cursor.fetchall())


def count_search(text: str):
    cursor.execute(
        "SELECT COUNT(*) FROM postdbid WHERE subject LIKE %s",
        (f"%{text}%",),
    )
    return cursor.fetchall()


def search_list_paged(text: str, offset: int, limit: int):
    cursor.execute(
        """
        SELECT p.id, p.subject, p.created_at, p.image_path, u.userNameData
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.subject LIKE %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (f"%{text}%", offset, limit),
    )
    return _row_to_list_with_image_url(cursor.fetchall())


def count_all():
    cursor.execute("SELECT COUNT(*) FROM postdbid;")
    return cursor.fetchall()


def list_paged(offset: int, limit: int):
    cursor.execute(
        """
        SELECT p.id, p.subject, p.created_at, p.image_path, u.userNameData, p.changeCnt
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (offset, limit),
    )
    return _row_to_list_with_image_url(cursor.fetchall())


def list_by_user_paged(user_id: str, offset: int, limit: int):
    cursor.execute(
        """
        SELECT p.id, p.subject, p.created_at, p.image_path, u.userNameData
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.userid = %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (user_id, offset, limit),
    )
    return _row_to_list_with_image_url(cursor.fetchall())


def count_by_user(user_id: str):
    cursor.execute(
        "SELECT COUNT(*) FROM postdbid WHERE userid = %s",
        (user_id,),
    )
    return cursor.fetchall()


def get_by_id(post_id: str):
    cursor.execute(
        """
        SELECT u.id, p.subject, p.content, p.created_at, p.image_path,
               u.userNameData, p.changeCnt
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.id = %s
        """,
        (post_id,),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return _row_to_list_with_image_url(rows, image_col_index=4)[0]


def insert(subject: str, content: str, created_at, image_path: str, user_id: str):
    cursor.execute(
        """
        INSERT INTO postdbid (subject, content, created_at, image_path, userid)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (subject, content, created_at, image_path, user_id),
    )
    conn.commit()


def update_with_image(subject: str, content: str, created_at, image_path: str, post_id: str):
    cursor.execute(
        """
        UPDATE postdbid
        SET subject = %s, content = %s, created_at = %s, image_path = %s, changeCnt = 1
        WHERE id = %s
        """,
        (subject, content, created_at, image_path, post_id),
    )
    conn.commit()


def delete(post_id: str):
    cursor.execute("DELETE FROM postdbid WHERE id = %s", (post_id,))
    conn.commit()
