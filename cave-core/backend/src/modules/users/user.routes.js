const express = require('express');
const router = express.Router();
const { getUsers, updateProfile } = require('./user.controller');
const { protect, authorize } = require('../../shared/authMiddleware');

router.use(protect);

router.get('/', authorize('Admin'), getUsers);
router.put('/profile', updateProfile);

module.exports = router;
