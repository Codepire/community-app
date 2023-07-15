const router = require("express").Router();

const {
  getServerInfo,
  createServer,
  deleteServer,
  editServer,
} = require("../controllers/serverController");
const { verifyToken } = require("../middlewares/authJwt");

router
  .route("/:serverId")
  .get(getServerInfo)
  .delete(verifyToken, deleteServer)
  .patch(verifyToken, editServer);
router.route("/create-server").post(verifyToken, createServer);

module.exports = router;
