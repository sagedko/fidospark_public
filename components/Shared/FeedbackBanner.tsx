'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackBannerProps {
  message: string | null;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
}

const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const bgColor = {
    success: 'bg-lime/80 backdrop-blur-md border-lime',
    error: 'bg-primary/80 backdrop-blur-md border-primary',
    info: 'bg-aqua/80 backdrop-blur-md border-aqua',
  }[type];

  const textColor = {
    success: 'text-primary',
    error: 'text-white',
    info: 'text-primary',
  }[type];
  
  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }[type];

  return (
    <AnimatePresence>
      {show && message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-xl border-2 ${bgColor} max-w-sm w-full sm:w-auto`}
        >
          <div className="flex items-start">
            <span className={`text-xl mr-3 ${textColor}`}>{icon}</span>
            <div className="flex-grow">
              <p className={`font-semibold ${textColor}`}>{type.toUpperCase()}</p>
              <p className={`text-sm ${textColor} opacity-90`}>{message}</p>
            </div>
            <button 
              onClick={onClose} 
              className={`ml-4 text-lg ${textColor} hover:opacity-75 transition-opacity`}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackBanner; 