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
            database: 'quality'
        });
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                return;
            }
        // console.log('Connected to DB');

        const query = `select n.NCM_ID
        , n.NCM_DATE
        , n.NCM_TYPE
        , n.SUBJECT
        , n.ASSIGNED_TO
        , n.DUE_DATE        
        , n.PRODUCT_ID
        , n.PO_NUMBER
        , n.PROCESS_ID
        , ne.DESCRIPTION
        , n.CLOSED
        from NONCONFORMANCE n 
        left join NCM_DESCRIPTION ne on n.NCM_ID = ne.NCM_ID
        left join NCM_DISPOSITION ni on n.NCM_ID = ni.NCM_ID
        left join NCM_VERIFICATION nv on n.NCM_ID = nv.NCM_ID
        order by n.CLOSED, n.NCM_ID desc`;

        // from NONCONFORMANCE n left join PPL_INPT_TEXT pit on pi.INPUT_ID = pit.INPUT_ID order by pi.INPUT_ID desc`;
        // where USER_DEFINED_1 = 'MR'
        
        connection.query(query, (err, rows, fields) => {
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

module.exports = router;