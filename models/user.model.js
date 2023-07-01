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
  joinedServers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServerModel",
    },
  ],
  createdServers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServerModel",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = {
  userSchema,
  User,
};
