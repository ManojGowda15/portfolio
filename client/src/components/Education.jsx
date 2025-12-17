import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { educationAPI } from '../utils/api';

const Education = () => {
  const [educationContent, setEducationContent] = useState({
    sectionTitle: 'Education',
    sectionDescription:
      'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.',
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

  const sortedItems = educationContent.educationItems
    ? [...educationContent.educationItems].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  return (
    <section id="education" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto bg-white rounded-[32px] border border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-[1.4fr_2fr]">
            {/* Left column */}
            <div className="bg-gradient-to-br from-white via-blue-50/60 to-white p-6 sm:p-8 md:p-10 border-r border-gray-100">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                {loading ? 'Education' : educationContent.sectionTitle || 'Education'}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mt-4 leading-relaxed">
                {loading
                  ? 'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.'
                  : educationContent.sectionDescription ||
                    'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.'}
              </p>
            </div>

            {/* Right column */}
            <div className="relative bg-white p-6 sm:p-8 md:p-10">
              <div className="absolute left-6 sm:left-8 top-8 bottom-8 border-l-2 border-blue-100"></div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="pl-10 sm:pl-12 flex items-start space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mt-2"></div>
                      <div className="flex-1 bg-gray-100 rounded-2xl p-5 animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedItems.length > 0 ? (
                <div className="space-y-6">
                  {sortedItems.map((item, index) => (
                    <motion.div
                      key={`${item.degree}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.15,
                        ease: 'easeOut',
                      }}
                      className="relative pl-10 sm:pl-12"
                    >
                      <div className="absolute left-0 sm:left-1 top-6 w-3 h-3 rounded-full bg-blue-600 shadow-lg"></div>

                      <div className="bg-gradient-to-br from-white to-blue-50/20 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {item.degree || 'Bachelor of Engineering'}
                            </h3>
                            {item.collegeName && (
                              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                {item.collegeName}
                              </p>
                            )}
                            {item.institution && (
                              <p className="text-gray-500 text-sm">{item.institution}</p>
                            )}
                            {item.description && (
                              <p className="text-gray-500 text-sm mt-2">{item.description}</p>
                            )}
                            {item.percentage && (
                              <span className="inline-flex items-center px-3 py-1 mt-3 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                {item.percentage}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                            {item.year || '2021 - 2025'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No education information available yet.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;

