import express from 'express';
import { login, getMe, register, resetPassword } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { loginLimiter, moderateLimiter } from '../middleware/bruteForceProtection.js';

const router = express.Router();

// Public routes with brute force protection
router.post('/login', loginLimiter, login);
router.post('/register', moderateLimiter, register);
router.put('/reset-password', moderateLimiter, resetPassword); // For initial setup only

// Protected routes
router.get('/me', protect, getMe);

export default router;

