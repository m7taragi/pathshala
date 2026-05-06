const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  formTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FormTemplate',
    required: true
  },
  formVersion: {
    type: Number,
    required: true
  },
  officeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  // We use Mixed type to store a flattened map of question IDs to their corresponding answers.
  // This allows for flexible and fast aggregation.
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
