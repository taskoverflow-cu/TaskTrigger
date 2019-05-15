from config import QUEUE_NAME
import boto3
class SQSHandler(object):
    
    def __init__(self):
        sqs = boto3.resource('sqs')
        self.queue = sqs.get_queue_by_name(QueueName=QUEUE_NAME)
        
    def list_all_queues(self):
        client = boto3.client('sqs')
        return client.list_queues()
        
    def get_message(self):
        """
        Get a message from preconfigured queue.
        After return from this method, user must check whether return value is None

        Example:
        content, message =  sqs.get_message()
        if content:
            print(content)
            sqs.delete_message(message)
        """
        response = self.queue.receive_messages(
            MessageAttributeNames=["All"],
            MaxNumberOfMessages = 1,
            VisibilityTimeout = 1,
            )
        record = {}
        if response:
            message = response[0]
            for key, value in message.message_attributes.items():
                record[key] = value['StringValue']
        else:
            message = None
        return record, message

            

    def delete_message(self, message):
        """
        After processed message succesfully, one can delete the message from queue.

        Example: 
        content, message =  sqs.get_message()
        if content:
            print(content)
            sqs.delete_message(message)
        """
        if message:
             message.delete()

    def send_message(self, message_attr):
        """
        Send a message to SQS.

        Example:
        sqs = SQSHandler()
        sqs.send_message({"Test": "hello world", "body":"new message from test"})
        """
        messageContent = {}
        for key, value in message_attr.items():
            if key.lower() != 'body':
                messageContent[key.capitalize()] = {
                    "DataType" : "String",
                    "StringValue": value
                }
        
        response = self.queue.send_message(
            MessageBody = message_attr['body'],
            DelaySeconds=0,
            MessageAttributes= messageContent
            )
       
        # {
        #         'Test': {
        #             'DataType': 'String',
        #             'StringValue': message_attr['test']
        #         }
        #     },
