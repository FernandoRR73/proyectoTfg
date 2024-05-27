const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/checkSession', authController.checkSession);
router.post('/logout', authController.logout);
router.post('/setSession', authController.setSession);
router.post('/uploadAvatar', upload.single('avatar'), authController.uploadAvatar);
router.get('/profile', authController.getUserProfile);
router.put('/updateUser', authController.updateUser);
router.delete('/deleteUser', authController.deleteUser);

module.exports = router;
