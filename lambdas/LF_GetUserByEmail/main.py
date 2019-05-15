import pymysql.cursors
from config import *
import logging
import json

def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    email = event['pathParameters']['email'].replace("%40", "@")
    
    # get user info
    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM User WHERE email = %s",email)
        result = cursor.fetchone()
        if result:
            logger.info('Get user information with email = %s'%email)
            result = {
                    "isBase64Encoded": False,
                    "statusCode": 200,
                    "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
                    "body": json.dumps(result)
                }
        else:
            logger.info('No user with email = %s '%email)
            result = {
                    "isBase64Encoded": False,
                    "statusCode": 200,
                    "headers" : {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"},
                    "body": json.dumps({
                        "reason": "No user with the email %s"%email
                    })
                }
            
        return result