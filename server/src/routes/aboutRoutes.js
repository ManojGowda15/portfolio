import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getAbout);

// Protected routes (Admin only)
router.put('/', protect, updateAbout);

export default router;

