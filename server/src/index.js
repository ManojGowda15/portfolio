import dotenv from 'dotenv';
// Only load .env file in development, don't override existing env vars in production
dotenv.config({ override: false });

import app from './app.js';
import connectDB from './utils/db.js';
import validateEnv from './utils/validateEnv.js';
import mongoose from 'mongoose';

// Validate environment variables
validateEnv();

// Load environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error('');
    console.error('💡 Solutions:');
    console.error(`   1. Kill the process using port ${PORT}:`);
    console.error('      Get-Process -Name node | Stop-Process -Force');
    console.error('');
    console.error('   2. Change the port in server/.env:');
    console.error('      PORT=5001');
    console.error('');
    console.error(`   3. Find and kill the specific process:`);
    console.error(`      netstat -ano | findstr :${PORT}`);
    console.error('      taskkill /PID <PID> /F');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connection
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      console.log('👋 Shutdown complete');
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Promise Rejection: ${err.message}`);
  console.error(err.stack);
  // Don't exit in production, let the process manager handle it
  if (NODE_ENV === 'development') {
    server.close(() => process.exit(1));
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  gracefulShutdown('uncaughtException');
});

