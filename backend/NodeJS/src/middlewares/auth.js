// JWT-based authentication middleware
const jwt = require('jsonwebtoken');

module.exports = function auth(optional = false) {
  return (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.header('Authorization');
      
      if (!authHeader) {
        if (optional) {
          req.auth = { userId: null, role: null };
          return next();
        }
        return res.status(401).json({ error: 'No token provided' });
      }

      // Extract token from "Bearer <token>" format
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key');
      
      // Set auth context from decoded token
      req.auth = { 
        userId: decoded.id || decoded.user_id,
        role: decoded.role,
        email: decoded.email
      };
      
      next();
    } catch (error) {
      if (optional) {
        req.auth = { userId: null, role: null };
        return next();
      }
      
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};
