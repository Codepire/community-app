const { Message } = require("../models/message.model");
const { Channel } = require("../models/channel.model");

module.exports.createMessage = async (req, res) => {
  try {
    const { message, channelId } = req.body;
    const channel = await Channel.findById(channelId);
    if (channel) {
      const newMsg = new Message({
        message: message,
        createdAt: new Date().getDate(),
        author: req.user.id,
        channel: channelId,
      });
      await newMsg.save();

      channel.messages.push(newMsg._id);
      await channel.save();

      res.status(201).json({ response: "Message created" });
    } else {
      res.json({ response: "Channel does not exist" });
    }
  } catch (err) {
    res.json({
      response: "Some error occured while creating message",
      err: err,
    });
  }
};

module.exports.getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channel: channelId });
    res.status(200).json({ response: messages });
  } catch (err) {
    res.send({
      response: "Some error occured while retriving messages.",
      err: err,
    });
  }
};
