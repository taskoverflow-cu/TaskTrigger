import json
from config import *
import pymysql
from elasticsearch import Elasticsearch
import logging
import re


def get_busy_intervals(participants_id, min_start_time, max_end_time, conn): # time in sec
    """
    must_q = []
    must_q.append(
        {"range": {
            "end_time"  : {"gte": min_start_time * 1000}  # ES uses epoch millisec
        }
        }
    )
    must_q.append(
        {"range": {
            "start_time": {"lte": max_end_time * 1000}  # ES uses epoch millisec
        }
        }
    )
    """
    # datetime format: 'YYYY-MM-DD hh:mm:ss'
    qry =  "SELECT unix_timestamp(Event.start_time) AS start_time, "
    qry += "unix_timestamp(Event.end_time) AS end_time "
    qry += "FROM Event, ParticipateEvent "
    qry += "WHERE ParticipateEvent.event_id = Event.event_id "
    qry += "AND   ParticipateEvent.participant_id in {} ".format(str(tuple(participants_id)))
    qry += "AND   ParticipateEvent.state = 1 "
    qry += "AND   Event.state = 1 "
    qry += "AND   Event.start_time < from_unixtime({}) ".format(max_end_time)
    qry += "AND   Event.end_time>from_unixtime({});".format(min_start_time)


    with conn.cursor() as cur:
        try:
            cur.execute(qry)
            rows = cur.fetchall()
        except Exception as e:
            print(e)
            conn.close()
            exit()
        conn.commit()

    return map(lambda t: [int(t['start_time']),int(t['end_time'])], rows) # return a map object

def intersect(i1,i2):
    return not (i1[0]>=i2[1] or i2[0]>=i1[1])

def compute_remnant_intervals(min_start_time, max_end_time, intervals):
    res = [[min_start_time,max_end_time]]
    next_res = []
    for interval in intervals: # each interval is a busy interval
        for res_i in res:  # each res_i is a free interval
            if intersect(res_i, interval):
                if res_i[0]<interval[0]:
                    next_res.append([res_i[0],interval[0]])
                if interval[1]<res_i[1]:
                    next_res.append([interval[1],res_i[1]])
            else:
                next_res.append(res_i)
        res = next_res
        next_res = []

    return res


def get_advice_no_conflict(message, participants_id, conn, es):
    participants_id = set(participants_id)
    participants_id.add(int(message["user_id"]))

    duration = int(float(message["duration"]))#in sec
    min_start_time = int(float(message["min_start_time"]))
    max_end_time = int(float(message["max_end_time"]))

    intervals = get_busy_intervals(participants_id,min_start_time,max_end_time,conn)

    free_intervals = compute_remnant_intervals(min_start_time,max_end_time, intervals)

    ret = []

    for i in free_intervals:
        if i[1]-i[0]>= duration:
            ret.append({
                "start_time": str(i[0]),
                "end_time": str(i[1])
            })

    return ret


def get_invalid_emails(message, logger, conn):
    emails = message['participants_email']
    # check whether email is valid
    invalid_emails = []
    participants_id = []
    with conn.cursor() as cur:
        for email in emails:
            email_query = "SELECT user_id FROM User WHERE email={}".format("\'" + email + "\'")
            logger.info(email_query)
            cur.execute(email_query)
            result = cur.fetchall()
            if not result:
                invalid_emails.append(email)
            else:
                participants_id.append(result[0]['user_id'])

    return invalid_emails, participants_id

def lambda_handler(event, context):
    messages = event['messages']

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    # connect to RDS and ES
    try:
        conn = pymysql.connect(rds_host,
                               user=name,
                               passwd=password,
                               db=db_name,
                               port=3306,
                               cursorclass=pymysql.cursors.DictCursor,
                               connect_timeout=5)

        es = Elasticsearch([es_host + ":" + str(es_port), ])
    except Exception as e:
        print(e)
        return {
            "code": 500,
            "message": "LF_GetAdvice: Unable to connect to DB/ES!"
        }

    results = []

    with conn.cursor() as cur:
        cur.execute("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;")

    for message in messages:
        invalid_emails, participants_id = get_invalid_emails(message,logger,conn)
        if len(invalid_emails)>0:
            results.append({
                'statusCode': 200,
                'body': {
                    'state': '-1',
                    'message': 'invalid emails',
                    'data': json.dumps(invalid_emails)
                }
            })
        else:
            res = get_advice_no_conflict(message,participants_id, conn, es)
            results.append({
                "user_id": int(message["user_id"]),
                "recommendations": res
            })

    return {"messages": results}