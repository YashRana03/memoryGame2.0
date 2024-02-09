const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Model schema for the Player
const playerSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Player name must be provided"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  score: {
    type: Number,
    required: [true, "Score must be provided"],
  },
});

// This runs before the document is saved to the DB
playerSchema.pre("save", async function (next) {
  // Checks if this is a new Player document
  if (!this.isNew) return next();
  // if so changes the password to the hashed version
  this.password = await bcrypt.hash(this.password, 12);
});

// This istance method is available to all Player documents

playerSchema.methods.checkPassword = async function (
  testPassword,
  actualPassword
) {
  // Returns true or false depending on if the two passwords match
  return await bcrypt.compare(testPassword, actualPassword);
};

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
