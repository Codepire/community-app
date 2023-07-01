const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
  },
  parentServer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServerModel",
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Channel = mongoose.model("Channel", channelSchema);

module.exports = {
  channelSchema,
  Channel,
};
