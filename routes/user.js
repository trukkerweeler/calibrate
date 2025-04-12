import express from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
const router = express.Router();

// Middleware to hash passwords before saving to the database
router.use("/create", async (req, res, next) => {
  try {
    if (req.body.PASSWORD) {
      const saltRounds = 10;
      req.body.PASSWORD = await bcrypt.hash(req.body.PASSWORD, saltRounds);
    }
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    res.sendStatus(500);
  }
});

// ==================================================
// Get all records
router.get("/", async (_, res) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      database: "calibration",
    });

    const query = `SELECT * FROM USERS`;

    connection.query(query, (err, rows) => {
      if (err) {
        console.error("Failed to query for getallcalibrations: " + err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });

    connection.end();
  } catch (err) {
    console.error("Error connecting to DB:", err);
    res.sendStatus(500);
  }
});

// ==================================================
// Create a new record
router.post("/create", async (req, res) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      database: "calibration",
    });

    const query = `INSERT INTO USERS (USER_ID, PASSWORD) VALUES (?, ?)`;
    const queryParams = [
      req.body.USER_ID,
      req.body.PASSWORD,
    ];

    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error("Failed to insert new user record: " + err);
        res.sendStatus(500);
        return;
      }
      res
        .status(201)
        .json({ message: "User created successfully", id: result.insertId });
    });

    connection.end();
  } catch (err) {
    console.error("Error connecting to DB (USERS):", err);
    res.sendStatus(500);
  }
});

// ==================================================
// Delete a record
router.delete("/delete", async (req, res) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      database: "calibration",
    });

    const query = `DELETE FROM USERS WHERE USER_ID = ?`;
    const queryParams = [req.body.USER_ID];
    if (!queryParams[0]) {
      res.status(400).json({ message: "USER_ID is required" });
      return;
    }

    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error("Failed to delete user record: " + err);
        res.sendStatus(500);
        return;
      }
      res.status(200).json({ message: "User deleted successfully" });
    });

    connection.end();
  } catch (err) {
    console.error("Error connecting to DB:", err);
    res.sendStatus(500);
  }
});

export default router;
