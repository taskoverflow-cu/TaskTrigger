import pymysql
import logging
import sys
import rds_config

rds_host  = rds_config.rds_host
name = rds_config.name
password = rds_config.password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name,port=3306, connect_timeout=5)
except:
    print("ERROR: Unexpected error: Could not connect to MySQL instance.")
    sys.exit()

print("SUCCESS: Connection to RDS MySQL instance succeeded")

item_count = 0
"""
with conn.cursor() as cur:
    cur.execute("create table Employee3 ( EmpID  int NOT NULL, Name varchar(255) NOT NULL, PRIMARY KEY (EmpID))")
    cur.execute('insert into Employee3 (EmpID, Name) values(1, "Joe")')
    cur.execute('insert into Employee3 (EmpID, Name) values(2, "Bob")')
    cur.execute('insert into Employee3 (EmpID, Name) values(3, "Mary")')
    conn.commit()
    cur.execute("select * from Employee3")
    for row in cur:
        item_count += 1
        #logger.info(row)
        print(row)
conn.commit()
conn.close()
"""

#Create User

with conn.cursor() as cur:
    command =  "CREATE TABLE User(\
        user_id integer primary key auto_increment,\
        username varchar(50) not null,\
        email varchar(30) unique not null,\
        avatar_url varchar(200),\
        cognito_id varchar(200) unique not null\
    )"
    try:
        cur.execute(command)
        conn.commit()
        print("User table created.")

    except pymysql.err.InternalError as e:
        print(str(e)+" Nothing created.")
# Create Friend
with conn.cursor() as cur:
    command = "CREATE TABLE Friend(\
       friend_id integer primary key auto_increment,\
       user_id1 integer not null,\
       user_id2 integer not null,\
       state integer\
    )"
    try:
        cur.execute(command)
        conn.commit()
        print("Friend table created.")
    except pymysql.err.InternalError as e:
        print(str(e) + " Nothing created.")



#Create FriendRequest
with conn.cursor() as cur:
    command = "CREATE TABLE FriendRequest(\
        request_id integer primary key auto_increment,\
        request_user_id integer not null,\
        accept_user_id integer not null,\
        state integer,\
        request_time datetime,\
        response_time datetime\
    )"
    try:
        cur.execute(command)
        conn.commit()
        print("FriendRequest table created.")
    except pymysql.err.InternalError as e:
        print(str(e) + " Nothing created.")

#Create Event
with conn.cursor() as cur:
    command = "CREATE TABLE Event(\
        event_id integer primary key auto_increment,\
        creator_id integer not null,\
        event_name varchar(100) not null,\
        start_time datetime,\
        end_time datetime,\
        location varchar(200),\
        longitude double,\
        latitude double,\
        description varchar(1000),\
        visibility integer not null,\
        create_time datetime,\
        capacity integer,\
        avatar_url varchar(200),\
        state integer\
    )"
    try:
        cur.execute(command)
        conn.commit()
        print("Event table created.")
    except pymysql.err.InternalError as e:
        print(str(e) + " Nothing created.")

#Create ParticipateEvent
with conn.cursor() as cur:
    command = "CREATE TABLE ParticipateEvent(\
        participate_event_id integer primary key auto_increment,\
        participant_id integer not null,\
        event_id integer not null\
    )"
    try:
        cur.execute(command)
        conn.commit()
        print("ParticipateEvent table created.")
    except pymysql.err.InternalError as e:
        print(str(e) + " Nothing created.")


#Create EventInvitation
with conn.cursor() as cur:
    command = "CREATE TABLE  EventInvitation(\
        event_invitation_id integer primary key auto_increment,\
        event_id integer not null,\
        creator_id integer not null,\
        invitee_id integer not null,\
        state integer,\
        invite_time datetime,\
        response_time datetime\
    )"
    try:
        cur.execute(command)
        conn.commit()
        print("EventInvitation table created.")
    except pymysql.err.InternalError as e:
        print(str(e) + " Nothing created.")


conn.close()




