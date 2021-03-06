import pymysql.cursors
from config import *
import logging
import json

def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

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

        cursor.execute("SELECT COUNT(user_id) AS count FROM User WHERE user_id=%s OR user_id=%s", (uid1,uid2))
        result = cursor.fetchone()
        if result['count'] != 2:
            return getBadResponse("User does not exist.")
        
        try:
            cursor.execute("DELETE FROM Friend WHERE user_id1=%s AND user_id2=%s", (uid1,uid2))
            cursor.execute("DELETE FROM Friend WHERE user_id1=%s AND user_id2=%s", (uid2,uid1))
            connection.commit()
            return getGoodResponse("OK")
        except Exception as e:
            logger.error(e)
            return getBadResponse("Remove failed.")


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
        "statusCode": 200,
        "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
        "body": json.dumps({
            "reason": reason
        })
    }