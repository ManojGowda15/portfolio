import mongoose from 'mongoose';
import { DEFAULT_SERVICES } from '../utils/defaults.js';

const serviceSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      default: 'My Design Services',
      trim: true,
    },
    sectionDescription: {
      type: String,
      default: 'Crafting visually engaging interfaces that are both intuitive and user-centered, ensuring a seamless experience.',
      trim: true,
    },
    services: [
      {
        slug: {
          type: String,
          required: true,
          trim: true,
          unique: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        icon: {
          type: String,
          default: 'Smartphone', // 'Smartphone' or 'Monitor'
          enum: ['Smartphone', 'Monitor'],
        },
        shortDescription: {
          type: String,
          required: true,
          trim: true,
        },
        fullDescription: {
          type: String,
          required: true,
          trim: true,
        },
        features: [{
          type: String,
          trim: true,
        }],
        process: [{
          step: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        }],
        color: {
          type: String,
          default: 'purple',
          enum: ['purple', 'green', 'blue', 'red', 'orange'],
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure only one service document exists
serviceSchema.statics.getServices = async function () {
  try {
    let service = await this.findOne();
    if (!service) {
      // Create default services if none exists
      service = await this.create(DEFAULT_SERVICES);
    }
    return service;
  } catch (error) {
    console.error('Error in getServices:', error);
    throw error;
  }
};

const Service = mongoose.model('Service', serviceSchema);

export default Service;

