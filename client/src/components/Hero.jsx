import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Download, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroAPI } from '../utils/api';

const Hero = () => {
  const [downloading, setDownloading] = useState(false);
  const [heroContent, setHeroContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await heroAPI.getHero();
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          // Server already normalizes the image URL, but ensure it's accessible
          if (data.image) {
            // If it's a relative path, make it absolute
            if (data.image.startsWith('/images/')) {
              const baseUrl = window.location.origin;
              data.image = `${baseUrl}${data.image}`;
            }
            // If it's already a full URL, use it as is (server already normalized it)
            // No need to replace localhost as server handles this
          }
          setHeroContent(data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  const handleDownloadCV = async () => {
    try {
      setDownloading(true);

      // Use relative URL or detect from current origin
      const getApiUrl = () => {
        if (process.env.REACT_APP_API_URL) {
          return process.env.REACT_APP_API_URL.endsWith('/api')
            ? process.env.REACT_APP_API_URL
            : `${process.env.REACT_APP_API_URL}/api`;
        }
        // Use relative URL which works on any device
        return '/api';
      };

      const API_URL = getApiUrl();

      // First, fetch CV info to get the original filename
      let filename = 'CV.pdf';
      try {
        const infoResponse = await fetch(`${API_URL}/cv/info`);
        if (infoResponse.ok) {
          const infoData = await infoResponse.json();
          // The filename is directly on the response object (not in data)
          if (infoData.filename) {
            filename = infoData.filename;
          }
        }
      } catch (e) {
        // Could not fetch CV info, will try to extract from headers
      }

      // Now fetch the CV file
      const response = await fetch(`${API_URL}/cv`, {
        method: 'GET',
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to Download CV';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Try to get filename from Content-Disposition header as backup
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition && filename === 'CV.pdf') {
        // Try filename*=UTF-8'' pattern first (RFC 5987)
        let filenameMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]+)/i);
        if (filenameMatch) {
          try {
            filename = decodeURIComponent(filenameMatch[1]);
          } catch (e) {
            filename = filenameMatch[1];
          }
        } else {
          // Try regular filename= pattern
          filenameMatch = contentDisposition.match(/filename=["']?([^"';\n]+)["']?/i);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
            // Remove quotes if present
            filename = filename.replace(/^["']|["']$/g, '');
            // Try to decode if it's URL encoded
            try {
              filename = decodeURIComponent(filename);
            } catch (e) {
              // If decoding fails, use as is
            }
          }
        }
      }

      // Get blob from response
      const blob = await response.blob();

      // Check if blob is valid
      if (!blob || blob.size === 0) {
        throw new Error('CV file is empty or invalid');
      }

      // For mobile browsers, use a more compatible download method
      try {
        // Try the standard blob URL method first
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        // Add attributes for better mobile support
        link.setAttribute('download', filename);
        link.setAttribute('target', '_blank');

        document.body.appendChild(link);
        link.click();

        // Clean up after a delay
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          window.URL.revokeObjectURL(url);
        }, 1000);
      } catch (blobError) {
        // Fallback to direct download if blob URL fails
        const directUrl = `${API_URL}/cv`;
        const fallbackLink = document.createElement('a');
        fallbackLink.href = directUrl;
        fallbackLink.download = filename;
        fallbackLink.target = '_blank';
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        setTimeout(() => {
          if (document.body.contains(fallbackLink)) {
            document.body.removeChild(fallbackLink);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      // Note: Toast will be available if needed, but this is in a public component
      // For now, we'll keep a simple error handling
      console.error('CV download failed:', error.message || 'Failed to Download CV');
    } finally {
      setDownloading(false);
    }
  };

  // Show error/empty state if no data
  if (!loading && (error || !heroContent)) {
    return (
      <section id="home" className="hero-section-height relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 section-bg-gradient"></div>
        <div className="relative z-10 text-center px-4">
          <AlertCircle className="w-16 h-16 text-body-light mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">Hero Section Not Available</h2>
          <p className="text-body-light">Content is being loaded from the database. Please check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="hero-section-height relative overflow-x-hidden">
      {/* Light Gradient Background */}
      <div className="absolute inset-0 section-bg-gradient"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Soft Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-10 w-72 h-72 orb-primary rounded-full mix-blend-multiply filter blur-3xl opacity-40"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute bottom-20 left-10 w-96 h-96 orb-primary rounded-full mix-blend-multiply filter blur-3xl opacity-40"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 orb-primary rounded-full mix-blend-multiply filter blur-3xl opacity-35"
      />

      {/* Content Container */}
      <div className="relative z-10 h-full md:h-full flex items-center">
        <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32 w-full pt-20 pb-4 sm:pt-24 sm:pb-6 md:py-12 lg:py-16">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-start md:items-center w-full">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 space-y-2 sm:space-y-3 md:space-y-4 w-full"
            >
              {loading ? (
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded w-64 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-24 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ) : (
                <>
                  {/* Greeting Badge */}
                  <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary-light text-primary font-semibold text-xs sm:text-sm">
                      {heroContent?.greeting || 'Hello, I\'m'}
                    </span>
                  </motion.div>

                  {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-section-title leading-tight"
            >
                    {heroContent?.name || ''}
            </motion.h1>

                  {/* Designation */}
                  <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight"
                  >
                    {heroContent?.designation || ''}
                  </motion.h2>

                  {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
                    className="text-body text-xs sm:text-sm md:text-base leading-relaxed text-left max-w-xl"
            >
                    {heroContent?.description || ''}
            </motion.p>
                </>
              )}

              {/* Contact Details & Social Links */}
              {(heroContent && (heroContent.phone || heroContent.email || heroContent.address || heroContent.linkedinUrl || heroContent.githubUrl)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
                  className="pt-3 sm:pt-4 md:pt-5 border-t border-primary-light/30"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {/* Contact Details Column */}
                    {(heroContent.phone || heroContent.email || heroContent.address) && (
                      <div className="space-y-2">
                        {heroContent?.phone && (
                          <motion.a
                            href={`tel:${heroContent.phone}`}
                            whileHover={{ scale: 1.02, x: 3 }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-primary-light/20 hover:bg-primary-light/40 transition-all duration-300 group border border-primary-light/30"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary-dark">
                              <Phone className="text-white" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-body-light font-medium uppercase tracking-wide mb-0.5">Phone</p>
                              <p className="text-primary font-semibold text-xs sm:text-sm">{heroContent.phone}</p>
                            </div>
                          </motion.a>
                        )}
                        {heroContent?.email && (
                          <motion.a
                            href={`mailto:${heroContent.email}`}
                            whileHover={{ scale: 1.02, x: 3 }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-primary-light/20 hover:bg-primary-light/40 transition-all duration-300 group border border-primary-light/30"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary-dark">
                              <Mail className="text-white" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-body-light font-medium uppercase tracking-wide mb-0.5">Email</p>
                              <p className="text-primary font-semibold text-xs sm:text-sm truncate">{heroContent.email}</p>
                            </div>
                          </motion.a>
                        )}
                        {heroContent?.address && (
                          <motion.div
                            whileHover={{ scale: 1.02, x: 3 }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-primary-light/20 hover:bg-primary-light/40 transition-all duration-300 group border border-primary-light/30"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary-dark">
                              <MapPin className="text-white" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-body-light font-medium uppercase tracking-wide mb-0.5">Address</p>
                              <p className="text-primary font-semibold text-xs sm:text-sm">{heroContent.address}</p>
                            </div>
            </motion.div>
                        )}
                      </div>
                    )}

                    {/* Social Links Column */}
                    {(heroContent.linkedinUrl || heroContent.githubUrl) && (
                      <div className="space-y-2">
                        <h3 className="text-xs text-body-light font-medium uppercase tracking-wide mb-2">Social Links</h3>
                        {heroContent?.linkedinUrl && (
                          <motion.a
                    href={heroContent.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                            whileHover={{ scale: 1.02, x: 3 }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-primary-light/20 hover:bg-primary-light/40 transition-all duration-300 group border border-primary-light/30"
                    aria-label="LinkedIn"
                  >
                            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary-dark">
                              <Linkedin className="text-white" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-body-light font-medium uppercase tracking-wide mb-0.5">LinkedIn</p>
                              <p className="text-primary font-semibold text-xs sm:text-sm">Connect with me</p>
                            </div>
                          </motion.a>
                        )}
                        {heroContent?.githubUrl && (
                          <motion.a
                    href={heroContent.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                            whileHover={{ scale: 1.02, x: 3 }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-primary-light/20 hover:bg-primary-light/40 transition-all duration-300 group border border-primary-light/30"
                    aria-label="GitHub"
                  >
                            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary-dark">
                              <Github className="text-white" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-body-light font-medium uppercase tracking-wide mb-0.5">GitHub</p>
                              <p className="text-primary font-semibold text-xs sm:text-sm">View my work</p>
                            </div>
                          </motion.a>
                        )}
                      </div>
                )}
              </div>
                </motion.div>
              )}
          </motion.div>

            {/* Right Content - Portrait & Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 order-1 md:order-2 flex flex-col items-center md:items-end justify-center mt-6 md:mt-0 w-full"
            >
              {/* Portrait Image */}
              <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto md:ml-auto md:mr-0 mb-4">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full orb-primary blur-3xl opacity-50"></div>
                <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full orb-primary blur-3xl opacity-50"></div>
              {/* Dynamic Portrait Image - Fetched from Database */}
                {heroContent?.image && heroContent.image.trim() !== '' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                    className="relative rounded-2xl overflow-visible shadow-2xl border-4 border-white"
                >
                  <img
                    src={heroContent.image}
                      alt={heroContent?.name || 'Portrait'}
                      className="w-full h-auto max-h-[180px] sm:max-h-[240px] md:max-h-[300px] lg:max-h-[350px] xl:max-h-[400px] object-contain rounded-xl"
                      loading="eager"
                    onError={e => {
                      console.error('Error loading hero image:', heroContent.image);
                      // Prevent infinite loop by checking if already set to placeholder
                      if (
                        e.target.src !==
                        'https://via.placeholder.com/400x560?text=Image+Not+Available'
                      ) {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src =
                          'https://via.placeholder.com/400x560?text=Image+Not+Available';
                      }
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
                >
                    <div className="h-[180px] sm:h-[240px] md:h-[300px] lg:h-[350px] xl:h-[400px] bg-gradient-to-br from-[rgba(224,251,252,0.5)] via-[rgba(152,193,217,0.3)] to-[rgba(224,251,252,0.5)] flex items-center justify-center rounded-xl">
                    <div className="text-center px-6">
                        <div className="w-28 h-28 gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <span className="text-4xl">👨‍💼</span>
                      </div>
                        <p className="text-primary font-semibold">Portrait Image</p>
                        <p className="text-body-light text-sm mt-2">
                        Upload an image in the admin panel
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

              {/* Action Buttons Below Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto md:mx-0 flex flex-col sm:flex-row gap-2 sm:gap-3"
              >
                <Link
                  to="#contact"
                  onClick={e => {
                    e.preventDefault();
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="btn-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 flex-1"
                >
                  <span>Let's Talk</span>
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleDownloadCV}
                  disabled={downloading}
                  className="btn-secondary px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 flex-1"
                >
                  {downloading ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="mr-2" size={16} />
                      <span>Download CV</span>
                    </>
                  )}
                </button>
              </motion.div>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
