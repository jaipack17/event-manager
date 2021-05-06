const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  server: String,
  rewards: Array
});

module.exports = mongoose.model("reward", dataSchema);