import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, User } from 'lucide-react';
import { adminAPI } from '../utils/api';
import { useToast } from '../components/Toast';

const AdminLogin = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Check if already logged in
    const token = sessionStorage.getItem('token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

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
      if (mode === 'login') {
        const response = await adminAPI.login({
          username: formData.username,
          password: formData.password,
        });
        sessionStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        navigate('/admin');
      } else {
        if (!formData.email) {
          toast.error('Email is required to register.');
          setLoading(false);
          return;
        }

        const response = await adminAPI.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        sessionStorage.setItem('token', response.data.token);
        toast.success('Account created successfully!');
        navigate('/admin');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (mode === 'login' ? 'Invalid credentials. Please try again.' : 'Registration failed. Please try again.');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'login' ? 'Admin Login' : 'Create Admin Account';
  const subtitle =
    mode === 'login' ? 'Sign in to access the dashboard' : 'Create an account to manage your portfolio content';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mb-4 shadow-lg"
          >
            <Lock className="text-white sm:w-8 sm:h-8" size={28} />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-2">{title}</h1>
          <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
        </div>

        <div className="flex mb-6 sm:mb-8 rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
              mode === 'login' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
              mode === 'register' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" size={18} />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm sm:text-base"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={mode === 'register'}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" size={18} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm sm:text-base"
                placeholder={mode === 'login' ? 'Enter your password' : 'Choose a strong password'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 sm:py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-sm sm:text-base"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

