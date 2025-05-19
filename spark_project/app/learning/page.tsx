'use client';

import React from 'react';
import LearningCardCarousel from '@/components/LearningPath/LearningCardCarousel';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/Shared/Layout';

const LearningPathPage = () => {
  return (
    <Layout>
      <motion.div 
        className="flex flex-col items-center justify-start w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-full max-w-4xl mb-8 text-center pt-4"
          initial={{ y: -20, opacity: 0}}
          animate={{ y: 0, opacity: 1}}
          transition={{ delay: 0.1, type: 'spring'}}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-heading mb-3 drop-shadow-md">📘 Learning Path</h1>
          <p className="text-lg text-gray-700">Swipe or use the buttons to navigate through the FIDO basics.</p>
        </motion.div>

        <LearningCardCarousel />

        <motion.div 
          className="mt-12 mb-8"
          initial={{ y: 20, opacity: 0}}
          animate={{ y: 0, opacity: 1}}
          transition={{ delay: 0.5}}
        >
          <Link href="/onboarding" legacyBehavior>
            <a className="bg-mauve/80 hover:bg-mauve text-white font-semibold py-3 px-6 rounded-xl shadow-soft hover:shadow-lg transition-all duration-200 font-heading">
              Back to Path Selection
            </a>
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default LearningPathPage; 