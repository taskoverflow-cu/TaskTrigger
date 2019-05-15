import json
from config import *
import pymysql.cursors
from elasticsearch import Elasticsearch #, RequestsHttpConnection
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
    except Exception:
        logger.error("ERROR: Unexpected error: LF_GetEvent: Unable to connect to MySQL instance!")
        return {
            "code": 500,
            "message": "LF_GetEvent: Unable to connect to DB!"
        }
    logger.info("INFO: Connect to MySQL instance succeed!")
    
    user_id = event['user_id']
    query = "SELECT event_id FROM ParticipateEvent WHERE participant_id = {} and state=1".format(user_id)
    create_events = list()
    par_events = list()
    
    with conn.cursor() as cur:
        try:
            cur.execute(query)
            results = cur.fetchall()
            if results:
                for result in results:
                    event_id = result['event_id']
                    # check if this event is created by user
                    get_event_q = "SELECT event_id, creator_id, event_name, unix_timestamp(start_time),unix_timestamp(end_time)," 
                    get_event_q += "location, longitude, latitude, description, visibility, capacity, avatar_url FROM Event" 
                    get_event_q += " WHERE event_id={};".format(event_id)
                    cur.execute(get_event_q)
                    my_event = cur.fetchall()
                    if my_event:
                        if my_event[0]['creator_id']==int(user_id):
                            create_events.append(my_event[0])
                        else:
                            par_events.append(my_event[0])
            conn.commit()
        except Exception as e:
            print(e)
            conn.close()
            logger.error("ERROR: Unexpected error: LF_GetEvent: Unable to get event!")
            return {
                "code": 500,
                "message": "LF_GetEvent: Fail to get event!"
            }
    
    logger.info("created_event:"+json.dumps(create_events,indent=2))
    logger.info("participated_event:"+json.dumps(par_events))
    
    return {
        'statusCode': 200,
        'body': {
            "created_event":json.dumps(create_events),
            "participated_event":json.dumps(par_events)
        }
    }

