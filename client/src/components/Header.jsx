import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, FolderKanban, Settings, MessageCircle, Linkedin, Github, ArrowRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Detect active section for menu highlighting
      const sections = ['home', 'about', 'services', 'education', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home', icon: Home, section: 'home' },
    { name: 'About Us', href: '#about', icon: User, section: 'about' },
    { name: 'Services', href: '#services', icon: Settings, section: 'services' },
    { name: 'Education', href: '#education', icon: GraduationCap, section: 'education' },
    { name: 'Portfolio', href: '#portfolio', icon: FolderKanban, section: 'portfolio' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/manojv03/', icon: Linkedin, color: 'text-blue-600' },
    { name: 'GitHub', url: 'https://github.com/ManojGowda15', icon: Github, color: 'text-gray-800' },
  ];

  const handleNavClick = (e, href, isRoute = false) => {
    e.preventDefault();
    if (isRoute) {
      // Handle route navigation using React Router
      setIsMobileMenuOpen(false);
      navigate(href);
      return;
    }
    if (href.startsWith('#')) {
      // If we're on a different page, navigate to home first
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            const headerHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 20;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        const element = document.querySelector(href);
        if (element) {
          const headerHeight = 80; // Header height in pixels
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight - 20; // Extra 20px spacing

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-30 h-12 rounded-lg flex items-center justify-center text-gray-800 font-bold text-xl">
              Manoj V
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={e => handleNavClick(e, link.href, link.isRoute)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={e => handleNavClick(e, '#contact')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Let's Talk
            </button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden relative p-2.5 text-gray-700 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-100/80"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
            {!isMobileMenuOpen && (
              <motion.span
                className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-gradient-to-br from-white via-blue-50/40 to-white shadow-2xl z-[70] md:hidden flex flex-col border-r border-gray-200/30"
            >
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.03, 0.05, 0.03]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl"
                ></motion.div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.03, 0.04, 0.03]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600 rounded-full blur-3xl"
                ></motion.div>
              </div>

              {/* Sidebar Header with Branding */}
              <div className="relative flex items-center justify-between p-5 border-b border-gray-200/50 bg-gradient-to-r from-white via-blue-50/40 to-white backdrop-blur-md">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-blue-200/50"
                  >
                    <span className="text-white font-bold text-lg">MV</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Manoj V</h2>
                    <p className="text-xs text-gray-500 font-medium">Software Developer</p>
                  </div>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(0,0,0,0.05)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-gray-700" />
                </motion.button>
              </div>

              {/* Navigation Links with Icons */}
              <nav className="relative flex-1 p-5 flex flex-col space-y-2 overflow-y-auto">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = activeSection === link.section;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={e => handleNavClick(e, link.href, link.isRoute)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3, type: 'spring' }}
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-base ${
                        isActive
                          ? 'text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-md border border-blue-200/50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-white/70 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-r-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      <motion.div 
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-blue-600 shadow-lg'
                            : 'bg-blue-50 group-hover:bg-blue-100'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon 
                          size={20} 
                          className={isActive ? 'text-white' : 'text-blue-600'} 
                        />
                      </motion.div>
                      
                      <span className="flex-1 font-semibold">{link.name}</span>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight 
                          size={16} 
                          className={`transition-opacity duration-200 ${
                            isActive ? 'text-blue-600' : 'text-blue-600 opacity-0 group-hover:opacity-100'
                          }`} 
                        />
                      </motion.div>
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:via-blue-400/5 group-hover:to-blue-400/10 transition-all duration-300 pointer-events-none"></div>
                    </motion.a>
                  );
                })}
              </nav>

              {/* Social Media Links */}
              <div className="relative px-5 py-4 border-t border-gray-200/50 bg-gradient-to-b from-transparent to-white/30">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-widest px-1"
                >
                  Connect
                </motion.p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: 0.45 + index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                          damping: 15
                        }}
                        whileHover={{ scale: 1.15, y: -3, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative w-11 h-11 rounded-full bg-white shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 border border-gray-200/50 group overflow-hidden"
                        aria-label={social.name}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-full"></div>
                        <Icon size={18} className={`relative z-10 ${social.color} transition-transform duration-300 group-hover:scale-110`} />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-full transition-all duration-300"></div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* CTA Button */}
              <div className="relative p-5 border-t border-gray-200/50 bg-gradient-to-b from-white/90 to-white backdrop-blur-md">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={e => {
                    handleNavClick(e, '#contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 font-semibold text-center shadow-lg hover:shadow-2xl flex items-center justify-center space-x-2 overflow-hidden group"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <MessageCircle size={20} className="relative z-10" />
                  </motion.div>
                  <span className="relative z-10">Let's Talk</span>
                  
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-xl bg-blue-600 opacity-0 group-hover:opacity-20 animate-pulse"></div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
