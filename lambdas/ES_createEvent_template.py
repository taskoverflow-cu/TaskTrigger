import json
from elasticsearch import Elasticsearch#, RequestsHttpConnection


the_event = { "visibility": 4,
            "event_id":     6,
            "creator_id":   15,
            "start_time":   1234567890,
            "end_time":     9876543333,
            "coordinate":   "41.12,-71.34",
            "event_name":   "Java Night",
            "description":  "Come and play with java programming!"
            }


def add_to_ES(the_event):
    es_host = "https://vpc-tasktrigger-domain-bmmm3cd2xeh4x3iex5aug35u3q.us-east-1.es.amazonaws.com"
    es_port = 443

    es = Elasticsearch([es_host+":"+str(es_port),])
    es.index(index="events", doc_type="Event", body=the_event)