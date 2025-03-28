import os
from datetime import datetime, timedelta
from icecream import ic
# from dotenv.main import load_dotenv
# load_dotenv()
# DB_HOST = os.getenv('DB_HOST')
# DB_NAME = os.getenv('DB_NAME')
# DB_USER = os.getenv('DB_USER')
# DB_PASS = os.getenv('DB_PASS')


def getcomputername():
    return os.getenv('COMPUTERNAME')


def getDatabaseData(sql):
    import mysql.connector
    from mysql.connector import Error
    try:
        import dotenv

        connection = mysql.connector.connect(host=os.getenv('DB_HOST'),
                                             database=os.getenv('DB_NAME'),
                                             user=os.getenv('DB_USER'),
                                             password=os.getenv('DB_PASS'))
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(sql)
            records = cursor.fetchall()
            return records

    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if (connection.is_connected()):
            cursor.close()
            connection.close()

def sendMail(to_email, subject, message, from_email="quality@ci-aviation.com", cc_email="tim.kent@ci-aviation.com"):
    print(f"**Email subject to {subject} from {from_email}")
    import smtplib, ssl
    from email.message import EmailMessage
    PORT = 465
    SERVER = "sh10.nethosting.com"
    CONTEXT = ssl.create_default_context()
    if from_email == "tim":
        USERNAME = "tim.kent@ci-aviation.com"
        PASSWORD = os.getenv('PASSWORD')

    else:
        USERNAME = "quality@ci-aviation.com"
        PASSWORD = os.getenv('PASSWORDQ')
    
    # Replace linefeed in subject
    subject = subject.replace("\n", " ")

    msg = EmailMessage()
    # print(f"--Email subject to {subject} from {from_email}")
    msg["Subject"] = subject
    msg["From"] = USERNAME
    msg["To"] = to_email
    msg["Cc"] = cc_email
    # set msg content to html
    msg.set_content(message)

    # if subject is test than add attachment
    if subject == "test":
        attachment = r"C:\Users\TimK\Documents\QMS\07500 Documented Information\CI-QSP-7500 Documented Information_r01.pdf"
        with open(attachment, "rb") as f:
            file_data = f.read()
            file_name = f.name
            msg.add_attachment(file_data, maintype="application", subtype="octet-stream", filename=file_name)
    
    # iterate through message fields and log to console
    # for key in msg.keys():
        # print(f"{key}: {msg[key]}")


    # msg.set_default_type(display)
    server = smtplib.SMTP_SSL(SERVER, PORT, context=CONTEXT)
    server.login(USERNAME, PASSWORD)
    server.send_message(msg)
    server.quit()


def updateDatabaseData(sql):
    # print(sql)
    table = sql.split()[2]
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

def insertSqlValues(sql, values):
    # print(sql)
    project = "calibration"
    if project == "calibration":
        db = "calibration"
    else:
        db = "quality"
    import mysql.connector
    from mysql.connector import Error
    try:
        connection = mysql.connector.connect(host=os.getenv('DB_HOST'),
                                             database=db
                                             user=os.getenv('DB_USER'),
                                             password=os.getenv('DB_PASS'))
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(sql, values)
            connection.commit()
            # print(f"Inserted into {table}")
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if (connection.is_connected()):
            connection.close()
            connection = None
    return


def updateSqlValues(sql, values):
    # print(sql)
    import mysql.connector
    from mysql.connector import Error
    try:
        connection = mysql.connector.connect(host=os.getenv('DB_HOST'),
                                             database=os.getenv('DB_NAME'),
                                             user=os.getenv('DB_USER'),
                                             password=os.getenv('DB_PASS'))
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(sql, values)
            connection.commit()
            # print(f"Inserted into {table}")
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if (connection.is_connected()):
            connection.close()
            connection = None
    return


def emailAddress(name):
    import mysql.connector
    from mysql.connector import Error
    sql = f"select WORK_EMAIL_ADDRESS from PEOPLE where PEOPLE_ID = '{name}'"
    # print(sql)
    try:
        connection = mysql.connector.connect(host=os.getenv('DB_HOST'),
                                             database=os.getenv('DB_NAME'),
                                             user=os.getenv('DB_USER'),
                                             password=os.getenv('DB_PASS'))
        if connection.is_connected():
            cursor = connection.cursor(buffered=True)
            cursor.execute(sql)
            # connection.commit()
            email = cursor.fetchone()
            # print(email)
            return email[0]
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if (connection.is_connected()):
            connection.close()

def setLastSentFile(file):
    """Set the date in the last sent file."""
    lastSentFile = file + "Lastsent.txt"
    with open(lastSentFile, "w") as f:
        f.write(str(datetime.today()))
        
        
def getLastSentFile(file):
    """Get the date from the last sent file, add 12 days to it."""
    lastSentFile = file + "Lastsent.txt"
    # print(lastSentFile)
    if os.path.exists(lastSentFile):
        with open(lastSentFile, "r") as f:
            lastSentDate = f.read().split()[0]
            lastSentDate = datetime.strptime(lastSentDate, '%Y-%m-%d') + timedelta(days=10)
    else:
        lastSentDate = datetime.today() - timedelta(days=10)
    return lastSentDate


def getLastSentFile0(file):
    """Get the actual date from the last sent file."""
    lastSentFile = file + "Lastsent.txt"
    # print(lastSentFile)
    if os.path.exists(lastSentFile):
        with open(lastSentFile, "r") as f:
            lastSentDate = f.read().split()[0]
            lastSentDate = datetime.strptime(lastSentDate, '%Y-%m-%d')
    else:
        lastSentDate = datetime.today()
    return lastSentDate


def getNextSysid(description):
    """Get the next sysid from the database."""
    sql = "select CURRENT_ID from SYSTEM_IDS where DESCRIPTION = '{description}'".format (description=description)
    # print(sql)
    sysid = getDatabaseData(sql)
    # convert to number
    sysid = int(sysid[0][0])
    # increment
    sysid += 1
    #prepends with zeros
    while len(str(sysid)) < 7:
        sysid = "0" + str(sysid)
    # increment in database
    sql = "update SYSTEM_IDS set CURRENT_ID = '{sysid}' where DESCRIPTION = '{description}'".format(sysid=sysid, description=description)
    updateDatabaseData(sql)
    return sysid

def getProjectName(projectid):
    """Get the project name from the database."""
    sql = "select NAME from PROJECT where PROJECT_ID = '{projectid}'".format(projectid=projectid)
    # print(sql)
    projectname = getDatabaseData(sql)

    return projectname


def getProjectId(iid):
    """Get the project id from the database."""
    sql = "select PROJECT_ID from PEOPLE_INPUT where INPUT_ID = '{iid}'".format(iid=iid)
    # print(sql)
    projectid = getDatabaseData(sql)
    return projectid[0][0]


def getAttachmentPath(sysid, recType):
    """Get the attachment from the records directory."""
    match recType:
        case "sysdoc": 
            path = "C:\\Users\\timk\\Documents\\Python\\sysdoc\\records\\"
        case "corrective":
            path = "\\\\fs1\\Quality - Records\\10200 - Corrective Actions\\2023\\"
            path = "K:\\Quality - Records\\10200 - Corrective Actions\\2023\\"
            
        case default:
            path = ""
    # print(path)
    if path != "":
        for folder in os.listdir(path):
            # print(f"folder: {folder}")
            if folder.startswith(sysid):
                for file in os.listdir(path + folder):
                    # print(os.path.join(path, folder, file))
                    if file.endswith(".pdf") and file.startswith(sysid) and not file.endswith("closeout.pdf"):
                        attachment = path + folder + "\\" + file
                        return attachment                        
    else:
        return None
    

def WeekLastSent(file):
    """Get the week number from the last sent file."""
    lastSentFile = file + "Lastsent.txt"
    # print(lastSentFile)
    if os.path.exists(lastSentFile):
        with open(lastSentFile, "r") as f:
            lastSentDate = f.read().split()[0]
            lastSentDate = datetime.strptime(lastSentDate, '%Y-%m-%d').isocalendar()[1]
    else:
        lastSentDate = datetime.today().isocalendar()[1] - 1
    return lastSentDate


def futureExists(rid):
    """Check if any future actions exist."""
    sql = (f"select * from PEOPLE_INPUT where USER_DEFINED_2 = {rid[0]} and DUE_DATE > NOW()")
    alreadyDone = getDatabaseData(sql)
    if (alreadyDone):      
        print(f"Future action already exists(utils): {rid[0]}")
        return True
    else:
        print(f"Future action does not exist(utils): {rid[0]}")
        return False


def week_of_month(date):
    # Get the year, month, and day of the given date
    # if the date argument is a string, convert it to a date object
    if isinstance(date, str):
        date = datetime.strptime(date, '%Y-%m-%d')
    year, month, day = date.year, date.month, date.day
    # Get the week number of the year and the weekday of the given date
    week, weekday = date.isocalendar()[1:]
    # Get the week number of the year and the weekday of the first day of the month
    first_week, first_weekday = date.replace(day=1).isocalendar()[1:]
    # Calculate the week number of the month
    return week - first_week + 1

def weekofyear(mydate):
    weekofyeardate = datetime.strptime(mydate, '%Y-%m-%d')
    return weekofyeardate.isocalendar()[1]



def notifyCorrective(caid, stage):
    """Insert a record into the CORRECTIVE_NOTIFY table."""
    # print(caid)
    # print(stage)
    # prepend caid with zeros until it is 7 characters long
    while len(caid) < 7:
        caid = "0" + caid
        
    sql = f"insert into CORRECTIVE_NOTIFY (CORRECTIVE_ID, STAGE, NOTIFY_DATE) values ('{caid}', '{stage}', NOW())"
    updateDatabaseData(sql)
    

def getRcaRequestCount(caid, stage):
    """Get the number of RCA requests."""
    sql = "select count(*) from CORRECTIVE_NOTIFY where STAGE = '{stage}' and CORRECTIVE_ID = '{caid}'".format(caid=caid, stage=stage)
    # ic(sql)
    count = getDatabaseData(sql)
    # ic(count)
    return str(count[0][0])

def ninedigitdate(date):
    """Convert a date to a 9-digit number."""
    thisdate = str(date)
    date = thisdate.split("-")
    return date[0] + "-" + date[1] + date[2]

def sixdigitdate(date):
    """Convert a date to a 6-digit format."""
    thisdate = str(date)
    date = thisdate.split("-")
    return date[0] + "-" + date[1]

def threelettermonth(date):
    """Convert a date to 3-Letter month"""
    month = date[5:7]        
    if month == '01':
        threelettermonth = 'Jan-' + date[2:4]
    elif month == '02':
        threelettermonth = 'Feb'
    elif month == '03':                    
        threelettermonth = 'Mar'
    elif month == '04':
        threelettermonth = 'Apr'
    elif month == '05':                    
        threelettermonth = 'May'
    elif month == '06':
        threelettermonth = 'Jun'
    elif month == '07':
        threelettermonth = 'Jul'
    elif month == '08':
        threelettermonth = 'Aug'
    elif month == '09':
        threelettermonth = 'Sep'
    elif month == '10':
        threelettermonth = 'Oct'
    elif month == '11':
        threelettermonth = 'Nov'
    elif month == '12':
        threelettermonth = 'Dec'
    return threelettermonth

def sendHtmlMail(to_email, subject, message, from_email="quality@ci-aviation.com", cc_email="tim.kent@ci-aviation.com"):
    print(f"**Email subject to {subject} from {from_email}")
    import smtplib, ssl
    from email.message import EmailMessage
    PORT = 465
    SERVER = "sh10.nethosting.com"
    CONTEXT = ssl.create_default_context()
    if from_email == "tim":
        USERNAME = "tim.kent@ci-aviation.com"
        PASSWORD = os.getenv('PASSWORD')

    else:
        USERNAME = "quality@ci-aviation.com"
        PASSWORD = os.getenv('PASSWORDQ')
    
    # Replace linefeed in subject
    subject = subject.replace("\n", " ")

    msg = EmailMessage()
    # print(f"--Email subject to {subject} from {from_email}")
    msg["Subject"] = subject
    msg["From"] = USERNAME
    msg["To"] = to_email
    msg["Cc"] = cc_email
    # set the message send date to local time
    localtime = datetime.now().strftime("%a, %d %b %Y %H:%M:%S")
    msg["Date"] = localtime

    # msg["X-Priority"] = "1"
    # msg["X-MSMail-Priority"] = "High"
    # msg["Importance"] = "High"

    # set msg content to html
    msg.set_content(message, subtype='html')

    # if subject  is test than add attachment
    if subject == "test":
        attachment = r"C:\Users\TimK\Documents\QMS\07500 Documented Information\CI-QSP-7500 Documented Information_r01.pdf"
        with open(attachment, "rb") as f:
            file_data = f.read()
            file_name = f.name
            msg.add_attachment(file_data, maintype="application", subtype="octet-stream", filename=file_name)
    
    # if subject is Root Cause than add attachment
    if subject.__contains__("Root Cause"):
        attachments = [r"K:\Quality\10200 - Corrective Action\5-why instructions.doc", r"K:\Quality\10200 - Corrective Action\5 Whys Worksheet.docx"]
        for attachment in attachments:
            with open(attachment, "rb") as f:
                file_data = f.read()
                file_name = f.name
                msg.add_attachment(file_data, maintype="application", subtype="octet-stream", filename=file_name)

    # msg.set_default_type(display)
    server = smtplib.SMTP_SSL(SERVER, PORT, context=CONTEXT)
    server.login(USERNAME, PASSWORD)
    server.send_message(msg)
    server.quit()


def getJson(jsonfile):
    import json
    with open(jsonfile) as json_file:
        data = json.load(json_file)
        return data


def getcatitle(caid):
    """Get the corrective action title from the database."""
    sql = f"select TITLE from CORRECTIVE where CORRECTIVE_ID = '{caid}'"
    # print(sql)
    title = getDatabaseData(sql)
    return title[0][0]

def inthismanymysqldays(days):
    """Get the date in this many days."""
    mydate = datetime.today() + timedelta(days=days)
    return mydate.strftime('%Y-%m-%d')

def insertInput(input):
    """Insert an INPUT into the database."""
    input_id = getNextSysid("INPUT_ID")
    due_date = datetime.today() + timedelta(days=14)
    due_date = due_date.strftime('%Y-%m-%d')
    sql = f"""insert into PEOPLE_INPUT (
    INPUT_ID
    , PROJECT_ID
    , PEOPLE_ID
    , INPUT_DATE
    , DUE_DATE
    , INPUT_TYPE
    , ASSIGNED_TO
    , SUBJECT
    , CREATE_BY
    , CREATE_DATE
    , CLOSED
    ) 
    values 
    ('{input_id}'
    , '{input['PROJECT_ID']}'
    , '{input['PEOPLE_ID']}'
    , NOW()
    , '{due_date}'
    , 'STMT'
    , '{input['ASSIGNED_TO']}'
    , '{input['SUBJECT']}'
    , '{input['CREATED_BY']}'
    , NOW()
    , 'N')"""
    # ic(sql)
    updateDatabaseData(sql)
    
    inputtextsql = f"""insert into PPL_INPT_TEXT (INPUT_ID, INPUT_TEXT) values ('{input_id}', '{input['TEXT']}')"""
    # ic(inputtextsql)
    updateDatabaseData(inputtextsql)
    

if __name__ == '__main__':
    mydate = datetime.strptime('2023-09-29', '%Y-%m-%d')
    mydate = datetime.today()
    # print(getNextSysid("INPUT_ID"))
    # print(getProjectName("0000055"))
    # print(getProjectId("0000055"))
    # print(getAttachmentPath("0001219", "corrective"))
    # sendMail('tim.kent@ci-aviation.com', 'test', 'test', 'tim')
    # sendHtmlMail('tim.kent@ci-aviation.com', 'test', 'test', 'tim')
    # print(WeekLastSent('project'))
    # convert string to datetime
    # # today = datetime.today()
    # print(mydate)
    # print(getRcaRequestCount("0001237", "R"))
    # print(week_of_month(mydate))
    # print(ninedigitdate('2023-09-29'))
    # print(sixdigitdate('2023-09-29'))
    # print(getcomputername())
    # print(getcatitle("0001239"))
    # print(inthismanymysqldays(7))
    print(weekofyear('2024-06-06'))