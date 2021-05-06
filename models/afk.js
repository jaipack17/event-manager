const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    reason: String
});

module.exports = mongoose.model("Afk", dataSchema);