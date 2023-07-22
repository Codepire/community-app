const router = require("express").Router();

const {
  userInfo,
  editUser,
  deleteUser,
  joinServer,
  leaveServer,
  getJoinedServers,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authJwt");

router
  .route("/me")
  .get(verifyToken, userInfo)
  .patch(verifyToken, editUser)
  .delete(verifyToken, deleteUser);

router.route("/servers").get(verifyToken, getJoinedServers);

router
  .route("/servers/:serverId")
  .post(verifyToken, joinServer)
  .delete(verifyToken, leaveServer);

module.exports = router;
