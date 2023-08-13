const { Message } = require("../models/message.model");
const { Channel } = require("../models/channel.model");
const { default: mongoose } = require("mongoose");
const { verifyTokenIO } = require("../lib/authJwt.socket");

module.exports.getMessagesSocket = async (channelId) => {
  try {
    const messages = await Message.find({ channelId: channelId });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

module.exports.createMessageSocket = async (messageData) => {
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
