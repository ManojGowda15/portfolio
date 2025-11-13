import express from 'express';
import { getHero, updateHero, uploadHeroImage } from '../controllers/heroController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProjectImage as uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getHero);

// Protected routes (Admin only)
router.put('/', protect, updateHero);
router.post('/upload-image', protect, uploadMiddleware.single('image'), uploadHeroImage);

export default router;

