const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions, aggregateData } = require('./submission.controller');
const { protect, authorize } = require('../../shared/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSubmissions)
  .post(createSubmission);

// GRAVITY: Aggregated drill-down view
router.get('/aggregate/:formTemplateId/:officeId', authorize('Admin', 'Manager'), aggregateData);

module.exports = router;
