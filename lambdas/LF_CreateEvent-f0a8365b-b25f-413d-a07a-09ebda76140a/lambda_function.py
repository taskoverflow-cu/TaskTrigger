from config import *
from extract_info import *

import copy
import json
import datetime
import pymysql.cursors
from elasticsearch import Elasticsearch #, RequestsHttpConnection
import logging

def zzhandler(event,context):
    for message in event["messages"]:
        #print(message['event'])
        lambda_handler(message,context)


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
         
        # connect to es
        es = Elasticsearch([es_host+":"+str(es_port),])
    except Exception:
        logger.error("ERROR: Unexpected error: LF_CreateEvent: Unable to connect to MySQL instance or ES!")
        return {
            "code": 500,
            "message": "LF_CreateEvent: Unable to connect to DB or ES!"
        }
    logger.info("INFO: Connect to MySQL instance and ES succeed!")
    creator_id = event['user_id']

    # for es 
    # deep copy, otherwise event will be modified
    logger.info(event.keys())
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
        #event_body['lat'] = str(event['event']['latitude']) 
        #event_body['lon'] = str(event['event']['longitude'])

    # for rds
    # deep copy, otherwise event will be modified
    event_info = extract_event(copy.copy(event['event']))
    headers = ",".join(key for key in event_info)
    values = ",".join("\'" + str(v) + "\'" for v in event_info.values())

    query = "INSERT INTO Event(creator_id,"
    query += headers
    query += ",create_time,state) VALUES("
    query += str(creator_id)+","+values+","
    query += "\'"+datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')+"\'"
    query += ","+str(1)+");"
    logger.info("Create Event Query: "+ query)
    
    with conn.cursor() as cur:
        cur.execute("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;")

        try:
            # add to rds
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
            
            # add to es  
            event_body['event_id']=event_id
            es.index(index="events", doc_type="Event", body=event_body)
        except Exception as e:
            print(e)
            conn.close()
            logger.error("ERROR: Unexpected error: LF_CreateEvent: Unable to create event!")
            return {
                "code": 500,
                "message": "LF_CreateEvent: Fail to create event!"
            }
    return {
        'statusCode': 200,
        'body': json.dumps("Created an Event Successfully!")
    }
