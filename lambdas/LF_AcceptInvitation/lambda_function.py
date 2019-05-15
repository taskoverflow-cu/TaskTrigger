from config import *
import datetime
import json
import pymysql.cursors
import logging

def lambda_handler(event, context):
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.info("Event: "+json.dumps(event,indent=2))
      
    # connect to RDS
    try:
        conn = pymysql.connect(rds_host,
                               user=name,
                               passwd=password,
                               db=db_name,
                               port=3306,
                               cursorclass=pymysql.cursors.DictCursor,
                               connect_timeout=5)
        
    except Exception as e:
        logger.error(e)
        logger.error("ERROR: Unexpected error: LF_AcceptInvitation: Unable to connect to MySQL instance!")
        return {
            "code": 500,
            "message": "LF_AcceptInvitation: Unable to connect to DB!"
        }
    logger.info("INFO: Connect to MySQL instance succeed!")
    
    with conn.cursor() as cur:
        try:
            event_invitation_id = event['event_invitation_id']
            user_id = event['user_id']
            
            query = "SELECT event_id FROM EventInvitation WHERE event_invitation_id={};".format(event_invitation_id)
            logger.info("select event_id query:"+query)
            
            cur.execute(query)
            result = cur.fetchall()
            if result:
                event_id = result[0]['event_id']
                # update invitation
                invitation_query = "Update EventInvitation SET state=0, response_time = {} WHERE event_invitation_id={};".format("\'"+datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')+"\'", event_invitation_id)
                logger.info("update invitation_query:"+invitation_query)

                cur.execute(invitation_query)
                # add to participant table
                par_query = "INSERT INTO ParticipateEvent(participant_id, event_id, state) VALUES({},{},{});".format(user_id, event_id, 1)
                logger.info("insert participant_query:"+par_query)

                cur.execute(par_query)
                conn.commit()
        except Exception as e:
            logger.error(e)
            logger.error("ERROR: LF_AcceptInvitation: Accept Invitation failed!")
            return {
                'statusCode':500,
                'body':json.dumps('Accept Invitation failed!')
            }
    
    return {
        'statusCode': 200,
        'body': json.dumps('Accepted Invitation from {}!'.format(event_invitation_id))
    }
