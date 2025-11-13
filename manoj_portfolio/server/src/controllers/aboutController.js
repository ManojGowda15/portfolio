import About from '../models/About.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get about content
 * @route GET /api/about
 */
export const getAbout = async (req, res, next) => {
  try {
    const about = await About.getAbout();
    
    // Normalize image URL if it exists
    const aboutData = about.toObject();
    if (aboutData.image) {
      // If it's a relative path, convert to full URL
      if (aboutData.image.startsWith('/images/')) {
        const baseUrl = req.protocol + '://' + req.get('host');
        aboutData.image = `${baseUrl}${aboutData.image}`;
      }
    }

    res.status(200).json({
      success: true,
      data: aboutData,
    });
  } catch (error) {
    console.error('Error in getAbout:', error);
    next(error);
  }
};

/**
 * Update about content (Admin only)
 * @route PUT /api/about
 */
export const updateAbout = async (req, res, next) => {
  try {
    const { description, skills, image } = req.body;

    // Normalize image URL if provided
    let imageUrl = image;
    if (imageUrl && imageUrl.startsWith('/images/')) {
      const baseUrl = req.protocol + '://' + req.get('host');
      imageUrl = `${baseUrl}${imageUrl}`;
    }

    // Get existing about or create new one
    let about = await About.findOne();
    
    if (!about) {
      // Create new about if none exists
      about = await About.create({
        description: description || 'Passionate UI/UX Designer with a Creative Approach to Crafting Intuitive and Engaging User Experiences',
        skills: skills || [],
        image: imageUrl || '',
      });
    } else {
      // Update existing about
      if (description !== undefined) about.description = description;
      if (skills !== undefined) about.skills = skills;
      if (imageUrl !== undefined) about.image = imageUrl;
      
      await about.save();
    }

    // Verify the image was saved to database (if image was provided)
    if (imageUrl !== undefined) {
      const verifiedAbout = await About.findById(about._id);
      if (verifiedAbout && verifiedAbout.image !== imageUrl) {
        console.error('ERROR: Image URL mismatch after update!', {
          expected: imageUrl,
          actual: verifiedAbout.image,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'About content updated successfully',
      data: about,
    });
  } catch (error) {
    console.error('Error in updateAbout:', error);
    next(error);
  }
};

/**
 * Upload about image (Admin only)
 * @route POST /api/about/upload-image
 */
export const uploadAboutImage = async (req, res, next) => {
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

    // Delete old about image if exists
    const about = await About.findOne();
    if (about && about.image) {
      // Extract filename from old image URL
      const oldImageUrl = about.image;
      if (oldImageUrl.includes('/images/')) {
        const oldFilename = oldImageUrl.split('/images/')[1].split('?')[0];
        const oldFilePath = path.join(__dirname, '../../public/images', oldFilename);
        if (fs.existsSync(oldFilePath) && oldFilename.startsWith('about-')) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (error) {
            console.error('Error deleting old about image:', error);
          }
        }
      }
    }

    // Update about with new image URL (save full URL to database)
    if (!about) {
      about = await About.create({ image: fullImageUrl });
    } else {
      about.image = fullImageUrl;
      await about.save();
    }
    
    // Verify the image was saved to database
    const updatedAbout = await About.findById(about._id);
    if (!updatedAbout) {
      throw new Error('Failed to retrieve about from database after save');
    }
    
    if (updatedAbout.image !== fullImageUrl) {
      console.error('ERROR: Image URL mismatch in database!', {
        expected: fullImageUrl,
        actual: updatedAbout.image,
      });
      throw new Error('Image URL was not saved correctly to database');
    }

    res.status(200).json({
      success: true,
      message: 'About image uploaded successfully and saved to database',
      data: {
        imageUrl: relativePath, // Relative path
        fullImageUrl: fullImageUrl, // Full URL (this is what's saved in DB)
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        about: {
          id: updatedAbout._id,
          image: updatedAbout.image,
          imageInDB: true, // Confirmation that image is in database
        },
      },
    });
  } catch (error) {
    console.error('Error uploading about image:', error);
    next(error);
  }
};

