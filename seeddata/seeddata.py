import json
import utils

def device_seed_data():
    """Seed device data into the database"""
    print("Seeding data into the database...")
    # open the devices.json file and read the data
    with open(r"C:\Users\tim\Documents\CALIBRATE\seeddata\devices.json", "r") as file:
        devices = json.load(file)
        for device in devices:
            sql = """
                INSERT INTO DEVICE (
                    DEVICE_ID, PRODUCT_ID, CUSTOMER_ID, SUPPLIER_ID, DEVICE_ASSIGNED_TO, STATUS, DEVICE_TYPE, NAME, 
                    MAJOR_LOCATION, MINOR_LOCATION, CA_UD1, CA_UD2, REFERENCE, DEVICE_LEVEL, SUPPLIER_DEVICE_ID, 
                    SUPP_DEV_NAME, PURCHASE_PRICE, PURCHASE_DATE, EXTN_WARRAN_DATE, MANUFACTURER_NAME, MODEL, 
                    SERIAL_NUMBER, WARRANTY_DATE, RESOLUTION, LOW_RANGE, HIGH_RANGE, METRIC, DIGITAL, UNITS, 
                    CHECKED_OUT, RR_SPL_INTERVAL, RR_STD_INTERVAL, RR_TIME_ESTIMATE, RR_LAST_DATE, RR_NEXT_DATE, 
                    RR_TYPE, CALIBRATE_DUE_BY, CALIBRATED_BY, SPECIAL_USG_LIMIT, STANDARD_USG_LIMIT, USAGE_FREQUENCY, 
                    TIMES_USED_AS_OF, INCREMENT_USED, HAS_BEEN_USED, INCR_TIMES_AS_OF, STANDARD_INTERVAL, 
                    SPECIAL_INTERVAL, LAST_DATE, NEXT_DATE, TIME_ESTIMATE, CREATE_DATE, CREATE_BY, MODIFIED_DATE, 
                    MODIFIED_BY, ASSI_EMPLOYEE_ID, ASSI_SUPPLIER_ID, ASSI_SUPP_CONT_NO, ASSI_CUSTOMER_ID, 
                    ASSI_CUST_CONT_NO, CALIB_EMPLOYEE_ID, CALIB_CUSTOMER_ID, CALIB_CUST_CONT_NO, CALIB_SUPPLIER_ID, 
                    CALIB_SUPP_CONT_NO, REFERENCE2, REFERENCE3, CA_UD3, CA_UD4, CA_UD5, CA_UD6, CA_UD7, CA_UD8, 
                    WARNING_INTERVAL, STOP_CLOCK_SWITCH, CLOCK_STATUS, STOP_CLOCK_DATE, DAYS_REMAINING, 
                    USAGE_REMAINING, CALIB_STANDARD, EQUIPMENT_ID, ENTITY_ID
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s )"""


            values = (
                device["DEVICE_ID"], device["PRODUCT_ID"], device["CUSTOMER_ID"], device["SUPPLIER_ID"], device["DEVICE_ASSIGNED_TO"],
                device["STATUS"], device["DEVICE_TYPE"], device["NAME"], device["MAJOR_LOCATION"], device["MINOR_LOCATION"], device["CA_UD1"],
                device["CA_UD2"], device["REFERENCE"], device["DEVICE_LEVEL"], device["SUPPLIER_DEVICE_ID"], device["SUPP_DEV_NAME"],
                device["PURCHASE_PRICE"], device["PURCHASE_DATE"], device["EXTN_WARRAN_DATE"], device["MANUFACTURER_NAME"], device["MODEL"],
                device["SERIAL_NUMBER"], device["WARRANTY_DATE"], device["RESOLUTION"], device["LOW_RANGE"], device["HIGH_RANGE"],
                device["METRIC"], device["DIGITAL"], device["UNITS"], device["CHECKED_OUT"], device["RR_SPL_INTERVAL"], device["RR_STD_INTERVAL"],
                device["RR_TIME_ESTIMATE"], device["RR_LAST_DATE"], device["RR_NEXT_DATE"], device["RR_TYPE"], device["CALIBRATE_DUE_BY"],
                device["CALIBRATED_BY"], device["SPECIAL_USG_LIMIT"], device["STANDARD_USG_LIMIT"], device["USAGE_FREQUENCY"],
                device["TIMES_USED_AS_OF"], device["INCREMENT_USED"], device["HAS_BEEN_USED"], device["INCR_TIMES_AS_OF"],
                device["STANDARD_INTERVAL"], device["SPECIAL_INTERVAL"], device["LAST_DATE"], device["NEXT_DATE"], device["TIME_ESTIMATE"],
                device["CREATE_DATE"], device["CREATE_BY"], device["MODIFIED_DATE"], device["MODIFIED_BY"], device["ASSI_EMPLOYEE_ID"],
                device["ASSI_SUPPLIER_ID"], device["ASSI_SUPP_CONT_NO"], device["ASSI_CUSTOMER_ID"], device["ASSI_CUST_CONT_NO"],
                device["CALIB_EMPLOYEE_ID"], device["CALIB_CUSTOMER_ID"], device["CALIB_CUST_CONT_NO"], device["CALIB_SUPPLIER_ID"],
                device["CALIB_SUPP_CONT_NO"], device["REFERENCE2"], device["REFERENCE3"], device["CA_UD3"], device["CA_UD4"], device["CA_UD5"],
                device["CA_UD6"], device["CA_UD7"], device["CA_UD8"], device["WARNING_INTERVAL"], device["STOP_CLOCK_SWITCH"],
                device["CLOCK_STATUS"], device["STOP_CLOCK_DATE"], device["DAYS_REMAINING"], device["USAGE_REMAINING"],
                device["CALIB_STANDARD"], device["EQUIPMENT_ID"], device["ENTITY_ID"]
            )

            utils.insertSqlValues(sql, values)
        
    print("Device data seeded successfully")


def calibration_seed_data():
    """Seed calibration data into the database"""
    print("Seeding calibration data into the database...")
    # open the calibrations.json file and read the data
    with open(r"C:\Users\tim\Documents\CALIBRATE\seeddata\calibrations.json", "r") as file:
        calibrations = json.load(file)
        for calibration in calibrations:
            sql = """
                INSERT INTO CALIBRATION (
                    CALIBRATION_ID, TEMPERATE_UNITS, DEVICE_ID, EMPLOYEE_ID, CUSTOMER_ID, CUST_CONT_NO, CALIBRATED_BY, 
                    SUPPLIER_ID, SUPP_CONT_NO, CALIBRATE_DATE, RESULT, TEMPERATURE, HUMIDITY, CREATE_BY, CREATE_DATE, 
                    MODIFIED_BY, MODIFIED_DATE, ENTITY_ID, NCM_ID
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            
            values = (
                calibration["CALIBRATION_ID"], calibration["TEMPERATE_UNITS"], calibration["DEVICE_ID"], calibration["EMPLOYEE_ID"],
                calibration["CUSTOMER_ID"], calibration["CUST_CONT_NO"], calibration["CALIBRATED_BY"], calibration["SUPPLIER_ID"],
                calibration["SUPP_CONT_NO"], calibration["CALIBRATE_DATE"], calibration["RESULT"], calibration["TEMPERATURE"],
                calibration["HUMIDITY"], calibration["CREATE_BY"], calibration["CREATE_DATE"], calibration["MODIFIED_BY"],
                calibration["MODIFIED_DATE"], calibration["ENTITY_ID"], calibration["NCM_ID"]
            )
            
            utils.insertSqlValues(sql, values)

    print("Calibration data seeded successfully")


def main():
    """Main entry point of the app"""
    device_seed_data()

if __name__ == "__main__":
    main()