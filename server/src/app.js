const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const statusRoutes = require("./routes/status");

const app = express();

// 미들웨어 설정
app.use(cors()); // CORS 설정
app.use(morgan("dev")); // HTTP 요청 로그
app.use(express.json()); // JSON 요청 본문 파싱

// 라우트 설정
app.use("/api/status", statusRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Express Server is running...");
});

module.exports = app;
