const router = require("express").Router();

const { loginUser, registerUser } = require("../controllers/authController");

router.route("/login").all(loginUser);
router.route("/register").all(registerUser);

module.exports = router;
