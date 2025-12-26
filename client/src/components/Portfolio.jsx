import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ExternalLink, X, AlertCircle } from 'lucide-react';
import { projectsAPI } from '../utils/api';

// Helper function to normalize image URLs - moved outside component to prevent recreation
const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/400x300';
  
  // If it's already a full URL, use it as is (server already normalizes it)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /images/, construct full URL
  if (imageUrl.startsWith('/images/')) {
    const baseUrl = window.location.origin;
    return `${baseUrl}${imageUrl}`;
  }
  
  // Return placeholder for invalid URLs
  return 'https://via.placeholder.com/400x300';
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('Website Design');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const filters = ['Website Design', 'App Design'];

  const [error, setError] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const category = activeFilter;
      const response = await projectsAPI.getAll(category);
      
      if (response.data.success) {
        // Server already normalizes URLs, but ensure they're accessible
        const projects = (response.data.data || []).map(project => ({
          ...project,
          image: normalizeImageUrl(project.image),
        }));
        
        setProjects(projects);
      } else {
        setError(true);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(true);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <section id="portfolio" className="py-20 sm:py-24 md:py-28 lg:py-36 section-bg-gradient-light relative overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-section-title mb-6 px-4 drop-shadow-lg">My Portfolio</h2>
          <p className="text-section-subtitle text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 leading-relaxed font-medium">
            Explore a collection of my design projects, each crafted to deliver seamless,
            user-centered experiences.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 px-4"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 sm:px-7 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base transform hover:scale-105 ${
                activeFilter === filter
                  ? 'filter-btn-active shadow-lg scale-105'
                  : 'filter-btn shadow-md hover:shadow-lg'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-body-light">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-body-light mx-auto mb-4" />
            <p className="text-primary text-lg font-semibold mb-2">Portfolio Section Not Available</p>
            <p className="text-body-light text-sm">Content is being loaded from the database. Please check back later.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary text-lg">No projects found in this category.</p>
            <p className="text-body-light text-sm mt-2">
              {`No ${activeFilter} projects available. Try selecting a different category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
            <AnimatePresence>
              {projects.map((project, index) => {
                const isAppDesign = project.category === 'App Design';
                
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`cursor-pointer group relative w-full max-w-sm transition-all duration-300 ${
                      isAppDesign ? 'flex justify-center items-center' : ''
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    {isAppDesign ? (
                      // Modern Mobile Phone Frame for App Design
                      <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[300px] mx-auto">
                        {/* Phone Frame with Modern Design - Using base color scheme */}
                        <div className="relative bg-gradient-to-br from-[#98C1d9] via-[#7BA8C4] to-[#293241] rounded-[3.5rem] p-1 sm:p-1.5 shadow-2xl ring-1 ring-[#98C1d9]/30">
                          {/* Dynamic Island / Notch - Modern Design */}
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-[#293241] rounded-full z-10 flex items-center justify-center shadow-lg">
                            <div className="w-20 h-5 bg-[#1F2530] rounded-full"></div>
                          </div>
                          
                          {/* Screen with Bezel */}
                          <div className="relative bg-[#293241] rounded-[3rem] overflow-hidden shadow-inner">
                            {/* Modern Status Bar */}
                            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#293241] via-[#1F2530] to-transparent z-20 flex items-center justify-between px-5 pt-1 text-[#E0FBFC]">
                              <span className="text-xs font-semibold">10:15</span>
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-3" viewBox="0 0 20 12" fill="none">
                                  <rect x="0" y="4" width="16" height="4" rx="1" fill="#E0FBFC" opacity="0.9"/>
                                  <path d="M16 0 L20 4 L16 8 Z" fill="#E0FBFC" opacity="0.9"/>
                                </svg>
                                <div className="w-6 h-3 border-2 border-[#E0FBFC] rounded-sm">
                                  <div className="w-full h-full bg-[#E0FBFC] rounded-sm" style={{width: '75%'}}></div>
                                </div>
                              </div>
                            </div>
                            
                            {/* App Content with Modern Look */}
                            <div className="relative h-[420px] sm:h-[520px] overflow-hidden bg-gradient-to-br from-[#E0FBFC] via-[#98C1d9] to-[#E0FBFC]">
                              <img
                                src={project.image || 'https://via.placeholder.com/400x300'}
                                alt={project.title}
                                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                                onError={(e) => {
                                  console.error('Image failed to load:', project.image);
                                  if (e.target.src !== 'https://via.placeholder.com/400x300?text=Image+Not+Available') {
                                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                  }
                                }}
                                loading="lazy"
                              />
                              {/* Modern Overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#293241]/95 via-[#293241]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex space-x-4 transform translate-y-6 group-hover:translate-y-0">
                                  <motion.div 
                                    whileHover={{ scale: 1.3, rotate: 10 }}
                                    className="bg-[#E0FBFC]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-[#E0FBFC]/20">
                                    <ZoomIn className="text-primary" size={22} />
                                  </motion.div>
                                  <motion.div 
                                    whileHover={{ scale: 1.3, rotate: -10 }}
                                    className="bg-[#E0FBFC]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-[#E0FBFC]/20">
                                    <ExternalLink className="text-primary" size={22} />
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Modern Home Indicator */}
                            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-36 h-1.5 bg-[#E0FBFC]/40 backdrop-blur-sm rounded-full z-20 border border-[#E0FBFC]/30"></div>
                          </div>
                          
                          {/* Side Buttons (Volume, Power) - Lighter design */}
                          <div className="absolute left-0 top-20 w-1 h-12 bg-[#293241]/40 rounded-r-full"></div>
                          <div className="absolute left-0 top-36 w-1 h-8 bg-[#293241]/40 rounded-r-full"></div>
                          <div className="absolute right-0 top-24 w-1 h-10 bg-[#293241]/40 rounded-l-full"></div>
                        </div>
                        
                        {/* Project Info Below Phone with Modern Styling */}
                        <div className="mt-5 text-center px-2">
                          <span className="inline-block link-primary text-xs sm:text-sm uppercase tracking-wider font-bold mb-2 px-3 py-1 badge-primary rounded-full">
                            {project.category}
                          </span>
                          <h3 className="text-primary text-base sm:text-lg font-bold mt-2 line-clamp-2 leading-tight">{project.title}</h3>
                        </div>
                      </div>
                    ) : (
                      // Regular Card for Website Design
                      <div className="card-bg rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl w-full border border-primary-light">
                        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-[rgba(152,193,217,0.1)] to-[rgba(152,193,217,0.2)]">
                          <img
                            src={project.image || 'https://via.placeholder.com/400x300'}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              console.error('Image failed to load:', project.image);
                              if (e.target.src !== 'https://via.placeholder.com/400x300?text=Image+Not+Available') {
                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                              }
                            }}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-90 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4 transform translate-y-4 group-hover:translate-y-0">
                              <motion.div 
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className="bg-white p-3 rounded-full shadow-xl">
                                <ZoomIn className="text-primary" size={24} />
                              </motion.div>
                              <motion.div 
                                whileHover={{ scale: 1.2, rotate: -5 }}
                                className="bg-white p-3 rounded-full shadow-xl">
                                <ExternalLink className="text-primary" size={24} />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 sm:p-5 md:p-6">
                          <span className="link-primary text-xs sm:text-sm uppercase tracking-wide font-semibold">
                            {project.category || 'Design'}
                          </span>
                          <h3 className="text-primary text-base sm:text-lg md:text-xl font-bold mt-2 line-clamp-2 leading-tight">{project.title}</h3>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Project Modal - Rendered via Portal to ensure it's above all content */}
        {selectedProject && createPortal(
          <AnimatePresence>
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 portfolio-modal-backdrop"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`bg-white rounded-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative portfolio-modal-content ${
                  selectedProject.category === 'App Design' ? 'max-w-2xl' : 'max-w-4xl'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-0 right-0 m-4 sm:m-6 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-100 z-[100001]"
                    aria-label="Close modal"
                    style={{ zIndex: 100001 }}
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  
                  {selectedProject.category === 'App Design' ? (
                    // Modern Mobile Phone Frame in Modal for App Design
                    <div className="flex flex-col items-center justify-center p-6 sm:p-8 section-bg-gradient pt-8 sm:pt-12">
                      <div className="relative w-full max-w-[380px] mx-auto">
                        {/* Modern Phone Frame - Using base color scheme */}
                        <div className="relative bg-gradient-to-br from-[#98C1d9] via-[#7BA8C4] to-[#293241] rounded-[4rem] p-1.5 sm:p-2 shadow-2xl ring-1 ring-[#98C1d9]/30">
                          {/* Modern Dynamic Island / Notch */}
                          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-[#293241] rounded-full z-10 flex items-center justify-center shadow-lg">
                            <div className="w-24 h-6 bg-[#1F2530] rounded-full"></div>
                          </div>
                          
                          {/* Screen with Modern Bezel */}
                          <div className="relative bg-[#293241] rounded-[3.5rem] overflow-hidden shadow-inner">
                            {/* Modern Status Bar */}
                            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#293241] via-[#1F2530] to-transparent z-20 flex items-center justify-between px-6 pt-2 text-[#E0FBFC]">
                              <span className="text-sm font-semibold">10:15</span>
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-3.5" viewBox="0 0 20 12" fill="none">
                                  <rect x="0" y="4" width="16" height="4" rx="1" fill="#E0FBFC" opacity="0.9"/>
                                  <path d="M16 0 L20 4 L16 8 Z" fill="#E0FBFC" opacity="0.9"/>
                                </svg>
                                <div className="w-7 h-3.5 border-2 border-[#E0FBFC] rounded-sm">
                                  <div className="w-full h-full bg-[#E0FBFC] rounded-sm" style={{width: '80%'}}></div>
                                </div>
                              </div>
                            </div>
                            
                            {/* App Content */}
                            <div className="relative h-[650px] sm:h-[750px] overflow-hidden bg-gradient-to-br from-[#E0FBFC] via-[#98C1d9] to-[#E0FBFC]">
                              <img
                                src={normalizeImageUrl(selectedProject.image) || 'https://via.placeholder.com/400x300'}
                                alt={selectedProject.title}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  console.error('Image failed to load:', selectedProject.image);
                                  if (e.target.src !== 'https://via.placeholder.com/400x300?text=Image+Not+Available') {
                                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                  }
                                }}
                              />
                            </div>
                            
                            {/* Modern Home Indicator */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-[#E0FBFC]/40 backdrop-blur-sm rounded-full z-20 border border-[#E0FBFC]/30"></div>
                          </div>
                          
                          {/* Side Buttons (Volume, Power) - Lighter design */}
                          <div className="absolute left-0 top-24 w-1.5 h-14 bg-[#293241]/40 rounded-r-full"></div>
                          <div className="absolute left-0 top-44 w-1.5 h-10 bg-[#293241]/40 rounded-r-full"></div>
                          <div className="absolute right-0 top-28 w-1.5 h-12 bg-[#293241]/40 rounded-l-full"></div>
                        </div>
                      </div>
                      
                      {/* Project Details Below Phone */}
                      <div className="mt-6 w-full max-w-2xl">
                        <span className="link-primary text-xs sm:text-sm uppercase tracking-wide font-semibold">
                          {selectedProject.category}
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
                          {selectedProject.title}
                        </h2>
                        <p className="text-body-light text-sm sm:text-base leading-relaxed mb-6">
                          {selectedProject.description ||
                            'This is a detailed description of the app design project. It showcases the design process, user experience considerations, and mobile-specific solutions implemented.'}
                        </p>
                        {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">Technologies:</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="badge-primary px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          {selectedProject.liveUrl && (
                            <a
                              href={selectedProject.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary px-6 sm:px-8 py-3 rounded-lg transition-colors text-center text-sm sm:text-base font-medium shadow-lg hover:shadow-xl"
                            >
                              View Live App
                            </a>
                          )}
                          {selectedProject.githubUrl && (
                            <a
                              href={selectedProject.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary px-6 sm:px-8 py-3 rounded-lg transition-colors text-center text-sm sm:text-base font-medium shadow-lg hover:shadow-xl"
                            >
                              View Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular Modal for Website Design
                    <>
                      <img
                        src={normalizeImageUrl(selectedProject.image) || 'https://via.placeholder.com/800x600'}
                        alt={selectedProject.title}
                        className="w-full h-48 sm:h-64 object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', selectedProject.image);
                          if (e.target.src !== 'https://via.placeholder.com/800x600?text=Image+Not+Available') {
                            e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                          }
                        }}
                      />
                      <div className="p-4 sm:p-6">
                        <span className="text-gray-500 text-xs sm:text-sm uppercase">
                          {selectedProject.category}
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-3 sm:mb-4">
                          {selectedProject.title}
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {selectedProject.description ||
                            'This is a detailed description of the project. It showcases the design process, challenges faced, and solutions implemented.'}
                        </p>
                        {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-base sm:text-lg font-semibold mb-2">Technologies:</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                          {selectedProject.liveUrl && (
                            <a
                              href={selectedProject.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm sm:text-base font-medium"
                            >
                              View Live
                            </a>
                          )}
                          {selectedProject.githubUrl && (
                            <a
                              href={selectedProject.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors text-center text-sm sm:text-base font-medium"
                            >
                              View Code
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  );
};

export default Portfolio;

