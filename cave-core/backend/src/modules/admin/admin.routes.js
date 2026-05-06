const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { importOffices, importUsers } = require('./admin.controller');
const { protect, authorize } = require('../../shared/authMiddleware');

// Setup multer for temporary storage
const upload = multer({ dest: 'uploads/' });

router.use(protect);
router.use(authorize('Admin'));

router.post('/import/offices', upload.single('file'), importOffices);
router.post('/import/users', upload.single('file'), importUsers);

module.exports = router;
