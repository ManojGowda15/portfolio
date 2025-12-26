import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ServiceDetail from './pages/ServiceDetail';
import FeedbackPage from './pages/FeedbackPage';

function App() {
  useEffect(() => {
    // Check if DEVELOPMENT mode is enabled (disable right-click and text selection only in development)
    const isDevelopment = process.env.REACT_APP_DEVELOPMENT === 'true';
    
    // Disable right-click only if DEVELOPMENT is true
    const handleContextMenu = e => {
      if (isDevelopment) {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection - only on non-input elements and only if DEVELOPMENT is true
    const handleSelectStart = e => {
      if (isDevelopment) {
        const target = e.target;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Disable drag - only if DEVELOPMENT is true
    const handleDragStart = e => {
      if (isDevelopment) {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy (Ctrl+C, Cmd+C) - only on non-input elements and only if DEVELOPMENT is true
    const handleCopy = e => {
      if (isDevelopment) {
        const target = e.target;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Disable cut (Ctrl+X, Cmd+X) - only on non-input elements and only if DEVELOPMENT is true
    const handleCut = e => {
      if (isDevelopment) {
        const target = e.target;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Disable paste (Ctrl+V, Cmd+V) - only on non-input elements and only if DEVELOPMENT is true
    const handlePaste = e => {
      if (isDevelopment) {
        const target = e.target;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source) - only if DEVELOPMENT is true
    const handleKeyDown = e => {
      if (isDevelopment) {
        // F12
        if (e.keyCode === 123) {
          e.preventDefault();
          return false;
        }
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
          e.preventDefault();
          return false;
        }
        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
          e.preventDefault();
          return false;
        }
        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
          e.preventDefault();
          return false;
        }
        // Ctrl+S
        if (e.ctrlKey && e.keyCode === 83) {
          e.preventDefault();
          return false;
        }
        // Ctrl+A (select all) - only prevent on non-input elements
        if (e.ctrlKey && e.keyCode === 65) {
          const target = e.target;
          if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
          }
        }
      }
    };

    // Add event listeners - only if DEVELOPMENT is true
    if (isDevelopment) {
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('selectstart', handleSelectStart);
      document.addEventListener('dragstart', handleDragStart);
      document.addEventListener('copy', handleCopy);
      document.addEventListener('cut', handleCut);
      document.addEventListener('paste', handlePaste);
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup
    return () => {
      if (isDevelopment) {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('selectstart', handleSelectStart);
        document.removeEventListener('dragstart', handleDragStart);
        document.removeEventListener('copy', handleCopy);
        document.removeEventListener('cut', handleCut);
        document.removeEventListener('paste', handlePaste);
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service/:serviceId" element={<ServiceDetail />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
