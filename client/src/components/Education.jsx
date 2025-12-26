import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { educationAPI } from '../utils/api';

const Education = () => {
  const [educationContent, setEducationContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEducationContent = async () => {
      try {
        const response = await educationAPI.getEducation();
        if (response.data.success && response.data.data) {
          setEducationContent(response.data.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching education content:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationContent();
  }, []);

  const sortedItems = educationContent?.educationItems
    ? [...educationContent.educationItems].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  // Show error/empty state if no data
  if (!loading && (error || !educationContent)) {
    return (
      <section id="education" className="py-20 sm:py-24 md:py-28 lg:py-36 section-bg-gradient relative overflow-hidden">
        <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-body-light mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">Education Section Not Available</h2>
            <p className="text-body-light">Content is being loaded from the database. Please check back later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 sm:py-24 md:py-28 lg:py-36 section-bg-gradient relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[rgba(152,193,217,0.2)] to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-[rgba(152,193,217,0.2)] to-transparent"></div>
      
      <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full card-bg rounded-2xl sm:rounded-3xl border border-primary-light shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-[1.4fr_2fr]">
            {/* Left column */}
            <div className="bg-gradient-to-br from-white via-[rgba(224,251,252,0.6)] to-white p-6 sm:p-8 md:p-10 lg:p-12 border-r border-primary-light">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-section-title">
                {loading ? 'Education' : (educationContent?.sectionTitle || 'Education')}
              </h2>
              <p className="text-section-subtitle text-sm sm:text-base md:text-lg mt-3 sm:mt-4 leading-relaxed font-medium">
                {loading
                  ? 'Loading...'
                  : (educationContent?.sectionDescription || '')}
              </p>
            </div>

            {/* Right column */}
            <div className="relative bg-white p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="absolute left-4 sm:left-6 md:left-8 top-6 sm:top-8 bottom-6 sm:bottom-8 border-l-2 border-primary-light"></div>

              {loading ? (
                <div className="space-y-8">
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
                <div className="space-y-8">
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
                      <div className="absolute left-0 sm:left-1 top-6 w-3 h-3 rounded-full orb-text shadow-lg"></div>

                      <div className="highlight-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-primary">
                              {item.degree || 'Bachelor of Engineering'}
                            </h3>
                            {item.collegeName && (
                              <p className="text-body-light mt-1 text-sm sm:text-base">
                                {item.collegeName}
                              </p>
                            )}
                            {item.institution && (
                              <p className="text-body-light text-sm">{item.institution}</p>
                            )}
                            {item.description && (
                              <p className="text-body-light text-sm mt-2">{item.description}</p>
                            )}
                            {item.percentage && (
                              <span className="inline-flex items-center px-3 py-1 mt-3 rounded-full text-xs font-semibold badge-primary">
                                {item.percentage}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-primary whitespace-nowrap">
                            {item.year || '2021 - 2025'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap size={64} className="mx-auto text-body-light mb-4" />
                  <p className="text-body-light">No education information available yet.</p>
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

