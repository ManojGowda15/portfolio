import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: [true, 'Please provide a section title'],
      trim: true,
    },
    sectionDescription: {
      type: String,
      required: [true, 'Please provide a section description'],
      trim: true,
    },
    educationItems: [
      {
        degree: {
          type: String,
          required: true,
          trim: true,
        },
        institution: {
          type: String,
          trim: true,
        },
        collegeName: {
          type: String,
          required: true,
          trim: true,
        },
        year: {
          type: String,
          required: true,
          trim: true,
        },
        percentage: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
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


const Education = mongoose.model('Education', educationSchema);

export default Education;

