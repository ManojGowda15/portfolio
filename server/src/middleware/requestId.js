import { randomUUID } from 'crypto';

/**
 * Adds a unique request ID to each request for tracking
 */
export const requestIdMiddleware = (req, res, next) => {
  req.id = randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};

