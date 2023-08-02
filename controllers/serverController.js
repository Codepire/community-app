const { serverModel } = require("../models/server.model");
const { User } = require("../models/user.model");
const { Channel } = require("../models/channel.model");

module.exports.getServerInfo = async (req, res) => {
  try {
    const serverObj = await serverModel.findById(req.params.serverId);
    res.json(serverObj);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createServer = async (req, res) => {
  const { serverName } = req.body;
  try {
    // creating new server
    const newServer = await new serverModel({
      serverName: serverName,
      serverOwnerId: req.user.id,
      createdAt: new Date().getDate(),
      membersId: req.user.id,
    });
    await newServer.save();

    // updating user fields
    await User.findByIdAndUpdate(req.user.id, {
      $set: { joinedServersId: newServer._id, createdServersId: newServer._id },
    });
    res.status(201).json({ response: "server created." });
  } catch (err) {
    res.json({
      response: "Some error occurred while creating server.",
      err: err,
    });
  }
};

module.exports.deleteServer = async (req, res) => {
  const server = await serverModel.findById(req.params.serverId);
  if (server) {
    if (server.serverOwnerId.toString() === req.user.id) {
      // remove deleted servers from joined servers in user
      await User.updateMany(
        { joinedServersId: server._id },
        { $pull: { joinedServersId: server._id } }
      );
      // delete all channels of this server
      await Channel.deleteMany({ parentServerId: server._id });
      // remove created server from server owner
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { createdServersId: server._id },
      });
      // delete server
      await serverModel.deleteOne({ _id: server._id });
      res.sendStatus(204);
    } else {
      res.status(401).json({ response: "You can not delete the server!" });
    }
  } else {
    res.status(404).json({ response: "server does not exist!" });
  }
};

module.exports.editServer = async (req, res) => {
  const server = await serverModel.findById(req.params.serverId);
  if (server) {
    if (server.serverOwnerId.toString() === req.user.id) {
      await serverModel.updateOne(
        { _id: req.params.serverId },
        { $set: { serverName: req.body.serverName } }
      );
      res.status(200).json({ response: "server updated" });
    } else {
      res.status(401).json({ response: "You can not edit server." });
    }
  } else {
    res.json({ response: "server does not exist!" });
  }
};
