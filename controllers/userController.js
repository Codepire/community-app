const { User } = require("../models/user.model");

module.exports.userInfo = async (req, res, next) => {
   let user = req.user;
   const userObj = await User.findOne({ username: user.username }).select('-password -__v');;
   if (userObj) {
      res.status(200).json({ "response": userObj });
   } else {
      res.status(404).json({ "response": "Not found. (user does not exist with this username)!" })
   }
}