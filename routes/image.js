import express from "express";
import mysql from "mysql2";
import multer from "multer";

const router = express.Router();

// ==================================================
// Save image to DB using multer

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  // console.log("Received request to save image");
  // console.log("Request body: ", req.body);
  // console.log("Request headers: ", req.headers);
  // console.log("Request method: ", req.method);
  // console.log("Request URL: ", req.url);

  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      database: "calibration",
    });

    // Check if the file is uploaded
    if (!req.file) {
      console.error("No file uploaded");
      res.status(400).send("Image file is required");
      return;
    }

    const toolId = req.body.deviceId; // Assuming TOOL_ID is sent in the request body
    if (!toolId) {
      console.error("Tool ID is null or undefined");
      res.status(400).send("Tool ID is required");
      return;
    }

    const image = req.file.buffer; // Get the image buffer from the uploaded file

    const query = `INSERT INTO DEVICE_IMAGES (DEVICE_ID, IMAGEBLOB) VALUES (?, ?)`;

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
