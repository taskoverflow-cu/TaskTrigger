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
    requestid = event['pathParameters']['requestid']
    state = event['pathParameters']['state']

    try:
        requestid = int(requestid)
        state = int(state)
        if requestid < 1 or state < 1 or state > 4:
            raise Exception()
    except:
        raise ValueError("Input parameters error.")
    return requestid, state


def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    try:
        requestid, state = checkInput(event)
    except Exception as e:
        return getBadResponse(str(e))

    logger.info(f'Received a valid request with parameters: requestID: {requestid}, state: {state}')

    connection = pymysql.connect(host= host,
                                 user=username,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
        # request
        cursor.execute("SELECT COUNT(*) AS count FROM FriendRequest WHERE request_id = %s", requestid)
        result = cursor.fetchone()
        if result['count'] == 0:
            logger.error(f'Request does not exist for RID =  {requestid}')
            return getBadResponse(f"Request does not exist for requestID = {requestid}.")

        # Change request State
        try:
            cursor.execute("UPDATE FriendRequest SET state = %s, response_time = %s WHERE request_id = %s", (state, datetime.datetime.now(), requestid))
            connection.commit()
            logger.info(f'Changed friend request with requestID = {requestid} TO state= {state}')
        except:
            logger.error(f'Change friend request failed, with requestID={requestid} and state ={state}.')
            return getBadResponse("Change friend request state failed.")
    return getGoodResponse("OK")

    


