const router = require("express").Router();

const { loginUser, registerUser } = require("../controllers/authController");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

module.exports = router;
