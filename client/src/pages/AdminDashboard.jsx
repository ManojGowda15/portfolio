import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  X,
  Save,
  XCircle,
  FolderKanban,
  Mail,
  FileText,
  Image,
  User,
  Settings,
  Menu,
  X as XIcon,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';
import { projectsAPI, contactAPI, adminAPI, cvAPI, heroAPI, aboutAPI, servicesAPI, feedbackAPI, educationAPI } from '../utils/api';
import ImageCropper from '../components/ImageCropper';
import { useToast } from '../components/Toast';
// Empty form structures for AdminDashboard initialization
const EMPTY_HERO = {
  greeting: '',
  name: '',
  designation: '',
  description: '',
  linkedinUrl: '',
  githubUrl: '',
  image: '',
  phone: '',
  email: '',
  address: '',
};

const EMPTY_ABOUT = {
  description: '',
  skills: [],
  highlights: [],
  mission: '',
};

const EMPTY_SERVICES = {
  sectionTitle: '',
  sectionDescription: '',
  services: [],
};

const EMPTY_PROJECT = {
  title: '',
  description: '',
  category: 'Website Design',
  image: '',
  technologies: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [cvInfo, setCvInfo] = useState(null);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [heroContent, setHeroContent] = useState(EMPTY_HERO);
  const [savingHero, setSavingHero] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [aboutContent, setAboutContent] = useState(EMPTY_ABOUT);
  const [savingAbout, setSavingAbout] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState(null);
  const [cropperType, setCropperType] = useState(null); // currently only 'hero'
  const [cropperAspectRatio, setCropperAspectRatio] = useState(null);
  const [servicesContent, setServicesContent] = useState(EMPTY_SERVICES);
  const [savingServices, setSavingServices] = useState(false);
  const [educationContent, setEducationContent] = useState({
    sectionTitle: '',
    sectionDescription: '',
    educationItems: [],
  });
  const [savingEducation, setSavingEducation] = useState(false);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getMessages();
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getFeedback();
      setFeedback(response.data.data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCVInfo = useCallback(async () => {
    try {
      const response = await cvAPI.getCVInfo();
      setCvInfo(response.data);
    } catch (error) {
      console.error('Error fetching CV info:', error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem('token');
        navigate('/admin/login');
      }
    }
  }, [navigate]);

  const fetchHeroContent = useCallback(async () => {
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
              data.image = data.image.replace(/https?:\/\/[^/]+/, window.location.origin);
            }
          }
        }
        setHeroContent(data);
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
    }
  }, []);

  const fetchAboutContent = useCallback(async () => {
    try {
      const response = await aboutAPI.getAbout();
      if (response.data.success && response.data.data) {
        setAboutContent(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  }, []);

  const fetchServicesContent = useCallback(async () => {
    try {
      const response = await servicesAPI.getServices();
      if (response.data.success && response.data.data) {
        setServicesContent(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching services content:', error);
    }
  }, []);

  const fetchEducationContent = useCallback(async () => {
    try {
      const response = await educationAPI.getEducation();
      if (response.data.success && response.data.data) {
        setEducationContent(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching education content:', error);
    }
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        await adminAPI.getMe();
        // Auth successful, fetch initial data
        // Fetch messages and feedback for unread count
        fetchMessages();
        fetchFeedback();
        // Fetch initial tab data
        if (activeTab === 'projects') {
          fetchProjects();
        } else if (activeTab === 'cv') {
          fetchCVInfo();
        } else if (activeTab === 'hero') {
          fetchHeroContent();
        } else if (activeTab === 'about') {
          fetchAboutContent();
        } else if (activeTab === 'services') {
          fetchServicesContent();
        } else if (activeTab === 'education') {
          fetchEducationContent();
        } else if (activeTab === 'feedback') {
          fetchFeedback();
        }
        setIsInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/admin/login');
        }
        setLoading(false);
      }
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Fetch data when tab changes (but only if authenticated and initialized)
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token || !isInitialized) return;

    if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'feedback') {
      fetchFeedback();
    } else if (activeTab === 'cv') {
      fetchCVInfo();
    } else if (activeTab === 'hero') {
      fetchHeroContent();
    } else if (activeTab === 'about') {
      fetchAboutContent();
    } else if (activeTab === 'services') {
      fetchServicesContent();
    } else if (activeTab === 'education') {
      fetchEducationContent();
    }
    // Note: fetch functions are stable useCallbacks, so they don't need to be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isInitialized]);

  // Note: Removed beforeunload token clearing as it was too aggressive
  // Token will be cleared on explicit logout or 401 errors only

  const handleCVUpload = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      toast.error('Please select a file');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = cvFile.name.toLowerCase().substring(cvFile.name.lastIndexOf('.'));

    if (
      !allowedTypes.includes(cvFile.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      toast.error('Invalid file type. Only PDF and Word documents (.pdf, .doc, .docx) are allowed.');
      return;
    }

    // Validate file size (10MB)
    if (cvFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploadingCV(true);
      const formData = new FormData();
      formData.append('cv', cvFile);

      await cvAPI.uploadCV(formData);
      toast.success('CV uploaded successfully!');
      setCvFile(null);
      // Reset file input
      const fileInput = document.getElementById('cv-file-input');
      if (fileInput) {
        fileInput.value = '';
      }
      // Refresh CV info after a short delay to ensure DB is updated
      setTimeout(() => {
        fetchCVInfo();
      }, 500);
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to upload CV. Please try again.'
      );
    } finally {
      setUploadingCV(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/admin/login');
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        toast.success('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image,
      technologies: project.technologies?.join(', ') || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
    });
    setShowProjectModal(true);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setProjectForm(EMPTY_PROJECT);
    setShowProjectModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    
    // Check if image file is selected but not uploaded
    if (projectImageFile && !projectForm.image) {
      toast.error('Please upload the selected image first, or remove it and use an image URL instead.');
      return;
    }
    
    // Validate that image is provided (either URL or uploaded)
    if (!projectForm.image || projectForm.image.trim() === '') {
      toast.error('Please provide an image URL or upload an image file.');
      return;
    }
    
    try {
      const projectData = {
        ...projectForm,
        technologies: projectForm.technologies
          .split(',')
          .map((tech) => tech.trim())
          .filter((tech) => tech),
      };

      if (editingProject) {
        await projectsAPI.update(editingProject._id, projectData);
      } else {
        await projectsAPI.create(projectData);
      }

      setShowProjectModal(false);
      setProjectImageFile(null);
      const fileInput = document.getElementById('project-image-input');
      if (fileInput) {
        fileInput.value = '';
      }
      toast.success(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save project';
      toast.error(`Failed to save project: ${errorMessage}`);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactAPI.delete(id);
        toast.success('Message deleted successfully!');
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.delete(id);
        toast.success('Feedback deleted successfully!');
        fetchFeedback();
      } catch (error) {
        console.error('Error deleting feedback:', error);
        toast.error('Failed to delete feedback');
      }
    }
  };

  const handleMarkFeedbackAsRead = async (id) => {
    try {
      await feedbackAPI.markAsRead(id);
      fetchFeedback();
    } catch (error) {
      console.error('Error marking feedback as read:', error);
    }
  };

  const handleHeroImageUpload = async (file) => {
    if (!file) {
      return;
    }

    // Validate file type - more lenient check
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const fileType = file.type.toLowerCase();

    // Check both MIME type and extension (case-insensitive)
    const isValidType = allowedTypes.some(type => fileType.includes(type.split('/')[1])) || 
                        allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      toast.error('Invalid file type. Please upload an image file (JPG, PNG, GIF, or WEBP).');
      const fileInput = document.getElementById('hero-image-input');
      if (fileInput) {
        fileInput.value = '';
      }
      setHeroImageFile(null);
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Please upload an image smaller than 5MB.');
      const fileInput = document.getElementById('hero-image-input');
      if (fileInput) {
        fileInput.value = '';
      }
      setHeroImageFile(null);
      return;
    }

    // Show cropper instead of directly uploading
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropperImageSrc(e.target.result);
      setCropperType('hero');
      setCropperAspectRatio(null); // Free aspect ratio for hero
      setShowCropper(true);
    };
    reader.onerror = () => {
      toast.error('Failed to read image file. Please try again.');
      setHeroImageFile(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = async (croppedBlob) => {
    if (!croppedBlob || !cropperType) {
      return;
    }

    try {
      if (cropperType === 'hero') {
        setUploadingHeroImage(true);
        const formData = new FormData();
        formData.append('image', croppedBlob, 'hero-image.jpg');
        formData.append('imageType', 'hero');

        const response = await heroAPI.uploadImage(formData);
        
        const imageUrl = response.data.data.fullImageUrl || response.data.data.imageUrl;
        let finalImageUrl = imageUrl;
        if (imageUrl) {
          // If it's a relative path, make it absolute
          if (imageUrl.startsWith('/images/')) {
            const baseUrl = window.location.origin;
            finalImageUrl = `${baseUrl}${imageUrl}`;
          }
          // If it contains localhost, replace with current origin (for mobile access)
          else if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
            try {
              const url = new URL(imageUrl);
              finalImageUrl = imageUrl.replace(url.origin, window.location.origin);
            } catch (e) {
              finalImageUrl = imageUrl.replace(/https?:\/\/[^/]+/, window.location.origin);
            }
          }
        }
        
        setHeroContent({ ...heroContent, image: finalImageUrl });
        setHeroImageFile(null);
        toast.success('Hero image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingHeroImage(false);
      setShowCropper(false);
      setCropperImageSrc(null);
      setCropperType(null);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid file type. Only image files (.jpg, .jpeg, .png, .gif, .webp) are allowed.');
      const fileInput = document.getElementById('project-image-input');
      if (fileInput) {
        fileInput.value = '';
      }
      setProjectImageFile(null);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      const fileInput = document.getElementById('project-image-input');
      if (fileInput) {
        fileInput.value = '';
      }
      setProjectImageFile(null);
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await projectsAPI.uploadImage(formData);
      
      // Use the fullImageUrl from server response (image is now saved in database)
      const imageUrl = response.data.data.fullImageUrl || response.data.data.imageUrl;
      
      // Normalize image URL for mobile compatibility
      let finalImageUrl = imageUrl;
      if (imageUrl) {
        // If it's a relative path, make it absolute
        if (imageUrl.startsWith('/images/')) {
          const baseUrl = window.location.origin;
          finalImageUrl = `${baseUrl}${imageUrl}`;
        }
        // If it contains localhost, replace with current origin (for mobile access)
        else if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
          try {
            const url = new URL(imageUrl);
            finalImageUrl = imageUrl.replace(url.origin, window.location.origin);
          } catch (e) {
            finalImageUrl = imageUrl.replace(/https?:\/\/[^/]+/, window.location.origin);
          }
        }
      }
      
      // Store the image URL in the form (this will be saved to project in database)
      setProjectForm({ ...projectForm, image: finalImageUrl });
      toast.success('Project image uploaded successfully!');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image. Please try again.');
      const fileInput = document.getElementById('project-image-input');
      if (fileInput) {
        fileInput.value = '';
      }
      setProjectImageFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  // Calculate statistics
  const unreadMessages = messages.filter(m => !m.read).length;
  const unreadFeedback = feedback.filter(f => !f.read).length;
  const totalProjects = projects.length;

  if (loading && projects.length === 0 && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'messages', label: 'Messages', icon: Mail, badge: unreadMessages },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: unreadFeedback },
    { id: 'cv', label: 'CV Management', icon: FileText },
    { id: 'hero', label: 'Hero Section', icon: Image },
    { id: 'about', label: 'About Section', icon: User },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'education', label: 'Education', icon: GraduationCap },
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        bg-white shadow-xl transition-all duration-300 flex flex-col
        fixed lg:static inset-y-0 left-0 z-50
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
          )}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false); // Close mobile menu on item click
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
                  {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your portfolio content</p>
              </div>
            </div>
          </div>
        </header>

        {/* Statistics Cards - Only show on projects tab */}
        {activeTab === 'projects' && (
          <div className="px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Projects</p>
                  <p className="text-3xl font-bold">{totalProjects}</p>
                </div>
                <FolderKanban size={40} className="opacity-80" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Total Messages</p>
                  <p className="text-3xl font-bold">{messages.length}</p>
                </div>
                <Mail size={40} className="opacity-80" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Unread Messages</p>
                  <p className="text-3xl font-bold">{unreadMessages}</p>
                </div>
                <Clock size={40} className="opacity-80" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your portfolio projects</p>
              </div>
              <button
                onClick={handleAddProject}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium"
              >
                <Plus size={20} />
                <span>Add Project</span>
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FolderKanban size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Yet</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first project</p>
                <button
                  onClick={handleAddProject}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <Plus size={20} />
                  <span>Add Your First Project</span>
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image || 'https://via.placeholder.com/400x300'}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2 font-medium shadow-md"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center space-x-2 font-medium shadow-md"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
              <p className="text-gray-500 text-sm mt-1">View and manage contact messages</p>
            </div>
            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Mail size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages Yet</h3>
                <p className="text-gray-500">Messages from your contact form will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all ${
                      !message.read ? 'border-l-4 border-blue-600 bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{message.name}</h3>
                          {!message.read && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{message.email}</p>
                        <p className="text-gray-800 font-semibold mb-2 text-lg">{message.subject}</p>
                        <p className="text-gray-600 leading-relaxed">{message.message}</p>
                        <p className="text-gray-400 text-sm mt-4 flex items-center space-x-2">
                          <Clock size={14} />
                          <span>{new Date(message.createdAt).toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {!message.read && (
                          <button
                            onClick={() => handleMarkAsRead(message._id)}
                            className="bg-blue-100 text-blue-600 p-3 rounded-xl hover:bg-blue-200 transition-colors"
                            title="Mark as read"
                          >
                            <Eye size={20} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Feedback</h2>
              <p className="text-gray-500 text-sm mt-1">View and manage user feedback</p>
            </div>
            {feedback.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Feedback Yet</h3>
                <p className="text-gray-500">Feedback from users will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all ${
                      !item.read ? 'border-l-4 border-yellow-500 bg-yellow-50/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                          {!item.read && (
                            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.email}</p>
                        
                        {/* Rating Display */}
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-gray-700 font-semibold">Rating:</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={18}
                                className={
                                  star <= item.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-gray-600 text-sm">({item.rating}/5)</span>
                        </div>
                        
                        <p className="text-gray-800 leading-relaxed mb-4">{item.feedback}</p>
                        <p className="text-gray-400 text-sm mt-4 flex items-center space-x-2">
                          <Clock size={14} />
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {!item.read && (
                          <button
                            onClick={() => handleMarkFeedbackAsRead(item._id)}
                            className="bg-blue-100 text-blue-600 p-3 rounded-xl hover:bg-blue-200 transition-colors"
                            title="Mark as read"
                          >
                            <Eye size={20} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteFeedback(item._id)}
                          className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-colors"
                          title="Delete feedback"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CV Management Tab */}
        {activeTab === 'cv' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">CV Management</h2>
              <p className="text-gray-500 text-sm mt-1">Upload and manage your CV file</p>
            </div>

            {/* Current CV Card */}
            {cvInfo && cvInfo.hasCV ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                      <FileText size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Current CV</h3>
                      <p className="text-green-100 text-sm">Your most recent CV file</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-green-100 text-sm font-medium mb-1">Filename</p>
                      <p className="text-white font-semibold text-lg">{cvInfo.filename}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <TrendingUp size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-green-100 text-sm font-medium mb-1">File Size</p>
                        <p className="text-white font-semibold">{(cvInfo.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Clock size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-green-100 text-sm font-medium mb-1">Uploaded</p>
                        <p className="text-white font-semibold">{new Date(cvInfo.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-8"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-4 rounded-2xl">
                    <FileText size={32} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-800 mb-1">No CV Uploaded</h3>
                    <p className="text-yellow-700">Upload your CV file to get started</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Upload New CV</h3>
                <p className="text-gray-500 text-sm">Replace your current CV with a new file</p>
              </div>

              <form onSubmit={handleCVUpload} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Select CV File
                  </label>
                  <div className="relative">
                    <input
                      id="cv-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all hover:border-blue-400 cursor-pointer"
                      required
                    />
                    {cvFile && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
                        <FileText size={20} className="text-blue-600" />
                        <span className="text-blue-700 font-medium">{cvFile.name}</span>
                        <span className="text-blue-500 text-sm">({(cvFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
                    <FileText size={16} />
                    <span>Accepted formats: PDF, DOC, DOCX</span>
                    <span className="mx-2">•</span>
                    <span>Max size: 10MB</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploadingCV || !cvFile}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  {uploadingCV ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading CV...</span>
                    </>
                  ) : (
                    <>
                      <Save size={24} />
                      <span>Upload CV</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Hero Section</h2>
              <p className="text-gray-500 text-sm mt-1">Customize your hero section content</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setSavingHero(true);
                    await heroAPI.updateHero(heroContent);
                    toast.success('Hero content updated successfully!');
                  } catch (error) {
                    console.error('Error updating hero content:', error);
                    toast.error(error.response?.data?.message || 'Failed to update hero content');
                  } finally {
                    setSavingHero(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Greeting</label>
                  <input
                    type="text"
                    value={heroContent.greeting}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, greeting: e.target.value })
                    }
                    placeholder="Hi I am"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={heroContent.name}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, name: e.target.value })
                    }
                    placeholder="Manoj V"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Designation</label>
                  <input
                    type="text"
                    value={heroContent.designation}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, designation: e.target.value })
                    }
                    placeholder="Software Developer"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={heroContent.description}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, description: e.target.value })
                    }
                    placeholder="With a passion for crafting clean, intuitive, and high-performing digital experiences..."
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={heroContent.linkedinUrl}
                      onChange={(e) =>
                        setHeroContent({ ...heroContent, linkedinUrl: e.target.value })
                      }
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={heroContent.githubUrl}
                      onChange={(e) =>
                        setHeroContent({ ...heroContent, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/yourusername"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                      type="text"
                      value={heroContent.phone || ''}
                      onChange={(e) =>
                        setHeroContent({ ...heroContent, phone: e.target.value })
                      }
                      placeholder="+91-9638527415"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="text"
                      value={heroContent.email || ''}
                      onChange={(e) =>
                        setHeroContent({ ...heroContent, email: e.target.value })
                      }
                      placeholder="info@domain_name.com / email@gmail.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  <textarea
                    value={heroContent.address || ''}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, address: e.target.value })
                    }
                    placeholder="456 Maple Avenue, Los Angeles, CA 90001, United States"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Hero Image</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={heroContent.image}
                        onChange={(e) =>
                          setHeroContent({ ...heroContent, image: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg or upload below"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="text-center text-gray-500">OR</div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Upload Image</label>
                      <input
                        id="hero-image-input"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setHeroImageFile(file);
                            await handleHeroImageUpload(file);
                          }
                        }}
                        disabled={uploadingHeroImage}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {uploadingHeroImage && (
                        <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Uploading image...
                        </p>
                      )}
                      {heroImageFile && !uploadingHeroImage && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ {heroImageFile.name} uploaded successfully
                        </p>
                      )}
                    </div>
                    {heroContent.image && (
                      <div className="mt-4">
                        <label className="block text-sm text-gray-600 mb-2">Preview</label>
                        <img
                          src={heroContent.image}
                          alt="Hero preview"
                          className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingHero}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {savingHero ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Hero Content</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* About Section Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">About Section</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your about section content</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setSavingAbout(true);
                    await aboutAPI.updateAbout(aboutContent);
                    toast.success('About content updated successfully!');
                  } catch (error) {
                    console.error('Error updating about content:', error);
                    toast.error(error.response?.data?.message || 'Failed to update about content');
                  } finally {
                    setSavingAbout(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={aboutContent.description}
                    onChange={(e) =>
                      setAboutContent({ ...aboutContent, description: e.target.value })
                    }
                    placeholder="Passionate UI/UX Designer with a Creative Approach to Crafting Intuitive and Engaging User Experiences"
                    rows={3}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-gray-700 font-medium">Skills</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAboutContent({
                          ...aboutContent,
                          skills: [
                            ...aboutContent.skills,
                            { name: '', progress: 0, color: 'bg-blue-600' },
                          ],
                        });
                      }}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      + Add Skill
                    </button>
                  </div>
                  <div className="space-y-4">
                    {aboutContent.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 space-y-3"
                      >
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Skill Name</label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const newSkills = [...aboutContent.skills];
                                newSkills[index].name = e.target.value;
                                setAboutContent({ ...aboutContent, skills: newSkills });
                              }}
                              placeholder="e.g., Java"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Progress (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={skill.progress}
                              onChange={(e) => {
                                const newSkills = [...aboutContent.skills];
                                newSkills[index].progress = parseInt(e.target.value) || 0;
                                setAboutContent({ ...aboutContent, skills: newSkills });
                              }}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Color</label>
                            <select
                              value={skill.color}
                              onChange={(e) => {
                                const newSkills = [...aboutContent.skills];
                                newSkills[index].color = e.target.value;
                                setAboutContent({ ...aboutContent, skills: newSkills });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            >
                              <option value="bg-red-600">Red</option>
                              <option value="bg-orange-500">Orange</option>
                              <option value="bg-orange-600">Orange Dark</option>
                              <option value="bg-purple-600">Purple</option>
                              <option value="bg-blue-600">Blue</option>
                              <option value="bg-gray-500">Gray</option>
                              <option value="bg-red-500">Red Light</option>
                              <option value="bg-green-600">Green</option>
                              <option value="bg-yellow-500">Yellow</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = aboutContent.skills.filter((_, i) => i !== index);
                            setAboutContent({ ...aboutContent, skills: newSkills });
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove Skill
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-gray-700 font-medium">Highlights</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAboutContent({
                          ...aboutContent,
                          highlights: [
                            ...(aboutContent.highlights || []),
                            { value: '', label: '', detail: '' },
                          ],
                        });
                      }}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      + Add Highlight
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(aboutContent.highlights || []).map((highlight, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 space-y-3"
                      >
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Value</label>
                            <input
                              type="text"
                              value={highlight.value || ''}
                              onChange={(e) => {
                                const newHighlights = [...(aboutContent.highlights || [])];
                                newHighlights[index].value = e.target.value;
                                setAboutContent({ ...aboutContent, highlights: newHighlights });
                              }}
                              placeholder="e.g., 5+"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Label</label>
                            <input
                              type="text"
                              value={highlight.label || ''}
                              onChange={(e) => {
                                const newHighlights = [...(aboutContent.highlights || [])];
                                newHighlights[index].label = e.target.value;
                                setAboutContent({ ...aboutContent, highlights: newHighlights });
                              }}
                              placeholder="e.g., Years of Experience"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Detail</label>
                            <input
                              type="text"
                              value={highlight.detail || ''}
                              onChange={(e) => {
                                const newHighlights = [...(aboutContent.highlights || [])];
                                newHighlights[index].detail = e.target.value;
                                setAboutContent({ ...aboutContent, highlights: newHighlights });
                              }}
                              placeholder="e.g., Building digital products"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newHighlights = (aboutContent.highlights || []).filter((_, i) => i !== index);
                            setAboutContent({ ...aboutContent, highlights: newHighlights });
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove Highlight
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Mission Statement</label>
                  <textarea
                    value={aboutContent.mission || ''}
                    onChange={(e) =>
                      setAboutContent({ ...aboutContent, mission: e.target.value })
                    }
                    placeholder="Crafting meaningful products that balance stunning visuals with dependable performance."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingAbout}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {savingAbout ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save About Content</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Education Section Tab */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Education Section</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your education content</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setSavingEducation(true);
                    await educationAPI.updateEducation(educationContent);
                    toast.success('Education content updated successfully!');
                  } catch (error) {
                    console.error('Error updating education content:', error);
                    toast.error(error.response?.data?.message || 'Failed to update education content');
                  } finally {
                    setSavingEducation(false);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Section Title</label>
                  <input
                    type="text"
                    value={educationContent.sectionTitle}
                    onChange={(e) =>
                      setEducationContent({ ...educationContent, sectionTitle: e.target.value })
                    }
                    placeholder="Education"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Section Description</label>
                  <textarea
                    value={educationContent.sectionDescription}
                    onChange={(e) =>
                      setEducationContent({ ...educationContent, sectionDescription: e.target.value })
                    }
                    placeholder="All my life I have been driven by my strong belief that education is important. I try to learn something new every single day."
                    rows={3}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <label className="block text-gray-700 font-bold text-lg">Education Items</label>
                      <p className="text-sm text-gray-500 mt-1">Add your educational qualifications</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEducationContent({
                          ...educationContent,
                          educationItems: [
                            ...educationContent.educationItems,
                            {
                              degree: '',
                              institution: '',
                              collegeName: '',
                              year: '',
                              percentage: '',
                              description: '',
                              order: educationContent.educationItems.length,
                            },
                          ],
                        });
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center space-x-2"
                    >
                      <Plus size={18} />
                      <span>Add Education</span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {educationContent.educationItems.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-center mb-2 pb-4 border-b-2 border-blue-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                              <GraduationCap size={20} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Education {itemIndex + 1}</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = educationContent.educationItems.filter((_, i) => i !== itemIndex);
                              setEducationContent({ ...educationContent, educationItems: newItems });
                            }}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex items-center space-x-2"
                          >
                            <Trash2 size={16} />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Degree *</label>
                            <input
                              type="text"
                              value={item.degree}
                              onChange={(e) => {
                                const newItems = [...educationContent.educationItems];
                                newItems[itemIndex].degree = e.target.value;
                                setEducationContent({ ...educationContent, educationItems: newItems });
                              }}
                              placeholder="e.g., Bachelor of Engineering"
                              required
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Institution/University (Optional)</label>
                            <input
                              type="text"
                              value={item.institution || ''}
                              onChange={(e) => {
                                const newItems = [...educationContent.educationItems];
                                newItems[itemIndex].institution = e.target.value;
                                setEducationContent({ ...educationContent, educationItems: newItems });
                              }}
                              placeholder="e.g., Visvesvaraya Technological University"
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">College Name *</label>
                          <input
                            type="text"
                            value={item.collegeName || ''}
                            onChange={(e) => {
                              const newItems = [...educationContent.educationItems];
                              newItems[itemIndex].collegeName = e.target.value;
                              setEducationContent({ ...educationContent, educationItems: newItems });
                            }}
                            placeholder="e.g., Vivekananda Institute of Technology"
                            required
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                          <textarea
                            value={item.description || ''}
                            onChange={(e) => {
                              const newItems = [...educationContent.educationItems];
                              newItems[itemIndex].description = e.target.value;
                              setEducationContent({ ...educationContent, educationItems: newItems });
                            }}
                            placeholder="Additional details about this education (e.g., Major, Honors, Achievements, Specializations)"
                            rows={3}
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm transition-all resize-none"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                            <input
                              type="text"
                              value={item.year}
                              onChange={(e) => {
                                const newItems = [...educationContent.educationItems];
                                newItems[itemIndex].year = e.target.value;
                                setEducationContent({ ...educationContent, educationItems: newItems });
                              }}
                              placeholder="e.g., 2011 - 2015"
                              required
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Percentage/Grade</label>
                            <input
                              type="text"
                              value={item.percentage}
                              onChange={(e) => {
                                const newItems = [...educationContent.educationItems];
                                newItems[itemIndex].percentage = e.target.value;
                                setEducationContent({ ...educationContent, educationItems: newItems });
                              }}
                              placeholder="e.g., 85% or 3.8/4.0"
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm transition-all"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                          <input
                            type="number"
                            value={item.order || 0}
                            onChange={(e) => {
                              const newItems = [...educationContent.educationItems];
                              newItems[itemIndex].order = parseInt(e.target.value) || 0;
                              setEducationContent({ ...educationContent, educationItems: newItems });
                            }}
                            className="w-full max-w-xs px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm transition-all"
                            placeholder="0"
                          />
                          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingEducation}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {savingEducation ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Education Content</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Services Section Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Services Section</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your services content</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setSavingServices(true);
                    await servicesAPI.updateServices(servicesContent);
                    toast.success('Services content updated successfully!');
                  } catch (error) {
                    console.error('Error updating services content:', error);
                    toast.error(error.response?.data?.message || 'Failed to update services content');
                  } finally {
                    setSavingServices(false);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Section Title</label>
                  <input
                    type="text"
                    value={servicesContent.sectionTitle}
                    onChange={(e) =>
                      setServicesContent({ ...servicesContent, sectionTitle: e.target.value })
                    }
                    placeholder="My Design Services"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Section Description</label>
                  <textarea
                    value={servicesContent.sectionDescription}
                    onChange={(e) =>
                      setServicesContent({ ...servicesContent, sectionDescription: e.target.value })
                    }
                    placeholder="Crafting visually engaging interfaces that are both intuitive and user-centered, ensuring a seamless experience."
                    rows={3}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-gray-700 font-medium">Services</label>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesContent({
                          ...servicesContent,
                          services: [
                            ...servicesContent.services,
                            {
                              slug: '',
                              title: '',
                              icon: 'Smartphone',
                              shortDescription: '',
                              fullDescription: '',
                              features: [],
                              process: [],
                              color: 'purple',
                              order: servicesContent.services.length,
                            },
                          ],
                        });
                      }}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      + Add Service
                    </button>
                  </div>
                  <div className="space-y-6">
                    {servicesContent.services.map((service, serviceIndex) => (
                      <div
                        key={serviceIndex}
                        className="border border-gray-200 rounded-lg p-6 space-y-4"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Service {serviceIndex + 1}</h3>
                          <button
                            type="button"
                            onClick={() => {
                              const newServices = servicesContent.services.filter((_, i) => i !== serviceIndex);
                              setServicesContent({ ...servicesContent, services: newServices });
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove Service
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Slug (URL)</label>
                            <input
                              type="text"
                              value={service.slug}
                              onChange={(e) => {
                                const newServices = [...servicesContent.services];
                                newServices[serviceIndex].slug = e.target.value;
                                setServicesContent({ ...servicesContent, services: newServices });
                              }}
                              placeholder="app-design"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Title</label>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => {
                                const newServices = [...servicesContent.services];
                                newServices[serviceIndex].title = e.target.value;
                                setServicesContent({ ...servicesContent, services: newServices });
                              }}
                              placeholder="App Design"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Icon</label>
                            <select
                              value={service.icon}
                              onChange={(e) => {
                                const newServices = [...servicesContent.services];
                                newServices[serviceIndex].icon = e.target.value;
                                setServicesContent({ ...servicesContent, services: newServices });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            >
                              <option value="Smartphone">Smartphone</option>
                              <option value="Monitor">Monitor</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Color</label>
                            <select
                              value={service.color}
                              onChange={(e) => {
                                const newServices = [...servicesContent.services];
                                newServices[serviceIndex].color = e.target.value;
                                setServicesContent({ ...servicesContent, services: newServices });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                            >
                              <option value="purple">Purple</option>
                              <option value="green">Green</option>
                              <option value="blue">Blue</option>
                              <option value="red">Red</option>
                              <option value="orange">Orange</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Short Description</label>
                          <textarea
                            value={service.shortDescription}
                            onChange={(e) => {
                              const newServices = [...servicesContent.services];
                              newServices[serviceIndex].shortDescription = e.target.value;
                              setServicesContent({ ...servicesContent, services: newServices });
                            }}
                            placeholder="Designing mobile applications that are both beautiful and functional..."
                            rows={2}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Full Description</label>
                          <textarea
                            value={service.fullDescription}
                            onChange={(e) => {
                              const newServices = [...servicesContent.services];
                              newServices[serviceIndex].fullDescription = e.target.value;
                              setServicesContent({ ...servicesContent, services: newServices });
                            }}
                            placeholder="I design mobile applications that users love to interact with..."
                            rows={4}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm text-gray-600">Features</label>
                            <button
                              type="button"
                              onClick={() => {
                                const newServices = [...servicesContent.services];
                                if (!newServices[serviceIndex].features) {
                                  newServices[serviceIndex].features = [];
                                }
                                newServices[serviceIndex].features.push('');
                                setServicesContent({ ...servicesContent, services: newServices });
                              }}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            >
                              + Add Feature
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(service.features || []).map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={feature}
                                  onChange={(e) => {
                                    const newServices = [...servicesContent.services];
                                    newServices[serviceIndex].features[featureIndex] = e.target.value;
                                    setServicesContent({ ...servicesContent, services: newServices });
                                  }}
                                  placeholder="e.g., iOS & Android Design"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newServices = [...servicesContent.services];
                                    newServices[serviceIndex].features = newServices[serviceIndex].features.filter((_, i) => i !== featureIndex);
                                    setServicesContent({ ...servicesContent, services: newServices });
                                  }}
                                  className="text-red-600 hover:text-red-700 px-2"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm text-gray-600">Process Steps</label>
                            <button
                              type="button"
                              onClick={() => {
                                const newServices = [...servicesContent.services];
                                if (!newServices[serviceIndex].process) {
                                  newServices[serviceIndex].process = [];
                                }
                                newServices[serviceIndex].process.push({
                                  step: String(newServices[serviceIndex].process.length + 1).padStart(2, '0'),
                                  title: '',
                                  description: '',
                                });
                                setServicesContent({ ...servicesContent, services: newServices });
                              }}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            >
                              + Add Step
                            </button>
                          </div>
                          <div className="space-y-3">
                            {(service.process || []).map((step, stepIndex) => (
                              <div key={stepIndex} className="border border-gray-200 rounded p-3 space-y-2">
                                <div className="grid md:grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    value={step.step}
                                    onChange={(e) => {
                                      const newServices = [...servicesContent.services];
                                      newServices[serviceIndex].process[stepIndex].step = e.target.value;
                                      setServicesContent({ ...servicesContent, services: newServices });
                                    }}
                                    placeholder="01"
                                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                                  />
                                  <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => {
                                      const newServices = [...servicesContent.services];
                                      newServices[serviceIndex].process[stepIndex].title = e.target.value;
                                      setServicesContent({ ...servicesContent, services: newServices });
                                    }}
                                    placeholder="Step Title"
                                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newServices = [...servicesContent.services];
                                      newServices[serviceIndex].process = newServices[serviceIndex].process.filter((_, i) => i !== stepIndex);
                                      setServicesContent({ ...servicesContent, services: newServices });
                                    }}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <textarea
                                  value={step.description}
                                  onChange={(e) => {
                                    const newServices = [...servicesContent.services];
                                    newServices[serviceIndex].process[stepIndex].description = e.target.value;
                                    setServicesContent({ ...servicesContent, services: newServices });
                                  }}
                                  placeholder="Step description"
                                  rows={2}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Order (Display Order)</label>
                          <input
                            type="number"
                            value={service.order || 0}
                            onChange={(e) => {
                              const newServices = [...servicesContent.services];
                              newServices[serviceIndex].order = parseInt(e.target.value) || 0;
                              setServicesContent({ ...servicesContent, services: newServices });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingServices}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {savingServices ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Services Content</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, description: e.target.value })
                  }
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    <option value="Website Design">Website Design</option>
                    <option value="App Design">App Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Image</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={projectForm.image}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, image: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="text-center text-gray-500">OR</div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Upload Image</label>
                      <input
                        id="project-image-input"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setProjectImageFile(file);
                            // Auto-upload when file is selected
                            await handleImageUpload(file);
                          }
                        }}
                        disabled={uploadingImage}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {uploadingImage && (
                        <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Uploading image...
                        </p>
                      )}
                      {projectImageFile && !uploadingImage && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ {projectImageFile.name} uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, technologies: e.target.value })
                  }
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Live URL</label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, liveUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, githubUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectForm.featured}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, featured: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                />
                <label htmlFor="featured" className="ml-2 text-gray-700 font-medium">
                  Featured Project
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 font-medium"
                >
                  <Save size={20} />
                  <span>Save Project</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <XCircle size={20} />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && cropperImageSrc && (
        <ImageCropper
          imageSrc={cropperImageSrc}
          aspectRatio={cropperAspectRatio}
          onCropComplete={handleCroppedImage}
          onCancel={() => {
            setShowCropper(false);
            setCropperImageSrc(null);
            setCropperType(null);
            setHeroImageFile(null);
            // Reset file inputs
            const heroInput = document.getElementById('hero-image-input');
            if (heroInput) heroInput.value = '';
          }}
        />
      )}
    </>
  );
};

export default AdminDashboard;

