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
    client_userid = event['userid']

    try:
        client_userid = int(client_userid)
    except:
        return { "result":"BAD INPUT"}
    
    with connection.cursor() as cursor:
        cursor.execute("""SELECT u.user_id as uid, u.username as username, u.email as email, u.avatar_url as avatar
                FROM Friend f 
                INNER JOIN User u
                ON f.user_id2 = u.user_id
                WHERE f.state=true AND f.user_id1 = %s""",client_userid)
        result = cursor.fetchall()
        
        logger.info('Find friend list for userid %s'%client_userid)
        friend_list = []
        for row in result:
            friend_list.append({
                "userid" : row['uid'],
                "username": row['username'],
                "email":row['email'],
                "avatar": row['avatar']
            })
    return { "result":"OK", "friends": friend_list }

