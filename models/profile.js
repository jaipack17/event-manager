const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    status: String,
    description: String
});

module.exports = mongoose.model("Profile", dataSchema);