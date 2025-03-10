// Express 설정 파일
require("dotenv").config();
const express = require("express");
const applyMiddleware = require("./middleware");
const statusRoutes = require("./routes/status");
const playersRoutes = require("./routes/players");

const app = express();

// 미들웨어 적용
applyMiddleware(app);

// 라우트 설정
app.use("/api/status", statusRoutes);
app.use("/api/players", playersRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("ERer API Server is running...");
});

module.exports = app;
