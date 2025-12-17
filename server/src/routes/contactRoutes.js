import express from 'express';
import { body } from 'express-validator';
import {
  sendContactMessage,
  getMessages,
  markMessageAsRead,
  deleteMessage,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation rules with length limits to prevent DoS attacks
const contactValidation = [
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
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters')
    .escape(), // Sanitize to prevent XSS
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters')
    .escape(), // Sanitize to prevent XSS
];

// Public route
router.post('/', contactValidation, sendContactMessage);

// Protected routes (Admin only)
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markMessageAsRead);
router.delete('/:id', protect, deleteMessage);

export default router;

