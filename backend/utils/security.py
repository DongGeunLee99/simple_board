import os
import jwt
import bcrypt
from dotenv import load_dotenv


load_dotenv()
key = os.getenv("SECRET_KEY")


def passWordEncode(passWord : str):
    return bcrypt.hashpw(passWord.encode('utf-8'), bcrypt.gensalt())


def passWordCheck(passWord : str, check : str):
    return bcrypt.checkpw(check.encode('utf-8'), passWord)


def tokenEncode(userId : str):
    return jwt.encode({'id' : userId}, key, algorithm = 'HS256')


def tokenCheck(accessToken : str):
    return jwt.decode(accessToken, key, algorithms=['HS256'])