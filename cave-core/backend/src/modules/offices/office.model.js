const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tier: {
    type: String,
    enum: ['Head', 'Regional', 'Zonal', 'District'],
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    default: null
  },
  ancestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office'
  }],
  vacancies: [{
    title: { type: String, required: true },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isPrimary: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Office', officeSchema);
