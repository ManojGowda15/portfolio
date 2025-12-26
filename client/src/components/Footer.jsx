import React from 'react';
import { Instagram, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-bg-gradient text-primary py-16 sm:py-20 md:py-24 relative overflow-hidden border-t border-primary-light">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(41,50,65,0.1),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(152,193,217,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32 relative z-10">
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-12">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-24 h-10 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                Manoj V
              </div>
              <span className="ml-3 text-xl font-bold text-primary">Portfolio</span>
            </div>
            <p className="text-body-light leading-relaxed">
              Turning ideas into fast, beautiful, and user-centered web & mobile experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              <li>
                <a href="#home" className="link-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="link-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="link-primary transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#portfolio" className="link-primary transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#contact" className="link-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Follow Me</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/itzz__manoj_?igsh=MWplNm9yanQxODR5cQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 sm:w-12 sm:h-12 card-bg border border-primary-light rounded-full flex items-center justify-center hover:gradient-primary hover:border-transparent transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram size={20} className="sm:w-6 sm:h-6 text-primary hover:text-white transition-colors" />
              </a>
              <a
                href="https://github.com/ManojGowda15"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 sm:w-12 sm:h-12 card-bg border border-primary-light rounded-full flex items-center justify-center hover:gradient-primary hover:border-transparent transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="GitHub"
              >
                <Github size={20} className="sm:w-6 sm:h-6 text-primary hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/manojv03/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 sm:w-12 sm:h-12 card-bg border border-primary-light rounded-full flex items-center justify-center hover:gradient-primary hover:border-transparent transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="sm:w-6 sm:h-6 text-primary hover:text-white transition-colors" />
              </a>
              <a
                href="mailto:manojv13579@example.com"
                className="w-11 h-11 sm:w-12 sm:h-12 card-bg border border-primary-light rounded-full flex items-center justify-center hover:gradient-primary hover:border-transparent transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="Email"
              >
                <Mail size={20} className="sm:w-6 sm:h-6 text-primary hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-light pt-8 text-center">
          <p className="text-body-light">© {currentYear} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
