const router = require("express").Router();

const {
  createChannel,
  getChannels,
  deleteChannel,
  editChannel,
} = require("../controllers/channelController");
const { verifyToken } = require("../middlewares/authJwt");

router.use(verifyToken);

router.route("/").post(createChannel).patch(editChannel).delete(deleteChannel);
router.route("/:parentServerId").get(getChannels);
module.exports = router;
