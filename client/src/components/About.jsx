import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aboutAPI } from '../utils/api';
import { DEFAULT_ABOUT } from '../utils/defaults';

const About = () => {
  const [aboutContent, setAboutContent] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await aboutAPI.getAbout();
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          // Normalize image URL for mobile compatibility
          if (data.image) {
            // If it's a relative path, make it absolute
            if (data.image.startsWith('/images/')) {
              const baseUrl = window.location.origin;
              data.image = `${baseUrl}${data.image}`;
            }
            // If it contains localhost, replace with current origin (for mobile access)
            else if (data.image.includes('localhost') || data.image.includes('127.0.0.1')) {
              try {
                const url = new URL(data.image);
                data.image = data.image.replace(url.origin, window.location.origin);
              } catch (e) {
                // If URL parsing fails, try simple string replace
                data.image = data.image.replace(/https?:\/\/[^/]+/, window.location.origin);
              }
            }
          }
          setAboutContent(data);
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
        // Use default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Portrait and Decorative Circles */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden"
          >
            {/* Decorative Circles */}
            <div className="absolute left-0 sm:left-0 md:-left-6 top-0 sm:top-0 md:-top-6 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-blue-200 rounded-full opacity-50"></div>
            <div className="absolute left-2 sm:left-2 md:-left-3 top-2 sm:top-2 md:-top-3 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-blue-300 rounded-full opacity-50"></div>
            <div className="absolute left-4 sm:left-4 md:left-0 top-4 sm:top-4 md:top-0 w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 bg-blue-400 rounded-full opacity-50"></div>

            {/* Dynamic Portrait Image - Fetched from Database */}
            {aboutContent.image && aboutContent.image.trim() !== '' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-xl"
              >
                <img
                  src={aboutContent.image}
                  alt="About Me"
                  className="w-full h-[350px] sm:h-[400px] md:h-[500px] object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Error loading about image:', aboutContent.image);
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'https://via.placeholder.com/400x500?text=Image+Not+Available';
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="w-full h-[350px] sm:h-[400px] md:h-[500px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl text-blue-700">👨‍💼</span>
                    </div>
                    <p className="text-gray-600">Portrait Image</p>
                    <p className="text-gray-400 text-sm mt-2">Upload an image in the admin panel</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Side - Content and Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">About Me</h2>
            <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
              {loading 
                ? 'Passionate UI/UX Designer with a Creative Approach to Crafting Intuitive and Engaging User Experiences'
                : aboutContent.description || 'Passionate UI/UX Designer with a Creative Approach to Crafting Intuitive and Engaging User Experiences'}
            </p>

            {/* Skill Progress Bars */}
            <div className="space-y-6">
              {(loading ? aboutContent.skills : (aboutContent.skills || [])).map((skill, index) => (
                <motion.div
                  key={`${skill.name}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-semibold">{skill.name}</span>
                    <span className="text-gray-500 text-sm">{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`${skill.color} h-full rounded-full relative`}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
