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
    // Disable right-click
    const handleContextMenu = e => {
      e.preventDefault();
      return false;
    };

    // Disable text selection - only on non-input elements
    const handleSelectStart = e => {
      const target = e.target;
      if (
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        !target.isContentEditable
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag
    const handleDragStart = e => {
      e.preventDefault();
      return false;
    };

    // Disable copy (Ctrl+C, Cmd+C) - only on non-input elements
    const handleCopy = e => {
      const target = e.target;
      if (
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        !target.isContentEditable
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable cut (Ctrl+X, Cmd+X) - only on non-input elements
    const handleCut = e => {
      const target = e.target;
      if (
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        !target.isContentEditable
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable paste (Ctrl+V, Cmd+V) - only on non-input elements
    const handlePaste = e => {
      const target = e.target;
      if (
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        !target.isContentEditable
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source)
    const handleKeyDown = e => {
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
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
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
