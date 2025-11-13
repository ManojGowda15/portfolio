import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to reset admin password
 * Usage: node src/utils/resetAdminPassword.js [username] [newPassword]
 * Example: node src/utils/resetAdminPassword.js admin 123456
 */
const resetAdminPassword = async () => {
  try {
    // Connect to database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('');

    const username = process.argv[2] || 'admin';
    const newPassword = process.argv[3] || '123456';
    const normalizedUsername = username.toLowerCase().trim();

    console.log('=== Admin Password Reset ===');
    console.log('Username:', normalizedUsername);
    console.log('Password:', newPassword);
    console.log('');

    // Find admin user
    let admin = await AdminUser.findOne({ username: normalizedUsername });

    if (!admin) {
      console.log(`Admin user with username "${normalizedUsername}" not found!`);
      console.log('Creating new admin user in database...');
      console.log('');
      
      // Create admin if it doesn't exist
      admin = await AdminUser.create({
        username: normalizedUsername,
        email: `${normalizedUsername}@example.com`,
        password: newPassword,
      });
      
      console.log('✓ Admin user created and saved to database!');
      console.log('  - Username:', admin.username);
      console.log('  - Email:', admin.email);
      console.log('  - User ID:', admin._id);
      console.log('  - Created At:', admin.createdAt);
      console.log('');
    } else {
      console.log(`Admin user found in database (ID: ${admin._id})`);
      console.log('Updating password in database...');
      console.log('');
      
      // Update password - explicitly mark as modified
      admin.password = newPassword;
      admin.markModified('password');
      await admin.save();
      
      console.log('✓ Password updated in database!');
      console.log('  - Username:', admin.username);
      console.log('  - Email:', admin.email);
      console.log('  - User ID:', admin._id);
      console.log('  - Updated At:', admin.updatedAt);
      console.log('');
    }

    // Verify the credentials are stored in database
    console.log('=== Verifying Database Storage ===');
    const verifyAdmin = await AdminUser.findById(admin._id);
    
    if (!verifyAdmin) {
      console.error('✗ ERROR: Admin user not found in database after save!');
      throw new Error('Database verification failed - user not found');
    }
    
    console.log('✓ Admin user found in database');
    console.log('  - Username stored:', verifyAdmin.username);
    console.log('  - Email stored:', verifyAdmin.email);
    console.log('  - Password hash stored:', verifyAdmin.password ? 'Yes (hashed)' : 'No');
    console.log('');

    // Verify password can be validated
    console.log('=== Testing Password Validation ===');
    const testMatch = await verifyAdmin.matchPassword(newPassword);
    if (!testMatch) {
      console.error('✗ ERROR: Password validation failed!');
      console.error('  The password stored in database does not match the provided password.');
      throw new Error('Password validation failed - credentials will not work for login');
    }
    
    console.log('✓ Password validation test PASSED');
    console.log('  The stored password hash correctly validates against the provided password.');
    console.log('');

    // Final confirmation
    console.log('=== Summary ===');
    console.log('✓ Username and password have been successfully stored in the database');
    console.log('✓ Password has been properly hashed and secured');
    console.log('✓ Login validation will work with these credentials');
    console.log('');
    console.log('You can now login with:');
    console.log('  Username: ' + normalizedUsername);
    console.log('  Password: ' + newPassword);
    console.log('');

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('✗ ERROR:', error.message);
    console.error('');
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

resetAdminPassword();

