const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'number', 'boolean', 'choice'],
    required: true
  },
  options: [{ type: String }], // Only used if type is 'choice'
  isRequired: { type: Boolean, default: false }
});

const subHeadingSchema = new mongoose.Schema({
  subHeadingTitle: { type: String, required: false },
  questions: {
    type: [questionSchema],
    validate: [v => Array.isArray(v) && v.length > 0, 'Sub-heading must have at least one question']
  }
});


const headingSchema = new mongoose.Schema({
  headingTitle: { type: String, required: false },
  subHeadings: {
    type: [subHeadingSchema],
    validate: [v => Array.isArray(v) && v.length > 0, 'Heading must have at least one sub-heading']
  }
});


const formTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  targetTiers: [{
    type: String,
    enum: ['Head', 'Regional', 'Zonal', 'District']
  }],
  targetRoles: [{
    type: String,
    enum: ['Admin', 'Manager', 'Viewer']
  }],
  structure: {
    type: [headingSchema],
    validate: [v => Array.isArray(v) && v.length > 0, 'Form structure must have at least one heading']
  },

  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FormTemplate', formTemplateSchema);
