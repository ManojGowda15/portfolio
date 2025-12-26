import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type };
    
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, duration = 3000) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration = 3000) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message, duration = 3000) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message, duration = 3000) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, warning, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toastItem) => (
          <ToastItem key={toastItem.id} toast={toastItem} onClose={() => removeToast(toastItem.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const { message, type } = toast;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: <CheckCircle size={20} className="text-white" />,
          border: 'border-green-600',
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: <XCircle size={20} className="text-white" />,
          border: 'border-red-600',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: <AlertCircle size={20} className="text-white" />,
          border: 'border-yellow-600',
        };
      default:
        return {
          bg: 'bg-blue-500',
          icon: <AlertCircle size={20} className="text-white" />,
          border: 'border-blue-600',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`${styles.bg} ${styles.border} border-2 rounded-xl shadow-2xl p-4 text-white flex items-center space-x-3 min-w-[300px]`}
    >
      <div className="flex-shrink-0">{styles.icon}</div>
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <X size={16} className="text-white" />
      </button>
    </motion.div>
  );
};

