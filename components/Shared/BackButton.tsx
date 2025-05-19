'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BackButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold cursor-pointer select-none shadow-soft hover:shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 m-4"
      aria-label="Go back to the previous page"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowLeft size={18} className="mr-2" />
      Back
    </motion.button>
  );
};

export default BackButton; 