import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a project category'],
      enum: ['Website Design', 'App Design'],
      default: 'Website Design',
    },
    image: {
      type: String,
      required: [true, 'Please provide a project image URL'],
    },
    technologies: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;

