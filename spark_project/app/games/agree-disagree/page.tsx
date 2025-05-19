'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, Sparkles, RefreshCw, Award, ArrowRight } from 'lucide-react';

interface GameStatement {
  id: string;
  text: string;
  correctAnswer: 'agree' | 'disagree'; // 'agree' if statement is true, 'disagree' if false
}

const gameStatements: GameStatement[] = [
  {
    id: 'stmt1',
    text: 'FIDO Spark uses a vibrant color palette including Cherry and Lime.',
    correctAnswer: 'agree',
  },
  {
    id: 'stmt2',
    text: 'Micro-animations are discouraged in the FIDO Spark design philosophy.',
    correctAnswer: 'disagree',
  },
  {
    id: 'stmt3',
    text: 'The primary font used in FIDO Spark is Comic Sans.',
    correctAnswer: 'disagree',
  },
  {
    id: 'stmt4',
    text: 'User data in FIDO Spark is stored exclusively in localStorage.',
    correctAnswer: 'agree', // Assuming for this frontend-only context
  },
];

const AgreeDisagreeGamePage = () => {
  const router = useRouter();
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<'agree' | 'disagree' | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrectChoice, setIsCorrectChoice] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const currentStatementData = gameStatements[currentStatementIndex];

  const handleChoiceSelect = (choice: 'agree' | 'disagree') => {
    if (isAnswerRevealed) return;

    setSelectedChoice(choice);
    setIsAnswerRevealed(true);
    const wasCorrect = choice === currentStatementData.correctAnswer;
    setIsCorrectChoice(wasCorrect);

    if (wasCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage("✅ Correct!");
      const gameScore = { gameId: 'agreeDisagree', score: score + 1, statementsPlayed: gameStatements.length };
      localStorage.setItem('agreeDisagreeScore', JSON.stringify(gameScore));
    } else {
      setFeedbackMessage("❌ Oops, that's not right.");
    }
  };

  const handleNextStatement = () => {
    setFeedbackMessage(null);
    if (currentStatementIndex < gameStatements.length - 1) {
      setCurrentStatementIndex(prev => prev + 1);
      setSelectedChoice(null);
      setIsAnswerRevealed(false);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentStatementIndex(0);
    setSelectedChoice(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setGameOver(false);
    setFeedbackMessage(null);
  };

  const statementCardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9, rotateX: -10 },
    animate: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.3 } },
  };
  
  const choiceButtonVariants = {
    hover: { scale: 1.05, y: -3, boxShadow: '0px 8px 15px rgba(0,0,0,0.1)' },
    tap: { scale: 0.97 }
  };

  if (!currentStatementData && !gameOver) {
    return <Layout><BackButton /><div className="text-center p-8 text-xl text-slate-500">Loading statements...</div></Layout>;
  }

  return (
    <Layout>
      <BackButton />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-aqua via-mauve to-lime">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="w-full max-w-xl bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl text-center ring-1 ring-black/5"
        >
          <Sparkles className="mx-auto text-cherry mb-3 h-8 w-8" />
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-bold text-primary font-heading mb-2 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-cherry to-mauve"
          >
            Agree or Disagree?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-6 md:mb-8"
          >
            {gameOver ? "Game Over!" : `Statement ${currentStatementIndex + 1} of ${gameStatements.length}. Do you agree?`}
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
                      onClick={() => handleChoiceSelect('disagree')}
                      variants={choiceButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-4 px-7 rounded-2xl shadow-lg hover:shadow-rose-500/40 transition-all text-lg md:text-xl flex items-center justify-center"
                    >
                      <ThumbsDown size={24} className="mr-2.5" /> Disagree
                    </motion.button>
                    <motion.button
                      onClick={() => handleChoiceSelect('agree')}
                      variants={choiceButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-7 rounded-2xl shadow-lg hover:shadow-emerald-500/40 transition-all text-lg md:text-xl flex items-center justify-center"
                    >
                      <ThumbsUp size={24} className="mr-2.5" /> Agree
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center w-full max-w-md mx-auto mt-2"
                  >
                    <div className={`flex items-center justify-center text-2xl md:text-3xl font-bold mb-5 ${isCorrectChoice ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrectChoice ? <CheckCircle size={30} className="mr-2" /> : <XCircle size={30} className="mr-2" />}
                      {feedbackMessage}
                    </div>
                    <motion.button
                      onClick={handleNextStatement}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-10 rounded-xl shadow-lg transition-colors flex items-center justify-center mx-auto text-lg"
                      variants={choiceButtonVariants}
                      whileHover="hover" 
                      whileTap="tap"
                    >
                      {currentStatementIndex < gameStatements.length - 1 ? 'Next Statement' : 'Finish Game'} <ArrowRight size={22} className="ml-2" />
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
                Challenge Complete{username ? `, ${username}` : ''}! 🎉
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-2">You've considered all the statements!</p>
              <p className="text-2xl md:text-3xl font-semibold text-lime drop-shadow-sm mb-8">
                Final Score: <span className="text-slate-700">{score}</span> / {gameStatements.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  onClick={restartGame} 
                  className="bg-lime text-primary font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center text-lg"
                  variants={choiceButtonVariants} whileHover="hover" whileTap="tap"
                >
                  <RefreshCw size={20} className="mr-2"/> Play Again
                </motion.button>
                <motion.button 
                  onClick={() => router.push('/games')}
                  className="bg-mauve text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center text-lg"
                  variants={choiceButtonVariants} whileHover="hover" whileTap="tap"
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

export default AgreeDisagreeGamePage; 