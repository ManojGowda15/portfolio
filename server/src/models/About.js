import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please provide a description'],
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
          trim: true,
        },
      },
    ],
    highlights: [
      {
        value: {
          type: String,
          trim: true,
        },
        label: {
          type: String,
          trim: true,
        },
        detail: {
          type: String,
          trim: true,
        },
      },
    ],
    mission: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


const About = mongoose.model('About', aboutSchema);

export default About;

