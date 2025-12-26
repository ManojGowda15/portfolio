import About from '../models/About.js';

/**
 * Get about content
 * @route GET /api/about
 */
export const getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found',
      });
    }

    res.status(200).json({
      success: true,
      data: about,
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
    const { description, skills, highlights, mission } = req.body;

    // Get existing about or create new one
    let about = await About.findOne();
    
    if (!about) {
      // Create new about if none exists
      about = await About.create({
        description: description || '',
        skills: skills || [],
        highlights: highlights || [],
        mission: mission || '',
      });
    } else {
      // Update existing about
      if (description !== undefined) about.description = description;
      if (skills !== undefined) about.skills = skills;
      if (highlights !== undefined) about.highlights = highlights;
      if (mission !== undefined) about.mission = mission;
      
      await about.save();
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

