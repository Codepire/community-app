const { Channel } = require("../models/channel.model");
const { serverModel } = require("../models/server.model");

module.exports.getChannels = async (req, res) => {
  const channels = await Channel.find({ parentServer: req.body.parentServer });
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
  const { channelName, parentServer: parentServerId } = req.body;
  const parentServer = await serverModel.findById(parentServerId);
  if (parentServer.serverOwner.toString() === req.user.id) {
    try {
      const newChannel = new Channel({
        channelName: channelName,
        parentServer: parentServerId,
      });
      await newChannel.save();
      res.status(200).json({ response: "Channel created successfully." });
    } catch (err) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the channel." });
    }
  } else {
    res
      .status(401)
      .json({ response: "Only server leader can create channel in server" });
  }
};

module.exports.editChannel = async (req, res) => {
  const channel = await Channel.findById(req.body.channelId);
  if (channel) {
    const parentServer = await serverModel.findById(channel.parentServer);
    if (parentServer.serverOwner.toString() === req.user.id) {
      try {
        await channel.updateOne({
          $set: { channelName: req.body.channelName },
        });
        res.status(200).json({ response: "channel edited" });
      } catch (err) {
        res.json({
          response: "Some error occured while updating channel",
          err: err,
        });
      }
    } else {
      res
        .status(401)
        .json({ response: "Only server owner can edit channels." });
    }
  } else {
    res.status(404).json({ response: "Channel not found" });
  }
};

module.exports.deleteChannel = async (req, res) => {
  const channel = await Channel.findById(req.body.channelId);
  if (channel) {
    const parentServer = await serverModel.findById(channel.parentServer);
    if (parentServer.serverOwner.toString() === req.user.id) {
      try {
        await channel.deleteOne();
        res.status(200).json({ response: "Channel deleted successfully" });
      } catch (err) {
        res.json({
          response: "Some error occured while deleting channel!",
          err: err,
        });
      }
    } else {
      res
        .status(402)
        .json({ response: "Only server owner can delete channel." });
    }
  } else {
    res.status(404).json({ response: "Channel does not exist!" });
  }
};
