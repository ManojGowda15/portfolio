import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hero from './src/models/Hero.js';
import About from './src/models/About.js';
import Service from './src/models/Service.js';
import Project from './src/models/Project.js';
import AdminUser from './src/models/AdminUser.js';
import Message from './src/models/Message.js';
import Feedback from './src/models/Feedback.js';
import Education from './src/models/Education.js';
import CV from './src/models/CV.js';

dotenv.config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  title: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.blue}📊 ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.yellow}ℹ${colors.reset} ${msg}`),
  data: (msg) => console.log(`${colors.magenta}  ${msg}${colors.reset}`),
};

async function viewDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    log.title('MongoDB Database Viewer');
    console.log(`Connecting to: ${process.env.MONGODB_URI}`);
    
    await mongoose.connect(process.env.MONGODB_URI);
    const dbName = mongoose.connection.db.databaseName;
    
    log.success(`Connected to MongoDB`);
    log.info(`Database: ${dbName}\n`);

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    log.section(`Collections in database (${collections.length}):`);
    collections.forEach(col => {
      log.data(`  - ${col.name}`);
    });

    // View Hero
    log.section('Hero Collection');
    const hero = await Hero.findOne();
    if (hero) {
      log.success('Hero data found:');
      console.log(JSON.stringify(hero.toObject(), null, 2));
    } else {
      log.info('No hero data found');
    }

    // View About
    log.section('About Collection');
    const about = await About.findOne();
    if (about) {
      log.success('About data found:');
      console.log(JSON.stringify(about.toObject(), null, 2));
    } else {
      log.info('No about data found');
    }

    // View Services
    log.section('Services Collection');
    const services = await Service.findOne();
    if (services) {
      log.success('Services data found:');
      console.log(JSON.stringify(services.toObject(), null, 2));
    } else {
      log.info('No services data found');
    }

    // View Projects
    log.section('Projects Collection');
    const projects = await Project.find();
    log.info(`Total projects: ${projects.length}`);
    if (projects.length > 0) {
      projects.forEach((project, index) => {
        console.log(`\n  Project ${index + 1}:`);
        console.log(`    Title: ${project.title}`);
        console.log(`    Category: ${project.category}`);
        console.log(`    ID: ${project._id}`);
      });
    }

    // View Admin Users
    log.section('Admin Users Collection');
    const admins = await AdminUser.find().select('-password');
    log.info(`Total admin users: ${admins.length}`);
    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(`\n  Admin ${index + 1}:`);
        console.log(`    Username: ${admin.username}`);
        console.log(`    Email: ${admin.email}`);
        console.log(`    ID: ${admin._id}`);
      });
    }

    // View Messages
    log.section('Messages Collection');
    const messages = await Message.find();
    log.info(`Total messages: ${messages.length}`);
    if (messages.length > 0) {
      messages.forEach((message, index) => {
        console.log(`\n  Message ${index + 1}:`);
        console.log(`    From: ${message.name} (${message.email})`);
        console.log(`    Subject: ${message.subject}`);
        console.log(`    Read: ${message.read ? 'Yes' : 'No'}`);
        console.log(`    Date: ${message.createdAt}`);
      });
    }

    // View Feedback
    log.section('Feedback Collection');
    const feedbacks = await Feedback.find();
    log.info(`Total feedback entries: ${feedbacks.length}`);
    if (feedbacks.length > 0) {
      feedbacks.forEach((feedback, index) => {
        console.log(`\n  Feedback ${index + 1}:`);
        console.log(`    From: ${feedback.name} (${feedback.email})`);
        console.log(`    Rating: ${feedback.rating}/5`);
        console.log(`    Read: ${feedback.read ? 'Yes' : 'No'}`);
        console.log(`    Date: ${feedback.createdAt}`);
      });
    }

    // View Education
    log.section('Education Collection');
    const education = await Education.findOne();
    if (education) {
      log.success('Education data found:');
      console.log(JSON.stringify(education.toObject(), null, 2));
    } else {
      log.info('No education data found');
    }

    // View CV
    log.section('CV Collection');
    const cv = await CV.findOne();
    if (cv) {
      log.success('CV data found:');
      console.log(`    Filename: ${cv.filename}`);
      console.log(`    Original Name: ${cv.originalName}`);
      console.log(`    Size: ${cv.size} bytes`);
      console.log(`    Uploaded: ${cv.createdAt}`);
    } else {
      log.info('No CV data found');
    }

    // Collection Statistics
    log.section('Database Statistics');
    const stats = {
      'Hero': await Hero.countDocuments(),
      'About': await About.countDocuments(),
      'Services': await Service.countDocuments(),
      'Projects': await Project.countDocuments(),
      'Admin Users': await AdminUser.countDocuments(),
      'Messages': await Message.countDocuments(),
      'Feedback': await Feedback.countDocuments(),
      'Education': await Education.countDocuments(),
      'CV': await CV.countDocuments(),
    };

    Object.entries(stats).forEach(([name, count]) => {
      log.data(`${name}: ${count} document(s)`);
    });

    log.title('End of Database View');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
    await mongoose.connection.close();
    process.exit(1);
  }
}

viewDatabase();

