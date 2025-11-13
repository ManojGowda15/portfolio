import express from 'express';
import { login, getMe, register, resetPassword } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.put('/reset-password', resetPassword); // For initial setup only

// Protected routes
router.get('/me', protect, getMe);

export default router;

