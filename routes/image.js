import express from "express";
import mysql from "mysql2";

const router = express.Router();

// ==================================================
// Save image to DB
router.post("/", async (req, res) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      database: "calibration",
    });

    const query = `INSERT INTO DEVICE_IMAGES (DEVICE_ID, IMAGE) VALUES (?, ?)`;
    const toolId = req.body.toolId; // Assuming TOOL_ID is sent in the request body
    const image = req.body.image; // Assuming the image is sent in the request body

    connection.execute(query, [toolId, image], (err, result) => {
      if (err) {
        console.error("Failed to save image: " + err);
        res.sendStatus(500);
        return;
      }
      res.json({ message: "Image saved successfully", id: result.insertId });
    });

    connection.end();
  } catch (err) {
    console.error("Error connecting to DB: ", err);
    res.sendStatus(500);
  }
});

export default router;
