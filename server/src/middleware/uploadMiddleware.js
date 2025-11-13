import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CV upload directory
const CV_DIR = path.join(__dirname, '../../public/cv');

// Ensure CV directory exists
if (!fs.existsSync(CV_DIR)) {
  fs.mkdirSync(CV_DIR, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists before saving
    if (!fs.existsSync(CV_DIR)) {
      fs.mkdirSync(CV_DIR, { recursive: true });
    }
    cb(null, CV_DIR);
  },
  filename: (req, file, cb) => {
    // Keep original filename but ensure uniqueness
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `cv-${uniqueSuffix}${ext}`);
  },
});

// File filter - only allow PDF and Word documents
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF and Word documents (.pdf, .doc, .docx) are allowed.'
      ),
      false
    );
  }
};

// Configure multer
export const uploadCV = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Project image upload directory
const PROJECT_IMAGES_DIR = path.join(__dirname, '../../public/images');

// Ensure project images directory exists
if (!fs.existsSync(PROJECT_IMAGES_DIR)) {
  fs.mkdirSync(PROJECT_IMAGES_DIR, { recursive: true });
}

// Configure storage for project images
const projectImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists before saving
    if (!fs.existsSync(PROJECT_IMAGES_DIR)) {
      fs.mkdirSync(PROJECT_IMAGES_DIR, { recursive: true });
    }
    cb(null, PROJECT_IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    // Keep original filename but ensure uniqueness
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    // Check if this is a hero or about image upload (check route or custom field)
    const isHeroImage = req.originalUrl?.includes('/hero/upload-image') || req.body?.imageType === 'hero';
    const isAboutImage = req.originalUrl?.includes('/about/upload-image') || req.body?.imageType === 'about';
    let prefix = 'project';
    if (isHeroImage) prefix = 'hero';
    else if (isAboutImage) prefix = 'about';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

// File filter for images - only allow image files (case-insensitive)
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP'];
  const fileExtension = path.extname(file.originalname);
  const fileMimeType = file.mimetype ? file.mimetype.toLowerCase() : '';

  // Check MIME type (case-insensitive)
  const isValidMime = allowedMimes.some(mime => fileMimeType.includes(mime.split('/')[1]));
  
  // Check extension (case-insensitive)
  const isValidExtension = allowedExtensions.some(ext => 
    fileExtension.toLowerCase() === ext.toLowerCase()
  );

  if (isValidMime || isValidExtension) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only image files (.jpg, .jpeg, .png, .gif, .webp) are allowed.'
      ),
      false
    );
  }
};

// Configure multer for project images
export const uploadProjectImage = multer({
  storage: projectImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

