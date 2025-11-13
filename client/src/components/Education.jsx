import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { educationAPI } from '../utils/api';

const Education = () => {
  const [educationContent, setEducationContent] = useState({
    sectionTitle: 'Education',
    sectionDescription: 'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.',
    educationItems: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducationContent = async () => {
      try {
        const response = await educationAPI.getEducation();
        if (response.data.success && response.data.data) {
          setEducationContent(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching education content:', error);
        // Use default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchEducationContent();
  }, []);

  return (
    <section id="education" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {loading ? 'Education' : educationContent.sectionTitle || 'Education'}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {loading 
              ? 'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.'
              : educationContent.sectionDescription || 'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.'}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-6 animate-pulse">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    {i < 3 && <div className="w-0.5 h-24 bg-gray-200 mt-2"></div>}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-lg p-6">
                    <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : educationContent.educationItems && educationContent.educationItems.length > 0 ? (
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              <div className="space-y-8">
                {educationContent.educationItems
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ 
                        duration: 0.6,
                        delay: index * 0.2,
                        ease: "easeOut"
                      }}
                      className="relative flex items-start space-x-6"
                    >
                      {/* Timeline Marker */}
                      <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: index * 0.2 + 0.3,
                            type: "spring",
                            stiffness: 200
                          }}
                          className="w-4 h-4 bg-teal-500 rounded-full shadow-md"
                        ></motion.div>
                      </div>

                      {/* Content Card */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: index * 0.2 + 0.1,
                          duration: 0.5
                        }}
                        className="flex-1 bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {/* Date Range */}
                        <p className="text-teal-500 text-sm font-semibold mb-2">
                          {item.year}
                        </p>
                        
                        {/* Degree Title */}
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                          {item.degree}
                        </h3>
                        
                        {/* Institution */}
                        {item.institution && (
                          <p className="text-gray-700 text-base font-medium mb-2">
                            {item.institution}
                          </p>
                        )}
                        
                        {/* College Name */}
                        {item.collegeName && (
                          <p className="text-gray-600 text-sm mb-3">
                            {item.collegeName}
                          </p>
                        )}
                        
                        {/* Description */}
                        {item.description && (
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                            {item.description}
                          </p>
                        )}
                        
                        {/* Percentage/Grade */}
                        {item.percentage && (
                          <div className="mt-3">
                            <span className="text-teal-600 text-sm font-semibold bg-teal-50 px-3 py-1 rounded-full">
                              {item.percentage}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No education information available yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Education;

