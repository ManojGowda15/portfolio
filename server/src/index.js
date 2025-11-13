import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './utils/db.js';

// Load environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

