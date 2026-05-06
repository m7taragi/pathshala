const express = require('express');
const router = express.Router();
const { createForm, getForms, getForm, updateForm, deleteForm } = require('./form.controller');
const { protect, authorize } = require('../../shared/authMiddleware');

router.use(protect);

router.route('/')
  .get(getForms)
  .post(authorize('Admin', 'Manager'), createForm);

router.route('/:id')
  .get(getForm)
  .put(authorize('Admin', 'Manager'), updateForm)
  .delete(authorize('Admin'), deleteForm);

module.exports = router;
