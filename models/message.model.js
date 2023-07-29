const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "You must provide message to create message."],
  },
  createdAt: Date,
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: [true, "You must provide channel in which message is created."],
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Message,
};
