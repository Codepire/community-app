const router = require("express").Router();

const {
  getServerInfo,
  createServer,
} = require("../controllers/serverController");
const { verifyToken } = require("../middlewares/authJwt");

router.route("/:serverId").get(getServerInfo);
router.route("/create-server").post(verifyToken, createServer);

module.exports = router;
