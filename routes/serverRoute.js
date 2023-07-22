const router = require("express").Router();

const {
  getServerInfo,
  createServer,
  deleteServer,
  editServer,
} = require("../controllers/serverController");
const { verifyToken } = require("../middlewares/authJwt");

router.route("/").post(verifyToken, createServer);
router
  .route("/:serverId")
  .get(getServerInfo)
  .delete(verifyToken, deleteServer)
  .patch(verifyToken, editServer);

module.exports = router;
