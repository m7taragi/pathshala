const FormTemplate = require('./formTemplate.model');
const { ApiError } = require('../../shared/errorHandler');

/**
 * @desc    Create a new form template
 * @route   POST /api/forms
 */
const createForm = async (req, res, next) => {
  try {
    const form = await FormTemplate.create(req.body);
    res.status(201).json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all form templates
 * @route   GET /api/forms
 */
const getForms = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.tier) filter.targetTiers = req.query.tier;
    if (req.query.active !== undefined) filter.isActive = req.query.active === 'true';

    const forms = await FormTemplate.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: forms.length, data: forms });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single form template by ID
 * @route   GET /api/forms/:id
 */
const getForm = async (req, res, next) => {
  try {
    const form = await FormTemplate.findById(req.params.id);
    if (!form) {
      throw new ApiError(404, 'Form template not found');
    }
    res.json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a form template (creates a new version)
 * @route   PUT /api/forms/:id
 */
const updateForm = async (req, res, next) => {
  try {
    const existing = await FormTemplate.findById(req.params.id);
    if (!existing) {
      throw new ApiError(404, 'Form template not found');
    }

    // Bump the version number on structural changes
    if (req.body.structure) {
      req.body.version = existing.version + 1;
    }

    const form = await FormTemplate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete (deactivate) a form template
 * @route   DELETE /api/forms/:id
 */
const deleteForm = async (req, res, next) => {
  try {
    const form = await FormTemplate.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!form) {
      throw new ApiError(404, 'Form template not found');
    }

    res.json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

module.exports = { createForm, getForms, getForm, updateForm, deleteForm };
