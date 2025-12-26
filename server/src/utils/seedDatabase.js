import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hero from '../models/Hero.js';
import About from '../models/About.js';
import Service from '../models/Service.js';
import Education from '../models/Education.js';
import Project from '../models/Project.js';
import AdminUser from '../models/AdminUser.js';
import { DEFAULT_HERO, DEFAULT_ABOUT, DEFAULT_SERVICES, DEFAULT_EDUCATION, DEFAULT_PROJECTS } from './defaults.js';

dotenv.config();

/**
 * Seed script to initialize database with default data
 * Usage: 
 *   node src/utils/seedDatabase.js [adminUsername] [adminEmail] [adminPassword]
 *   node src/utils/seedDatabase.js --reset [adminUsername] [adminEmail] [adminPassword]
 */
const seedDatabase = async () => {
  try {
    // Connect to database
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check for --reset flag (npm passes it as a separate argument)
    const resetFlag = process.argv.includes('--reset') || process.argv.includes('reset');
    const args = process.argv.filter(arg => arg !== '--reset' && arg !== 'reset');
    
    console.log('\n📦 Seeding database...\n');

    // Seed Hero
    console.log('Seeding Hero data...');
    if (resetFlag) {
      await Hero.deleteMany({});
      console.log('  → Existing Hero data cleared');
    }
    let hero = await Hero.findOne();
    if (hero && !resetFlag) {
      console.log('  → Hero data already exists, skipping...');
    } else {
      if (hero && resetFlag) {
        await Hero.deleteMany({});
      }
      hero = await Hero.create(DEFAULT_HERO);
      console.log('  ✓ Hero data created successfully');
    }

    // Seed About
    console.log('Seeding About data...');
    if (resetFlag) {
      await About.deleteMany({});
      console.log('  → Existing About data cleared');
    }
    let about = await About.findOne();
    if (about && !resetFlag) {
      console.log('  → About data already exists, skipping...');
    } else {
      if (about && resetFlag) {
        await About.deleteMany({});
      }
      about = await About.create(DEFAULT_ABOUT);
      console.log('  ✓ About data created successfully');
    }

    // Seed Services
    console.log('Seeding Services data...');
    if (resetFlag) {
      await Service.deleteMany({});
      console.log('  → Existing Services data cleared');
    }
    let service = await Service.findOne();
    if (service && !resetFlag) {
      console.log('  → Services data already exists, skipping...');
    } else {
      if (service && resetFlag) {
        await Service.deleteMany({});
      }
      service = await Service.create(DEFAULT_SERVICES);
      console.log('  ✓ Services data created successfully');
    }

    // Seed Education
    console.log('Seeding Education data...');
    if (resetFlag) {
      await Education.deleteMany({});
      console.log('  → Existing Education data cleared');
    }
    let education = await Education.findOne();
    if (education && !resetFlag) {
      console.log('  → Education data already exists, skipping...');
    } else {
      if (education && resetFlag) {
        await Education.deleteMany({});
      }
      education = await Education.create(DEFAULT_EDUCATION);
      console.log('  ✓ Education data created successfully');
    }

    // Seed Projects
    console.log('Seeding Projects data...');
    if (resetFlag) {
      await Project.deleteMany({});
      console.log('  → Existing Projects data cleared');
    }
    const existingProjects = await Project.countDocuments();
    if (existingProjects > 0 && !resetFlag) {
      console.log(`  → ${existingProjects} project(s) already exist, skipping...`);
    } else {
      if (resetFlag && existingProjects > 0) {
        await Project.deleteMany({});
      }
      const projects = await Project.insertMany(DEFAULT_PROJECTS);
      console.log(`  ✓ ${projects.length} project(s) created successfully`);
    }

    // Create Admin User (optional)
    const adminUsername = args[2] || 'admin';
    const adminEmail = args[3] || 'admin@example.com';
    const adminPassword = args[4] || 'admin123';

    console.log('\nCreating Admin User...');
    const adminExists = await AdminUser.findOne({
      $or: [{ username: adminUsername }, { email: adminEmail }],
    });

    if (adminExists) {
      console.log('  → Admin user already exists, skipping...');
    } else {
      const admin = await AdminUser.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
      });
      console.log('  ✓ Admin user created successfully');
      console.log(`     Username: ${admin.username}`);
      console.log(`     Email: ${admin.email}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();

