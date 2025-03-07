// API 기반 플레이어 model 불러오기
// const Player = require("../models/Player");
// 아직 데이터 형태가 정해지지 않음

// 닉네임으로 유저 정보 조회 컨트롤러
const getPlayerByNickname = async (req, res) => {
  const { nickname } = req.params;
  console.log(nickname, "의 유저 정보 조회");

  return res.status(200).json({ message: "OK" });
};

module.exports = { getPlayerByNickname };
