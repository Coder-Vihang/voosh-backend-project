const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/multerMiddleware');

router.get('/fetchUsers', userController.fetchUsers);
router.get('/fetchMyProfile', userController.fetchMyProfile);
router.put('/editmyProfile', upload.none(), userController.editMyProfile);
router.post('/uploadUserImage', upload.single('imageURL'), userController.uploadUserImage);
router.put('/editRole', userController.editRole);

module.exports = router;
