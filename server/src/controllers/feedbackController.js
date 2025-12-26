import Feedback from '../models/Feedback.js';
import { sendEmail } from '../utils/sendEmail.js';
import { validationResult } from 'express-validator';

/**
 * Submit feedback
 * @route POST /api/feedback
 */
export const submitFeedback = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, rating, feedback } = req.body;

    // Save feedback to database
    const feedbackData = await Feedback.create({
      name,
      email,
      rating,
      feedback,
    });

    // Send email notification (optional)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendEmail({
          to: process.env.EMAIL_FROM,
          subject: `New Feedback Received: ${rating} Star${rating > 1 ? 's' : ''}`,
          text: `You have received new feedback from ${name} (${email}):\n\nRating: ${rating}/5\n\nFeedback:\n${feedback}`,
          html: `
            <h2>New Feedback Received</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Rating:</strong> ${rating}/5 ⭐</p>
            <p><strong>Feedback:</strong></p>
            <p>${feedback}</p>
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedbackData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all feedback (Admin only)
 * @route GET /api/feedback
 */
export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark feedback as read (Admin only)
 * @route PUT /api/feedback/:id/read
 */
export const markFeedbackAsRead = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete feedback (Admin only)
 * @route DELETE /api/feedback/:id
 */
export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

