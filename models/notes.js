const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    host: String,
    hostID: String,
    personID: String,
    note: String,
    time: String
});

module.exports = mongoose.model("Note", dataSchema);