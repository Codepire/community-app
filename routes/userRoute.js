const router = require("express").Router();

const {
  userInfo,
  editUser,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authJwt");

router.route("/me").get(verifyToken, userInfo);
router.route("/update-profile").patch(verifyToken, editUser);
router.route("/delete-profile").delete(verifyToken, deleteUser);

module.exports = router;
