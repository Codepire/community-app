const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  serverName: {
    type: String,
    required: true
  },
  serverOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: Date,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
});

const serverModel = mongoose.model("Server", serverSchema);

module.exports = {
  serverSchema,
  serverModel,
};
