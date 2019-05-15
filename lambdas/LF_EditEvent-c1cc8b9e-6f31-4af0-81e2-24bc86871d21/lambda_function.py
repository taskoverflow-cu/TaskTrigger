from config import *
from extract_info import *
import json
import copy
import pymysql.cursors
from elasticsearch import Elasticsearch #, RequestsHttpConnection
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# connect to ES
es = Elasticsearch([es_host+":"+str(es_port),])

def lambda_handler(event, context):
    # connect to RDS
    try:
        conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, port=3306,
                            cursorclass=pymysql.cursors.DictCursor,
                            connect_timeout=5)
    except Exception:
        logger.error("ERROR: Unexpected error: LF_EditEvent: Unable to connect to MySQL instance!")
        return {
            "code": 500,
            "message": "LF_EditEvent: Unable to connect to DB!"
        }
    logger.info("INFO: Connect to MySQL instance succeed!")

    logger.info("Event: "+json.dumps(event,indent=2))
    event_id = event['event_id']
    creator_id = event['user_id']
    
    # for es 
    # deep copy, otherwise event will be modified
    event_body = copy.copy(event['event']) 
    event_body.pop('longitude', None)
    event_body.pop('latitude', None)
    event_body['creator_id'] = creator_id
    if 'start_time' in event['event']:
        event_body['start_time']=float(event['event']['start_time'])*1000.0
    if 'end_time' in event['event']:
        event_body['end_time'] = float(event['event']['end_time'])*1000.0
        
    if 'longitude' in event['event'] and 'latitude' in event['event']:
        event_body['coordinate'] = {'lat': str(event['event']['latitude']), 
                               'lon': str(event['event']['longitude']) }

    # for rds
    # deep copy, otherwise event will be modified
    event_info = extract_event(copy.copy(event['event']))
    creator_id = event['user_id']
    headers = ",".join(key for key in event_info)
    values = ",".join("\'"+str(v)+"\'" for v in event_info.values())

    query = "INSERT INTO Event(creator_id,"
    query += headers
    query += ",create_time,state) VALUES("
    query += str(creator_id)+","+values+","
    query += "\'"+datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')+"\'"
    query += ","+str(1)+");"
    
    logger.info("SQL Query: "+ query)
    cur = conn.cursor()

    try:
        # soft delete original event
        if delete_item(cur, event_id, creator_id):
            # add new event to rds
            cur.execute(query)
            event_id = cur.lastrowid
            par_query = "INSERT INTO ParticipateEvent(participant_id, event_id, state) VALUES({},{},{});".format(creator_id, event_id, 1)
            cur.execute(par_query)
            
            # if group event
            if 'participant_emails' in event:
                logger.info("This is a Group Event!")
                invalid_emails = list()
                invitee_ids = list()
                
                emails = event['participant_emails']
                # check whether email is valid 
                for email in emails:
                    email_query="SELECT user_id FROM User WHERE email={}".format("\'"+email+"\'")
                    logger.info(email_query)
                    cur.execute(email_query)
                    result = cur.fetchall()
                    if result is None:
                        invalid_emails.append(email)
                    else:
                        invitee_ids.append(result[0]['user_id'])
                    
                if len(invalid_emails)>0:
                    # invalid emails exist
                    logger.info("Invalid Emails:"+json.dumps(invalid_emails, indent=2))
                    return {
                        'statusCode':200,
                        'body': {
                            'state':'-1',
                            'message':'invalid emails',
                            'data':json.dumps(invalid_emails)
                        }
                    }
                    
                # save invitations
                logger.info("Invitation invitee_ids:"+json.dumps(invitee_ids))
                
                for invitee_id in invitee_ids:
                    save_query = "INSERT INTO EventInvitation(event_id, creator_id, invitee_id, invite_time, state)"
                    save_query += " VALUES({},{},{},{},{})".format(event_id, creator_id, invitee_id, "\'"+datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')+"\'", 1)
                    logger.info("Insert Invitations query:"+save_query)
                    cur.execute(save_query)
                
            conn.commit()
            logger.info("Add new Event to rds successfully")
    	    # add new event to es
            event_body['event_id']=event_id
            es.index(index="events",doc_type="Event",body=event_body)
            logger.info("Add new Event to es successfully")
        else:
            conn.close()
            return {
                "code": 500,
                "message": "LF_EditEvent: No such event exists!"
                }
    except Exception as e:
        print(e)
        conn.close()
        logger.error("ERROR: Unexpected error: LF_EditEvent: Unable to update event!")
        return {
            "code": 500,
            "message": "LF_EditEvent: Fail to update event!"
            }
    
    conn.close()   
    return {
        'statusCode': 200,
        'body': json.dumps("Edited Event Successfully!")
    }


def delete_item(cur, event_id, creator_id):
    get_query = "SELECT * FROM Event WHERE event_id="+ event_id+" AND state=1 AND creator_id={};".format(creator_id)
    logger.info("Get query:" + get_query)
    delete_query = "UPDATE Event SET state=0 WHERE event_id="+ event_id+";"
    logger.info("Delete query:"+delete_query)
    delete_par_query = "UPDATE ParticipateEvent SET state=0 WHERE event_id="+event_id+";"
    logger.info("Delete participant query:" + delete_par_query)
    delete_invi_query = "UPDATE EventInvitation SET state=-2 WHERE event_id="+event_id+";"
    logger.info("Delete invitation query:"+delete_invi_query)
    
    # es
    doc = {"query":{"term": {"event_id": event_id}}}
    
    # check if event exists
    cur.execute(get_query)
    result = cur.fetchone()
    if result:
        # delete from rds
        cur.execute(delete_query)
        logger.info("Event: {} deleted from rds.".format(event_id))
        cur.execute(delete_par_query)
        logger.info("ParticpateEvent: {} deleted from rds.".format(event_id))    
        cur.execute(delete_invi_query)
        logger.info("EventInvitation: {} deleted from rds.".format(event_id))
        
        # delete from es
        es.delete_by_query( index='events', 
                            doc_type='Event',
                            body=doc)
        	
        logger.info("Event: {} deleted from ES".format(event_id))
        return True
    return False