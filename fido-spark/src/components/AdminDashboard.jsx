import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 15, duration: 0.4 },
  },
};

function AdminDashboard({ onGoHome }) {
  const [adminData, setAdminData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({ totalUniqueUsers: 0, totalQuizAttempts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const allScoresData = [];
    let uniqueUsernames = new Set();
    let totalAttempts = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fidoSparkScores_')) {
          const userName = key.replace('fidoSparkScores_', '');
          uniqueUsernames.add(userName);
          const userData = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(userData)) {
            allScoresData.push({ userName, scores: userData });
            totalAttempts += userData.length;
          }
        }
      }
    } catch (error) {
      console.error("Error processing localStorage data:", error);
    }
    
    setAdminData(allScoresData);
    setSummaryStats({ totalUniqueUsers: uniqueUsernames.size, totalQuizAttempts: totalAttempts });
    setLoading(false);
  }, []);

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-fido-aqua/70 text-foreground relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatedBackground shapeCount={3} />
        <motion.p 
          className="text-xl sm:text-2xl text-app-white drop-shadow-md z-10 flex items-center gap-3"
          variants={itemVariants} initial="hidden" animate="visible"
        >
          <span role="img" aria-label="loading">⏳</span> Loading Admin Data...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 bg-fido-aqua/70 text-foreground relative overflow-y-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedBackground shapeCount={4} />
      
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row justify-between items-center my-6 sm:my-8 pt-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-fido-cherry drop-shadow-lg mb-4 sm:mb-0">
            <span role="img" aria-label="shield">🛡️</span> Admin Dashboard
          </h1>
          <motion.button 
            onClick={onGoHome} 
            className="bg-fido-mauve text-accent-foreground font-semibold py-2.5 px-6 rounded-lg shadow-md hover:bg-fido-mauve/80 flex items-center gap-2 transform transition-all duration-150 ease-in-out"
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)"}}
            whileTap={{scale: 0.97}}
            data-cursor-interactive="button"
          >
            <span role="img" aria-label="home">🏠</span> App Home
          </motion.button>
        </motion.div>

        <motion.div 
          variants={cardVariants} 
          className="mb-8 sm:mb-12 bg-app-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-fido-mauve/30"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-fido-cherry mb-4 sm:mb-6 text-center border-b border-fido-cherry/30 pb-3">
            <span role="img" aria-label="bar chart">📊</span> Overall Statistics
          </h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-base sm:text-lg"
            variants={containerVariants} 
          >
            <motion.p 
              variants={itemVariants} 
              className="flex items-center justify-center md:justify-start gap-2 text-gray-700 p-3 bg-fido-lime/20 rounded-lg"
            >
              <span role="img" aria-label="users" className="text-xl">👥</span> Total Unique Users: 
              <span className="font-bold text-gray-800">{summaryStats.totalUniqueUsers}</span>
            </motion.p>
            <motion.p 
              variants={itemVariants} 
              className="flex items-center justify-center md:justify-start gap-2 text-gray-700 p-3 bg-fido-aqua/20 rounded-lg"
            >
              <span role="img" aria-label="quiz attempts" className="text-xl">📝</span> Total Quiz Attempts: 
              <span className="font-bold text-gray-800">{summaryStats.totalQuizAttempts}</span>
            </motion.p>
          </motion.div>
        </motion.div>

        {adminData.length === 0 ? (
          <motion.div 
            variants={cardVariants} 
            className="text-center bg-app-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-xl sm:rounded-2xl shadow-lg border border-fido-mauve/30"
          >
            <p className="text-xl sm:text-2xl text-fido-cherry flex items-center justify-center gap-3">
              <span role="img" aria-label="empty folder" className="text-3xl">📁</span> No user quiz data found.
            </p>
          </motion.div>
        ) : (
          <motion.div className="space-y-6 sm:space-y-8" variants={containerVariants}>
            {adminData.map(({ userName, scores }) => (
              <motion.div 
                key={userName} 
                variants={itemVariants} 
                className="bg-app-white/80 dark:bg-app-black/70 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg border border-fido-lime/30"
              >
                <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 border-b border-primary/30 pb-3 flex items-center gap-2">
                  <span role="img" aria-label="user icon" className="text-2xl">👤</span> User: <span className="text-foreground/90">{userName}</span>
                </h2>
                {scores.length === 0 ? (
                  <p className="text-foreground/80 italic">No quiz attempts found for this user.</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {scores.map((entry, index) => {
                      const percentage = entry.total > 0 ? ((entry.score / entry.total) * 100).toFixed(1) : 0;
                      const passed = parseFloat(percentage) >= 90;
                      return (
                        <motion.div 
                          key={index} 
                          variants={itemVariants} 
                          className="bg-background/5 dark:bg-background/10 p-3 sm:p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between md:items-start gap-3"
                        >
                          <div className="flex-1 mb-2 md:mb-0">
                            <h3 className="text-lg sm:text-xl font-medium text-accent mb-1 flex items-center gap-2">
                              <span role="img" aria-label="books" className="text-lg">📚</span> {entry.section}
                            </h3>
                            <p className="text-xs text-foreground/70 flex items-center gap-1.5">
                              <span role="img" aria-label="calendar" className="text-sm">📅</span> {new Date(entry.date).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-1 w-full md:w-auto">
                            <p className="text-base sm:text-lg text-foreground/90 flex items-center gap-1.5">
                              <span role="img" aria-label="target" className="text-sm">🎯</span> Score: {entry.score}/{entry.total} <span className="font-semibold">({percentage}%)</span>
                            </p>
                            <p className={`text-base sm:text-lg font-semibold ${passed ? 'text-primary' : 'text-accent-destructive'}`}>
                              {passed ? <><span role="img" aria-label="check mark">✅</span> Passed</> : <><span role="img" aria-label="cross mark">❌</span> Needs Improvement</>} 
                              <span className="text-xs text-foreground/60">(90% Pass)</span>
                            </p>
                             <p className="text-sm text-secondary-foreground flex items-center gap-1.5 mt-1">
                              <span role="img" aria-label="stopwatch" className="text-sm">⏱️</span> Learn Time: {formatTime(entry.timeSpentLearning)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                 <p className="text-right text-foreground/70 mt-4 text-xs sm:text-sm italic">
                    Total Quizzes Taken: <span className="font-semibold">{scores.length}</span>
                  </p>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}

export default AdminDashboard; 