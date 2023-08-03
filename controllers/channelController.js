const { default: mongoose } = require("mongoose");
const { Channel } = require("../models/channel.model");
const { serverModel } = require("../models/server.model");

module.exports.getChannels = async (req, res) => {
  const channels = await Channel.find({
    parentServerId: req.params.parentServerId,
  });
  if (channels.length !== 0) {
    res.status(200).json(channels);
  } else {
    res.status(404).json({
      response:
        "Opps, this server don't have any channel yet. please create one.",
    });
  }
};

module.exports.createChannel = async (req, res) => {
  const { channelName, parentServerId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  const parentServer = await serverModel.findById(parentServerId).session(session);
  if (!parentServer) {
    await session.abortTransaction();
    session.endSession();
    return res.status(404).json({ response: "Parent-server not found." });
  }

  if (parentServer.serverOwnerId.toString() !== req.user.id) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(401)
      .json({ response: "Only server owner can create channel in server" });
  }

  try {
    // creating new channel
    const newChannel = new Channel({
      channelName: channelName,
      parentServerId: parentServerId,
    });
    await newChannel.save({ session: session });

    // updating server field
    parentServer.channelsId.push(newChannel._id);
    await parentServer.save({ session: session });

    await session.commitTransaction();
    res.status(201).json({ response: "Channel created successfully." });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      response: "An error occurred while creating the channel.",
      err: err,
    });
  } finally {
    session.endSession();
  }
};

module.exports.editChannel = async (req, res) => {
  const channel = await Channel.findById(req.params.channelId);
  if (!channel) {
    return res.status(404).json({ response: "Channel not found!" });
  }

  const parentServer = await serverModel.findById(channel.parentServerId);
  if (!parentServer) {
    return res.status(404).json({ response: "Parent-server not found!" });
  }

  if (parentServer.serverOwnerId.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ response: "Only server owner can edit channels." });
  }

  try {
    await channel.updateOne({
      $set: { channelName: req.body.channelName },
    });
    res.status(200).json({ response: "channel edited" });
  } catch (err) {
    res.json({
      response: "Some error occurred while updating channel",
      err: err,
    });
  }
};

module.exports.deleteChannel = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const channel = await Channel.findById(req.params.channelId).session(session);
  if (!channel) {
    await session.abortTransaction();
    session.endSession();
    return res.status(404).json({ response: "Channel not found!" });
  }

  const parentServer = await serverModel.findById(channel.parentServerId).session(session);
  if (!parentServer) {
    await session.abortTransaction();
    session.endSession();
    return res.status(404).json({ response: "Parent-server not found!" });
  }

  if (parentServer.serverOwnerId.toString() !== req.user.id) {
    await session.abortTransaction();
    session.endSession();
    res.status(401).json({ response: "Only server owner can delete channel." });
  }

  try {
    await parentServer.updateOne(
      {
        $pull: { channelsId: channel._id },
      },
      { session: session }
    );
    await channel.deleteOne({ session: session });

    await session.commitTransaction();
    res.status(204).json({ response: "Channel deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    res.json({
      response: "Some error occurred while deleting channel!",
      err: err,
    });
  } finally {
    session.endSession();
  }
};
