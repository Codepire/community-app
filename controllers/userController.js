const { User } = require("../models/user.model");
const { serverModel } = require("../models/server.model");

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
    res.status(200).json({ response: "Deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ response: "An error occurred while deleting the user." });
  }
};

module.exports.joinServer = async (req, res) => {
  const user = await User.findById(req.user.id);
  const server = await serverModel.findById(req.body.serverId);

  if (
    user.joinedServers.includes(server.id) &&
    server.members.includes(user.id)
  ) {
    res.json({ response: "You have already joined this server!" });
  } else {
    user.joinedServers.push(server.id);
    await user.save();

    server.members.push(user.id);
    await server.save();

    res.json({ response: "Server joined." });
  }
};

module.exports.leaveServer = async (req, res) => {
  const user = await User.findById(req.user.id);
  const server = await serverModel.findById(req.body.serverId);

  if (
    user.joinedServers.includes(server.id) ||
    server.members.includes(user.id)
  ) {
    await user.updateOne({
      $pull: { joinedServers: server.id },
    });

    await server.updateOne({
      $pull: { members: user.id },
    });

    res.json({ response: "Server left successfully." });
  } else {
    res.json({
      response: "You haven't joined server yet. you cant leave it bruh.",
    });
  }
};

module.exports.getJoinedServers = async (req, res) => {
  const servers = await serverModel.find({});
  const joinedServers = servers.filter((server) => {
    return server.members.includes(req.user.id);
  });
  res.json({ joinedServers });
};
