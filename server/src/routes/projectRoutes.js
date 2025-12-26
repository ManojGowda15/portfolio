import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProjectImage as uploadMiddleware } from '../middleware/uploadMiddleware.js';
import ProjectImage from '../models/ProjectImage.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Get image info from database
router.get('/images/:imageId', async (req, res, next) => {
  try {
    const image = await ProjectImage.findById(req.params.imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }
    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (Admin only)
router.post('/upload-image', protect, uploadMiddleware.single('image'), uploadProjectImage);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;

