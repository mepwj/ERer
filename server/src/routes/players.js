const express = require("express");
const {
  getPlayerByNickname,
  refreshPlayerData,
} = require("../controllers/playersController");
const router = express.Router();

// 닉네임으로 유저 정보 조회 (DB에 없으면 외부 API 호출 후 생성 및 갱신)
router.get("/:nickname", getPlayerByNickname);

// 별도의 갱신 라우트: 클라이언트가 '갱신' 버튼을 누르면 최신 데이터로 갱신
router.get("/:nickname/refresh", refreshPlayerData);

module.exports = router;
