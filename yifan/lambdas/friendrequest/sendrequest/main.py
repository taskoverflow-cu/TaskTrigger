import pymysql.cursors
from config import *
import logging
import json
import datetime




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


def checkInput(event):
    # STATE_LIST= ['wait', 'accept', 'decline', 'timeout']
    uid1 = event['pathParameters']['uid1']
    uid2 = event['pathParameters']['uid2']

    try:
        uid1 = int(uid1)
        uid2 = int(uid2)
        if uid1 < 1 or uid2 < 1:
            raise Exception()
    except:
        raise ValueError("Input UID error.")
    return uid1, uid2


def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    try:
        uid1, uid2 = checkInput(event)
    except Exception as e:
        return getBadResponse(str(e))

    logger.info(f'Received a valid request with parameters: uid1: {uid1}, uid2: {uid2}')

    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
        # check user 
        cursor.execute("SELECT COUNT(user_id) AS count FROM User WHERE user_id = %s OR user_id = %s", (uid1, uid2))
        result = cursor.fetchone()
        
        if result['count'] != 2:
            logger.error(f'User does not exist for UID = {uid1} or {uid2}')
            return getBadResponse("User does not exist.")

        # create request
        try:
            cursor.execute("INSERT INTO FriendRequest VALUES(NULL, %s,%s,1,%s,NULL)", (uid1, uid2,datetime.datetime.now()))
            connection.commit()
            logger.info(f'Create a friend request from uid={uid1} to uid={uid2}')
        except:
            logger.error(f'Create friend request failed, with uid1={uid1}, uid2={uid2}')
            return getBadResponse("Create friend request failed.")

    return getGoodResponse("OK")

    


