import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CV from '../models/CV.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CV upload directory
const CV_DIR = path.join(__dirname, '../../public/cv');

// Ensure CV directory exists
if (!fs.existsSync(CV_DIR)) {
  fs.mkdirSync(CV_DIR, { recursive: true });
}

/**
 * Download CV
 * @route GET /api/cv
 */
export const downloadCV = async (req, res, next) => {
  try {
    // Get CV from database (most recent one)
    const cvRecord = await CV.findOne().sort({ createdAt: -1 });

    if (!cvRecord) {
      return res.status(404).json({
        success: false,
        message: 'CV not found. Please upload a CV first.',
      });
    }

    let filePath = cvRecord.filePath;
    
    // If stored path doesn't exist, try to find the file in CV directory
    if (!fs.existsSync(filePath)) {
      const files = fs.readdirSync(CV_DIR);
      const matchingFile = files.find(file => file === cvRecord.filename);
      
      if (matchingFile) {
        filePath = path.join(CV_DIR, matchingFile);
        // Update the database with correct path
        cvRecord.filePath = filePath;
        await cvRecord.save();
      } else {
        console.error('CV file not found at path:', filePath);
        // Delete the database record if file doesn't exist
        await CV.findByIdAndDelete(cvRecord._id);
        return res.status(404).json({
          success: false,
          message: 'CV file not found on server. Please upload a new CV.',
        });
      }
    }

    const fileExtension = path.extname(cvRecord.filename).toLowerCase();

    // Set appropriate content type
    let contentType = cvRecord.mimeType || 'application/pdf';
    if (fileExtension === '.doc') {
      contentType = 'application/msword';
    } else if (fileExtension === '.docx') {
      contentType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    // Use original filename and ensure proper encoding for international characters
    const originalName = cvRecord.originalName || 'CV.pdf';
    const encodedFilename = encodeURIComponent(originalName);
    // Set both formats for maximum browser compatibility
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${originalName}"; filename*=UTF-8''${encodedFilename}`
    );

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error reading CV file',
        });
      }
    });
    
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error in downloadCV:', error);
    next(error);
  }
};

/**
 * Upload CV (Admin only)
 * @route POST /api/cv/upload
 */
export const uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Verify the file was actually saved
    const uploadedFilePath = path.join(CV_DIR, req.file.filename);
    if (!fs.existsSync(uploadedFilePath)) {
      console.error('Uploaded file not found at expected path:', uploadedFilePath);
      return res.status(500).json({
        success: false,
        message: 'File upload failed. File was not saved to server.',
      });
    }

    // Get all existing CVs from database
    const existingCVs = await CV.find().sort({ createdAt: -1 });
    
    // Delete old CV records from database (keep only the latest one)
    if (existingCVs.length > 0) {
      // Delete all old CV records
      for (const oldCV of existingCVs) {
        // Delete the file from filesystem first
        try {
          if (fs.existsSync(oldCV.filePath)) {
            fs.unlinkSync(oldCV.filePath);
          }
        } catch (fsError) {
          console.error('Error deleting old CV file:', fsError);
        }
        // Delete the database record
        await CV.findByIdAndDelete(oldCV._id);
      }
    }

    // Save CV info to database
    const filePath = path.join(CV_DIR, req.file.filename);
    
    // Double-check file exists before saving to database
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        message: 'File was not saved correctly. Please try again.',
      });
    }
    
    const cvRecord = await CV.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: filePath,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(200).json({
      success: true,
      message: 'CV uploaded successfully',
      data: {
        id: cvRecord._id,
        filename: cvRecord.filename,
        originalName: cvRecord.originalName,
        fileSize: cvRecord.fileSize,
        uploadedAt: cvRecord.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in uploadCV:', error);
    next(error);
  }
};

/**
 * Get CV info (Admin only)
 * @route GET /api/cv/info
 */
export const getCVInfo = async (req, res, next) => {
  try {
    // Get most recent CV
    const cvRecord = await CV.findOne().sort({ createdAt: -1 });

    if (!cvRecord) {
      return res.status(200).json({
        success: true,
        hasCV: false,
        message: 'No CV uploaded yet',
      });
    }

    res.status(200).json({
      success: true,
      hasCV: true,
      filename: cvRecord.originalName,
      size: cvRecord.fileSize,
      uploadedAt: cvRecord.createdAt,
    });
  } catch (error) {
    console.error('Error in getCVInfo:', error);
    next(error);
  }
};

