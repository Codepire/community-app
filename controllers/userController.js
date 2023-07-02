const { User } = require("../models/user.model");

module.exports.userInfo = async (req, res) => {
  let user = req.user;
  const userObj = await User.findOne({ username: user.username }).select(
    "-password -__v"
  );
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
    User.updateOne({ username: user.username }, { $set: updatedField }).then(
      (response) => {
        res.send(response);
      }
    );
  } else {
    res.status(409).json({ "response": "duplication error (user already exist with this username)." });
  }
};
