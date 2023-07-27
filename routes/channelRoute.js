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
router.route("/:parentServer").get(getChannels);
module.exports = router;
