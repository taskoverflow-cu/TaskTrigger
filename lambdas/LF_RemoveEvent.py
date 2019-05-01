import json
from config import *
import pymysql

def lambda_handler(event, context):
    # TODO implement
    messages = event['messages']

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
        print(e)
        return {
            "code": 500,
            "message": "LF_RemoveEvent: Unable to connect to DB!"
        }
    results = []
    # need serializable
    with conn.cursor() as cur:
        cur.execute("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;")

    # Handle the messages
    for message in messages:

        event_qry = "SELECT event_name, creator_id, state "
        event_qry += "FROM Event WHERE event_id = {};".format(message["event_id"])

        with conn.cursor() as cur:
            try:
                cur.execute(event_qry) # get the event info
                the_event = cur.fetchall()
            except Exception as e:
                print(e)
                conn.close()
                return {
                    "code": 500,
                    "message": "LF_RemoveEvent: Fail to execute event query!"
                }
            print (the_event)
            if not the_event or the_event[0]['state'] == 0:  # event nonexist or inactive
                results.append({"response": "success|invalid event"})
            elif int(message["user_id"]) == the_event[0]["creator_id"]:  # creator removes event. Delete the event
                #delete the event
                delete_qry =  "UPDATE Event "
                delete_qry += "SET state = 0 "
                delete_qry += "WHERE event_id = {}; ".format(message["event_id"])

                #cascade delete participations to the event
                cascade_qry =  "UPDATE ParticipateEvent "
                cascade_qry += "SET state = 0 "
                cascade_qry += "WHERE event_id = {};".format(message["event_id"])
                try:
                    cur.execute(delete_qry)
                    cur.execute(cascade_qry)
                except Exception as e:
                    print(e)
                    conn.close()
                    return {
                        "code": 500,
                        "message": "LF_RemoveEvent: Fail to delete!"
                    }
                # TODO: Delete the event from ES!
                results.append({"response": "success|deleted"})
            else: #simple remove
                results.append({"response": "success|removed"})

            # Try to delete participation anyway
            quit_qry = "UPDATE ParticipateEvent "
            quit_qry+= "SET state = 0 "
            quit_qry+= "WHERE event_id = {} AND participant_id = {};".format(message["event_id"],message["user_id"])
            try:
                cur.execute(quit_qry) # get the event info
            except Exception as e:
                print(e)
                conn.close()
                return {
                    "code": 500,
                    "message": "LF_RemoveEvent: Fail to execute remove query!"
                }
        conn.commit()

    conn.close()
    return {"messages":results}

event = {"messages":[{"user_id": 16, "event_id":2}]}
lambda_handler(event,{})