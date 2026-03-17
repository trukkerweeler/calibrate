import csv
from datetime import datetime
import utils
# from icecream import ic


with open('tblGages.txt', 'r', encoding='latin-1') as f:
    reader = csv.reader(f, delimiter=',', quotechar='"')
    # next(reader, None)  # skip header row
    headers = next(reader)
    # print("Headers:", headers)
    # for row in reader:
        # print(row)
       
    class Device:
        def __init__(self, DEVICE_ID, STATUS, DEVICE_TYPE, NAME, MAJOR_LOCATION, MINOR_LOCATION, PURCHASE_PRICE, PURCHASE_DATE, MANUFACTURER_NAME, MODEL, SERIAL_NUMBER, DIGITAL, UNITS, STANDARD_INTERVAL, SPECIAL_INTERVAL, NEXT_DATE, ASSI_EMPLOYEE_ID, WARNING_INTERVAL):
            self.DEVICE_ID = DEVICE_ID
            self.STATUS = STATUS
            self.DEVICE_TYPE = DEVICE_TYPE
            self.NAME = NAME
            self.MAJOR_LOCATION = MAJOR_LOCATION
            self.MINOR_LOCATION = MINOR_LOCATION
            self.PURCHASE_PRICE = PURCHASE_PRICE
            self.PURCHASE_DATE = PURCHASE_DATE
            self.MANUFACTURER_NAME = MANUFACTURER_NAME
            self.MODEL = MODEL
            self.SERIAL_NUMBER = SERIAL_NUMBER
            self.DIGITAL = DIGITAL
            self.UNITS = UNITS
            self.STANDARD_INTERVAL = STANDARD_INTERVAL
            self.SPECIAL_INTERVAL = SPECIAL_INTERVAL
            self.NEXT_DATE = NEXT_DATE
            self.ASSI_EMPLOYEE_ID = ASSI_EMPLOYEE_ID
            self.WARNING_INTERVAL = WARNING_INTERVAL

    for row in reader:
        # Create a new device object with the attributes: DEVICE_ID, STATUS, DEVICE_TYPE, NAME, MAJOR_LOCATION, MINOR_LOCATION, PURCHASE_PROCE, PURCHASE_DATE, MANUFACTURER_NAME, MODEL, SERIAL_NUMBER, DIGITAL, UNITS, STANDARD_INTERVAL, SPECIAL_INTERVAL, NEXT_DATE, ASSI_EMPL_ID, WARNING INTERVAL
        # Convert PURCHASE_DATE and NEXT_DATE to MySQL DATETIME format (YYYY-MM-DD)
        def to_mysql_date(date_str):
            # Try common date formats, including those with time
            formats = [
            "%m/%d/%Y %H:%M:%S",
            "%m/%d/%Y",
            "%Y-%m-%d",
            "%m/%d/%y"
            ]
            for fmt in formats:
                try:
                    return datetime.strptime(date_str.strip(), fmt).strftime("%Y-%m-%d")
                except Exception:
                    continue
                return None

        purchase_date = to_mysql_date(row[10]) if len(row) > 10 else None
        # print("dd: " + row[15])
        next_date = to_mysql_date(row[15]) if len(row) > 15 else None

        device = Device(
            DEVICE_ID=row[1],
            STATUS=row[5],
            DEVICE_TYPE="tbd",
            NAME=row[3],
            MAJOR_LOCATION=row[18],
            MINOR_LOCATION="tbd",
            PURCHASE_PRICE="tbd",
            PURCHASE_DATE=purchase_date if purchase_date else "",
            MANUFACTURER_NAME=row[17],
            MODEL=row[2],
            SERIAL_NUMBER="",
            DIGITAL="",
            UNITS="",
            STANDARD_INTERVAL=row[12],
            SPECIAL_INTERVAL='',
            NEXT_DATE=next_date if next_date else "",
            ASSI_EMPLOYEE_ID="BOBBI",
            WARNING_INTERVAL=14
        )
        
        if "personal" in device.MANUFACTURER_NAME.lower():
            device.MANUFACTURER_NAME = ''
        if "office" in device.MANUFACTURER_NAME.lower():
            device.MANUFACTURER_NAME = ''
        if "pdf" in device.SPECIAL_INTERVAL.lower():
            device.SPECIAL_INTERVAL = ''
            
        # # Print device attributes in a more human-readable format
        # for attr, value in vars(device).items():
        #     print(f"{attr}: {value}")
        # print("-" * 40)
        
        sql_insert = f"""
        INSERT INTO DEVICES (
            DEVICE_ID, STATUS, DEVICE_TYPE, NAME, MAJOR_LOCATION, MINOR_LOCATION, 
            PURCHASE_PRICE, PURCHASE_DATE, MANUFACTURER_NAME, MODEL, SERIAL_NUMBER, 
            DIGITAL, UNITS, STANDARD_INTERVAL, SPECIAL_INTERVAL, NEXT_DATE, 
            ASSI_EMPLOYEE_ID, WARNING_INTERVAL, CREATE_DATE
        ) VALUES (
            '{device.DEVICE_ID}', '{device.STATUS}', '{device.DEVICE_TYPE}', '{device.NAME}', 
            '{device.MAJOR_LOCATION}', '{device.MINOR_LOCATION}', '{device.PURCHASE_PRICE}', 
            '{device.PURCHASE_DATE}', '{device.MANUFACTURER_NAME}', '{device.MODEL}', 
            '{device.SERIAL_NUMBER}', '{device.DIGITAL}', '{device.UNITS}', 
            '{device.STANDARD_INTERVAL}', '{device.SPECIAL_INTERVAL}', '{device.NEXT_DATE}', 
            '{device.ASSI_EMPLOYEE_ID}', {device.WARNING_INTERVAL}, NOW()
        );
        """
        if not str(device.DEVICE_ID).startswith('00000'):
            # print(sql_insert)
            utils.sqlInsert(sql_insert)
        
        
        
print("tblGages.py completed successfully.")