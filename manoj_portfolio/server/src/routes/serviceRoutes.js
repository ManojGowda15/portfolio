import express from 'express';
import { getServices, getServiceBySlug, updateServices } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

// Protected route (Admin only)
router.put('/', protect, updateServices);

export default router;

