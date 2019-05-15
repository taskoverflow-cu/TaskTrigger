import datetime


def extract_event(event):
    event_info = event

    event_info['event_name'] = event_info['event_name']
    if 'start_time' in event:
        start_time = datetime.datetime.fromtimestamp(int(event['start_time']))
        event_info['start_time'] = start_time.strftime('%Y-%m-%d %H:%M:%S')
    if 'end_time' in event:
        end_time = datetime.datetime.fromtimestamp(int(event['end_time']))
        event_info['end_time'] = end_time.strftime('%Y-%m-%d %H:%M:%S')
 
    return event_info
