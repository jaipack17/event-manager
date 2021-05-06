const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  server: String,
  userID: String,
  username: String,
  voted: Boolean,
  police: String,
  ex_police: String,
  host: String,
  art: String,
  active: String,
  helper: String,
  veteran: String
});

module.exports = mongoose.model("vote", dataSchema);