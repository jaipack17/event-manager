const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    server: String,
    creator: String,
    name: String,
    content: String,
    creator: String,
    uses: Number
});

module.exports = mongoose.model("Tag", dataSchema);