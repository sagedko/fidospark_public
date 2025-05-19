'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { CheckSquare, XSquare, Clock, RefreshCw, Award, ArrowRight, Zap } from 'lucide-react'; // Using CheckSquare/XSquare for T/F

interface TrueFalseStatement {
  id: string;
  text: string;
  correctAnswer: boolean; // true for True, false for False
}

const gameStatements: TrueFalseStatement[] = [
  {
    id: 'tf1',
    text: 'FIDO Spark aims to make onboarding engaging through gamification.',
    correctAnswer: true,
  },
  {
    id: 'tf2',
    text: 'The \'stylishsite\' design philosophy prioritizes minimalist black and white themes.',
    correctAnswer: false,
  },
  {
    id: 'tf3',
    text: 'All games in FIDO Spark award experience points (XP).',
    correctAnswer: false, // Placeholder, actual implementation might vary
  },
  {
    id: 'tf4',
    text: 'The color Aqua (#A3F8FF) is part of the FIDO Spark palette.',
    correctAnswer: true,
  },
];

const TrueOrFalseRapidGamePage = () => {
  const router = useRouter();
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrectUserAnswer, setIsCorrectUserAnswer] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Timer could be added here for "Rapid Fire" aspect

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const currentStatementData = gameStatements[currentStatementIndex];

  const handleAnswerSelect = (answer: boolean) => {
    if (isAnswerRevealed) return;

    setSelectedAnswer(answer);
    setIsAnswerRevealed(true);
    const wasCorrect = answer === currentStatementData.correctAnswer;
    setIsCorrectUserAnswer(wasCorrect);

    if (wasCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage("⚡️ Correct & Fast!");
      const gameScore = { gameId: 'trueFalseRapid', score: score + 1, statementsPlayed: gameStatements.length };
      localStorage.setItem('trueFalseRapidScore', JSON.stringify(gameScore));
    } else {
      setFeedbackMessage("❌ Not quite! Keep going!");
    }
  };

  const handleNextStatement = () => {
    setFeedbackMessage(null);
    if (currentStatementIndex < gameStatements.length - 1) {
      setCurrentStatementIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentStatementIndex(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setGameOver(false);
    setFeedbackMessage(null);
  };

  const statementCardVariants = {
    initial: { opacity: 0, x: -50, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
    exit: { opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } },
  };
  
  const answerButtonVariants = {
    hover: { scale: 1.06, boxShadow: '0px 6px 12px rgba(0,0,0,0.1)' },
    tap: { scale: 0.96 }
  };

  if (!currentStatementData && !gameOver) {
    return <Layout><BackButton /><div className="text-center p-8 text-xl text-slate-500">Loading statements...</div></Layout>;
  }

  return (
    <Layout>
      <BackButton />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: 'spring', stiffness:100 }}
          className="w-full max-w-xl bg-white/85 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl text-center ring-1 ring-black/5"
        >
          <Clock className="mx-auto text-red-700 mb-3 h-10 w-10 animate-pulse" />
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-bold text-primary font-heading mb-2 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-400"
          >
            True or False: Rapid Fire!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-6 md:mb-8"
          >
            {gameOver ? "Time's Up! How did you do?" : `Statement ${currentStatementIndex + 1} of ${gameStatements.length}. Quick, is it True or False?`}
          </motion.p>

          {!gameOver ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStatementIndex} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="w-full"
              >
                <motion.div
                  variants={statementCardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-gradient-to-br from-white to-slate-100 p-6 md:p-8 rounded-2xl shadow-lg mb-6 md:mb-8 min-h-[100px] flex items-center justify-center ring-1 ring-slate-200"
                >
                  <p className="text-xl md:text-2xl font-semibold text-slate-700">{currentStatementData.text}</p>
                </motion.div>

                {!isAnswerRevealed ? (
                  <motion.div 
                    initial={{opacity: 0}}
                    animate={{opacity: 1, transition: {delay: 0.2}}}
                    className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md mx-auto"
                  >
                    <motion.button
                      onClick={() => handleAnswerSelect(true)} // True
                      variants={answerButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-7 rounded-2xl shadow-lg hover:shadow-emerald-500/40 transition-all text-lg md:text-xl flex items-center justify-center"
                    >
                      <CheckSquare size={24} className="mr-2.5" /> True
                    </motion.button>
                    <motion.button
                      onClick={() => handleAnswerSelect(false)} // False
                      variants={answerButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-4 px-7 rounded-2xl shadow-lg hover:shadow-rose-500/40 transition-all text-lg md:text-xl flex items-center justify-center"
                    >
                      <XSquare size={24} className="mr-2.5" /> False
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center w-full max-w-md mx-auto mt-2"
                  >
                    <div className={`flex items-center justify-center text-2xl md:text-3xl font-bold mb-5 ${isCorrectUserAnswer ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrectUserAnswer ? <Zap size={30} className="mr-2 text-yellow-400" /> : <XSquare size={30} className="mr-2" />}
                      {feedbackMessage}
                    </div>
                    <motion.button
                      onClick={handleNextStatement}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-10 rounded-xl shadow-lg transition-colors flex items-center justify-center mx-auto text-lg"
                      variants={answerButtonVariants}
                      whileHover="hover" 
                      whileTap="tap"
                    >
                      {currentStatementIndex < gameStatements.length - 1 ? 'Next! ' : 'Finish!'} <ArrowRight size={22} className="ml-1" />
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{opacity:0, scale:0.7}} 
              animate={{opacity:1, scale:1, transition:{type:'spring', stiffness:100, damping:10}}} 
              className="text-center"
            >
              <Award size={60} className="text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_10px_#FDE047CC]"/>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3 font-heading">
                Finished{username ? `, ${username}` : ''}! ⏱️
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-2">That was rapid fire!</p>
              <p className="text-2xl md:text-3xl font-semibold text-lime drop-shadow-sm mb-8">
                Final Score: <span className="text-slate-700">{score}</span> / {gameStatements.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  onClick={restartGame} 
                  className="bg-lime text-primary font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center text-lg"
                  whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                >
                  <RefreshCw size={20} className="mr-2"/> Play Again
                </motion.button>
                <motion.button 
                  onClick={() => router.push('/games')}
                  className="bg-mauve text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center text-lg"
                  whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                >
                  More Games
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default TrueOrFalseRapidGamePage; 