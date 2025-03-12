const express = require("express");
const {
  getPlayerByNickname,
  refreshPlayerData,
  getPlayerGamesByNickname,
} = require("../controllers/playersController");
const router = express.Router();

// 닉네임으로 유저 정보 조회 (DB에 없으면 외부 API 호출 후 생성 및 갱신)
router.get("/:nickname", getPlayerByNickname);

// 별도의 갱신 라우트: 클라이언트가 '갱신' 버튼을 누르면 최신 데이터로 갱신
router.get("/:nickname/refresh", refreshPlayerData);

// 별도의 게임 데이터 조회 라우트: 닉네임으로 최신 게임 10개씩 페이지네이션
router.get("/:nickname/games", getPlayerGamesByNickname);

module.exports = router;
