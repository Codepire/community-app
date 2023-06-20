const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/community-app");

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
