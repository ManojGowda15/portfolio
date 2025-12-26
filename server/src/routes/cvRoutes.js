import express from 'express';
import { downloadCV, uploadCV, getCVInfo } from '../controllers/cvController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadCV as uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', downloadCV);
router.get('/info', getCVInfo); // Public so frontend can get filename

// Protected routes (Admin only)
router.post('/upload', protect, uploadMiddleware.single('cv'), uploadCV);

export default router;

