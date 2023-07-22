const router = require("express").Router();

const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/authJwt");

router.use(verifyToken);

router.route("/").get(getMessages).post(createMessage);

module.exports = router;
