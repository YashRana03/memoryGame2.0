const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Player name must be provided"],
  },
  password: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: [false, "Score must be provided"],
  },
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
