import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aboutAPI } from '../utils/api';
import { AlertCircle, Code, Palette, Rocket, Target, Award, TrendingUp } from 'lucide-react';

const About = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await aboutAPI.getAbout();
        if (response.data.success && response.data.data) {
          setAboutContent(response.data.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  // Show error/empty state if no data
  if (!loading && (error || !aboutContent)) {
    return (
      <section id="about" className="py-20 sm:py-24 md:py-28 lg:py-36 section-bg-gradient relative overflow-hidden">
        <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-body-light mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">About Section Not Available</h2>
            <p className="text-body-light">Content is being loaded from the database. Please check back later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 sm:py-24 md:py-28 lg:py-36 section-bg-gradient relative overflow-hidden">
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 orb-primary opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 orb-primary opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 orb-primary opacity-10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32 relative z-10">
        {/* Modern Header with Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-section-title mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
          {/* Left Column - Description & Mission */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 space-y-6 sm:space-y-8"
          >
            {/* Description Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-bg-light rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-primary-light relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#98C1d9]/20 to-transparent rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary">My Story</h3>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                ) : (
                  <p className="text-body text-sm sm:text-base md:text-lg leading-relaxed text-left sm:text-justify">
                    {aboutContent?.description || ''}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Mission Card */}
            {aboutContent?.mission && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="mission-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">My Mission</h3>
                  </div>
                  <p className="text-white text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                    {aboutContent.mission}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Highlights Grid */}
            {aboutContent?.highlights && aboutContent.highlights.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {aboutContent.highlights.map((item, index) => {
                  const icons = [Award, TrendingUp, Rocket, Palette];
                  const Icon = icons[index % icons.length];
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -8, rotate: 1 }}
                      className="highlight-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-primary-light shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary-light rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 bg-primary-light rounded-xl group-hover:bg-primary transition-colors duration-300">
                            <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                            className="text-3xl sm:text-4xl font-bold text-primary"
                          >
                            {item.value || ''}
                          </motion.div>
                        </div>
                        <h4 className="text-primary font-bold text-base sm:text-lg mb-1">{item.label || ''}</h4>
                        <p className="text-body-light text-xs sm:text-sm leading-relaxed">{item.detail || ''}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 card-bg-light rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-primary-light relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#98C1d9]/20 to-transparent rounded-br-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="p-2 bg-primary-light rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-section-title">Core Skills</h3>
              </div>
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5 sm:space-y-6">
                  {(aboutContent?.skills || []).map((skill, index) => {
                    // Assign unique colors to skills, ensuring Node.js and MongoDB are different
                    const getSkillColor = (skillName) => {
                      const name = skillName.toLowerCase();
                      if (name.includes('node')) return 'bg-gradient-to-r from-[#68A063] to-[#3E7C3E]'; // Dark green for Node.js
                      if (name.includes('mongo')) return 'bg-gradient-to-r from-[#4DB33D] to-[#2D7A2D]'; // Medium green for MongoDB
                      if (name.includes('mobile')) return 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5]'; // Darker indigo for Mobile Development
                      if (name.includes('react')) return 'bg-gradient-to-r from-[#61DAFB] to-[#00D8FF]';
                      if (name.includes('javascript')) return 'bg-gradient-to-r from-[#F7DF1E] to-[#F0DB4F]';
                      if (name.includes('ui') || name.includes('ux') || name.includes('design')) return 'bg-gradient-to-r from-[#9333EA] to-[#7C3AED]';
                      // Default fallback - use original color or assign a new one
                      return skill.color || 'bg-gradient-to-r from-[#98C1d9] to-[#7BA8C1]';
                    };

                    const skillColor = getSkillColor(skill.name);

                    return (
                      <motion.div
                        key={`${skill.name}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-primary font-bold text-sm sm:text-base flex items-center gap-2">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                              className="w-2 h-2 bg-primary rounded-full"
                            ></motion.div>
                            {skill.name}
                          </span>
                          <motion.span
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                            className="text-primary font-bold text-xs sm:text-sm bg-primary-light px-2.5 py-0.5 rounded-full"
                          >
                            {skill.progress}%
                          </motion.span>
                        </div>
                        <div className="w-full progress-bar-bg rounded-full h-2 sm:h-2.5 overflow-hidden shadow-inner relative">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: index * 0.15, type: 'spring', stiffness: 100 }}
                            className={`${skillColor} h-full rounded-full relative shadow-md group-hover:shadow-lg transition-all duration-300`}
                          >
                            {/* Animated shimmer effect */}
                            <motion.div
                              animate={{
                                x: ['-100%', '100%'],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                                ease: 'easeInOut',
                              }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            ></motion.div>
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 rounded-full blur-sm"></div>
                            {/* Progress indicator dot */}
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.15 + 1.2, type: 'spring' }}
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full border-2 border-primary shadow-md flex items-center justify-center"
                            >
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
