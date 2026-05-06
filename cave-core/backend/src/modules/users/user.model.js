const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    // Optional because Google SSO users might not have a password
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  otpSecret: {
    type: String
  },
  empCode: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  role: {

    type: String,
    enum: ['Admin', 'Manager', 'Viewer'],
    default: 'Viewer'
  },
  primaryBase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office'
  },
  sideMissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
