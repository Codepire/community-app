const { User } = require("../models/user.model");
const { serverModel } = require("../models/server.model");
const { default: mongoose } = require("mongoose");

module.exports.userInfo = async (req, res) => {
  let user = req.user;
  const userObj = await User.findById(user.id).select("-password -__v");
  if (userObj) {
    res.status(200).json({ response: userObj });
  } else {
    res.status(404).json({
      response: "Not found. (user does not exist with this username)!",
    });
  }
};

module.exports.editUser = async (req, res) => {
  const user = req.user;
  const { password, ...updatedField } = req.body;
  const existingUser = await User.findOne({ username: updatedField.username });
  if (!existingUser) {
    await User.findByIdAndUpdate(user.id, { $set: updatedField });
    res.status(200).json({ response: "Updated successfully." });
  } else {
    res.status(409).json({
      response: "duplication error (user already exist with this username).",
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = req.user;
    await User.findByIdAndDelete(user.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      response: "An error occurred while deleting the user.",
      err: err,
    });
  }
};

module.exports.joinServer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const user = await User.findById(req.user.id).session(session);
  const server = await serverModel
    .findById(req.params.serverId)
    .session(session);

  if (!server) {
    await session.abortTransaction();
    session.endSession();
    return res.status(404).json({ response: "Server not found!" });
  }

  try {
    if (
      user.joinedServersId.includes(server._id) &&
      server.membersId.includes(user._id)
    ) {
      await session.abortTransaction();
      res.json({ response: "You have already joined this server!" });
    } else {
      user.joinedServersId.push(server._id);
      await user.save({ session: session });

      server.membersId.push(user._id);
      await server.save({ session: session });

      await session.commitTransaction();
      res.status(201).json({ response: "Server joined." });
    }
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      response: "Some error occurred while joinning the server",
      err: err,
    });
  } finally {
    session.endSession();
  }
};

module.exports.leaveServer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const user = await User.findById(req.user.id).session(session);
  const server = await serverModel
    .findById(req.params.serverId)
    .session(session);

  if (!server) {
    await session.abortTransaction();
    session.endSession();
    return res.status(404).json({ response: "Server not found!" });
  }

  if (user.createdServersId.includes(server._id)) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(400)
      .json({ response: "You can not leave server as you are owner." });
  }

  try {
    if (
      user.joinedServersId.includes(server._id) ||
      server.membersId.includes(user._id)
    ) {
      await user.updateOne(
        {
          $pull: { joinedServersId: server._id },
        },
        { session: session }
      );

      await server.updateOne(
        {
          $pull: { membersId: user._id },
        },
        { session: session }
      );

      await session.commitTransaction();
      res.sendStatus(204);
    } else {
      await session.abortTransaction();
      res.status(404).json({
        response: "You haven't joined server yet. you cant leave it bruh.",
      });
    }
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      response: "Some error occurred while leaving the server",
      err: err,
    });
  } finally {
    session.endSession();
  }
};

module.exports.getJoinedServers = async (req, res) => {
  const joinedServers = await serverModel.find({ membersId: req.user.id });
  res.status(200).json({ joinedServers });
};
