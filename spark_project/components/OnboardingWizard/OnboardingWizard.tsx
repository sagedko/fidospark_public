'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const OnboardingWizard = () => {
  const router = useRouter();

  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
    },
  };

  const gradientAnimation = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  const handleLearnPathClick = () => {
    router.push('/learning/courses');
  };

  const handleGamePathClick = () => {
    router.push('/games');
  };

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans"
      style={{
        background: 'linear-gradient(135deg, #A3F8FF, #FABAFF, #E8FF34)',
        backgroundSize: '200% 200%',
      }}
      variants={gradientAnimation}
      animate="animate"
    >
      <motion.div 
        className="absolute inset-0 bg-black opacity-10 -z-10"
        initial={{ opacity: 0}}
        animate={{ opacity: 0.05}}
        transition={{ duration: 1}}
      />

      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-12 text-primary drop-shadow-lg font-heading"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 100 }}
      >
        Welcome to FIDO Spark!
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-4xl px-4">
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="h-60 md:h-72"
        >
          <Link href="/learning/courses" legacyBehavior>
            <a className="bg-gradient-to-r from-aqua to-lime text-primary font-semibold text-lg md:text-2xl py-6 px-8 rounded-2xl shadow-xl flex flex-col items-center justify-center h-full w-full transform transition-transform duration-300 ease-out font-heading">
              <motion.span 
                className="text-5xl md:text-7xl mb-4"
                role="img" 
                aria-label="Book emoji"
                animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1, 1.1, 1]}}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 1}}
              >
                📘
              </motion.span>
              Learn the FIDO Way
            </a>
          </Link>
        </motion.div>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleGamePathClick}
          className="bg-gradient-to-r from-aqua to-lime text-primary font-semibold text-lg md:text-2xl py-6 px-8 rounded-2xl shadow-xl flex flex-col items-center justify-center h-60 md:h-72 transform transition-transform duration-300 ease-out font-heading"
        >
          <motion.span 
            className="text-5xl md:text-7xl mb-4"
            role="img" 
            aria-label="Gamepad emoji"
            animate={{ scale: [1, 1.1, 1, 1.1, 1]}}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 1}}
          >
            🎮
          </motion.span>
          Play Onboarding Games
        </motion.button>
      </div>

      <motion.p 
        className="mt-16 text-center text-lg text-primary opacity-90 font-sans"
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.5, delay: 0.8}}
      >
        Choose your path to start your adventure!
      </motion.p>
    </motion.div>
  );
};

export default OnboardingWizard; 