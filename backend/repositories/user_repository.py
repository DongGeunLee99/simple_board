"""유저 데이터 액세스."""
from db import cursor, conn


def find_by_id_and_password(user_id: str):
    cursor.execute(
        "SELECT * FROM postdbuser WHERE userIdData = %s",
        (user_id,),
    )
    return cursor.fetchone()


def find_by_id(user_id: str):
    cursor.execute("SELECT * FROM postdbuser WHERE id = %s", (user_id,))
    return cursor.fetchone()


def find_by_pw(user_id: str):
    cursor.execute("SELECT userPwData FROM postdbuser WHERE userIdData = %s", (user_id,))
    return cursor.fetchone()[0]


def count_by_user_id_data(user_id: str):
    cursor.execute(
        "SELECT COUNT(*) FROM postdbuser WHERE userIdData = %s",
        (user_id,),
    )
    result = cursor.fetchone()
    return result[0] if result else 0


def count_by_user_name_data(user_name: str):
    cursor.execute(
        "SELECT COUNT(*) FROM postdbuser WHERE userNameData = %s",
        (user_name,),
    )
    result = cursor.fetchone()
    return result[0] if result else 0


def insert_user(user_id_data: str, user_pw_data: str, user_birthday: str, user_name: str, user_email: str):
    cursor.execute(
        """
        INSERT INTO postdbuser
        (userIdData, userPwData, userBirthdayData, userNameData, userEmailData)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (user_id_data, user_pw_data, user_birthday, user_name, user_email),
    )
    conn.commit()


def update_user(user_pw: str, user_birthday: str, user_name: str, user_email: str, user_id: str):
    cursor.execute(
        """
        UPDATE postdbuser
        SET userPwData = %s, userBirthdayData = %s, userNameData = %s, userEmailData = %s
        WHERE id = %s
        """,
        (user_pw, user_birthday, user_name, user_email, user_id),
    )
    conn.commit()
    return cursor.rowcount


def find_for_login(user_id_data: str):
    cursor.execute(
        """
        SELECT id
        FROM postdbuser
        WHERE userIdData = %s
        """,
        (user_id_data),
    )
    return cursor.fetchone()
