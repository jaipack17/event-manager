const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    wins: Number,
    server: String
});

module.exports = mongoose.model("Data", dataSchema);