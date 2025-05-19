'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HomePagePlaceholder = () => {
  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-bg font-sans text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-5xl font-bold text-primary mb-6 font-heading drop-shadow-md"
        initial={{ y: -20, opacity: 0}}
        animate={{ y: 0, opacity: 1}}
        transition={{ delay: 0.2, type: 'spring'}}
      >
        🏠 Welcome Home, Sparky!
      </motion.h1>
      <motion.p 
        className="text-xl text-gray-700 mb-8 max-w-lg"
        initial={{ y: -20, opacity: 0}}
        animate={{ y: 0, opacity: 1}}
        transition={{ delay: 0.4}}
      >
        You've successfully logged in. The adventure continues from here!
      </motion.p>
      <motion.div
        initial={{ y: -20, opacity: 0}}
        animate={{ y: 0, opacity: 1}}
        transition={{ delay: 0.6}}
      >
        <Link href="/" legacyBehavior>
          <a className="bg-lime hover:bg-lime/90 text-primary font-semibold py-3 px-8 rounded-xl shadow-soft hover:shadow-hover transition-all duration-200 text-lg font-heading">
            Back to Login
          </a>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default HomePagePlaceholder; 