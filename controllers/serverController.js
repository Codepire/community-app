const { serverModel } = require("../models/server.model");
const { User } = require("../models/user.model");
const { Channel } = require("../models/channel.model");
const { default: mongoose } = require("mongoose");

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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // creating new server
    const newServer = await new serverModel({
      serverName: serverName,
      serverOwnerId: req.user.id,
      createdAt: new Date().getDate(),
      membersId: req.user.id,
    });
    await newServer.save({ session: session });

    // updating user fields
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          joinedServersId: newServer._id,
          createdServersId: newServer._id,
        },
      },
      { session: session }
    );
    await session.commitTransaction();
    res.status(201).json({ response: "server created." });
  } catch (err) {
    session.abortTransaction();
    res.json({
      response: "Some error occurred while creating server.",
      err: err,
    });
  } finally {
    session.endSession();
  }
};

module.exports.editServer = async (req, res) => {
  const server = await serverModel.findById(req.params.serverId);
  if (!server) {
    return res.json({ response: "server does not exist!" });
  }

  if (server.serverOwnerId.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ response: "Only server owner can edit the server." });
  }

  try {
    await serverModel.updateOne(
      { _id: req.params.serverId },
      { $set: { serverName: req.body.serverName } }
    );
    res.status(200).json({ response: "server updated" });
  } catch (err) {
    res.status(500).json({
      response: "Some error occurred while editing the server",
      err: err,
    });
  }
};

module.exports.deleteServer = async (req, res) => {
  const session = await mongoose.startSession();
  await session.startTransaction();

  const server = await serverModel
    .findById(req.params.serverId)
    .session(session);

  if (!server) {
    await session.abortTransaction();
    session.endSession();
    return res.status(404).json({ response: "Server does not exist!" });
  }

  if (server.serverOwnerId.toString() !== req.user.id) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(401)
      .json({ response: "Only server owner can delete the server!" });
  }

  try {
    // remove deleted servers from joined servers in user
    await User.updateMany(
      { joinedServersId: server._id },
      { $pull: { joinedServersId: server._id } },
      { session: session }
    );
    // delete all channels of this server
    await Channel.deleteMany(
      { parentServerId: server._id },
      { session: session }
    );
    // remove created server from server owner
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { createdServersId: server._id },
      },
      { session: session }
    );
    // delete server
    await serverModel.deleteOne({ _id: server._id }, { session: session });

    await session.commitTransaction();
    res.sendStatus(204);
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      response: "An error occurred while deleting server.",
      err: err,
    });
  } finally {
    session.endSession();
  }
};
