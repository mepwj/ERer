const express = require("express");
const { getPlayerByNickname } = require("../controllers/playersController");

const router = express.Router();

// 닉네임으로 유저 정보 조회 라우트
router.get("/:nickname", getPlayerByNickname);

module.exports = router;
