const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let test = false;

// ==================================================
// Get all records
router.get('/', (req, res) => {
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

        connection.query(query, (err, rows, fields) => {
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

        connection.query(query, [id], (err, rows, fields) => {
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

})

// Get the next ID for a new record
router.get('/nextId', (_, res) => {
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

        const query = 'SELECT * FROM SYSTEM_IDS WHERE TABLE_NAME = "CALIBRATION"';
        connection.query(query, (err, rows) => {
            if (err) {
                console.log('Failed to query for calibrations: ' + err);
                res.sendStatus(500);
                return;
            }
            if (rows.length === 0) {
                console.log('No records found in SYSTEM_IDS for CALIBRATION');
                res.status(404).send('No records found');
                return;
            }
            const nextId = parseInt(rows[0].CURRENT_ID) + 1;
            console.log('Next ID:', nextId);
            let dbNextId = nextId.toString().padStart(7, '0');

            res.json(dbNextId);
        });    

        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to calibrate');
        res.sendStatus(500);
    }
});

// ==================================================
// Create a new record
router.post('/', (req, res) => {
    console.log('Request Body:', req.body);
    const { DEVICE_ID, CALIBRATION_DATE, CALIBRATED_BY } = req.body;

    if (!DEVICE_ID || !CALIBRATION_DATE || !CALIBRATED_BY) {
        res.status(400).send('Missing required fields');
        return;
    }

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

            const query = `INSERT INTO CALIBRATIONS (CALIBRATION_ID, DEVICE_ID, CALIBRATION_DATE, CALIBRATED_BY, CREATE_DATE, CREATE_BY) VALUES (?, ?, ?, ?)`;

            connection.query(query, [DEVICE_ID, CALIBRATION_DATE, CALIBRATED_BY, NOTES || null], (err, result) => {
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


module.exports = router;