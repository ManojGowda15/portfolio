/**
 * Validates required environment variables
 * Exits process if any required variables are missing
 */
const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = [];

  // Debug: Log all environment variables (masked for security)
  if (process.env.NODE_ENV === 'production') {
    console.log('🔍 Checking environment variables...');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   PORT: ${process.env.PORT || 'not set'}`);
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✓ set' : '✗ missing'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✓ set' : '✗ missing'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✓ set' : '✗ missing'}`);
  }

  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => {
      console.error(`   - ${key}`);
    });
    console.error('\n💡 In Railway/Railpack:');
    console.error('   1. Go to your service → Variables tab');
    console.error('   2. Ensure MONGODB_URI and JWT_SECRET are set');
    console.error('   3. Make sure they have actual values (not empty)');
    console.error('   4. Redeploy after adding variables');
    process.exit(1);
  }

  // Validate JWT_SECRET strength in production
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET must be at least 32 characters long in production');
      process.exit(1);
    }
  }

  console.log('✅ Environment variables validated');
};

export default validateEnv;
