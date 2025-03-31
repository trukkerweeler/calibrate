
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// ==================================================
// Get all records
router.get("/", (req, res) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      database: "calibration",
    });
    connection.connect(function (err) {
      if (err) {
        console.error("Error connecting: " + err.stack);
        return;
      }
      // console.log('Connected to DB');

      const query = `select * from DEVICES`;

      connection.query(query, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for device: " + err);
          res.sendStatus(500);
          return;
        }
        if (rows.length == 0) {
          res.json({ message: "No records found" });
        } else {
          res.json(rows);
        }
      });

      connection.end();
    });
  } catch (err) {
    console.log("Error connecting to Db");
    return;
  }
});

// ==================================================
// Get a single record by id
router.get("/:id", (req, res) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      database: "calibration",
    });
    connection.connect(function (err) {
      if (err) {
        console.error("Error connecting: " + err.stack);
        return;
      }
      // console.log('Connected to DB');

      const query = `select * from DEVICES where DEVICE_ID = ?`;

      connection.query(query, [req.params.id], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for device: " + err);
          res.sendStatus(500);
          return;
        }
        if (rows.length == 0) {
          res.json({ message: "No records found" });
        } else {
          res.json(rows[0]);
        }
      });

      connection.end();
    });
  } catch (err) {
    console.log("Error connecting to Db");
    return;
  }
});

// ==================================================
// Create a new record
router.post("/create", (req, res) => {
  // console.log(req.body);
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3306,
    database: "calibration",
  });
  connection.connect(function (err) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }
    // console.log('Connected to DB');
    const query = `insert into DEVICES (DEVICE_ID, NAME, STATUS, DEVICE_TYPE, MANUFACTURER_NAME, MODEL, SERIAL_NUMBER, MAJOR_LOCATION, MINOR_LOCATION, PURCHASE_DATE, NEXT_DATE, CREATE_BY, CREATE_DATE, PURCHASE_PRICE) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      req.body.DEVICE_ID,
      req.body.NAME,
      req.body.STATUS,
      req.body.DEVICE_TYPE,
      req.body.MANUFACTURER_NAME,
      req.body.MODEL,
      req.body.SERIAL_NUMBER,
      req.body.MAJOR_LOCATION,
      req.body.MINOR_LOCATION,
      req.body.PURCHASE_DATE,
      req.body.NEXT_DATE,
      req.body.CREATE_BY,
      req.body.CREATE_DATE,
      req.body.PURCHASE_PRICE,
    ];
    connection.query(query, values, (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for device: " + err);
        res.sendStatus(500);
        return;
      } else {
        res.json(rows[0]);
      }
    });
    connection.end();
    res.json({ message: "Record created successfully" });
  });
});

module.exports = router;
