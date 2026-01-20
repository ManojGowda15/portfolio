import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import educationRoutes from './routes/educationRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy - required when behind a reverse proxy (nginx, load balancer, etc.)
// This allows Express to correctly identify client IPs from X-Forwarded-For headers
// Set to 1 for a single proxy (more secure than 'true')
app.set('trust proxy', 1);

// Request ID middleware (must be first)
app.use(requestIdMiddleware);

// HTTP request logging
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../client/build');
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // In development, use dev format
  app.use(morgan('dev'));
}

// Compression middleware (gzip) - reduces response size
app.use(compression());

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        connectSrc: ["'self'", 'https:'],
      },
    },
  })
);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',').map(url => url.trim())
      : ['http://localhost:3000'];

    // In development, allow all origins for mobile testing
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In production, check against allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// General rate limiting for all API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit in development, 100 in production
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Don't skip successful requests to prevent abuse
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  // Custom key generator that works with trust proxy
  keyGenerator: req => {
    // Use the IP from Express (which respects trust proxy setting)
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  // Disable trust proxy validation - we handle it ourselves with app.set('trust proxy', 1)
  validate: {
    trustProxy: false,
  },
});

app.use('/api/', limiter);

// Body parser middleware with size limits to prevent DoS attacks
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Limit URL-encoded payload size

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/cv', express.static(path.join(__dirname, '../public/cv')));

// Serve static files from React app build in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../client/build');
  // Serve static files from the React app build directory
  app.use(express.static(buildPath));
}

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/education', educationRoutes);

// Root route - API information (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Portfolio API Server',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        projects: '/api/projects',
        contact: '/api/contact',
        feedback: '/api/feedback',
        education: '/api/education',
        admin: '/api/admin',
      },
      frontend: 'http://localhost:3000',
      documentation: 'See README.md for API documentation',
    });
  });
}

// Health check route with database status
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isHealthy = dbStatus === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'Server is running' : 'Server is running but database is disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStates[dbStatus] || 'unknown',
      connected: dbStatus === 1,
    },
  });
});

// Serve React app for all non-API routes in production (for React Router)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../client/build');
  // Catch-all handler: send back React's index.html file for all non-API routes
  app.get('*', (req, res, next) => {
    // Don't serve React app for API routes
    if (req.path.startsWith('/api/')) {
      return next(); // Let error handler deal with 404 API routes
    }
    // Serve React app index.html for all other routes
    res.sendFile(path.join(buildPath, 'index.html'), err => {
      if (err) {
        res.status(500).send('Error loading the application');
      }
    });
  });
}

// Error handler middleware (must be last)
app.use(errorHandler);

export default app;
