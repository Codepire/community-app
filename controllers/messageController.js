const { Message } = require("../models/message.model");
const { Channel } = require("../models/channel.model");
const { default: mongoose } = require("mongoose");
let cryptoJs = require("crypto-js");

module.exports.getMessagesSocket = async (channelId) => {
  try {
    const messages = await Message.find({ channelId: channelId });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

module.exports.createMessageSocket = async (messageData, socket) => {
  const { message, channelId } = messageData;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const channel = await Channel.findById(channelId).session(session);
    if (channel && message) {
      const encryptedMessage = cryptoJs.AES.encrypt(
        message,
        process.env.AES_KEY
      ).toString();
      const newMessage = new Message({
        message: encryptedMessage,
        createdAt: new Date().getDate(),
        authorId: socket.userId,
        channelId: channelId,
      });
      await newMessage.save({ session: session });

      channel.messagesId.push(newMessage._id);
      await channel.save({ session: session });

      await session.commitTransaction();
    } else {
      throw new Error("Channel or Message undefined!");
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
  } finally {
    session.endSession();
    console.log("done.");
  }
};
