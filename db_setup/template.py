import traceback
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
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    sys.exit()

print("SUCCESS: Connection to RDS MySQL instance succeeded")

item_count = 0

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

"""
NOTE: To allow lambda to use rds,
1. Give lambda's role a policy to access VPC
2. Enable VPC for the lambda. 
3. Choose a security group for the lambda
4. In the SG of the db, allow the lambda SG in the inbound traffic rules.
"""