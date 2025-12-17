import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

/**
 * Protect routes with JWT authentication
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token with error handling for expired tokens
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            success: false,
            message: 'Token expired. Please login again.' 
          });
        }
        throw error; // Re-throw other errors
      }

      // Get user from token (exclude password)
      req.user = await AdminUser.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

