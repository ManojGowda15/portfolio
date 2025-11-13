import Message from '../models/Message.js';
import { sendEmail } from '../utils/sendEmail.js';
import { validationResult } from 'express-validator';

/**
 * Send contact message
 * @route POST /api/contact
 */
export const sendContactMessage = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, subject, message } = req.body;

    // Save message to database
    const contactMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    // Send email notification (optional)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendEmail({
          to: process.env.EMAIL_FROM,
          subject: `New Contact Form Message: ${subject}`,
          text: `You have a new message from ${name} (${email}):\n\n${message}`,
          html: `
            <h2>New Contact Form Message</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contactMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all messages (Admin only)
 * @route GET /api/contact
 */
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark message as read (Admin only)
 * @route PUT /api/contact/:id/read
 */
export const markMessageAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete message (Admin only)
 * @route DELETE /api/contact/:id
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

