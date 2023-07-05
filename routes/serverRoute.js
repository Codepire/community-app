const router = require("express").Router();

const { getServerInfo } = require("../controllers/serverController");

router.route("/:serverId").get(getServerInfo);

module.exports = router;
