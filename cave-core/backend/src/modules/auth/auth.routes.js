const express = require('express');
const router = express.Router();
const { register, login, getMe, googleLogin } = require('./auth.controller');
const { protect } = require('../../shared/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

module.exports = router;

