const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/signout', authMiddleware.authenticateToken,  authController.signout);
router.get('/googleCallBack',authMiddleware.isLoggedIn, authController.googleCallBack);
router.get('/googleFailure', authController.googleFailure);
router.get('/google', authController.google);
router.get('/googleLogout', authMiddleware.isLoggedIn, authController.googleLogout);

module.exports = router;
