const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  joinedServersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServerModel",
    },
  ],
  createdServersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServerModel",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
