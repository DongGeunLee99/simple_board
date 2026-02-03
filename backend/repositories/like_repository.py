"""좋아요 데이터 액세스."""
from db import cursor, conn

IMAGE_BASE_URL = "http://localhost:8000/images/"


def count_like(user_id: int, post_id: int):
    cursor.execute(
        "SELECT COUNT(*) FROM post_like WHERE user_id = %s AND post_id = %s",
        (user_id, post_id),
    )
    return cursor.fetchone()[0]


def delete_like(user_id: int, post_id: int):
    cursor.execute(
        "DELETE FROM post_like WHERE user_id = %s AND post_id = %s",
        (user_id, post_id),
    )
    conn.commit()


def insert_like(user_id: int, post_id: int):
    cursor.execute(
        "INSERT INTO post_like (user_id, post_id) VALUES (%s, %s)",
        (user_id, post_id),
    )
    conn.commit()


def list_liked_posts_paged(user_id: str, offset: int, limit: int):
    cursor.execute(
        """
        SELECT p.id, p.subject, p.created_at, p.image_path, u.userNameData
        FROM post_like pl
        JOIN postdbid p ON pl.post_id = p.id
        JOIN postdbuser u ON p.userid = u.id
        WHERE pl.user_id = %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (user_id, offset, limit),
    )
    rows = cursor.fetchall()
    rows = list(rows)
    for idx in range(len(rows)):
        row = list(rows[idx])
        row[3] = IMAGE_BASE_URL + row[3]
        rows[idx] = tuple(row)
    return rows


def count_liked_by_user(user_id: str):
    cursor.execute(
        "SELECT COUNT(*) FROM post_like WHERE user_id = %s",
        (user_id,),
    )
    return cursor.fetchall()


def find_like(user_id: str, post_id: str):
    cursor.execute(
        "SELECT * FROM post_like WHERE user_id = %s AND post_id = %s",
        (user_id, post_id),
    )
    return cursor.fetchone()
