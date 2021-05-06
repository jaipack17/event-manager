const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    winsApril: Number,
    server: String
});

module.exports = mongoose.model("aprildata", dataSchema);