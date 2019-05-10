import pymysql.cursors
from config import *
import logging
import json

def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    error = False
    key = event['pathParameters']['searchkey']
    page = event['pathParameters']['page']
    limit = event['pathParameters']['limit']

    try:
        page = int(page)
        limit = int(limit)
        if page < 1 or limit < 1:
            error = True
    except:
        error = True

    if error:    
        return {
                "isBase64Encoded": False,
                "statusCode": 400,
                "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
                "body": json.dumps({
                    "reason": "Invalid Page/Limit."
                })
            }

    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    users = []
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM User WHERE email LIKE %s OR username LIKE %s LIMIT %s OFFSET %s", ( '%'+ key + '%',  '%'+ key + '%', limit, (page-1)*limit ) )
        result = cursor.fetchall()
        if result:
            for row in result:
                users.append( json.dumps(row))


    result = {
                "isBase64Encoded": False,
                "statusCode": 200,
                "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
                "body": json.dumps(users)
            }
    return result