import datetime
from fastapi import APIRouter, File, UploadFile, Form

from db import cursor, conn
from image import saveImg
from models import UpdateNonImgRequest

router = APIRouter()


@router.post("/mysqlUpdateNotImg")
async def mysqlUpdateNotImg(body: UpdateNonImgRequest):
    createdAt = datetime.datetime.now()
    cursor.execute(
        """
        UPDATE postdbid
        SET subject = %s,
            content = %s,
            created_at = %s
        WHERE id = %s
        """,
        (body.subject, body.content, createdAt, body.postId)
    )
    conn.commit()

    return "완료"


# 검색
@router.get("/mysqlSearch")
async def mysqlSearch(text: str):
    query = """
        SELECT
            p.id,
            p.subject,
            p.created_at,
            p.image_path,
            u.userNameData
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.subject LIKE %s
        ORDER BY p.created_at DESC
    """
    cursor.execute(query, (f"%{text}%",))
    rows = cursor.fetchall()
    rows = list(rows)

    for idx in range(len(rows)):
        row = list(rows[idx])
        row[3] = "http://localhost:8000/images/" + row[3]
        rows[idx] = tuple(row)
    return rows


# 검색 페이징 (총 개수)
@router.get("/mysqlSearchPaging")
async def mysqlSearchPaging(text: str):
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM postdbid
        WHERE subject LIKE %s;
        """,
        (f"%{text}%",),
    )
    rows = cursor.fetchall()
    return rows


# 검색 페이징 (목록)
@router.get("/mysqlSearchList")
async def mysqlSearchList(text: str, pageWhere: int, pageNum: int):
    cursor.execute(
        """
        SELECT
            p.id,
            p.subject,
            p.created_at,
            p.image_path,
            u.userNameData
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.subject LIKE %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (f"%{text}%", pageWhere, pageNum),
    )
    rows = cursor.fetchall()
    rows = list(rows)

    for idx in range(len(rows)):
        row = list(rows[idx])
        row[3] = "http://localhost:8000/images/" + row[3]
        rows[idx] = tuple(row)
    return rows


# 페이징
@router.get("/paging")
async def paging():
    cursor.execute("SELECT COUNT(*) FROM postdbid;")
    rows = cursor.fetchall()
    return rows


# 메인 화면 (전체 게시글 id, 제목, 날짜 조회)
@router.get("/list")
async def home_select(pageWhere: int, pageNum: int):
    cursor.execute(
        """
        SELECT
            p.id,
            p.subject,
            p.created_at,
            p.image_path,
            u.userNameData,
            p.changeCnt
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        ORDER BY p.created_at DESC
        LIMIT %s, %s
        """,
        (pageWhere, pageNum)
    )

    rows = cursor.fetchall()
    rows = list(rows)

    for idx in range(len(rows)):
        row = list(rows[idx])
        print( row[3])
        row[3] = "http://localhost:8000/images/" + row[3]
        rows[idx] = tuple(row)

    return rows


# 마이페이지 (게시글 id, 제목, 날짜 조회)
@router.get("/mylist")
async def home_select(pageWhere: int, pageNum: int, userId: str):
    cursor.execute(
        """
        SELECT
            p.id,
            p.subject,
            p.created_at,
            p.image_path,
            u.userNameData
        FROM postdbid p
        JOIN postdbuser u ON p.userid = u.id
        WHERE p.userid = %s
        ORDER BY p.created_at DESC
        LIMIT %s, %s;
        """,
        (userId, pageWhere, pageNum)
    )

    rows = cursor.fetchall()
    rows = list(rows)

    for idx in range(len(rows)):
        row = list(rows[idx])
        row[3] = "http://localhost:8000/images/" + row[3]
        rows[idx] = tuple(row)

    return rows


# 마이페이지 페이징 (총 개수)
@router.get("/mypaging")
async def mypaging(userId: str):
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM postdbid
        WHERE userid = %s;
        """,
        (userId,),
    )
    rows = cursor.fetchall()
    return rows


# 게시글 조회 (게시글의 모든 정보 조회)
@router.get("/mysqlSelect")
async def mysqlSelect(postId: str):
    cursor.execute("""
            SELECT
            u.id,
            p.subject,
            p.content,
            p.created_at,
            p.image_path,
            u.userNameData,
            p.changeCnt
            FROM postdbid p
            JOIN postdbuser u ON p.userid = u.id
            WHERE p.id = %s
    """, (postId))
    rows = cursor.fetchall()
    rows = list(rows)

    for idx in range(len(rows)):
        row = list(rows[idx])
        row[4] = "http://localhost:8000/images/" + row[4]
        rows[idx] = tuple(row)

    return rows


# 게시글 추가 (제목, 내용)
@router.post("/mysqlInsert")
async def mysqlInsert(
    userId: str = Form(...),
    subject: str = Form(...),
    content: str = Form(...),
    files: UploadFile = File(...),
    postId: str = Form(...)
):
    imagePath = saveImg(files)

    # 경로 + id암호화
    createdAt = datetime.datetime.now()
    cursor.execute(
        """
        INSERT INTO postdbid
        (subject, content, created_at, image_path, userid)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (subject, content, createdAt, imagePath, userId)
    )
    conn.commit()

    return imagePath


@router.post("/mysqlUpdate")
async def mysqlUpdate(
    subject: str = Form(...),
    content: str = Form(...),
    files: UploadFile = File(...),
    postId: str = Form(...)
):
    imagePath = saveImg(files)
    createdAt = datetime.datetime.now()
    cursor.execute(
        """
        UPDATE postdbid
        SET subject = %s,
            content = %s,
            created_at = %s,
            image_path = %s,
            changeCnt = 1
        WHERE id = %s
        """,
        (subject, content, createdAt, imagePath, postId)
    )
    conn.commit()
    return imagePath


# 게시글 삭제
@router.get("/mysqlDelete")
async def mysqlDelete(postId: str):
    cursor.execute("DELETE FROM postdbid WHERE id = %s", (postId))
    conn.commit()

    return "완료"
