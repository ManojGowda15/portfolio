import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { feedbackAPI } from '../utils/api';
import { useToast } from './Toast';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    feedback: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate rating
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // Validate all required fields
    if (!formData.name || !formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.feedback || !formData.feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setLoading(true);

    try {
      const response = await feedbackAPI.submitFeedback({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        rating: formData.rating,
        feedback: formData.feedback.trim(),
      });

      if (response && response.data && response.data.success) {
        toast.success('Thank you for your feedback! Your opinion matters to us.');
        setFormData({
          name: '',
          email: '',
          rating: 0,
          feedback: '',
        });
        setHoveredRating(0);
      } else {
        throw new Error(response?.data?.message || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
      
      let errorMessage = 'Failed to submit feedback. Please try again.';
      
      if (err.response) {
        // Server responded with error
        if (err.response.data) {
          if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
            errorMessage = err.response.data.errors[0].msg || err.response.data.errors[0].message || errorMessage;
          } else if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          }
        } else if (err.response.status === 400) {
          errorMessage = 'Invalid data. Please check your input and try again.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.response.status === 404) {
          errorMessage = 'API endpoint not found. Please contact support.';
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="feedback" className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">Share Your Feedback</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            We'd love to hear from you! Your feedback helps us improve and serve you better.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 font-medium mb-3 text-sm sm:text-base">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= (hoveredRating || formData.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      } transition-colors duration-150`}
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-3 text-gray-600 text-sm font-medium">
                    {formData.rating} / 5
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label htmlFor="feedback" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
                placeholder="Tell us what you think about our portfolio, services, or any suggestions for improvement..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading || formData.rating === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Feedback;

