import express from 'express';
import mysql from 'mysql';
const router = express.Router();

// ==================================================
// Get all records
router.get('/', (_, res) => {
    try {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: 3306,
            database: 'calibration',
        });
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                return;
            }
        // console.log('Connected to DB');

        const query = `select * from CALIBRATIONS`

        connection.query(query, (err, rows) => {
            if (err) {
                console.log('Failed to query for getallcalibrations: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    
    } catch (err) {
        console.log('Error connecting to Db');
        return;
    }

})

// ==================================================
// Get records by ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    try {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: 3306,
            database: 'calibration'
        });
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                return;
            }
        // console.log('Connected to DB');

        const query = `select * from CALIBRATIONS c where c.DEVICE_ID = ? order by c.CALIBRATION_ID desc`;

        connection.query(query, [id], (err, rows) => {
            if (err) {
                console.log('Failed to query for inputs: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    
    } catch (err) {
        console.log('Error connecting to Db');
        return;
    }

});

// ==================================================
// Create a new record
router.post('/', (req, res) => {
    // console.log('Request Body:', req.body);

    try {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: 3306,
            database: 'calibration'
        });

        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                res.sendStatus(500);
                return;
            }

            const query = `INSERT INTO CALIBRATIONS (CALIBRATION_ID, DEVICE_ID, CALIBRATE_DATE, CALIBRATED_BY, SUPPLIER_ID, EMPLOYEE_ID, RESULT, CREATE_DATE, CREATE_BY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const queryParams = [
                req.body.CALIBRATION_ID || null,
                req.body.DEVICE_ID,
                req.body.CALIBRATE_DATE,
                req.body.CALIBRATED_BY,
                req.body.SUPPLIER_ID || null,
                req.body.EMPLOYEE_ID || null,
                req.body.RESULT,
                req.body.CREATE_DATE,
                req.body.CREATE_BY
            ]
            connection.query(query, queryParams, (err, result) => {
                if (err) {
                    console.log('Failed to insert new calibration record: ' + err);
                    res.sendStatus(500);
                    return;
                }
                res.status(201).json({ message: 'Record created successfully', id: result.insertId });
            });

            connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db');
        res.sendStatus(500);
    }
});


export default router;