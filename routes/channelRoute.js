const router = require("express").Router();

const {
  createChannel,
  getChannels,
  deleteChannel,
  editChannel,
} = require("../controllers/channelController");
const { verifyToken } = require("../middlewares/authJwt");

router.use(verifyToken);

router
  .route("/")
  .get(getChannels)
  .post(createChannel)
  .patch(editChannel)
  .delete(deleteChannel);

module.exports = router;
