'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface QuizAfterModuleProps {
  onQuizSuccess: () => void;
}

const QuizAfterModule: React.FC<QuizAfterModuleProps> = ({ onQuizSuccess }) => {
  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl text-center font-sans my-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-primary font-heading mb-4 drop-shadow-sm"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.1 }}}
      >
        📝 Module Quiz Time!
      </motion.h2>
      <motion.p 
        className="text-gray-700 mb-8"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 }}}
      >
        Ready to test your knowledge from this module?
      </motion.p>
      <motion.button
        onClick={onQuizSuccess} // Simulate immediate success for now
        className="bg-lime hover:bg-lime/90 text-primary font-bold py-3 px-8 rounded-xl shadow-soft hover:shadow-lg transition-all duration-200 font-heading text-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.3 }}}
      >
        Complete Quiz & Get Badge
      </motion.button>
    </motion.div>
  );
};

export default QuizAfterModule; 