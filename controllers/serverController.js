const { serverModel } = require("../models/server.model");

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
