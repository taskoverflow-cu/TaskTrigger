import json
from config import *
import pymysql
from sqs import *
import datetime


def lambda_handler(event, context):
    # TODO implement
    messages = event['messages']
    print(event)

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
            "message": "LF_AddEvent: Unable to connect to DB!"
        }
    results = []
    # need serializable
    with conn.cursor() as cur:
        cur.execute("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;")

    # Handle the messages
    for message in messages:
        # check if event if full
        qry = "SELECT DISTINCT participant_id "
        qry += "FROM Event, ParticipateEvent "
        qry += "WHERE Event.event_id = {} AND ".format(int(message["event_id"]))
        qry += "ParticipateEvent.event_id = {} AND ".format(int(message["event_id"]))
        qry += "ParticipateEvent.state =1;"

        # event_qry = "SELECT capacity, creator_id, state,  "
        event_qry = "SELECT *  "
        event_qry += "FROM Event WHERE event_id = {};".format(int(message["event_id"]))

        with conn.cursor() as cur:
            try:
                cur.execute(qry)  # get all participants
                rows = cur.fetchall()
                cur.execute(event_qry)  # get the event info
                the_event = cur.fetchall()
            except Exception as e:
                print(e)
                conn.close()
                return {
                    "code": 500,
                    "message": "LF_AddEvent: Fail to execute query!"
                }
            print(the_event)
            if not the_event or the_event[0]['state'] == 0:  # event nonexist or inactive
                # results.append({"response": "fail|invalid event"})
                results.append({"success": 0, "info": "invalid event"})
                conn.commit()
                continue

            capacity = the_event[0]['capacity']
            if int(message["user_id"]) in map(lambda t: t['participant_id'], rows):  # user is already in
                # results.append({"response": "success|already in"})
                results.append({"success": 1, "info": "already in"})
            elif len(rows) >= capacity:  # event full
                # results.append({"response": "fail|full"})
                results.append({"success": 0, "info": "full"})
            else:  # add him to event
                add_req = "INSERT INTO "
                add_req += "ParticipateEvent(participant_id, event_id, state) "
                add_req += "VALUES ({},{},1);".format(int(message["user_id"]), int(message["event_id"]))

                try:
                    cur.execute(add_req)
                except Exception as e:
                    print(e)
                    conn.close()
                    return {
                        "code": 500,
                        "message": "LF_AddEvent: Fail to execute insert!"
                    }
                sqs = SQSHandler()
                the_event[0]['start_time'] = (
                the_event[0]['start_time'] - datetime.datetime(1970, 1, 1)).total_seconds()
                the_event[0]['end_time'] = (the_event[0]['end_time'] - datetime.datetime(1970, 1, 1)).total_seconds()
                sqs.send_message({"body": "hello",
                                  "event_name": str(the_event[0]['event_name']),
                                  "start_time": str(the_event[0]['start_time']),
                                  "end_time": str(the_event[0]['end_time']),
                                  "location": str(the_event[0]['location']),
                                  "description": str(the_event[0]['description'])
                                  })
                # results.append({"response": "success|added"})
                results.append({"success": 1, "info": "added"})
        conn.commit()

    conn.close()
    return {"messages": results}

event = {"messages":[{"user_id": 15, "event_id":1}]}
event = {"messages":[{"user_id": 16, "event_id":2}]}
event = {"messages":[{"user_id": 17, "event_id":2}]}
lambda_handler(event,{})