const express = require('express');
const {
  registerUser,
  authUser,
  googleAuth,
  requestOtp,
  verifyOtp
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);

module.exports = router;
