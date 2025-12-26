import rateLimit from 'express-rate-limit';

/**
 * Strict rate limiter for login endpoint to prevent brute force attacks
 * Allows only 5 failed attempts per 15 minutes per IP
 * In development mode, allows more attempts for easier testing
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 20 : 5, // More attempts in dev mode
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful logins - only failed attempts
  skipFailedRequests: false, // Count failed requests
});

/**
 * Moderate rate limiter for other sensitive endpoints
 * Allows 10 attempts per 15 minutes per IP
 */
export const moderateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

