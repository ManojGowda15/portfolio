import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroAPI } from '../utils/api';
import { DEFAULT_HERO } from '../utils/defaults';

const Hero = () => {
  const [downloading, setDownloading] = useState(false);
  const [heroContent, setHeroContent] = useState(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await heroAPI.getHero();
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
          setHeroContent(data);
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
        // Use default values if API fails
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
        // Fallback: Open in new window/tab if blob URL fails (for HTTP connections or mobile)
        console.warn('Blob URL method failed, trying direct download:', blobError);
        // Try direct link approach
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

  return (
    <section id="home" className="min-h-screen bg-blue-50 pt-20 pb-16 relative overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-4 sm:right-10 opacity-10 hidden sm:block">
        <div className="w-32 h-32 sm:w-48 md:w-64 sm:h-48 md:h-64 border-2 border-dashed border-blue-400 rotate-45"></div>
      </div>
      <div className="absolute bottom-20 left-4 sm:left-10 opacity-10 hidden sm:block">
        <div className="w-24 h-24 sm:w-36 md:w-48 sm:h-36 md:h-48 border-2 border-dashed border-blue-400 rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-800 text-lg mb-4"
            >
              {loading ? DEFAULT_HERO.greeting : heroContent.greeting || DEFAULT_HERO.greeting}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-blue-900 mb-4"
            >
              {loading ? DEFAULT_HERO.name : heroContent.name || DEFAULT_HERO.name},
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-bold text-blue-800 mb-6"
            >
              {loading ? DEFAULT_HERO.designation : heroContent.designation || DEFAULT_HERO.designation}.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed max-w-lg"
            >
              {loading 
                ? 'With a passion for crafting clean, intuitive, and high-performing digital experiences, I develop both web and mobile applications that merge design and functionality seamlessly. From concept to deployment, I focus on creating interactive solutions that captivate users and make a lasting impression.'
                : heroContent.description || 'With a passion for crafting clean, intuitive, and high-performing digital experiences, I develop both web and mobile applications that merge design and functionality seamlessly. From concept to deployment, I focus on creating interactive solutions that captivate users and make a lasting impression.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
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
                className="bg-blue-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center text-sm sm:text-base"
              >
                Let's Talk
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
                className="bg-white text-gray-700 border-2 border-gray-300 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2" size={18} />
                    Download CV
                  </>
                )}
              </button>
            </motion.div>

            {/* Social Media Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center space-x-4"
            >
              <div className="bg-white p-3 rounded-lg shadow-md flex items-center space-x-6">
                {heroContent.linkedinUrl && (
                  <a
                    href={heroContent.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-800 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {heroContent.githubUrl && (
                  <a
                    href={heroContent.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Portrait */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="relative">
              {/* Dynamic Portrait Image - Fetched from Database */}
              {heroContent.image && heroContent.image.trim() !== '' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={heroContent.image}
                    alt={heroContent.name || 'Portrait'}
                    className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Error loading hero image:', heroContent.image);
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Available';
                    }}
                    onLoad={() => {
                      // Image loaded successfully
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
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

              {/* Customer Review Badge */}
              {/* <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute top-8 left-8 bg-white p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 font-semibold text-sm">20k+ Customer Review</p>
              </motion.div> */}

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
