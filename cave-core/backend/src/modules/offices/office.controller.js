const Office = require('./office.model');
const { ApiError } = require('../../shared/errorHandler');

/**
 * @desc    Create a new office node in the hierarchy
 * @route   POST /api/offices
 */
const createOffice = async (req, res, next) => {
  try {
    const { name, tier, parent } = req.body;
    // Normalize parent ID (frontend might send empty string for root)
    const parentId = (parent && parent !== '') ? parent : null;


    let ancestors = [];
    if (parentId) {
      const parentOffice = await Office.findById(parentId);
      if (!parentOffice) {
        throw new ApiError(404, 'Parent office not found');
      }
      // Build ancestor array: parent's ancestors + parent itself
      ancestors = [...parentOffice.ancestors, parentOffice._id];
    }

    const office = await Office.create({ name, tier, parent: parentId, ancestors });


    res.status(201).json({ success: true, data: office });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all offices (optionally filter by tier)
 * @route   GET /api/offices
 */
const getOffices = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.tier) filter.tier = req.query.tier;

    const offices = await Office.find(filter)
      .populate('parent', 'name tier')
      .sort({ tier: 1, name: 1 });

    res.json({ success: true, count: offices.length, data: offices });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single office by ID with its full ancestry
 * @route   GET /api/offices/:id
 */
const getOffice = async (req, res, next) => {
  try {
    const office = await Office.findById(req.params.id)
      .populate('parent', 'name tier')
      .populate('ancestors', 'name tier')
      .populate('vacancies.assignedUser', 'email role');

    if (!office) {
      throw new ApiError(404, 'Office not found');
    }

    res.json({ success: true, data: office });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all children of a given office (direct + deep descendants)
 * @route   GET /api/offices/:id/children
 */
const getChildren = async (req, res, next) => {
  try {
    const officeId = req.params.id;
    // All offices that have this office in their ancestors array
    const children = await Office.find({ ancestors: officeId })
      .populate('parent', 'name tier')
      .sort({ tier: 1, name: 1 });

    res.json({ success: true, count: children.length, data: children });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an office
 * @route   PUT /api/offices/:id
 */
const updateOffice = async (req, res, next) => {
  try {
    const office = await Office.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });


    if (!office) {
      throw new ApiError(404, 'Office not found');
    }

    res.json({ success: true, data: office });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an office (only if it has no children)
 * @route   DELETE /api/offices/:id
 */
const deleteOffice = async (req, res, next) => {
  try {
    const officeId = req.params.id;

    // Prevent deletion if there are child offices
    const childCount = await Office.countDocuments({ parent: officeId });
    if (childCount > 0) {
      throw new ApiError(400, 'Cannot delete office with existing child offices. Remove children first.');
    }

    const office = await Office.findByIdAndDelete(officeId);
    if (!office) {
      throw new ApiError(404, 'Office not found');
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOffice, getOffices, getOffice, getChildren, updateOffice, deleteOffice };
