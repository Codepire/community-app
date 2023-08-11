const { Message } = require("../models/message.model");
const { Channel } = require("../models/channel.model");
const { default: mongoose } = require("mongoose");
const { verifyTokenIO } = require("../lib/authJwt.socket");

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

module.exports.createMessage = async (messageData) => {
  const { message, channelId, jwtToken } = messageData;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const channel = await Channel.findById(channelId).session(session);

    if (channel && message) {
      const decode = await verifyTokenIO(jwtToken);
      if (decode) {
        const newMessage = new Message({
          message: message,
          createdAt: new Date().getDate(),
          authorId: decode.id,
          channelId: channelId,
        });

        await newMessage.save({ session: session });

        channel.messagesId.push(newMessage._id);
        await channel.save({ session: session });

        await session.commitTransaction();
      } else {
        throw new Error(
          "You are not authorized, please first Register or Login!"
        );
      }
    } else {
      throw new Error("Channel or Message undefined!");
    }
  } catch (err) {
    await session.abortTransaction();
  } finally {
    session.endSession();
    console.log("done.");
  }
};
