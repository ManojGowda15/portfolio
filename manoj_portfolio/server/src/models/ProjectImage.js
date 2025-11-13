import mongoose from 'mongoose';

const projectImageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
    },
    relativePath: {
      type: String,
      required: [true, 'Relative path is required'],
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
projectImageSchema.index({ filename: 1 });
projectImageSchema.index({ createdAt: -1 });

const ProjectImage = mongoose.model('ProjectImage', projectImageSchema);

export default ProjectImage;

