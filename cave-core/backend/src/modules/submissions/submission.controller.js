const mongoose = require('mongoose');
const Submission = require('./submission.model');

const Office = require('../offices/office.model');
const FormTemplate = require('../forms/formTemplate.model');
const { ApiError } = require('../../shared/errorHandler');

/**
 * @desc    Submit form data for a specific office
 * @route   POST /api/submissions
 */
const createSubmission = async (req, res, next) => {
  try {
    const { formTemplateId, officeId, data } = req.body;

    // Validate the form template exists
    const form = await FormTemplate.findById(formTemplateId);
    if (!form || !form.isActive) {
      throw new ApiError(404, 'Active form template not found');
    }

    const submission = await Submission.create({
      formTemplateId,
      formVersion: form.version,
      officeId,
      submittedBy: req.user._id,
      data
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get submissions (filterable by form, office, date range)
 * @route   GET /api/submissions
 */
const getSubmissions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.formTemplateId) filter.formTemplateId = req.query.formTemplateId;
    if (req.query.officeId) filter.officeId = req.query.officeId;
    if (req.query.from || req.query.to) {
      filter.submissionDate = {};
      if (req.query.from) filter.submissionDate.$gte = new Date(req.query.from);
      if (req.query.to) filter.submissionDate.$lte = new Date(req.query.to);
    }

    const submissions = await Submission.find(filter)
      .populate('officeId', 'name tier')
      .populate('submittedBy', 'email')
      .sort({ submissionDate: -1 });

    res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    GRAVITY: Aggregate data for a parent office (sums all children)
 *          Returns a grid: Questions (X) vs Offices (Y) with rolled-up totals
 * @route   GET /api/submissions/aggregate/:formTemplateId/:officeId
 */
const aggregateData = async (req, res, next) => {
  try {
    const { formTemplateId, officeId } = req.params;

    // Find all descendant office IDs using the ancestors array
    const office = await Office.findById(officeId);
    if (!office) {
      throw new ApiError(404, 'Office not found');
    }

    const descendantOffices = await Office.find({ ancestors: officeId }).select('_id name tier');
    const allOfficeIds = [office._id, ...descendantOffices.map(o => o._id)];

    // Aggregate submissions across all descendant offices
    const pipeline = [
      {
        $match: {
          formTemplateId: new mongoose.Types.ObjectId(formTemplateId),
          officeId: { $in: allOfficeIds }
        }

      },
      {
        // Get the latest submission per office
        $sort: { submissionDate: -1 }
      },
      {
        $group: {
          _id: '$officeId',
          latestData: { $first: '$data' },
          latestDate: { $first: '$submissionDate' }
        }
      }
    ];

    const results = await Submission.aggregate(pipeline);

    // Build the office lookup map
    const officeMap = {};
    officeMap[office._id.toString()] = { name: office.name, tier: office.tier };
    descendantOffices.forEach(o => {
      officeMap[o._id.toString()] = { name: o.name, tier: o.tier };
    });

    // Format: array of { office, data, date } + a rolled-up "total" row
    const grid = results.map(r => ({
      officeId: r._id,
      officeName: officeMap[r._id.toString()]?.name || 'Unknown',
      officeTier: officeMap[r._id.toString()]?.tier || 'Unknown',
      data: r.latestData,
      submissionDate: r.latestDate
    }));

    // Calculate rolled-up totals for numeric fields
    const totals = {};
    results.forEach(r => {
      if (r.latestData && typeof r.latestData === 'object') {
        Object.entries(r.latestData).forEach(([key, value]) => {
          if (typeof value === 'number') {
            totals[key] = (totals[key] || 0) + value;
          }
        });
      }
    });

    // Track which offices have NOT submitted
    const submittedOfficeIds = new Set(results.map(r => r._id.toString()));
    const missingOffices = descendantOffices
      .filter(o => !submittedOfficeIds.has(o._id.toString()))
      .map(o => ({ _id: o._id, name: o.name, tier: o.tier }));

    res.json({
      success: true,
      data: {
        parentOffice: { _id: office._id, name: office.name, tier: office.tier },
        grid,
        totals,
        missingOffices,
        totalDescendants: descendantOffices.length,
        submittedCount: results.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSubmission, getSubmissions, aggregateData };
