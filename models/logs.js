const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    host: String,
    userID: String,
    type: String,
    amount: Number,
    winner: String,
    winnerID: String,
    time: String
});

module.exports = mongoose.model("Log", dataSchema);