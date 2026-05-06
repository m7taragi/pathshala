const jwt = require('jsonwebtoken');
const User = require('../modules/users/user.model');
const { ApiError } = require('./errorHandler');

/**
 * Middleware: Verify JWT token and attach user to request.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized — no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      throw new ApiError(401, 'Not authorized — user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Not authorized — invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Not authorized — token expired'));
    }
    next(error);
  }
};

/**
 * Middleware: Role-Based Access Control guard.
 * Usage: authorize('Admin', 'Manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role '${req.user.role}' is not authorized for this action`));
    }
    next();
  };
};

module.exports = { protect, authorize };
