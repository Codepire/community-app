const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "You must provide message to create message."],
  },
  createdAt: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: [true, "You must provide channel in which message is created."],
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = {
  messageSchema,
  Message,
};
