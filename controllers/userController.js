const { User } = require("../models/user.model");

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
