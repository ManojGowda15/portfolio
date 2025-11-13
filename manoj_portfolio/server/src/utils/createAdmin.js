import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to create an admin user
 * Usage: node src/utils/createAdmin.js
 */
const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@example.com';
    const password = process.argv[4] || 'admin123';

    // Check if admin already exists
    const adminExists = await AdminUser.findOne({
      $or: [{ username }, { email }],
    });

    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit(1);
    }

    // Create admin
    const admin = await AdminUser.create({
      username,
      email,
      password,
    });

    console.log('Admin user created successfully!');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();

