import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Monitor, Smartphone, CheckCircle, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { servicesAPI } from '../utils/api';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesAPI.getServiceBySlug(serviceId);
        if (response.data.success && response.data.data) {
          setService(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  // Map icon strings to actual icon components
  const iconMap = {
    Smartphone: Smartphone,
    Monitor: Monitor,
  };

  // Default services as fallback
  const defaultServices = {
    'app-design': {
      id: 'app-design',
      title: 'App Design',
      icon: 'Smartphone',
      shortDescription: 'Designing mobile applications that are both beautiful and functional.',
      fullDescription: `I design mobile applications that users love to interact with. Whether it's iOS, Android, or cross-platform apps, I create intuitive interfaces that make complex tasks feel simple and enjoyable.

      My app design process focuses on creating seamless user flows, engaging micro-interactions, and pixel-perfect interfaces that align with platform guidelines while maintaining your unique brand identity. I ensure every screen is optimized for touch interactions and provides clear feedback to users.`,
      features: [
        'iOS & Android Design',
        'Native & Cross-Platform',
        'User Flow Optimization',
        'Micro-Interactions & Animations',
        'App Store Optimization',
        'Prototyping & Testing',
      ],
      process: [
        {
          step: '01',
          title: 'Research & Analysis',
          description: 'Studying user behavior, competitor apps, and market trends.',
        },
        {
          step: '02',
          title: 'User Flow Design',
          description: 'Mapping out user journeys and creating intuitive navigation structures.',
        },
        {
          step: '03',
          title: 'UI Design & Prototyping',
          description: 'Designing screens and creating interactive prototypes for testing.',
        },
        {
          step: '04',
          title: 'Usability Testing',
          description: 'Testing with real users to identify and fix usability issues.',
        },
        {
          step: '05',
          title: 'Handoff & Collaboration',
          description: 'Providing detailed design specs and assets for development.',
        },
      ],
      color: 'purple',
    },
    'web-design': {
      id: 'web-design',
      title: 'Web Design',
      icon: 'Monitor',
      shortDescription: 'Creating responsive and modern websites that provide excellent user experiences.',
      fullDescription: `I create stunning, responsive websites that work flawlessly across all devices and screen sizes. From landing pages to complex web applications, I design digital experiences that captivate users and drive conversions.

      My web design approach combines modern aesthetics with performance optimization, ensuring your website not only looks great but also loads quickly and ranks well in search engines. I focus on creating intuitive navigation, compelling visuals, and seamless interactions that keep visitors engaged.`,
      features: [
        'Responsive & Mobile-First Design',
        'Modern UI/UX Principles',
        'Performance Optimization',
        'SEO-Friendly Structure',
        'Cross-Browser Compatibility',
        'Content Management Integration',
      ],
      process: [
        {
          step: '01',
          title: 'Planning & Strategy',
          description: 'Defining project scope, goals, and technical requirements.',
        },
        {
          step: '02',
          title: 'Design & Mockups',
          description: 'Creating visual designs and interactive prototypes for approval.',
        },
        {
          step: '03',
          title: 'Development Preparation',
          description: 'Preparing design assets and specifications for development.',
        },
        {
          step: '04',
          title: 'Quality Assurance',
          description: 'Testing across devices and browsers to ensure perfect functionality.',
        },
        {
          step: '05',
          title: 'Launch & Support',
          description: 'Deploying the website and providing ongoing maintenance support.',
        },
      ],
      color: 'green',
    },
  };

  // Use fetched service or fallback to default
  const currentService = service || defaultServices[serviceId];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[currentService.icon] || Smartphone;
  const colorClasses = {
    blue: {
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      light: 'bg-blue-50',
      border: 'border-blue-600',
    },
    green: {
      bg: 'bg-green-600',
      text: 'text-green-600',
      light: 'bg-green-50',
      border: 'border-green-600',
    },
    purple: {
      bg: 'bg-purple-600',
      text: 'text-purple-600',
      light: 'bg-purple-50',
      border: 'border-purple-600',
    },
    orange: {
      bg: 'bg-orange-600',
      text: 'text-orange-600',
      light: 'bg-orange-50',
      border: 'border-orange-600',
    },
  };

  const colors = colorClasses[currentService.color];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className={`${colors.light} py-20 pt-32`}>
        <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Services
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
              <Icon className={colors.text} size={40} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              {currentService.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {currentService.shortDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20">
        <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {currentService.fullDescription}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What I Offer</h2>
              <p className="text-gray-600 text-lg">
                Comprehensive services tailored to your needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {currentService.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md flex items-start"
                >
                  <CheckCircle className={`${colors.text} mr-4 flex-shrink-0 mt-1`} size={24} />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">My Process</h2>
              <p className="text-gray-600 text-lg">
                A structured approach to delivering exceptional results
              </p>
            </motion.div>

            <div className="space-y-8">
              {currentService.process.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-lg">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${colors.light}`}>
        <div className="container mx-auto px-8 sm:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Let's discuss how I can help bring your vision to life with exceptional {currentService.title.toLowerCase()}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#contact"
                className={`${colors.bg} text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center`}
              >
                <Mail className="mr-2" size={20} />
                Get in Touch
              </Link>
              <Link
                to="/#portfolio"
                className="bg-gray-200 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;

