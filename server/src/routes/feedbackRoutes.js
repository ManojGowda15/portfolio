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

// Validation rules with length limits to prevent DoS attacks
const feedbackValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .escape(), // Sanitize to prevent XSS
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
    .toInt(), // Ensure it's an integer
  body('feedback')
    .trim()
    .notEmpty()
    .withMessage('Feedback is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Feedback must be between 1 and 5000 characters')
    .escape(), // Sanitize to prevent XSS
];

// Public route
router.post('/', feedbackValidation, submitFeedback);

// Protected routes (Admin only)
router.get('/', protect, getFeedback);
router.put('/:id/read', protect, markFeedbackAsRead);
router.delete('/:id', protect, deleteFeedback);

export default router;

