import mongoose from 'mongoose';
import { DEFAULT_HERO } from '../utils/defaults.js';

const heroSchema = new mongoose.Schema(
  {
    greeting: {
      type: String,
      default: 'Hi I am',
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      default: 'Manoj V',
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Please provide a designation'],
      default: 'Software Developer',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      default: 'With a passion for crafting clean, intuitive, and high-performing digital experiences, I develop both web and mobile applications that merge design and functionality seamlessly. From concept to deployment, I focus on creating interactive solutions that captivate users and make a lasting impression.',
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: 'https://www.linkedin.com/in/manojv03/',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/ManojGowda15',
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one hero document exists
heroSchema.statics.getHero = async function () {
  try {
    let hero = await this.findOne();
    if (!hero) {
      // Create default hero if none exists
      hero = await this.create(DEFAULT_HERO);
    }
    return hero;
  } catch (error) {
    console.error('Error in getHero:', error);
    throw error;
  }
};

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;

