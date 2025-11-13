import axios from 'axios';

// Get API URL - use environment variable or detect from current origin
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.endsWith('/api') 
      ? process.env.REACT_APP_API_URL 
      : `${process.env.REACT_APP_API_URL}/api`;
  }
  
  // For mobile/network access, use relative URL or detect origin
  if (typeof window !== 'undefined') {
    // Use relative URL which will work on any device
    return '/api';
  }
  
  // Fallback for SSR or other cases
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not already on the login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/admin/login')) {
      sessionStorage.removeItem('token');
      // Use setTimeout to avoid navigation during render
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 0);
    }
    return Promise.reject(error);
  }
);

// API functions
export const projectsAPI = {
  getAll: (category) => api.get('/projects', { params: { category } }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  uploadImage: (formData) => api.post('/projects/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const contactAPI = {
  sendMessage: (data) => api.post('/contact', data),
  getMessages: () => api.get('/contact'),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  register: (data) => api.post('/admin/register', data),
  getMe: () => api.get('/admin/me'),
  resetPassword: (data) => api.put('/admin/reset-password', data),
};

export const cvAPI = {
  downloadCV: () => api.get('/cv', { responseType: 'blob' }),
  uploadCV: (formData) => api.post('/cv/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getCVInfo: () => api.get('/cv/info'),
};

export const heroAPI = {
  getHero: () => api.get('/hero'),
  updateHero: (data) => api.put('/hero', data),
  uploadImage: (formData) => api.post('/hero/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const aboutAPI = {
  getAbout: () => api.get('/about'),
  updateAbout: (data) => api.put('/about', data),
  uploadImage: (formData) => api.post('/about/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const servicesAPI = {
  getServices: () => api.get('/services'),
  getServiceBySlug: (slug) => api.get(`/services/${slug}`),
  updateServices: (data) => api.put('/services', data),
};

export const feedbackAPI = {
  submitFeedback: (data) => api.post('/feedback', data),
  getFeedback: () => api.get('/feedback'),
  markAsRead: (id) => api.put(`/feedback/${id}/read`),
  delete: (id) => api.delete(`/feedback/${id}`),
};

export const educationAPI = {
  getEducation: () => api.get('/education'),
  updateEducation: (data) => api.put('/education', data),
};

export default api;

