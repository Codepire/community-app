const router = require('express').Router();

const { userInfo } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authJwt');

router.route("/me").get(verifyToken, userInfo);

module.exports = router;