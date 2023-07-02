const router = require('express').Router();

const { userInfo, editUser, deleteUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authJwt');

router.route("/me").get(verifyToken, userInfo);
router.route("/me").delete(verifyToken, deleteUser);
router.route("/update-profile").patch(verifyToken, editUser);

module.exports = router;