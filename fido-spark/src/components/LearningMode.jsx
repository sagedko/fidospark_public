import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { learningData as generalLearningData } from '../data/learningData';
import { departmentalLearningData, availableDepartments } from '../data/departmentalLearningData';
import { tailoredContentData } from '../data/tailoredContentData';
import AnimatedBackground from './AnimatedBackground';
import CustomCursor from './CustomCursor';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2, duration: 0.3 },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
  exit: { opacity: 0, y: -10 },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 15, duration: 0.4 },
  },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
};

function LearningMode({ onGoHome, onStartQuiz, currentUser }) {
  const [userDepartment, setUserDepartment] = useState(null);
  const [currentView, setCurrentView] = useState('departmentChoice'); 
  const [activeLearningPath, setActiveLearningPath] = useState(null); 
  const [selectedModuleKey, setSelectedModuleKey] = useState(null); 

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timerInterval;
    if (currentView === 'flashcards') {
      setElapsedTime(0);
      timerInterval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [currentView, selectedModuleKey, activeLearningPath]); 

  const resetToDepartmentChoice = () => {
    setUserDepartment(null);
    setActiveLearningPath(null);
    setSelectedModuleKey(null);
    setCurrentCardIndex(0);
    setElapsedTime(0);
    setCurrentView('departmentChoice');
  };

  const resetToModuleChoice = () => {
    setSelectedModuleKey(null);
    setCurrentCardIndex(0);
    setElapsedTime(0);
    setCurrentView('moduleChoice');
  };
  
  const handleDepartmentSelect = (department) => {
    setUserDepartment(department);
    setActiveLearningPath(null); 
    setCurrentView('moduleChoice');
  };

  const handleTailoredContentSelect = () => {
    setUserDepartment(null); 
    setActiveLearningPath('tailored');
    setSelectedModuleKey(null); 
    setCurrentView('moduleChoice');
  };

  const handleModuleSelect = (moduleKey, pathType) => {
    setSelectedModuleKey(moduleKey);
    setActiveLearningPath(pathType);
    setCurrentCardIndex(0);
    setCurrentView('flashcards');
  };

  const handleNextCard = () => {
    let currentData;
    if (activeLearningPath === 'general' && selectedModuleKey) {
      currentData = generalLearningData[selectedModuleKey];
    } else if (activeLearningPath === 'departmental' && userDepartment) {
      currentData = departmentalLearningData[userDepartment]; // Use userDepartment as key for departmental data
    } else if (activeLearningPath === 'tailored' && selectedModuleKey) {
      currentData = tailoredContentData[selectedModuleKey];
    }

    if (currentData && currentCardIndex < currentData.length - 1) {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prevIndex => prevIndex - 1);
    }
  };

  const triggerActionAtEnd = () => {
    if (activeLearningPath && selectedModuleKey) { 
      // For departmental, selectedModuleKey is the department name (e.g., "Technology")
      // For tailored, selectedModuleKey is the module name (e.g., "Advanced FIDO Concepts")
      // For general, selectedModuleKey is the general module name (e.g., "FIDO Fundamentals")
      // For departmental, if selectedModuleKey is set to userDepartment when module is selected, this will work.
      // Let's ensure handleModuleSelect sets selectedModuleKey appropriately for departmental.
      // It currently passes userDepartment as the moduleKey, which is correct for quizData.
      onStartQuiz(selectedModuleKey, elapsedTime, currentUser);
    } else {
      console.warn("Attempted to trigger action at end without a selected module/path. Navigating to module choice.");
      resetToModuleChoice();
    }
  };

  // Common button styling (can be adapted/expanded)
  const baseButtonClass = "font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg shadow-md transform transition-all duration-150 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryButtonClass = `${baseButtonClass} bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary`;
  const secondaryButtonClass = `${baseButtonClass} bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary`;
  const accentButtonClass = `${baseButtonClass} bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent`;

  // View 1: Department or Learning Path Choice
  if (currentView === 'departmentChoice') {
    return (
      <motion.div 
        className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground relative overflow-hidden cursor-none"
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit"
      >
        <CustomCursor />
        <AnimatedBackground theme="LIME" shapeCount={4} /> 
        <motion.div 
          variants={cardVariants} 
          className="relative z-10 bg-app-white/90 dark:bg-app-black/80 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-xl text-center w-full max-w-xl md:max-w-2xl"
        >
          <div className="absolute top-4 right-4">
             <motion.button
                variants={itemVariants}
                onClick={onGoHome}
                className={`${secondaryButtonClass} py-2 px-4 text-sm`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-cursor-interactive="button"
            >
                <span role="img" aria-label="home">🏠</span> App Home
            </motion.button>
          </div>

          <motion.h2 
            variants={itemVariants} 
            className="text-3xl sm:text-4xl font-bold text-fido-cherry mb-3 sm:mb-4"
          >
            Welcome to the Learning Hub!
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className="text-lg sm:text-xl text-foreground/80 mb-6 sm:mb-8"
          >
            Select your department or a specialized learning path:
          </motion.p>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            <motion.button
              onClick={handleTailoredContentSelect}
              className={`md:col-span-2 ${accentButtonClass} p-6 sm:p-8 text-xl sm:text-2xl mb-2 order-first md:order-none`}
              whileHover={{ scale: 1.03, y: -3, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.97 }}
              variants={itemVariants}
              data-cursor-interactive="button"
            >
              <span role="img" aria-label="sparkles">✨</span> Tailored Content For You <span role="img" aria-label="sparkles">✨</span>
            </motion.button>
            {availableDepartments.map(dept => (
              <motion.button
                key={dept}
                onClick={() => handleDepartmentSelect(dept)}
                className={`${secondaryButtonClass} p-5 sm:p-6 text-xl sm:text-2xl`}
                whileHover={{ scale: 1.03, y: -3, boxShadow: "0px 8px 15px rgba(0,0,0,0.08)" }}
                whileTap={{ scale: 0.97 }}
                variants={itemVariants}
                data-cursor-interactive="button"
              >
                <span role="img" aria-label="department icon" className="mr-2 text-2xl">🏢</span> {dept}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // View 2: Module/Section Choice
  if (currentView === 'moduleChoice') {
    let modules = {};
    let title = "Choose a Learning Module";
    let subtitle = "Select a module to begin.";
    let currentTheme = "AQUA"; // Default theme for this view

    if (activeLearningPath === 'tailored') {
      modules = tailoredContentData;
      title = "Tailored Learning Modules";
      subtitle = `Explore detailed content curated for you.`;
      currentTheme = "MAUVE"; // Different theme for tailored path
    } else if (userDepartment) { 
      title = `Learning Modules (Dept: ${userDepartment})`;
      subtitle = "Choose a general topic or a deep dive into your department.";
      currentTheme = "LIME"; // Theme for departmental path
    }

    return (
      <motion.div 
        className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground relative overflow-hidden cursor-none"
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit"
      >
        <CustomCursor />
        <AnimatedBackground theme={currentTheme} shapeCount={userDepartment ? 5 : 4} /> 
        <motion.div 
          variants={cardVariants} 
          className="relative z-10 bg-app-white/90 dark:bg-app-black/80 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-2xl lg:max-w-3xl"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-6 sm:mb-8 w-full">
            <motion.button
                onClick={resetToDepartmentChoice}
                className={`${secondaryButtonClass} py-2 px-4 text-sm`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-cursor-interactive="button"
              >
                <span role="img" aria-label="back arrow">⬅️</span> Back to Paths
              </motion.button>
            <motion.button
                onClick={onGoHome}
                className={`${primaryButtonClass} py-2 px-4 text-sm`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-cursor-interactive="button"
              >
                <span role="img" aria-label="home">🏠</span> App Home
              </motion.button>
          </motion.div>

          <motion.h2 
            variants={itemVariants} 
            className={`text-3xl sm:text-4xl font-bold ${currentTheme === "LIME" ? "text-fido-cherry" : "text-primary"} mb-2 text-center`}
          >
            {title}
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className="text-lg sm:text-xl text-foreground/80 mb-8 text-center"
          >
            {subtitle}
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            {activeLearningPath === 'tailored' && Object.keys(modules).map(key => (
              <motion.button
                key={key}
                onClick={() => handleModuleSelect(key, 'tailored')}
                className={`${accentButtonClass} p-6 rounded-xl flex flex-col items-center justify-center text-xl`} 
                whileHover={{ scale: 1.03, y: -3, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.97 }}
                variants={itemVariants}
                data-cursor-interactive="button"
              >
                <h3 className="font-semibold flex items-center gap-2"><span role="img" aria-label="document" className="text-2xl">📄</span> {key}</h3>
              </motion.button>
            ))}
            
            {userDepartment && activeLearningPath !== 'tailored' && (
              <>
                <motion.button
                  onClick={() => handleModuleSelect(userDepartment, 'departmental')} 
                  className={`${primaryButtonClass} p-6 rounded-xl flex flex-col items-center justify-center text-xl`} 
                  whileHover={{ scale: 1.03, y: -3, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  variants={itemVariants}
                  data-cursor-interactive="button"
                >
                  <h3 className="font-semibold flex items-center gap-2"><span role="img" aria-label="rocket" className="text-2xl">🚀</span> Deep Dive: {userDepartment}</h3>
                  <p className="text-sm text-primary-foreground/80 mt-1 font-normal">Custom content for your role.</p>
                </motion.button>

                {Object.keys(generalLearningData).map(key => (
                  <motion.button
                    key={key}
                    onClick={() => handleModuleSelect(key, 'general')}
                    className={`${secondaryButtonClass} p-6 rounded-xl flex flex-col items-center justify-center text-xl`} 
                    whileHover={{ scale: 1.03, y: -3, boxShadow: "0px 8px 15px rgba(0,0,0,0.08)" }}
                    whileTap={{ scale: 0.97 }}
                    variants={itemVariants}
                    data-cursor-interactive="button"
                  >
                    <h3 className="font-semibold flex items-center gap-2"><span role="img" aria-label="document" className="text-2xl">📄</span> {key}</h3>
                  </motion.button>
                ))}
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // View 3: Flashcards (Handles General, Departmental, and Tailored)
  if (currentView === 'flashcards') {
    let currentDataArray;
    let moduleDisplayTitle = selectedModuleKey || "";
    let currentFlashcardTheme = "CHERRY"; // Default theme for flashcards

    if (activeLearningPath === 'general' && selectedModuleKey) {
      currentDataArray = generalLearningData[selectedModuleKey];
      currentFlashcardTheme = "AQUA";
    } else if (activeLearningPath === 'departmental' && userDepartment) {
      currentDataArray = departmentalLearningData[selectedModuleKey]; 
      moduleDisplayTitle = `${selectedModuleKey} - Deep Dive`;
      currentFlashcardTheme = "LIME";
    } else if (activeLearningPath === 'tailored' && selectedModuleKey) {
      currentDataArray = tailoredContentData[selectedModuleKey];
      currentFlashcardTheme = "MAUVE";
    }

    const cardContentVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
      exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
    };

    if (!currentDataArray || currentDataArray.length === 0) {
      return (
        <motion.div 
          className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground relative overflow-hidden cursor-none"
          variants={containerVariants} initial="hidden" animate="visible" exit="exit"
        >
          <CustomCursor />
          <AnimatedBackground theme="MAUVE" shapeCount={3} />
          <motion.div 
            variants={cardVariants} 
            className="relative z-10 bg-app-white/95 dark:bg-app-black/80 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-xl text-center max-w-md"
          >
            <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-accent-destructive mb-6 flex items-center gap-3">
              <span role="img" aria-label="warning" className="text-3xl">⚠️</span> 
              Error: No learning data for "{moduleDisplayTitle}" ({activeLearningPath}).
            </motion.p>
            <motion.button 
              variants={itemVariants} 
              onClick={resetToModuleChoice} 
              className={`${secondaryButtonClass}`} 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.98 }}
              data-cursor-interactive="button"
            >
              <span role="img" aria-label="books">📚</span> Back to Modules
            </motion.button>
          </motion.div>
        </motion.div>
      );
    }

    const currentCard = currentDataArray[currentCardIndex];
    const isLastCard = currentCardIndex === currentDataArray.length - 1;
    const progressText = `${currentCardIndex + 1} / ${currentDataArray.length}`;
    const formattedTime = new Date(elapsedTime * 1000).toISOString().substr(14, 5);

    const ProgressBar = () => (
      <div className="w-full bg-secondary/30 rounded-full h-2.5 sm:h-3 mb-4 sm:mb-6 overflow-hidden">
        <motion.div 
          className="bg-primary h-full rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${((currentCardIndex + 1) / currentDataArray.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    );

    return (
      <motion.div 
        className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground relative overflow-hidden cursor-none"
        variants={containerVariants} initial="hidden" animate="visible" exit="exit"
      >
        <CustomCursor />
        <AnimatedBackground theme={currentFlashcardTheme} shapeCount={4} />
        <motion.div 
          variants={cardVariants} 
          className="relative z-10 bg-app-white/95 dark:bg-app-black/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl lg:max-w-3xl"
        >
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base">
            <h2 className={`text-xl sm:text-2xl font-semibold text-fido-cherry dark:text-primary mb-2 sm:mb-0 order-2 sm:order-1`}>{moduleDisplayTitle}</h2>
            <div className="flex items-center gap-4 order-1 sm:order-2 mb-2 sm:mb-0">
                <button onClick={resetToModuleChoice} className={`${secondaryButtonClass} py-1.5 px-3 text-xs`} whileHover={{scale: 1.05}} whileTap={{scale:0.95}} data-cursor-interactive="button">
                    <span role="img" aria-label="books">📚</span> Modules
                </button>
                <p className="text-gray-600 dark:text-gray-400"><span role="img" aria-label="clock">⏱️</span> {formattedTime}</p>
            </div>
          </motion.div>

          <ProgressBar />

          <AnimatePresence mode='wait'>
            <motion.div 
              key={currentCardIndex} 
              variants={cardContentVariants} 
              initial="hidden" 
              animate="visible" 
              exit="exit" 
              className="bg-secondary/10 dark:bg-secondary/5 p-4 sm:p-6 rounded-xl shadow-inner min-h-[200px] sm:min-h-[250px] mb-4 sm:mb-6 flex flex-col justify-center items-center text-center"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-secondary-foreground mb-3">{currentCard.term || currentCard.title}</h3>
              <p className="text-base sm:text-lg text-secondary-foreground">{currentCard.definition || currentCard.content}</p>
            </motion.div>
          </AnimatePresence>

          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <motion.button 
              onClick={handlePrevCard} 
              disabled={currentCardIndex === 0}
              className={`${secondaryButtonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              data-cursor-interactive="button"
            >
              <span role="img" aria-label="left arrow">⬅️</span> Previous
            </motion.button>
            <p className="text-foreground/70 font-medium">{progressText}</p>
            <motion.button 
              onClick={isLastCard ? triggerActionAtEnd : handleNextCard} 
              className={`${primaryButtonClass}`}
              whileHover={{ scale: 1.05, y: -1, boxShadow: "0px 5px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              data-cursor-interactive="button"
            >
              {isLastCard ? 'Start Quiz' : 'Next'} <span role="img" aria-label={isLastCard ? "graduation cap" : "right arrow"}>{isLastCard ? '🎓' : '➡️'}</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // Fallback if no view matches (should not happen in normal flow)
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background text-foreground cursor-none">
        <CustomCursor />
        <p>Something went wrong. Current view: {currentView}</p>
        <button 
          onClick={resetToDepartmentChoice} 
          className={`${primaryButtonClass} mt-4`}
          data-cursor-interactive="button"
        >
          Go to Start
        </button>
    </div>
  );
}

export default LearningMode;