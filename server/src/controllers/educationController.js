import Education from '../models/Education.js';

/**
 * Get education content
 * @route GET /api/education
 */
export const getEducation = async (req, res, next) => {
  try {
    const education = await Education.findOne();
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education section not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    console.error('Error in getEducation:', error);
    next(error);
  }
};

/**
 * Update education content (Admin only)
 * @route PUT /api/education
 */
export const updateEducation = async (req, res, next) => {
  try {
    const { sectionTitle, sectionDescription, educationItems } = req.body;

    // Get existing education or create new one
    let education = await Education.findOne();
    
    if (!education) {
      // Create new education if none exists
      education = await Education.create({
        sectionTitle: sectionTitle || '',
        sectionDescription: sectionDescription || '',
        educationItems: educationItems || [],
      });
    } else {
      // Update existing education
      if (sectionTitle !== undefined) education.sectionTitle = sectionTitle;
      if (sectionDescription !== undefined) education.sectionDescription = sectionDescription;
      if (educationItems !== undefined) education.educationItems = educationItems;
      
      await education.save();
    }

    res.status(200).json({
      success: true,
      message: 'Education content updated successfully',
      data: education,
    });
  } catch (error) {
    console.error('Error in updateEducation:', error);
    next(error);
  }
};

