import json
from elasticsearch import Elasticsearch#, RequestsHttpConnection


def delete_from_ES(event_id):

    es_host = "https://vpc-tasktrigger-domain-bmmm3cd2xeh4x3iex5aug35u3q.us-east-1.es.amazonaws.com"
    es_port = 443

    es = Elasticsearch([es_host+":"+str(es_port),])

    doc = {
      "query":{
        "term":
            {"event_id": event_id}
      }
    }
    es.delete_by_query(index='events',
                       doc_type='Event',
                       body= doc )
    print("Event: {} deleted from ES".format(event_id))