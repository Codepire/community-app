const router = require('express').Router();

const { homePage, greetPage } = require("../controllers/homeController");

router.route("/").get(homePage);

module.exports = router;

