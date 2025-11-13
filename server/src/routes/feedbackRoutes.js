import express from 'express';
import { body } from 'express-validator';
import {
  submitFeedback,
  getFeedback,
  markFeedbackAsRead,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation rules
const feedbackValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback').trim().notEmpty().withMessage('Feedback is required'),
];

// Public route
router.post('/', feedbackValidation, submitFeedback);

// Protected routes (Admin only)
router.get('/', protect, getFeedback);
router.put('/:id/read', protect, markFeedbackAsRead);
router.delete('/:id', protect, deleteFeedback);

export default router;

