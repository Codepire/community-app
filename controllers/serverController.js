const { serverModel } = require("../models/server.model");
const mongoose = require("mongoose");

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
    await new serverModel({
      serverName: serverName,
      serverOwner: req.user.id,
      createdAt: new Date().getDate(),
    }).save();
    res.status(200).json({ response: "server created." });
  } catch (err) {
    res.json(err);
  }
};

module.exports.deleteServer = async (req, res) => {
  const server = await serverModel.findById(req.params.serverId);
  if (server) {
    if (server.serverOwner.toString() === req.user.id) {
      await serverModel.deleteOne({ _id: server.id });
      res.json({ response: `server deleted: ${server.serverName}` });
    } else {
      res.json({ response: "You can not delete the server!" });
    }
  } else {
    res.json({ response: "server does not exist!" });
  }
};
