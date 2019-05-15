import pymysql.cursors
from config import *
import logging
import json

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

    uid1 = event['pathParameters']['uid1']
    uid2 = event['pathParameters']['uid2']
    try:
        uid1= int(uid1)
        uid2 = int(uid2)
        if uid1<1 or uid2 < 1:
            raise Exception()
    except:
        raise ValueError("UID error.")
        
    return uid1, uid2


def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    try:
        uid1, uid2 = checkInput(event)
    except Exception as e:
        return getBadResponse(str(e))

    logger.info(f'Received a valid request with parameters: uid1:{uid1}, uid2:{uid2}')

    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
        # check user 
        cursor.execute("SELECT COUNT(*) AS count FROM Friend WHERE user_id1 = %s AND user_id2 = %s", (uid1, uid2))
        result = cursor.fetchone()

    logger.info(f"Finished isFriend Request with uid1={uid1} and uid2={uid2}")
    return getGoodResponse({"result": False}) if result['count'] == 0 else getGoodResponse({"result": True})
        


    


