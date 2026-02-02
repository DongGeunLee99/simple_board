import pymysql


# fastApi.py 에 있던 DB 연결 로직을 그대로 분리
conn = pymysql.connect(
    host="localhost",
    port=3306,
    user="root",
    password="Ehdrms54!!",
    database="test",
    charset="utf8",
)

cursor = conn.cursor()


__all__ = ["conn", "cursor"]

