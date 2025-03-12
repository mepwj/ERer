const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  userNum: { type: Number, required: true, unique: true },
  nickname: { type: String, required: true },
  stats: { type: mongoose.Schema.Types.Mixed }, // 각 시즌별 스탯 데이터를 key-value 형식으로 저장 (예: { "0": {…}, "6": {…}, ... })
  games: [{ type: Number }], // 게임 전적에 해당하는 gameId 배열 (페이지네이션 적용)
});

module.exports = mongoose.model("Player", playerSchema);
