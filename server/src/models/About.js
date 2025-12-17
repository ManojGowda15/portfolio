import mongoose from 'mongoose';
import { DEFAULT_ABOUT } from '../utils/defaults.js';

const aboutSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      default: 'Passionate UI/UX Designer with a Creative Approach to Crafting Intuitive and Engaging User Experiences',
      trim: true,
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        progress: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        color: {
          type: String,
          default: 'bg-blue-600',
          trim: true,
        },
      },
    ],
    highlights: [
      {
        value: {
          type: String,
          default: '',
          trim: true,
        },
        label: {
          type: String,
          default: '',
          trim: true,
        },
        detail: {
          type: String,
          default: '',
          trim: true,
        },
      },
    ],
    mission: {
      type: String,
      default: 'Crafting meaningful products that balance stunning visuals with dependable performance.',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one about document exists
aboutSchema.statics.getAbout = async function () {
  try {
    let about = await this.findOne();
    if (!about) {
      // Create default about if none exists
      about = await this.create(DEFAULT_ABOUT);
    }
    return about;
  } catch (error) {
    console.error('Error in getAbout:', error);
    throw error;
  }
};

const About = mongoose.model('About', aboutSchema);

export default About;

