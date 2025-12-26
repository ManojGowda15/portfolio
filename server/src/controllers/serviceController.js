import Service from '../models/Service.js';

/**
 * Get services content
 * @route GET /api/services
 */
export const getServices = async (req, res, next) => {
  try {
    const service = await Service.findOne();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Services section not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error in getServices:', error);
    next(error);
  }
};

/**
 * Get single service by slug
 * @route GET /api/services/:slug
 */
export const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const service = await Service.findOne();
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Services section not found',
      });
    }
    
    const serviceItem = service.services.find(s => s.slug === slug);
    
    if (!serviceItem) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: serviceItem,
    });
  } catch (error) {
    console.error('Error in getServiceBySlug:', error);
    next(error);
  }
};

/**
 * Update services content (Admin only)
 * @route PUT /api/services
 */
export const updateServices = async (req, res, next) => {
  try {
    const { sectionTitle, sectionDescription, services } = req.body;

    // Get existing service or create new one
    let service = await Service.findOne();
    
    if (!service) {
      // Create new service if none exists
      service = await Service.create({
        sectionTitle: sectionTitle || '',
        sectionDescription: sectionDescription || '',
        services: services || [],
      });
    } else {
      // Update existing service
      if (sectionTitle !== undefined) service.sectionTitle = sectionTitle;
      if (sectionDescription !== undefined) service.sectionDescription = sectionDescription;
      if (services !== undefined) service.services = services;
      
      await service.save();
    }

    res.status(200).json({
      success: true,
      message: 'Services content updated successfully',
      data: service,
    });
  } catch (error) {
    console.error('Error in updateServices:', error);
    next(error);
  }
};

