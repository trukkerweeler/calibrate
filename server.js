
// const exp = require("constants");
import cors from "cors";
import express from "express";
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

import deviceRoutes from "./routes/device.js";
app.use("/device", deviceRoutes);

import calibrateRoutes from "./routes/calibrate.js";
app.use("/calibrate", calibrateRoutes);

import idRoutes from "./routes/ids.js";
app.use("/ids", idRoutes);

import imageRoutes from "./routes/image.js";
app.use("/image", imageRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});