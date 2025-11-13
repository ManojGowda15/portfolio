import Hero from '../models/Hero.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get hero content
 * @route GET /api/hero
 */
export const getHero = async (req, res, next) => {
  try {
    const hero = await Hero.getHero();
    
    // Normalize image URL if it exists
    const heroData = hero.toObject();
    if (heroData.image) {
      // If it's a relative path, convert to full URL
      if (heroData.image.startsWith('/images/')) {
        const baseUrl = req.protocol + '://' + req.get('host');
        heroData.image = `${baseUrl}${heroData.image}`;
      }
    }

    res.status(200).json({
      success: true,
      data: heroData,
    });
  } catch (error) {
    console.error('Error in getHero:', error);
    next(error);
  }
};

/**
 * Update hero content (Admin only)
 * @route PUT /api/hero
 */
export const updateHero = async (req, res, next) => {
  try {
    const { greeting, name, designation, description, linkedinUrl, githubUrl, image } = req.body;

    // Normalize image URL if provided
    let imageUrl = image;
    if (imageUrl && imageUrl.startsWith('/images/')) {
      const baseUrl = req.protocol + '://' + req.get('host');
      imageUrl = `${baseUrl}${imageUrl}`;
    }

    // Get existing hero or create new one
    let hero = await Hero.findOne();
    
    if (!hero) {
      // Create new hero if none exists
      hero = await Hero.create({
        greeting: greeting || 'Hi I am',
        name: name || 'Manoj V',
        designation: designation || 'Software Developer',
        description: description || '',
        linkedinUrl: linkedinUrl || 'https://www.linkedin.com/in/manojv03/',
        githubUrl: githubUrl || 'https://github.com/ManojGowda15',
        image: imageUrl || '',
      });
    } else {
      // Update existing hero
      if (greeting !== undefined) hero.greeting = greeting;
      if (name !== undefined) hero.name = name;
      if (designation !== undefined) hero.designation = designation;
      if (description !== undefined) hero.description = description;
      if (linkedinUrl !== undefined) hero.linkedinUrl = linkedinUrl;
      if (githubUrl !== undefined) hero.githubUrl = githubUrl;
      if (imageUrl !== undefined) hero.image = imageUrl;
      
      await hero.save();
    }

    // Verify the image was saved to database (if image was provided)
    if (imageUrl !== undefined) {
      const verifiedHero = await Hero.findById(hero._id);
      if (verifiedHero && verifiedHero.image !== imageUrl) {
        console.error('ERROR: Image URL mismatch after update!', {
          expected: imageUrl,
          actual: verifiedHero.image,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Hero content updated successfully',
      data: hero,
    });
  } catch (error) {
    console.error('Error in updateHero:', error);
    next(error);
  }
};

/**
 * Upload hero image (Admin only)
 * @route POST /api/hero/upload-image
 */
export const uploadHeroImage = async (req, res, next) => {
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

    // Delete old hero image if exists
    const hero = await Hero.findOne();
    if (hero && hero.image) {
      // Extract filename from old image URL
      const oldImageUrl = hero.image;
      if (oldImageUrl.includes('/images/')) {
        const oldFilename = oldImageUrl.split('/images/')[1].split('?')[0];
        const oldFilePath = path.join(__dirname, '../../public/images', oldFilename);
        if (fs.existsSync(oldFilePath) && oldFilename.startsWith('hero-')) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (error) {
            console.error('Error deleting old hero image:', error);
          }
        }
      }
    }

    // Update hero with new image URL (save full URL to database)
    if (!hero) {
      hero = await Hero.create({ image: fullImageUrl });
    } else {
      hero.image = fullImageUrl;
      await hero.save();
    }
    
    // Verify the image was saved to database
    const updatedHero = await Hero.findById(hero._id);
    if (!updatedHero) {
      throw new Error('Failed to retrieve hero from database after save');
    }
    
    if (updatedHero.image !== fullImageUrl) {
      console.error('ERROR: Image URL mismatch in database!', {
        expected: fullImageUrl,
        actual: updatedHero.image,
      });
      throw new Error('Image URL was not saved correctly to database');
    }

    res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully and saved to database',
      data: {
        imageUrl: relativePath, // Relative path
        fullImageUrl: fullImageUrl, // Full URL (this is what's saved in DB)
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        hero: {
          id: updatedHero._id,
          image: updatedHero.image,
          imageInDB: true, // Confirmation that image is in database
        },
      },
    });
  } catch (error) {
    console.error('Error uploading hero image:', error);
    next(error);
  }
};

