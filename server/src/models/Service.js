import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      trim: true,
    },
    sectionDescription: {
      type: String,
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
          enum: ['Smartphone', 'Monitor', 'Code'],
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
          enum: ['purple', 'green', 'blue', 'red', 'orange'],
        },
        order: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


const Service = mongoose.model('Service', serviceSchema);

export default Service;

