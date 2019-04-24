import pymysql.cursors
from config import *
import logging
import random

def request_handler(event, context):
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)

    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    client_username = event['userName']
    client_email = event['request']['userAttributes']['email']
    client_sub = event['request']['userAttributes']['sub']
    # test if user exists
    with connection.cursor() as cursor:
        cursor.execute("SELECT email FROM User WHERE email=%s", client_email)
        result = cursor.fetchall()
        if result:
            logger.info('User %s has signed in', client_email)
            return event
        # otherwise insert
        cursor.execute('INSERT INTO User(username, email, cognito_id) VALUES(%s, %s, %s)', (client_username, client_email, client_sub))
    try:
        connection.commit()
        logger.info('Insert New User %s into MySQL Succeed!', client_username)
    except Exception as e:
        logger.error('Insert New User %s into MySQL Failed!', client_username)
    return event
