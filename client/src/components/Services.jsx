import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, ArrowRight } from 'lucide-react';
import { servicesAPI } from '../utils/api';
import { DEFAULT_SERVICES } from '../utils/defaults';

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const [servicesContent, setServicesContent] = useState(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesContent = async () => {
      try {
        const response = await servicesAPI.getServices();
        if (response.data.success && response.data.data) {
          setServicesContent(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching services content:', error);
        // Use default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchServicesContent();
  }, []);

  // Map icon strings to actual icon components
  const iconMap = {
    Smartphone: Smartphone,
    Monitor: Monitor,
  };

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {loading ? DEFAULT_SERVICES.sectionTitle : servicesContent.sectionTitle || DEFAULT_SERVICES.sectionTitle}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {loading 
              ? DEFAULT_SERVICES.sectionDescription
              : servicesContent.sectionDescription || DEFAULT_SERVICES.sectionDescription}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
          {(loading ? servicesContent.services : (servicesContent.services || [])).sort((a, b) => (a.order || 0) - (b.order || 0)).map((service, index) => {
            const Icon = iconMap[service.icon] || Smartphone;
            const isActive = activeService === index;

            return (
              <motion.div
                key={`${service.slug}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveService(index)}
                className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-white border-2 border-blue-600 shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`p-4 rounded-lg ${
                      isActive ? 'bg-blue-100' : 'bg-gray-200'
                    }`}
                  >
                    <Icon
                      className={isActive ? 'text-blue-600' : 'text-gray-600'}
                      size={32}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {service.shortDescription}
                </p>
                <Link
                  to={`/service/${service.slug}`}
                  onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center bg-transparent border-none cursor-pointer p-0 w-full"
                >
                  Read more...
                  <ArrowRight className="ml-1" size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

