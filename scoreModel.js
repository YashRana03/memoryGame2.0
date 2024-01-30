const mongoose = require("mongoose");

const scoreSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Player name must be provided"],
  },
  score: {
    type: Number,
    required: [false, "Score must be provided"],
  },
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
