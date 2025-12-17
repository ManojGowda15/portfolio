import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ExternalLink, X } from 'lucide-react';
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
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Website Design', 'App Design'];

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const category = activeFilter === 'All' ? '' : activeFilter;
      const response = await projectsAPI.getAll(category);
      
      // Server already normalizes URLs, but ensure they're accessible
      const projects = (response.data.data || []).map(project => ({
        ...project,
        image: normalizeImageUrl(project.image),
      }));
      
      setProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <section id="portfolio" className="py-12 sm:py-16 md:py-20 bg-blue-50 pt-20 sm:pt-24 md:pt-32">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">My Portfolio</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Explore a collection of my design projects, each crafted to deliver seamless,
            user-centered experiences.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No projects found in this category.</p>
            <p className="text-gray-500 text-sm mt-2">
              {activeFilter === 'All' 
                ? 'Add projects through the admin panel to see them here.'
                : `No ${activeFilter} projects available. Try selecting a different category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer group relative w-full max-w-sm"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-700">
                    <img
                      src={project.image || 'https://via.placeholder.com/400x300'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Image failed to load:', project.image);
                        // Prevent infinite loop by checking if already set to placeholder
                        if (e.target.src !== 'https://via.placeholder.com/400x300?text=Image+Not+Available') {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full">
                          <ZoomIn className="text-white" size={24} />
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full">
                          <ExternalLink className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <span className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">
                      {project.category || 'Design'}
                    </span>
                    <h3 className="text-white text-lg sm:text-xl font-bold mt-2 line-clamp-2">{project.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
                    aria-label="Close modal"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <img
                    src={normalizeImageUrl(selectedProject.image) || 'https://via.placeholder.com/800x600'}
                    alt={selectedProject.title}
                    className="w-full h-48 sm:h-64 object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', selectedProject.image);
                      // Prevent infinite loop by checking if already set to placeholder
                      if (e.target.src !== 'https://via.placeholder.com/800x600?text=Image+Not+Available') {
                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                      }
                    }}
                  />
                </div>
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;

