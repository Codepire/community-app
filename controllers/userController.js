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
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      response: "An error occurred while deleting the user.",
      err: err,
    });
  }
};

module.exports.joinServer = async (req, res) => {
  const user = await User.findById(req.user.id);
  const server = await serverModel.findById(req.params.serverId);

  if (
    user.joinedServersId.includes(server.id) &&
    server.membersId.includes(user.id)
  ) {
    res.json({ response: "You have already joined this server!" });
  } else {
    user.joinedServersId.push(server.id);
    await user.save();

    server.membersId.push(user.id);
    await server.save();

    res.status(201).json({ response: "Server joined." });
  }
};

module.exports.leaveServer = async (req, res) => {
  const user = await User.findById(req.user.id);
  const server = await serverModel.findById(req.params.serverId);
  if (user.createdServersId.includes(server._id)) {
    res
      .status(400)
      .json({ response: "You can not leave server as you are owner." });
  } else {
    if (
      user.joinedServersId.includes(server.id) ||
      server.membersId.includes(user.id)
    ) {
      await user.updateOne({
        $pull: { joinedServersId: server.id },
      });

      await server.updateOne({
        $pull: { membersId: user.id },
      });

      res.sendStatus(204);
    } else {
      res.status(404).json({
        response: "You haven't joined server yet. you cant leave it bruh.",
      });
    }
  }
};

module.exports.getJoinedServers = async (req, res) => {
  const joinedServers = await serverModel.find({membersId: req.user.id});
  res.status(200).json({ joinedServers });
};
