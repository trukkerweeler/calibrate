import express from 'express';
import mysql from 'mysql';
const router = express.Router();

// Get the next ID for a new record
router.get('/', (_, res) => {
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

            const query = 'SELECT CURRENT_ID FROM calibration.SYSTEM_IDS WHERE TABLE_NAME = "CALIBRATION"';
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

// Update the next ID in the database
router.post('/', (req, res) => {
    const nextId = req.body.nextId;
    if (nextId.toString().length < 7) {
        req.body.nextId = nextId.toString().padStart(7, '0');
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

            const query = 'UPDATE calibration.SYSTEM_IDS SET CURRENT_ID = ? WHERE TABLE_NAME = "CALIBRATION"';
            connection.query(query, [nextId], (err, rows) => {
                if (err) {
                    console.log('Failed to update SYSTEM_IDS for CALIBRATION: ' + err);
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
            });

            connection.end();
        });
    } catch (err) {
        console.log('Error connecting to calibrate');
        res.sendStatus(500);
    }
}
);


export default router;
