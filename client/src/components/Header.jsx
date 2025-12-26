import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, FolderKanban, Settings, MessageCircle, Linkedin, Github, ArrowRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Detect active section for menu highlighting
      const sections = ['home', 'about', 'services', 'education', 'portfolio', 'contact', 'feedback'];
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
      // Store the current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position when menu closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home', icon: Home, section: 'home' },
    { name: 'About Us', href: '#about', icon: User, section: 'about' },
    { name: 'Services', href: '#services', icon: Settings, section: 'services' },
    { name: 'Education', href: '#education', icon: GraduationCap, section: 'education' },
    { name: 'Portfolio', href: '#portfolio', icon: FolderKanban, section: 'portfolio' },
    { name: 'Feedback', href: '/feedback', icon: MessageCircle, section: 'feedback', isRoute: true },
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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white backdrop-blur-lg shadow-md border-b border-gray-100"
    >
      <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative w-12 h-12 logo-bg rounded-xl flex items-center justify-center shadow-lg mr-3 group-hover:shadow-xl transition-all"
            >
              <span className="logo-text font-bold text-lg">MV</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl"></div>
            </motion.div>
            <span className="text-primary font-bold text-xl transition-all">Manoj V</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeSection === link.section;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.href, link.isRoute)}
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-primary ${
                    isActive
                      ? 'nav-active shadow-md'
                      : 'hover:bg-primary hover:bg-opacity-50'
                  }`}
                >
                  <Icon size={18} className="text-primary" />
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full nav-active-indicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={e => handleNavClick(e, '#contact')}
              className="btn-primary px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
            >
              <MessageCircle size={18} />
              <span>Let's Talk</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden relative p-2.5 text-primary transition-colors rounded-xl hover:bg-primary"
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
                className="absolute -top-1 -right-1 w-2 h-2 nav-active-indicator rounded-full"
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
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm mobile-menu-overlay lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ zIndex: 9998 }}
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
              className="fixed top-0 left-0 h-full w-72 max-w-[85vw] mobile-menu-bg shadow-2xl mobile-menu-sidebar lg:hidden flex flex-col border-r border-primary"
              style={{ zIndex: 9999 }}
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
                  className="absolute top-0 right-0 w-64 h-64 orb-text rounded-full blur-3xl"
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
                  className="absolute bottom-0 left-0 w-48 h-48 orb-primary rounded-full blur-3xl"
                ></motion.div>
              </div>

              {/* Sidebar Header with Branding */}
              <div className="relative flex items-center justify-between p-5 border-b border-primary backdrop-blur-md mobile-menu-header">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative w-12 h-12 logo-bg rounded-xl flex items-center justify-center shadow-lg ring-2 border-primary"
                  >
                    <span className="logo-text font-bold text-lg">MV</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-primary tracking-tight">Manoj V</h2>
                    <p className="text-xs text-primary font-medium opacity-70">Software Developer</p>
                  </div>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(0,0,0,0.05)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-primary-light transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-primary" />
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
                      className={`group relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-base text-primary ${
                        isActive
                          ? 'bg-primary-light border border-primary shadow-md'
                          : 'hover:bg-primary-light shadow-sm hover:shadow-md'
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 nav-active-indicator rounded-r-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      <motion.div 
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'icon-container-active shadow-lg'
                            : 'icon-container-inactive'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon 
                          size={20} 
                          className={isActive ? 'text-white' : 'text-primary'} 
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
                          className={`text-primary transition-opacity duration-200 ${
                            isActive ? '' : 'opacity-0 group-hover:opacity-100'
                          }`} 
                        />
                      </motion.div>
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none group-hover:bg-primary group-hover:bg-opacity-10"></div>
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
                  className="text-xs text-primary mb-3 font-semibold uppercase tracking-widest px-1 opacity-70"
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
                        className="relative w-11 h-11 rounded-full social-link-bg shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 border border-primary group overflow-hidden"
                        aria-label={social.name}
                      >
                        <div className="absolute inset-0 bg-primary-light rounded-full"></div>
                        <Icon size={18} className="relative z-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:bg-opacity-20"></div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* CTA Button */}
              <div className="relative p-5 border-t border-primary backdrop-blur-md mobile-menu-header">
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
                  className="relative w-full btn-primary px-6 py-4 rounded-xl transition-all duration-300 font-semibold text-center shadow-lg hover:shadow-2xl flex items-center justify-center space-x-2 overflow-hidden group"
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
                  <div className="absolute inset-0 rounded-xl nav-active-indicator opacity-0 group-hover:opacity-20 animate-pulse"></div>
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
