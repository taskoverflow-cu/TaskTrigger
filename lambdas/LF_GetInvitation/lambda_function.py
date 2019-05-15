from config import *
import json
import pymysql.cursors
from elasticsearch import Elasticsearch #, RequestsHttpConnection
import logging
import copy

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    logger.info("Event: "+json.dumps(event,indent=2))
    
    # connect to rds
    try:
        conn = pymysql.connect(rds_host,
                               user=name,
                               passwd=password,
                               db=db_name,
                               port=3306,
                               cursorclass=pymysql.cursors.DictCursor,
                               connect_timeout=5)
    except Exception:
        logger.error("ERROR: Unexpected error: LF_GetInvitation: Unable to connect to MySQL instance!")
        return {
            "code": 500,
            "message": "LF_GetInvitation: Unable to connect to DB!"
        }
    logger.info("INFO: Connect to MySQL instance succeed!")
    
    user_id = event['user_id']
    invitation_query = "SELECT event_invitation_id, event_id, creator_id, unix_timestamp(invite_time)"
    invitation_query += " FROM EventInvitation WHERE state=1 AND invitee_id={};".format(user_id)
    
    event_query =  "SELECT event_id, creator_id, event_name, unix_timestamp(start_time), unix_timestamp(end_time), "
    event_query += "location, longitude, latitude, description, visibility, capacity, avatar_url FROM Event "
    event_query += "WHERE state=1 AND event_id = "
    
    invitations = list()
    with conn.cursor() as cur:
        try:
            cur.execute(invitation_query)
            results = cur.fetchall()
            for result in results:
                event_id = result['event_id']
                query = event_query+str(event_id)+";"
                cur.execute(query)
                event = cur.fetchone()
                if event:
                    invitation = copy.copy(result)
                    invitation['event'] = event
                    invitations.append(invitation)
            conn.commit()
        except Exception as e:
            print(e)
            conn.close()
            logger.error("ERROR: Unexpected error: LF_GetInvitation: Unable to get invitation!")
            return {
                "code": 500,
                "message": "LF_GetInvitation: Fail to get invitations!"
            }  
            
    conn.close()
    logger.info("invitations:"+json.dumps(invitations,indent=2))
    return {
        'statusCode': 200,
        'body': {
            "invitations":json.dumps(invitations)
        }
    }
