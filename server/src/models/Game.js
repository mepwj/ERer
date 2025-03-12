const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({}, { strict: false });
const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
