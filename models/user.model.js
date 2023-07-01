const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    }
});

module.exports.User = mongoose.model("User", userSchema);
