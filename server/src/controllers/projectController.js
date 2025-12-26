import Project from '../models/Project.js';
import ProjectImage from '../models/ProjectImage.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all projects
 * @route GET /api/projects
 */
export const getProjects = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'All' ? { category } : {};
    
    const projects = await Project.find(query).sort({ createdAt: -1 });
    
    // Ensure image URLs are properly formatted and verify they exist
    const baseUrl = req.protocol + '://' + req.get('host');
    const projectsWithNormalizedUrls = await Promise.all(
      projects.map(async (project) => {
        const projectObj = project.toObject();
        
        // Normalize image URL and get image info from database
        if (projectObj.image) {
          let imageFilename = null;
          
          // Check if it's a relative path
          if (projectObj.image.startsWith('/images/')) {
            imageFilename = projectObj.image.split('/images/')[1];
            projectObj.image = `${baseUrl}${projectObj.image}`;
          } else if (projectObj.image.includes('/images/')) {
            // Extract filename from full URL
            const urlParts = projectObj.image.split('/images/');
            if (urlParts.length > 1) {
              imageFilename = urlParts[1].split('?')[0]; // Remove query params if any
            }
          }
          
          // If we found a filename, try to get image info from database
          if (imageFilename) {
            const imageRecord = await ProjectImage.findOne({ filename: imageFilename });
            if (imageRecord) {
              // Verify file still exists
              if (fs.existsSync(imageRecord.filePath)) {
                projectObj.imageInfo = {
                  id: imageRecord._id,
                  originalName: imageRecord.originalName,
                  fileSize: imageRecord.fileSize,
                  uploadedAt: imageRecord.createdAt,
                };
              } else {
                console.warn(`Image file not found: ${imageRecord.filePath}`);
              }
            }
          }
        }
        
        return projectObj;
      })
    );
    
    res.status(200).json({
      success: true,
      count: projectsWithNormalizedUrls.length,
      data: projectsWithNormalizedUrls,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single project
 * @route GET /api/projects/:id
 */
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Ensure image URL is properly formatted
    const baseUrl = req.protocol + '://' + req.get('host');
    const projectData = project.toObject();
    
    if (projectData.image) {
      let imageFilename = null;
      
      // Check if it's a relative path
      if (projectData.image.startsWith('/images/')) {
        imageFilename = projectData.image.split('/images/')[1];
        projectData.image = `${baseUrl}${projectData.image}`;
      } else if (projectData.image.includes('/images/')) {
        // Extract filename from full URL
        const urlParts = projectData.image.split('/images/');
        if (urlParts.length > 1) {
          imageFilename = urlParts[1].split('?')[0]; // Remove query params if any
        }
      }
      
      // Try to get image info from database
      if (imageFilename) {
        const imageRecord = await ProjectImage.findOne({ filename: imageFilename });
        if (imageRecord) {
          projectData.imageInfo = {
            id: imageRecord._id,
            originalName: imageRecord.originalName,
            fileSize: imageRecord.fileSize,
            uploadedAt: imageRecord.createdAt,
            fileExists: fs.existsSync(imageRecord.filePath),
          };
        }
      }
    }

    res.status(200).json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Normalize image URL - convert relative paths to full URLs if needed
 */
const normalizeImageUrl = (imageUrl, req) => {
  if (!imageUrl) return imageUrl;
  
  // If it's already a full URL (http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /images/, construct full URL
  if (imageUrl.startsWith('/images/')) {
    const baseUrl = req.protocol + '://' + req.get('host');
    return `${baseUrl}${imageUrl}`;
  }
  
  // Return as is for other cases
  return imageUrl;
};

/**
 * Create new project (Admin only)
 * @route POST /api/projects
 */
export const createProject = async (req, res, next) => {
  try {
    // Normalize image URL before saving
    let imageUrl = normalizeImageUrl(req.body.image, req);
    
    // If image is uploaded (starts with /images/), verify it exists in database
    if (imageUrl && imageUrl.startsWith('/images/')) {
      const imageFilename = imageUrl.split('/images/')[1];
      const imageRecord = await ProjectImage.findOne({ filename: imageFilename });
      
      if (imageRecord) {
        // Verify file exists on filesystem
        if (!fs.existsSync(imageRecord.filePath)) {
          return res.status(400).json({
            success: false,
            message: 'Image file not found on server. Please upload the image again.',
          });
        }
      }
    }
    
    const projectData = {
      ...req.body,
      image: imageUrl,
    };
    
    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project (Admin only)
 * @route PUT /api/projects/:id
 */
export const updateProject = async (req, res, next) => {
  try {
    // Normalize image URL before updating
    const updateData = {
      ...req.body,
    };
    
    if (req.body.image) {
      updateData.image = normalizeImageUrl(req.body.image, req);
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project (Admin only)
 * @route DELETE /api/projects/:id
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // If project uses an uploaded image, find and optionally clean it up
    if (project.image && project.image.startsWith('/images/')) {
      const imageFilename = project.image.split('/images/')[1];
      const imageRecord = await ProjectImage.findOne({ filename: imageFilename });
      
      if (imageRecord) {
        // Check if this image is used by other projects
        const otherProjects = await Project.find({
          _id: { $ne: project._id },
          image: { $regex: imageFilename },
        });
        
        // Only delete image record if not used by other projects
        if (otherProjects.length === 0) {
          // Optionally delete the file (uncomment if you want to delete files)
          // if (fs.existsSync(imageRecord.filePath)) {
          //   fs.unlinkSync(imageRecord.filePath);
          // }
          await ProjectImage.findByIdAndDelete(imageRecord._id);
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload project image (Admin only)
 * @route POST /api/projects/upload-image
 */
export const uploadProjectImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    // Verify file exists on filesystem
    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        message: 'File was not saved correctly. Please try again.',
      });
    }

    // Construct paths
    const relativePath = `/images/${req.file.filename}`;
    const baseUrl = req.protocol + '://' + req.get('host');
    const fullImageUrl = `${baseUrl}${relativePath}`;

    // Save image metadata to database
    const projectImage = await ProjectImage.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: filePath,
      relativePath: relativePath,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user?.id || null,
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully and saved to database',
      data: {
        imageId: projectImage._id,
        imageUrl: relativePath, // Relative path
        fullImageUrl: fullImageUrl, // Full URL
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: projectImage.createdAt,
      },
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    
    // If database save failed but file was uploaded, try to clean up
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    next(error);
  }
};

