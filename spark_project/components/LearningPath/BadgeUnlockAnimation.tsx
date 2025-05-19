'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BadgeUnlockAnimationProps {
  badgeName: string;
  courseId: string; // To link back to the specific course or next course
}

const BadgeUnlockAnimation: React.FC<BadgeUnlockAnimationProps> = ({ badgeName, courseId }) => {
  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-8 bg-gradient-to-br from-lime to-aqua rounded-2xl shadow-xl text-center font-sans my-10 flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, duration: 0.8 }}
    >
      <motion.div 
        className="text-7xl mb-5"
        initial={{ scale: 0}}
        animate={{ scale: 1, rotate: [0, 10, -10, 10, 0]}}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 8}}
      >
        🏆
      </motion.div>
      <motion.h2 
        className="text-3xl font-bold text-primary font-heading mb-2 drop-shadow-sm"
        initial={{ y: -20, opacity: 0}}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.7 }}}
      >
        Badge Unlocked!
      </motion.h2>
      <motion.p 
        className="text-2xl font-semibold text-white mb-6 bg-primary/70 px-4 py-1 rounded-lg shadow-md"
        initial={{ scale: 0.8, opacity: 0}}
        animate={{ scale: 1, opacity: 1, transition: { delay: 0.9, type: 'spring' }}}
      >
        {badgeName}
      </motion.p>
      <motion.p 
        className="text-gray-700 mb-8"
        initial={{ y: 20, opacity: 0}}
        animate={{ y: 0, opacity: 1, transition: { delay: 1.1 }}}
      >
        Amazing work completing this module! Keep the spark alive!
      </motion.p>
      
      <motion.div 
        className="flex space-x-4"
        initial={{ opacity: 0}}
        animate={{ opacity: 1, transition: { delay: 1.3 }}}
      >
        {/* This link might need to go to a course selection or next module */}
        <Link href="/onboarding" legacyBehavior>
            <a className="bg-mauve/80 hover:bg-mauve text-white font-semibold py-3 px-6 rounded-xl shadow-soft hover:shadow-lg transition-all duration-200 font-heading">
                Back to Paths
            </a>
        </Link>
        {/* Add a 'Next Module' button here if applicable */}
      </motion.div>
    </motion.div>
  );
};

export default BadgeUnlockAnimation; 