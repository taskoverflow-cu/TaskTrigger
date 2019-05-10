import pymysql.cursors
from config import *
import logging
import json

def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    error = False
    uid1 = event['pathParameters']['uid1']
    uid2 = event['pathParameters']['uid2']

    try:
        uid1 = int(uid1)
        uid2 = int(uid2)
    except:
        return getBadResponse("Invalid User ID.")

    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    # check user 
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM Friend WHERE user_id1 = %s AND user_id2 = %s", (uid1, uid2))
        result = cursor.fetchone()
        if result:
            return getBadResponse("Friendship relation already exists.")

        cursor.execute("SELECT COUNT(user_id) AS count FROM User WHERE user_id=%s OR user_id=%s", (uid1,uid2))
        result = cursor.fetchone()
        if result['count'] != 2:
            return getBadResponse("User does not exist.")
            
        try:
            cursor.execute("INSERT INTO Friend(user_id1, user_id2,state) VALUES(%s,%s,1)", (uid1,uid2))
            cursor.execute("INSERT INTO Friend(user_id1, user_id2,state) VALUES(%s,%s,1)", (uid2,uid1))
            connection.commit()
            return getGoodResponse("OK")
        except:
            return getBadResponse("Insert failed.")


def getGoodResponse(result):
    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
        "body": json.dumps(result)
    }


def getBadResponse(reason):
    return {
        "isBase64Encoded": False,
        "statusCode": 400,
        "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
        "body": json.dumps({
            "reason": reason
        })
    }