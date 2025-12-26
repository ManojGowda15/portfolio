import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, CheckCircle, Zap, Shield, Heart, Download, Calendar } from 'lucide-react';
import { contactAPI } from '../utils/api';
import { useToast } from './Toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactAPI.sendMessage(formData);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <section id="contact" className="py-20 sm:py-24 md:py-28 lg:py-36 section-bg-gradient-alt relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 orb-primary opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 orb-primary opacity-30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column - Title & Subscribe */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 lg:space-y-12"
          >
            {/* Title Section */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-section-title mb-4 lg:mb-6 leading-tight"
              >
                Get In Touch
              </motion.h2>
            </div>

            {/* Why Work With Me Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="card-bg-light p-6 sm:p-8 rounded-2xl shadow-xl border border-primary-light relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#98C1d9]/20 to-transparent rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-primary-light rounded-xl">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary">Why Work With Me</h3>
                </div>
                
                <div className="space-y-4 sm:space-y-5">
                  {[
                    { icon: Zap, title: 'Fast Delivery', desc: 'Quick turnaround times without compromising quality' },
                    { icon: Shield, title: 'Reliable & Secure', desc: 'Robust solutions with security best practices' },
                    { icon: CheckCircle, title: 'Quality Assured', desc: 'Thorough testing and attention to detail' },
                    { icon: Heart, title: 'Client Focused', desc: 'Your success is my priority' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-primary-light/30 hover:bg-primary-light/50 transition-all duration-300 group"
                      >
                        <div className="p-2.5 bg-primary rounded-lg group-hover:bg-primary-dark transition-colors flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-primary font-bold text-sm sm:text-base mb-1">{item.title}</p>
                          <p className="text-body-light text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="pt-6 mt-6 border-t border-primary-light/50"
                >
                  <p className="text-xs text-body-light mb-4">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.a
                      href="#home"
                      onClick={(e) => {
                        e.preventDefault();
                        const heroSection = document.getElementById('home');
                        if (heroSection) {
                          const downloadBtn = heroSection.querySelector('button[aria-label*="Download"]');
                          if (downloadBtn) downloadBtn.click();
                        }
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 p-3 bg-primary-light rounded-xl hover:bg-primary transition-all duration-300 group"
                    >
                      <Download className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                      <span className="text-primary font-semibold text-xs sm:text-sm group-hover:text-white transition-colors">CV</span>
                    </motion.a>
                    <motion.a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        const form = document.querySelector('form[onSubmit]');
                        if (form) {
                          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setTimeout(() => {
                            const nameInput = form.querySelector('input[name="name"]');
                            if (nameInput) nameInput.focus();
                          }, 500);
                        }
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 p-3 bg-primary-light rounded-xl hover:bg-primary transition-all duration-300 group"
                    >
                      <Calendar className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                      <span className="text-primary font-semibold text-xs sm:text-sm group-hover:text-white transition-colors">Schedule</span>
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <form onSubmit={handleSubmit} className="card-bg-light p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-primary-light relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#98C1d9]/20 to-transparent rounded-br-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 bg-primary-light rounded-xl">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary">Send a Message</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <label htmlFor="name" className="block text-primary font-medium mb-2 text-sm sm:text-base">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 input-primary rounded-lg outline-none text-sm sm:text-base"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-primary font-medium mb-2 text-sm sm:text-base">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 input-primary rounded-lg outline-none text-sm sm:text-base"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label htmlFor="subject" className="block text-primary font-medium mb-2 text-sm sm:text-base">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 input-primary rounded-lg outline-none text-sm sm:text-base"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className="mb-6 sm:mb-8">
                  <label htmlFor="message" className="block text-primary font-medium mb-2 text-sm sm:text-base">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 input-primary rounded-lg outline-none resize-none text-sm sm:text-base"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

