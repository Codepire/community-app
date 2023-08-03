const { Message } = require("../models/message.model");
const { Channel } = require("../models/channel.model");
const { default: mongoose } = require("mongoose");

module.exports.getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channelId: channelId });
    res.status(200).json({ response: messages });
  } catch (err) {
    res.send({
      response: "Some error occurred while retriving messages.",
      err: err,
    });
  }
};

module.exports.createMessage = async (req, res) => {
  const { message, channelId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const channel = await Channel.findById(channelId).session(session);
    if (!channel) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ response: "Channel does not exist" });
    }

    const newMsg = new Message({
      message: message,
      createdAt: new Date().getDate(),
      authorId: req.user.id,
      channelId: channelId,
    });
    await newMsg.save({ session: session });

    channel.messagesId.push(newMsg._id);
    await channel.save({ session: session });

    await session.commitTransaction();
    res.status(201).json({ response: "Message created" });
  } catch (err) {
    await session.abortTransaction();
    res.json({
      response: "Some error occurred while creating message",
      err: err,
    });
  } finally {
    session.endSession();
  }
};
