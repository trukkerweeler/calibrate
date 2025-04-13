const cors = require("cors");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const { exec } = require("child_process");

const app = express();
// const port = process.env.APP_PORT || 3010;
const port = 3010;

// Add middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  }));

const authRoutes = require("./routes/auth.js");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user.js");
app.use("/user", userRoutes);

const deviceRoutes = require("./routes/device.js");
app.use("/device", deviceRoutes);

const calibrateRoutes = require("./routes/calibrate.js");
app.use("/calibrate", calibrateRoutes);

const idRoutes = require("./routes/ids.js");
app.use("/ids", idRoutes);

const imageRoutes = require("./routes/image.js");
app.use("/image", imageRoutes);

// run croncal.js every 2 minutes if in test mode, otherwise every day at 8am
const isTestMode = process.env.NODE_ENV === "test";
const schedule = isTestMode ? "*/2 * * * *" : "0 8 * * *";

cron.schedule(schedule, () => {
  exec("node croncal.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing croncal.js: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
