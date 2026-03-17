import os
from dotenv import load_dotenv
load_dotenv()

def sqlInsert(sql):
    # print(sql)
    # table = sql.split()[2]
    import mysql.connector
    from mysql.connector import Error
    try:
        connection = mysql.connector.connect(host=os.getenv('DB_HOST'),
                                             database=os.getenv('DB_NAME'),
                                             user=os.getenv('DB_USER'),
                                             password=os.getenv('DB_PASS'))
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(sql)
            connection.commit()
            # print(f"Inserted into {table}")
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if (connection.is_connected()):
            connection.close()
            connection = None
    return