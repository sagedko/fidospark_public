'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import FeedbackBanner from '../Shared/FeedbackBanner'; // Import FeedbackBanner

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  // State for feedback banner
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!username || !password || isLoggingIn) {
      if (!username || !password) {
        setFeedbackMessage('Please enter both username and password.');
        setFeedbackType('error');
        setShowFeedback(true);
      }
      return;
    }

    setIsLoggingIn(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    // Simulate login success/failure
    if (username === 'a' && password === 'a') {
      console.log('Login successful:', { username });
      // Set items in localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('loginTime', Date.now().toString());
      localStorage.setItem('role', 'Spark User'); // Example role

      setFeedbackMessage('Login successful! Redirecting...');
      setFeedbackType('success');
      setShowFeedback(true);
      // Wait for feedback to show briefly before redirecting
      setTimeout(() => {
        router.push('/onboarding');
      }, 1000);
    } else {
      console.log('Login failed for:', { username });
      setFeedbackMessage('Invalid username or password. Please try again!');
      setFeedbackType('error');
      setShowFeedback(true);
      setIsLoggingIn(false);
    }
  };

  const handlePasswordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(214, 8, 107, 0.3)' },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-aqua via-bg to-mauve/30 font-sans overflow-hidden relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-soft w-full max-w-md"
        variants={itemVariants}
      >
        <motion.h1 
          className="text-4xl font-bold text-center mb-3 text-primary font-heading drop-shadow-sm"
          variants={itemVariants}
        >
          Welcome Back! ✨
        </motion.h1>
        <motion.p 
          className="text-center text-gray-600 mb-8"
          variants={itemVariants}
        >
          Let's get you signed in.
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="block text-sm font-medium text-primary/90 mb-1">
              Username
            </label>
            <motion.input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-mauve/50 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-200 shadow-sm bg-white/70"
              placeholder="YourSparkyName"
              whileFocus={{ scale: 1.02, borderColor: '#D6086B' }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-primary/90 mb-1">
              Password
            </label>
            <motion.input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handlePasswordKeyDown}
              className="w-full px-4 py-3 rounded-xl border-2 border-mauve/50 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-200 shadow-sm bg-white/70"
              placeholder="•••••••• (try 'a')"
              whileFocus={{ scale: 1.02, borderColor: '#D6086B' }}
            />
          </motion.div>

          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-heading text-lg"
          >
            {isLoggingIn ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : 'Sign In & Spark On'}
          </motion.button>
        </form>

        <motion.p className="text-xs text-center text-gray-500 mt-8" variants={itemVariants}>
          Forgot password? <a href="#" className="text-primary hover:underline">Get help!</a>
        </motion.p>

      </motion.div>
      
      {/* Render FeedbackBanner here */}
      <FeedbackBanner 
        message={feedbackMessage}
        type={feedbackType}
        show={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </motion.div>
  );
};

export default LoginPage; 