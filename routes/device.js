// require('dotenv').config();

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
            database: 'calibration'
        });
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                return;
            }
        // console.log('Connected to DB');

        const query = `select * from DEVICES`;
        
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for device: ' + err);
                res.sendStatus(500);
                return;
            }
            if (rows.length == 0) {
                res.json({message: "No records found"});
            } else {
                res.json(rows);
            }
        }
        );

        connection.end();
        });
    
    } catch (err) {
        console.log('Error connecting to Db');
        return;
    }

})

module.exports = router;