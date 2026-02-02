from fastapi import APIRouter

from db import cursor, conn

router = APIRouter()


# 유저가 게시글 좋아요
@router.get("/postgood")
async def postgood(userId: int, postId: int):
    # 1️⃣ 이미 좋아요 눌렀는지 확인
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM post_like
        WHERE user_id = %s AND post_id = %s
        """,
        (userId, postId)
    )
    exists = cursor.fetchone()[0]

    # 2️⃣ 이미 있으면 → 좋아요 취소
    if exists > 0:
        cursor.execute(
            """
            DELETE FROM post_like
            WHERE user_id = %s AND post_id = %s
            """,
            (userId, postId)
        )
        conn.commit()
        return {"liked": False}

    # 3️⃣ 없으면 → 좋아요 추가
    else:
        cursor.execute(
            """
            INSERT INTO post_like (user_id, post_id)
            VALUES (%s, %s)
            """,
            (userId, postId)
        )
        conn.commit()
        return {"liked": True}


# 유저 좋아요 게시글 리스트
@router.get("/postgoodlist")
async def postgoodlist(pageWhere: int, pageNum: int, userId: str):
    """
    유저가 좋아요(즐겨찾기)한 게시글 목록 조회
    - 최신순 정렬
    - 페이징 지원 (pageWhere offset, pageNum limit)
    - 기존 list/mylist와 동일한 응답 shape: [id, subject, created_at, image_path(full url), userNameData]
    """
    cursor.execute(
        """
        SELECT
            p.id,
            p.subject,
            p.created_at,
            p.image_path,
            u.userNameData
        FROM post_like pl
        JOIN postdbid p ON pl.post_id = p.id
        JOIN postdbuser u ON p.userid = u.id
        WHERE pl.user_id = %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (userId, pageWhere, pageNum),
    )
    rows = cursor.fetchall()
    rows = list(rows)

    for idx in range(len(rows)):
        row = list(rows[idx])
        row[3] = "http://localhost:8000/images/" + row[3]
        rows[idx] = tuple(row)

    return rows


# 유저 좋아요 게시글 페이징 (총 개수)
@router.get("/postgoodpaging")
async def postgoodpaging(userId: str):
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM post_like
        WHERE user_id = %s
        """,
        (userId,),
    )
    rows = cursor.fetchall()
    return rows


# 유저가 특정 게시글에 좋아요 확인
@router.get("/postgoodcheck")
async def postgoodcheck(userId: str, postId: str):
    cursor.execute(
        "SELECT * FROM post_like WHERE user_id = %s AND post_id=%s",
        (userId, postId)
    )
    row = cursor.fetchone()
    if row:
        return True
    else:
        return False
