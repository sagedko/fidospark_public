'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loginTime, setLoginTime] = useState<number | null>(null);
  const [timeLoggedIn, setTimeLoggedIn] = useState<string>('0 seconds');
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'));
      const storedLoginTime = localStorage.getItem('loginTime');
      if (storedLoginTime) {
        setLoginTime(parseInt(storedLoginTime, 10));
      }
    }
  }, []);

  useEffect(() => {
    if (!loginTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - loginTime;
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      let timeString = '';
      if (hours > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;
      setTimeLoggedIn(timeString.trim() || '0s');
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTime]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('role'); // Assuming role was also set
    setIsOpen(false);
    router.push('/'); // Navigate to login page (root)
  };

  if (!username) {
    // Or a loading state, or redirect if no user and not on login page
    return null; 
  }

  const dropdownVariants = {
    open: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    closed: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div ref={dropdownRef} className="relative font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-mauve/20 transition-colors duration-200 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <span className="text-xl" role="img" aria-label="User avatar">👤</span>
        <span className="text-sm font-medium text-primary hidden sm:block">{username}</span>
        <svg 
            className={`w-4 h-4 text-primary transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute right-0 mt-2 w-64 bg-white/80 backdrop-blur-lg rounded-xl shadow-xl z-50 border border-mauve/30 overflow-hidden"
          >
            <div className="p-4 border-b border-mauve/20">
              <p className="text-sm font-semibold text-primary">Hi, {username}!</p>
              <p className="text-xs text-gray-600">Logged in for: {timeLoggedIn}</p>
            </div>
            <button
              onClick={() => {router.push('/dashboard'); setIsOpen(false);}}
              className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-lime/50 transition-colors duration-150 flex items-center border-b border-mauve/20"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              My Dashboard
            </button>
            <button
              onClick={() => {router.push('/learning/history'); setIsOpen(false);}}
              className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-lime/50 transition-colors duration-150 flex items-center border-b border-mauve/20"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Quiz History
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-lime/50 transition-colors duration-150 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown; 