require("dotenv").config();

// const exp = require("constants");
const cors = require("cors");
const express = require("express");
const app = express();
// const port = process.env.APP_PORT || 3010;
const port = 3010;

app.use(cors());

app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const deviceRoutes = require("./routes/device");
app.use("/device", deviceRoutes);

const calibrateRoutes = require("./routes/calibrate");
app.use("/calibrate", calibrateRoutes);

app.listen(port, async() => {
  console.log(`Example app listening at http://localhost:${port}`);
});