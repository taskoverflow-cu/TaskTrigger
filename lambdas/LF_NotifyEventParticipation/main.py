import json
from sqs import SQSHandler
import boto3
import logging
import datetime
from botocore.exceptions import ClientError
from config import SENDER
from config import AWS_REGION
from config import QUEUE_NAME


def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    sqs = SQSHandler()
    
    content, message =  sqs.get_message()
    if not content:
        return
    print(content)
    try:
        reciever, start_time, end_time, event_name, location = checkInput(content)
    except:
        logger.error(f'Get a invalid message from queue {content}, Deleted!')
        sqs.delete_message(message)
        return 

    subject = "You have succesfully joined a event!"
    body_text, body_html = getEmailBody(reciever, start_time, end_time, event_name, location)
    
    try:
        response = sendEmail(SENDER, reciever, subject, body_text, body_html)
    except ClientError as e:
        logger.error(f"Failed sending email to reciever: {reciever} from sender: {SENDER}")
        print(e.response['Error']['Message'])
    else:
        logger.info(f"Email has been send to reciever: {reciever} from sender: {SENDER}")
        print("Email sent! Message ID:"),
        print(response['MessageId'])
        sqs.delete_message(message)


def checkInput(content):

    reciever = content['Email']
    start_time = content['Start_time']
    end_time = content['End_time']
    event_name = content['Event_name']
    location = content['Location']
    

    start_time =  str(datetime.datetime.fromtimestamp( float(start_time) ))
    end_time =  str(datetime.datetime.fromtimestamp(float(end_time)))
    
    return reciever, start_time, end_time, event_name, location
    


def getEmailBody(reciever, start_time, end_time, event_name, location):
    body_text = ("This email was sent to notify that you have succesfully joined a new event\r\n"
                f"Event: {event_name}\r\n"
                f"Star at: {start_time}, End at: {end_time}\r\n"
                f"Location: {location}"
                )
    
    body_html = f"""<html>
    <head></head>
    <body>
      <h1>New event Joined!</h1>
      <p>This email was sent to notify that you have succesfully joined a new event<p>
      
      <table>
          <tr>
            <td>Event Name</td>
            <td>{event_name}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>{location}</td>
          </tr>
          <tr>
            <td>Star</td>
            <td>{str(start_time)}</td>
          </tr>
          <tr>
            <td>End</td>
            <td>{str(end_time)}</td>
          </tr>
      </table>
    </body>
    </html>
                """    
    return body_text, body_html
    

def sendEmail(source, dest, subject, body_text, body_html, ):
    """
    Send email from source to dest
    """
    client = boto3.client('ses',region_name=AWS_REGION)
    CHARSET = "UTF-8"

    #Provide the contents of the email.
    response = client.send_email(
        Destination={
            'ToAddresses': [
                dest,
            ],
        },
        Message={
            'Body': {
                'Html': {
                    'Charset': CHARSET,
                    'Data': body_html,
                },
                'Text': {
                    'Charset': CHARSET,
                    'Data': body_text,
                },
            },
            'Subject': {
                'Charset': CHARSET,
                'Data': subject,
            },
        },
        Source=source
    )
    return response