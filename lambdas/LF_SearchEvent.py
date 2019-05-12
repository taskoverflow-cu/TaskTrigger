import json
from config import *
import pymysql
from elasticsearch import Elasticsearch
import re
import datetime

DEFAULT_GEO_RADIUS = "3km"


def parse_words(s):
    tmp = ""
    for char in s:
        if char in [';', ',', '.']:
            tmp += " "
        else:
            tmp += char
    return " ".join(tmp.split())


def build_must_query(message):
    must_q = []
    if "time_leftbound" in message:
        must_q.append(
            {"range": {
                "start_time": {"gte": float(message["time_leftbound"]) * 1000}  # ES uses epoch millisec
            }
            }
        )
    if "time_rightbound" in message:
        must_q.append(
            {"range": {
                "end_time": {"lte": float(message["time_rightbound"]) * 1000}  # ES uses epoch millisec
            }
            }
        )

    if "longitude" in message and "latitude" in message:
        radius = str(message['radius']) + "km" if 'radius' in message else DEFAULT_GEO_RADIUS
        coordinate = {
            "lat": str(message["latitude"]),
            "lon": str(message["longitude"])
        }
        must_q.append(
            {
                "geo_distance": {
                    "distance": radius,
                    "coordinate": coordinate
                }
            }
        )

    return must_q


def build_should_query(message):
    should_q = []
    """
    if "longitude" in message and "latitude" in message:
        radius = str(message['radius'])+"km" if 'radius' in message else DEFAULT_GEO_RADIUS
        coordinate  = {
            "lat": str(message["latitude"]),
            "lon": str(message["longitude"])
        }
        should_q.append(
        {
            "geo_distance": {
                "distance": radius,
                "coordinate": coordinate
            }
        }
        )
    """

    if "event_name" in message:
        qstring = parse_words(message['event_name'])
        should_q.append(
            {
                "match": {
                    "event_name": qstring  # default operator is or
                }
            }
        )
    if "event_keywords" in message:
        qstring = parse_words(message['event_keywords'])
        should_q.append(
            {
                "multi_match": {
                    "query": qstring,
                    "fields": ["event_name", "description"],
                    "type": "most_fields"  # consider "cross_fields"
                }
            }
        )

    return should_q


def build_query(filter_q, must_q, should_q, limit, offset):
    query = {
        "from": offset, "size": limit,
        "query": {
            "bool": {
                "filter": filter_q,
                "must": must_q,
                "should": should_q
            }
        }
    }
    print(query)
    return query


def get_friends_id(user_id, conn):
    sql_q = "SELECT DISTINCT user_id2 "
    sql_q += "FROM Friend "
    sql_q += "WHERE user_id1 = {} AND state = 1;".format(user_id)
    with conn.cursor() as cur:
        try:
            cur.execute(sql_q)
            rows = cur.fetchall()
        except Exception as e:
            print(e)
            conn.close()
            print(sql_q)
            exit()
        conn.commit()

    friends_id = list(map(lambda t: t['user_id2'], rows))

    return friends_id


def get_events_sql(event_id_list, conn):  # [1,2,3,4]

    # Perhaps needless to check event state? ES only keeps active events.
    sql_q = "SELECT * "
    sql_q += "FROM Event "
    if len(event_id_list) == 1:
        sql_q += "WHERE event_id = {} AND state = 1;".format(event_id_list[0])
    else:
        sql_q += "WHERE event_id in {} AND state = 1;".format(str(tuple(event_id_list)))
    # print (sql_q)

    with conn.cursor() as cur:
        try:
            cur.execute(sql_q)  # get events
            rows = cur.fetchall()
        except Exception as e:
            print(e)
            print(sql_q)
            conn.close()

            exit()
        conn.commit()
    for row in rows:
        row['start_time'] = int((row['start_time'] - datetime.datetime(1970, 1, 1)).total_seconds())
        row['end_time'] = int((row['end_time'] - datetime.datetime(1970, 1, 1)).total_seconds())
        row['create_time'] = int((row['create_time'] - datetime.datetime(1970, 1, 1)).total_seconds())
    return rows


def handle_es_res(es_res, conn):
    event_id_list = list(map(lambda t: int(t['_source']['event_id']), es_res['hits']['hits']))
    if not event_id_list:
        return []
    events = get_events_sql(event_id_list, conn)

    # sort the events according to the ES order
    # invert key-value
    event_id_dic = {}
    for i in range(len(event_id_list)):
        event_id_dic[event_id_list[i]] = i

    events.sort(key=lambda event: event_id_dic[event["event_id"]])

    # print(events)
    return events


def get_private_events(message, conn, es):
    limit = int(message["limit"])
    offset = int(message['offset'])
    filter_q = [
        {"term": {"visibility": 1}},
        {"term": {"creator_id": int(message["user_id"])}}
    ]
    must_q = build_must_query(message)
    should_q = build_should_query(message)

    doc = build_query(filter_q, must_q, should_q, limit, offset)
    print(json.dumps(doc, indent=2))
    res = es.search(index="events", doc_type="Event", body=doc)
    print(json.dumps(res, indent=2))
    events = handle_es_res(res, conn)

    return events


def get_friendonly_events(message, conn, es):
    # Get friendlist and then use terms
    # Nested query: https://www.elastic.co/guide/en/elasticsearch/guide/current/combining-filters.html
    limit = int(message["limit"])
    offset = int(message['offset'])
    friends_id = get_friends_id(int(message["user_id"]), conn)
    if not friends_id:
        return []

    filter_q = [
        {"term": {"visibility": 2}},
        {"terms": {"creator_id": friends_id}}
    ]
    must_q = build_must_query(message)
    should_q = build_should_query(message)

    doc = build_query(filter_q, must_q, should_q, limit, offset)
    print(json.dumps(doc, indent=2))
    res = es.search(index="events", doc_type="Event", body=doc)
    print(json.dumps(res, indent=2))
    events = handle_es_res(res, conn)

    return events


def get_public_events(message, conn, es):
    limit = int(message["limit"])
    offset = int(message['offset'])

    filter_q = [
        {"term": {"visibility": 4}}
    ]
    must_q = build_must_query(message)
    should_q = build_should_query(message)

    doc = build_query(filter_q, must_q, should_q, limit, offset)
    print(json.dumps(doc, indent=2))
    res = es.search(index="events", doc_type="Event", body=doc)
    print(json.dumps(res, indent=2))
    events = handle_es_res(res, conn)

    return events


def lambda_handler(event, context):
    messages = event['messages']

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
            "message": "LF_SearchEvent: Unable to connect to DB/ES!"
        }

    results = []

    with conn.cursor() as cur:
        cur.execute("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;")

    for message in messages:
        if int(message['visibility']) == 1:  # return private events
            events = get_private_events(message, conn, es)
        elif int(message['visibility']) == 2:  # return friends' friend-only events
            events = get_friendonly_events(message, conn, es)
        elif int(message['visibility']) == 4:  # return public events
            events = get_public_events(message, conn, es)
        else:  # invalid message
            return {
                "code": 500,
                "message": "LF_SearchEvent: Invalid Visibility!"
            }

        results.append({"user_id": int(message['user_id']),
                        "events": events})
    # print (results)
    return {"messages": results}
