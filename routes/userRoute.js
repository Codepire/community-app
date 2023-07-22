const router = require("express").Router();

const {
  userInfo,
  editUser,
  deleteUser,
  joinServer,
  leaveServer,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authJwt");

router.route("/me").get(verifyToken, userInfo);
router.route("/update-profile").patch(verifyToken, editUser);
router.route("/delete-profile").delete(verifyToken, deleteUser);
router.route("/join-server").post(verifyToken, joinServer);
router.route("/leave-server").delete(verifyToken, leaveServer);

module.exports = router;
