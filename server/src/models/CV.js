import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Only allow one CV document
cvSchema.statics.getCurrentCV = async function () {
  try {
    const cv = await this.findOne().sort({ createdAt: -1 });
    return cv;
  } catch (error) {
    console.error('Error in getCurrentCV:', error);
    throw error;
  }
};

// Delete old CVs when a new one is uploaded
cvSchema.statics.deleteOldCVs = async function () {
  try {
    const cvs = await this.find().sort({ createdAt: -1 });
    if (cvs.length > 0) {
      // Keep only the latest one
      const latestCV = cvs[0];
      const oldCVs = cvs.slice(1);
      for (const oldCV of oldCVs) {
        await this.findByIdAndDelete(oldCV._id);
      }
    }
  } catch (error) {
    console.error('Error in deleteOldCVs:', error);
    throw error;
  }
};

const CV = mongoose.model('CV', cvSchema);

export default CV;

