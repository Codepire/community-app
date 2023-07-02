const router = require('express').Router();

const { userInfo, editUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authJwt');

router.route("/me").get(verifyToken, userInfo);
router.route("/update-profile").patch(verifyToken, editUser);

module.exports = router;