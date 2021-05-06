const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    host: String,
    userID: String,
    hosted: Number
});

module.exports = mongoose.model("HostStat", dataSchema);