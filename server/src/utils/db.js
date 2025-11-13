import mongoose from 'mongoose';

/**
 * Connects to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please make sure:');
    console.error('1. MongoDB is running (local or Atlas)');
    console.error('2. MONGODB_URI is correct in server/.env');
    console.error('3. Network/firewall allows the connection');
    process.exit(1);
  }
};

export default connectDB;

