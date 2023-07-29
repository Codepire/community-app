const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  serverName: {
    type: String,
    required: true
  },
  serverOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: Date,
  membersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  channelsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
});

const serverModel = mongoose.model("Server", serverSchema);

module.exports = {
  serverModel,
};
