"""게시글 데이터 액세스."""
from db import cursor, conn
from utils.post_row import _row_to_list_with_image_url


def update_not_img(subject: str, content: str, created_at, post_id: str):
    cursor.execute(
        """
        UPDATE postdbid
        SET subject = %s, content = %s, created_at = %s, changeCnt = 1
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


def search_by_my_subject(text: str, userId: str, offset: int, limit: int):
    cursor.execute(
        """
        SELECT p.id, p.subject, p.created_at, p.image_path, u.userNameData
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.subject LIKE %s AND p.userid = %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (f"%{text}%",userId, offset, limit),
    )
    return _row_to_list_with_image_url(cursor.fetchall())


def search_by_like_subject(text: str, userId: str, offset: int, limit: int):
    cursor.execute(
        """
        SELECT
            p.id,
            p.subject,
            p.created_at,
            p.image_path,
            u.userNameData
        FROM postdbid p
        JOIN postdbuser u
        ON p.userid = u.id
        JOIN post_like l
        ON l.post_id = p.id
        WHERE p.subject LIKE %s
        AND l.user_id = %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (f"%{text}%",userId, offset, limit),
    )
    return _row_to_list_with_image_url(cursor.fetchall())


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


def list_paged_in_user(offset: int, limit: int, userId: str):
    cursor.execute(
        """
        SELECT 
            p.id, 
            p.subject, 
            p.created_at, 
            p.image_path, 
            u.userNameData, 
            p.changeCnt,
            CASE 
                WHEN l.user_id IS NULL THEN FALSE
                ELSE TRUE
            END AS is_liked
        FROM postdbid p
        JOIN postdbuser u 
            ON p.userid = u.id
        LEFT JOIN post_like l 
            ON p.id = l.post_id 
        AND l.user_id = %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s;
        """,
        (userId, offset, limit),
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
    return _row_to_list_with_image_url(rows, image_col_index=4)


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


def nextPostSelect(postCreatedAt: str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.created_at < %s
        ORDER BY p.created_at DESC
        LIMIT 1;
        """,
        (postCreatedAt,),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def prevPostSelect(postCreatedAt: str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.created_at > %s
        ORDER BY p.created_at ASC
        LIMIT 1;
        """,
        (postCreatedAt,),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def nextMyPostSelect(postCreatedAt: str, userId: str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.created_at < %s
        AND p.userid = %s
        ORDER BY p.created_at DESC
        LIMIT 1;

        """,
        (postCreatedAt, userId),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def prevMyPostSelect(postCreatedAt: str, userId: str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.created_at > %s
        AND p.userid = %s
        ORDER BY p.created_at ASC
        LIMIT 1;

        """,
        (postCreatedAt, userId),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def nextLikePostSelect(postCreatedAt: str, userId: str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN post_like l
        ON l.post_id = p.id
        WHERE p.created_at < %s
        AND l.user_id = %s
        ORDER BY p.created_at DESC
        LIMIT 1;
        """,
        (postCreatedAt, userId),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def prevLikePostSelect(postCreatedAt: str, userId: str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN post_like l
        ON l.post_id = p.id
        WHERE p.created_at > %s
        AND l.user_id = %s
        ORDER BY p.created_at ASC
        LIMIT 1;
        """,
        (postCreatedAt, userId),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]

#######################################################################
def nextSearchPostSelect(postCreatedAt: str, text:str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.created_at < %s
        AND p.subject LIKE %s
        ORDER BY p.created_at DESC
        LIMIT 1;
        """,
        (postCreatedAt, f"%{text}%"),
    )
    rows = cursor.fetchall()
    print("rows",postCreatedAt)
    if not rows:
        return None
    return rows[0]


def prevSearchPostSelect(postCreatedAt: str, text:str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.created_at > %s
        AND p.subject LIKE %s
        ORDER BY p.created_at ASC
        LIMIT 1;
        """,
        (postCreatedAt, f"%{text}%"),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def nextSearchMyPostSelect(postCreatedAt: str, userId: str, text:str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.created_at < %s
        AND p.userid = %s
        AND p.subject LIKE %s
        ORDER BY p.created_at DESC
        LIMIT 1;

        """,
        (postCreatedAt, userId, f"%{text}%"),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def prevSearchMyPostSelect(postCreatedAt: str, userId: str, text:str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.created_at > %s
        AND p.userid = %s
        AND p.subject LIKE %s
        ORDER BY p.created_at ASC
        LIMIT 1;

        """,
        (postCreatedAt, userId, f"%{text}%"),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def nextSearchLikePostSelect(postCreatedAt: str, userId: str, text:str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN post_like l
        ON l.post_id = p.id
        WHERE p.created_at < %s
        AND l.user_id = %s
        AND p.subject LIKE %s
        ORDER BY p.created_at DESC
        LIMIT 1;
        """,
        (postCreatedAt, userId, f"%{text}%"),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]


def prevSearchLikePostSelect(postCreatedAt: str, userId: str, text:str):
    cursor.execute(
        """
        SELECT p.id
        FROM postdbid p
        JOIN post_like l
        ON l.post_id = p.id
        WHERE p.created_at > %s
        AND l.user_id = %s
        AND p.subject LIKE %s
        ORDER BY p.created_at ASC
        LIMIT 1;
        """,
        (postCreatedAt, userId, f"%{text}%"),
    )
    rows = cursor.fetchall()
    if not rows:
        return None
    return rows[0]