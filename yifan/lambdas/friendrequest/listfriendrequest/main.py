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
    # STATE_LIST= ['wait', 'accept', 'decline', 'timeout']
    page = event['pathParameters']['page']
    limit = event['pathParameters']['limit']
    uid = event['pathParameters']['uid']
    state = event['pathParameters']['state']
    try:
        page = int(page)
        limit = int(limit)
        uid = int(uid)
        state = int(state)
        if state < 1 or state > 4  or page < 1 or limit < 1 or uid < 1:
            raise Exception()
    except:
        raise ValueError("Input error.")
        
    return page, limit, uid, state


def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    try:
        page, limit, uid, state = checkInput(event)
    except:
        return getBadResponse("Input error")

    logger.info(f'Received a valid request with parameters: page: {page}, limit: {limit}, uid: {uid}, state: {state}')

    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
        # check user 
        cursor.execute("SELECT COUNT(user_id) AS count FROM User WHERE user_id = %s", uid)
        result = cursor.fetchone()
        if result['count'] == 0:
            return getBadResponse("User does not exist.")

        # get request list
        requests = []
        cursor.execute("SELECT * FROM FriendRequest WHERE accept_user_id = %s AND state = %s LIMIT %s OFFSET %s;", ( uid, state, limit, (page-1)*limit ) )
        result = cursor.fetchall()
        if result:
            for row in result:
                requests.append(json.dumps(row))
    logger.info("Finished Request with uid={}".format(uid))
    return getGoodResponse(requests)

    


