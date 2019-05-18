import pymysql.cursors
from config import *
import logging
import json

def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    uid = event['pathParameters']['uid']
    
    # wrong input
    try:
        uid = int(uid)
    except:
        return {
            "isBase64Encoded": False,
            "statusCode": 400,
            "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
            "body": json.dumps({
                'reason': 'uid must be an integer.',
                'receiveduid': uid
            })
        }
    # get user info
    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM User WHERE user_id = %s",uid)
        result = cursor.fetchone()
        if result:
            logger.info('Get user information with uid = %s'%uid)
            result = {
                    "isBase64Encoded": False,
                    "statusCode": 200,
                    "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
                    "body": json.dumps(result)
                }
        else:
            logger.info('No user with uid = %s '%uid)
            result = {
                    "isBase64Encoded": False,
                    "statusCode": 400,
                    "headers" : {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"},
                    "body": json.dumps({
                        "reason": "No user with the uid %s"%uid
                    })
                }
            
        return result