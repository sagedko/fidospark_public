import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizData } from '../data/quizData.js'; // Assuming quizData.js is in src/data/
import AnimatedBackground from './AnimatedBackground';

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

function QuizView({ sectionKey, onQuizComplete, onBackToLearning, currentUser, learningTime }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null); // null, true, or false

  useEffect(() => {
    const sectionQuestions = quizData[sectionKey] || [];
    setQuestions(sectionQuestions.map(q => ({ ...q, id: Math.random().toString(36).substring(7) }))); // Add unique ID for AnimatePresence key
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setFeedbackMessage('');
    setIsCorrectAnswer(null);
  }, [sectionKey]);

  const saveScoreToLocalStorage = (finalScore, totalQuestions) => {
    if (!currentUser) return;
    const userScoresKey = `fidoSparkScores_${currentUser}`;
    const existingScores = JSON.parse(localStorage.getItem(userScoresKey)) || [];
    const newScoreEntry = {
      section: sectionKey,
      score: finalScore,
      total: totalQuestions,
      date: new Date().toISOString(),
      timeSpentLearning: learningTime || 0,
    };
    const updatedScores = [...existingScores, newScoreEntry];
    localStorage.setItem(userScoresKey, JSON.stringify(updatedScores));
  };

  const handleAnswerSelect = (option) => {
    if (feedbackMessage) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      setFeedbackMessage("Please select an answer first!");
      setIsCorrectAnswer(null);
      setTimeout(() => setFeedbackMessage(''), 1500);
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setFeedbackMessage("Excellent! That's correct.");
    } else {
      setFeedbackMessage(`Not quite. The correct answer was: ${currentQuestion.correctAnswer}`);
    }

    setTimeout(() => {
      setFeedbackMessage('');
      setSelectedAnswer(null);
      setIsCorrectAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        setShowResults(true);
        saveScoreToLocalStorage(isCorrect ? score + 1 : score, questions.length);
      }
    }, 2500); // Show feedback for 2.5 seconds
  };

  const ProgressBar = () => (
    <div className="w-full bg-fido-mauve/30 rounded-full h-2.5 sm:h-3 mb-4 sm:mb-6 overflow-hidden">
      <motion.div 
        className="bg-fido-lime h-full rounded-full" 
        initial={{ width: 0 }}
        animate={{ width: `${((currentQuestionIndex + (showResults ? 1 : selectedAnswer && feedbackMessage ? 1: 0) ) / questions.length) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
  
  // Common button styling
  const baseButtonClass = "font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg shadow-md transform transition-all duration-150 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryButtonClass = `${baseButtonClass} bg-fido-lime text-primary-foreground focus:ring-fido-lime`;
  const secondaryButtonClass = `${baseButtonClass} bg-fido-mauve text-accent-foreground focus:ring-fido-mauve`;
  const destructiveButtonClass = `${baseButtonClass} bg-fido-cherry text-destructive-foreground focus:ring-fido-cherry`;

  if (!questions.length) {
    return (
      <motion.div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-fido-mauve/70 text-foreground relative overflow-hidden" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
        <AnimatedBackground shapeCount={3} />
        <motion.div variants={cardVariants} className="relative z-10 bg-app-white/95 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-xl text-center max-w-md">
          <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-fido-cherry mb-6 flex items-center gap-3"><span role="img" aria-label="warning" className="text-3xl">⚠️</span> No quiz questions found for {sectionKey}.</motion.p>
          <motion.button variants={itemVariants} onClick={onBackToLearning} className={secondaryButtonClass} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
            <span role="img" aria-label="books">📚</span> Back to Learning Hub
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (showResults) {
    const percentage = questions.length > 0 ? (score / questions.length * 100).toFixed(1) : 0;
    const passed = parseFloat(percentage) >= 90;
    return (
      <motion.div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-fido-lime/70 text-foreground relative overflow-hidden" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
        <AnimatedBackground shapeCount={5} />
        <motion.div variants={cardVariants} className="relative z-10 bg-app-white/95 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full">
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-fido-cherry mb-2 sm:mb-3">Quiz Results!</motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-6 sm:mb-8">For section: <span className="font-semibold text-fido-aqua">{sectionKey}</span></motion.p>
          <motion.div variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 p-4 bg-fido-mauve/20 rounded-xl">
            <span role="img" aria-label="trophy">🏆</span> {score} <span className="text-2xl sm:text-3xl text-gray-500">/ {questions.length}</span>
          </motion.div>
          <motion.p variants={itemVariants} className={`text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 ${passed ? 'text-fido-lime' : 'text-fido-cherry'}`}>
             {passed ? 'Congratulations, You Passed! 🎉' : 'Keep Practicing! You Can Do It! 🎯'}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.button onClick={onBackToLearning} className={secondaryButtonClass} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <span role="img" aria-label="books">📚</span> Learning Hub
            </motion.button>
            <motion.button onClick={onQuizComplete} className={primaryButtonClass} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <span role="img" aria-label="home">🏠</span> App Home
            </motion.button>
          </motion.div>
          <motion.p variants={itemVariants} className="text-xs text-gray-500 mt-6 sm:mt-8">Scores saved for <span className="font-semibold text-fido-aqua">{currentUser}</span>.</motion.p>
        </motion.div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <motion.div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-fido-cherry/60 text-foreground relative overflow-hidden" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <AnimatedBackground shapeCount={3} />
      <motion.div variants={cardVariants} className="relative z-10 bg-app-white/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl lg:max-w-3xl">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base">
          <h2 className="text-xl sm:text-2xl font-semibold text-fido-cherry mb-2 sm:mb-0">{sectionKey} Quiz</h2>
          <p className="text-gray-600"><span className="font-semibold text-fido-mauve">{currentUser}</span> | Q: {currentQuestionIndex + 1}/{questions.length}</p>
        </motion.div>
        
        <ProgressBar />

        <AnimatePresence mode='wait'>
          <motion.div 
            key={currentQuestion.id} // Unique key for question transition
            variants={itemVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            className="bg-fido-mauve/10 p-4 sm:p-6 rounded-xl shadow-inner min-h-[120px] sm:min-h-[150px] mb-4 sm:mb-6"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 text-center">{currentQuestion.text}</h3>
          </motion.div>
        </AnimatePresence>

        <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {currentQuestion.options.map(option => {
            const isSelected = selectedAnswer === option;
            let buttonClass = `w-full text-left p-3 sm:p-3.5 rounded-lg transition-all duration-200 ease-in-out border-2 border-transparent flex items-center gap-2 text-gray-700 font-medium focus:outline-none`;
            let hoverEffect = { scale: 1.03 };
            let tapEffect = { scale: 0.97 };

            if (feedbackMessage && isSelected) {
              buttonClass += isCorrectAnswer ? ' bg-fido-lime text-primary-foreground border-fido-lime/80' : ' bg-fido-cherry text-destructive-foreground border-fido-cherry/80';
              hoverEffect = {}; // Disable hover effect on feedback
              tapEffect = {};   // Disable tap effect on feedback
            } else if (feedbackMessage) {
              buttonClass += ' bg-gray-200/70 text-gray-500 cursor-not-allowed'; // Unselected options during feedback
               hoverEffect = {}; 
               tapEffect = {};
            } else if (isSelected) {
              buttonClass += ' bg-fido-aqua text-secondary-foreground border-fido-aqua/80 ring-2 ring-fido-aqua';
            } else {
              buttonClass += ' bg-gray-100 hover:bg-fido-mauve/30 hover:border-fido-mauve';
            }

            return (
              <motion.button 
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={!!feedbackMessage}
                className={buttonClass}
                whileHover={hoverEffect}
                whileTap={tapEffect}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <span className={`w-5 h-5 rounded-full border-2 ${isSelected && !feedbackMessage ? 'bg-fido-aqua border-fido-aqua/80' : 'border-gray-400'} flex items-center justify-center`}>
                  {isSelected && !feedbackMessage && <motion.div className="w-2.5 h-2.5 bg-white rounded-full" layoutId="selectedIndicator" />}
                </span>
                {option}
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {feedbackMessage && (!selectedAnswer || (selectedAnswer && isCorrectAnswer !== null)) && (
            <motion.p 
              key="feedback"
              variants={itemVariants} initial="hidden" animate="visible" exit="exit"
              className={`text-center text-sm sm:text-base font-medium mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-md flex items-center justify-center gap-2 
                ${isCorrectAnswer === true ? 'bg-fido-lime/30 text-fido-lime' : isCorrectAnswer === false ? 'bg-fido-cherry/30 text-fido-cherry' : 'bg-fido-mauve/30 text-fido-mauve'}
            `}>
                {isCorrectAnswer === true ? '✅' : isCorrectAnswer === false ? '❌' : '🤔'} {feedbackMessage}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button 
          variants={itemVariants}
          onClick={handleSubmitAnswer}
          disabled={selectedAnswer === null || !!feedbackMessage}
          className={`${primaryButtonClass} w-full disabled:opacity-60 disabled:cursor-not-allowed`}
          whileHover={selectedAnswer !== null && !feedbackMessage ? { scale: 1.05, y: -2, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" } : {}}
          whileTap={selectedAnswer !== null && !feedbackMessage ? { scale: 0.98 } : {}}
        >
          {feedbackMessage ? 'Next...' : 'Submit Answer'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default QuizView; 