const express = require('express');
const router = express.Router();
const { createOffice, getOffices, getOffice, getChildren, updateOffice, deleteOffice } = require('./office.controller');
const { protect, authorize } = require('../../shared/authMiddleware');

router.use(protect); // All office routes require authentication

router.route('/')
  .get(getOffices)
  .post(authorize('Admin'), createOffice);

router.route('/:id')
  .get(getOffice)
  .put(authorize('Admin'), updateOffice)
  .delete(authorize('Admin'), deleteOffice);

router.get('/:id/children', getChildren);

module.exports = router;
