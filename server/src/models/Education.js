import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: [true, 'Please provide a section title'],
      default: 'Education',
      trim: true,
    },
    sectionDescription: {
      type: String,
      required: [true, 'Please provide a section description'],
      default: 'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.',
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
          default: '',
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
          default: '',
          trim: true,
        },
        description: {
          type: String,
          default: '',
          trim: true,
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

// Ensure only one education document exists
educationSchema.statics.getEducation = async function () {
  try {
    let education = await this.findOne();
    if (!education) {
      // Create default education if none exists
      education = await this.create({
        sectionTitle: 'Education',
        sectionDescription: 'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.',
        educationItems: [],
      });
    }
    return education;
  } catch (error) {
    console.error('Error in getEducation:', error);
    throw error;
  }
};

const Education = mongoose.model('Education', educationSchema);

export default Education;

