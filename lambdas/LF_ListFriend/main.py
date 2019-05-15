import pymysql.cursors
from config import *
import logging
import json

def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    uid = event['pathParameters']['uid']
    page = event['pathParameters']['page']
    limit = event['pathParameters']['limit']

    try:
        page = int(page)
        limit = int(limit)
        uid = int(uid)
    except:
        return getBadResponse("Invalid parameters.")
    
    if(page < 1 or limit < 1):
        return getBadResponse("Invalid parameters.")

    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)

    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(user_id) AS count FROM User WHERE user_id = %s", uid)
        result = cursor.fetchone()
        if result['count'] == 0:
            return getBadResponse("User does not exist.")

        users = []    
        
        cursor.execute(" SELECT u2.user_id, u2.username, u2.email, u2.avatar_url, u2.cognito_id "  +
                        "FROM User u1 INNER JOIN Friend f ON u1.user_id = f.user_id1 " + 
                        "INNER JOIN User u2 ON f.user_id2 = u2.user_id WHERE u1.user_id = %s LIMIT %s OFFSET %s;",(uid, limit, (page-1)*limit ))
        result = cursor.fetchall()
        for row in result:
            users.append(json.dumps(row))
        return getGoodResponse(users)


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