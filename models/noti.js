const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  userID: String,
  allow: Boolean
});

module.exports = mongoose.model("notification", dataSchema);