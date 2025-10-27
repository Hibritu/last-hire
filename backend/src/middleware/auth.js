const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to authenticate JWT tokens
 * @param {any} req - Express request
 * @param {any} res - Express response
 * @param {any} next - Express next function
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware to authorize based on user roles
 * @param {string[]} allowedRoles - Array of allowed role names
 * @returns {Function}
 */
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (allowedRoles.length === 0) return next();
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };


