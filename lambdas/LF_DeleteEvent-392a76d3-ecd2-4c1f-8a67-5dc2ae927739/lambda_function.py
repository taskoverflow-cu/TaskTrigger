from config import *
import json
import logging
import pymysql
from elasticsearch import Elasticsearch # RequestsHttpConnection


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
        logger.error("ERROR: Unexpected error: LF_DeleteEvent: Unable to connect to MySQL instance!")
        return {
            "code": 500,
            "message": "LF_DeleteEvent: Unable to connect to DB!"
        }
    logger.info("INFO: Connect to MySQL instance successfully!")

    event_id = event['event_id']
    
    # es
    es = Elasticsearch([es_host+":"+str(es_port),])
    doc = {"query":{"term": {"event_id": event_id}}}
    
    # rds
    get_query = "SELECT * FROM Event WHERE event_id="+ event_id+" AND state=1;"
    logger.info("Get query:" + get_query)
    delete_query = "UPDATE Event SET state=0 WHERE event_id="+ event_id+";"
    logger.info("Delete query:"+delete_query)
    delete_par_query = "UPDATE ParticipateEvent SET state=0 WHERE event_id="+event_id+";"
    logger.info("Delete participant query:" + delete_par_query)
    delete_inv_query  = "UPDATE EventInvitation SET state=-2 WHERE event_id="+event_id+";"
    logger.info("Delete invitation query:" + delete_inv_query)
    
    with conn.cursor() as cur:
        try:
            # check if event exists
            cur.execute(get_query)
            result = cur.fetchone()
            if result:
                # delete from rds
        	    cur.execute(delete_query)
        	    logger.info("Event: {} deleted from rds.".format(event_id))
        	    cur.execute(delete_par_query)
        	    logger.info("ParticpateEvent: {} deleted from rds.".format(event_id))
        	    cur.execute(delete_inv_query)
        	    logger.info("EventInvitation: {} deleted from rds.".format(event_id))

            conn.commit()
            
            # delete from es
            es.delete_by_query( index='events', 
                                doc_type='Event',
                                body=doc)
        	
            logger.info("Event: {} deleted from ES".format(event_id))
        except Exception as e:
            print(e)
            conn.close()
            logger.error("ERROR: Unexpected error: LF_DeleteEvent: Unable to delete event!")
            return {
                "code": 500,
                "message": "LF_DeleteEvent: Fail to delete event!"
            }
            
    conn.close()
    return {
        'statusCode': 200,
        'body': json.dumps("Deleted an event " + event_id + " successfully!")
    }