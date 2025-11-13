import express from 'express';
import { getAbout, updateAbout, uploadAboutImage } from '../controllers/aboutController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProjectImage as uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getAbout);

// Protected routes (Admin only)
router.put('/', protect, updateAbout);
router.post('/upload-image', protect, uploadMiddleware.single('image'), uploadAboutImage);

export default router;

