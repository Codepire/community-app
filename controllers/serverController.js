const { serverModel } = require("../models/server.model");
const { User } = require("../models/user.model");

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
      serverOwner: req.user.id,
      createdAt: new Date().getDate(),
      members: req.user.id,
    });
    await newServer.save();

    // updating user fields
    await User.findByIdAndUpdate(req.user.id, {
      $set: { joinedServers: newServer.id, createdServers: newServer.id },
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
    if (server.serverOwner.toString() === req.user.id) {
      await serverModel.deleteOne({ _id: server.id });
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
    if (server.serverOwner.toString() === req.user.id) {
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
