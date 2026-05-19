const User = require('./user.model');
const { ApiError } = require('../../shared/errorHandler');

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-passwordHash');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { empCode, designation, mobile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { empCode, designation, mobile },
      { returnDocument: 'after', runValidators: true }

    ).select('-passwordHash');

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, updateProfile };
