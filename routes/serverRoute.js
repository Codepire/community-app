const router = require("express").Router();

const {
  getServerInfo,
  createServer,
  deleteServer
} = require("../controllers/serverController");
const { verifyToken } = require("../middlewares/authJwt");

router.route("/:serverId").get(getServerInfo).delete(verifyToken, deleteServer);
router.route("/create-server").post(verifyToken, createServer);

module.exports = router;
