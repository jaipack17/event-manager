const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    userID: String,
    name: String,
    verdict: Boolean
});

module.exports = mongoose.model("Registrations", dataSchema);