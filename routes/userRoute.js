const router = require('express').Router();

const { userInfo } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authJwt');

router.route("/me").get(verifyToken, userInfo);

module.exports = router;