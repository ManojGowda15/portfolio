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

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

// Public route
router.post('/', contactValidation, sendContactMessage);

// Protected routes (Admin only)
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markMessageAsRead);
router.delete('/:id', protect, deleteMessage);

export default router;

