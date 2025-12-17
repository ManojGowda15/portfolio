import AdminUser from '../models/AdminUser.js';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token with expiration (24 hours)
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Token expires in 24 hours for security
  );
};

/**
 * Admin login with brute force protection
 * @route POST /api/admin/login
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input - prevent empty strings and only whitespace
    if (!username || !password || !username.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Additional input validation - prevent extremely long inputs (potential DoS)
    if (username.length > 100 || password.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input length',
      });
    }

    const normalizedUsername = username.toLowerCase().trim();
    
    // Check for admin user in database (lowercase username for consistency)
    const admin = await AdminUser.findOne({ username: normalizedUsername });

    // Always return same error message to prevent username enumeration
    if (!admin) {
      // Add small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    
    // Check if password matches (validates against hashed password in database)
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      // Add small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token with expiration
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current admin user
 * @route GET /api/admin/me
 */
export const getMe = async (req, res, next) => {
  try {
    const admin = await AdminUser.findById(req.user.id).select('-password');

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create admin user (for initial setup)
 * @route POST /api/admin/register
 */
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // In production, only allow the very first admin account to be created.
    // After that, additional registrations are blocked to prevent anyone from
    // self‑registering an admin in a live environment.
    const existingAdminsCount = await AdminUser.countDocuments();
    if (existingAdminsCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is disabled. An admin account already exists.',
      });
    }

    // Basic duplicate check for the very first admin (race‑condition safe enough
    // for single‑user setup). This also prevents creating two admins at once
    // if the count check above ran in parallel requests.
    const adminExists = await AdminUser.findOne({
      $or: [{ username }, { email }],
    });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists',
      });
    }

    // Create admin
    const admin = await AdminUser.create({
      username,
      email,
      password,
    });

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset admin password
 * @route PUT /api/admin/reset-password
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { username, newPassword } = req.body;

    // Validate input
    if (!username || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Find admin user (lowercase username for consistency)
    const admin = await AdminUser.findOne({ username: username.toLowerCase().trim() });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    // Update password - explicitly mark as modified to ensure pre-save hook runs
    admin.password = newPassword;
    admin.markModified('password');
    await admin.save();
    
    // Verify password was saved correctly by checking hash
    const verifyAdmin = await AdminUser.findById(admin._id);
    const testMatch = await verifyAdmin.matchPassword(newPassword);
    if (!testMatch) {
      console.error('Password was not saved correctly after reset');
      return res.status(500).json({
        success: false,
        message: 'Password reset failed. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

