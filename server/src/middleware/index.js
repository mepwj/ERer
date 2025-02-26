// 미들웨어 설정 파일
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

module.exports = (app) => {
  app.use(cors()); // CORS 설정
  app.use(morgan("dev")); // HTTP 요청 로그
  app.use(express.json()); // JSON 요청 본문 파싱
};
