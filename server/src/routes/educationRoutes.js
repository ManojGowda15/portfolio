import express from 'express';
import { getEducation, updateEducation } from '../controllers/educationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getEducation);

// Protected routes (Admin only)
router.put('/', protect, updateEducation);

export default router;

