'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { CheckCircle, XCircle, Sparkles, Target, HelpCircle, RefreshCw, Trophy, Award } from 'lucide-react';

interface OptionData {
  id: number;
  text: string;
  isLie: boolean;
}

interface GameRound {
  id: string;
  options: OptionData[];
}

// New mock data as per user request
const rounds: GameRound[] = [
  {
    id: 'round1',
    options: [
      { id: 1, text: 'FIDO was founded in 1995.', isLie: true },
      { id: 2, text: 'FIDO supports remote work.', isLie: false },
      { id: 3, text: 'FIDO offers onboarding badges.', isLie: false },
    ],
  },
  {
    id: 'round2',
    options: [
      { id: 1, text: 'ISO compliance is mandatory at FIDO.', isLie: false },
      { id: 2, text: 'FIDO has offices on Mars.', isLie: true },
      { id: 3, text: 'New hires get welcome packages.', isLie: false },
    ],
  },
];

// Simple Confetti for success
const ConfettiAnimation = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: Math.random() * -200 - 100, x: Math.random() * window.innerWidth - window.innerWidth / 2, opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
        animate={{
          y: window.innerHeight + 100,
          x: Math.random() * window.innerWidth - window.innerWidth / 2 + (Math.random() - 0.5) * 400,
          opacity: [1, 0.8, 0],
          rotate: Math.random() * 720 - 360,
        }}
        transition={{ duration: Math.random() * 3 + 3, delay: Math.random() * 0.5, ease: "linear", repeat: Infinity, repeatType: "loop" }}
        className="absolute text-lg"
        style={{ color: ['#D6086B', '#A3F8FF', '#E8FF34', '#FABAFF'][i % 4] }}
      >
        {['●', '▲', '■', '◆', '★'][i % 5]}
      </motion.div>
    ))}
  </div>
);

const TwoTruthsAndALiePage = () => {
  const router = useRouter();
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const currentRoundData = rounds[currentRoundIndex];

  const handleCardSelect = (selectedIndex: number) => {
    if (isAnswerRevealed) return;

    setSelectedCardIndex(selectedIndex);
    setIsAnswerRevealed(true);
    const selectedOption = currentRoundData.options[selectedIndex];
    const wasCorrect = selectedOption.isLie;

    if (wasCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      setFeedbackMessage("✅ Correct!");
      const gameScore = { gameId: 'twoTruthsLie', score: score + 1, roundsPlayed: rounds.length };
      localStorage.setItem('twoTruthsLieScore', JSON.stringify(gameScore));
    } else {
      setStreak(0);
      setFeedbackMessage("❌ Oops, that wasn't the lie.");
    }
  };

  const handleNextRound = () => {
    setShowConfetti(false);
    setFeedbackMessage(null);
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
      setSelectedCardIndex(null);
      setIsAnswerRevealed(false);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentRoundIndex(0);
    setSelectedCardIndex(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setShowConfetti(false);
    setFeedbackMessage(null);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.8 },
    animate: (i:number) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: i * 0.15, type: 'spring', stiffness: 100, damping: 12 }
    }),
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" },
    tap: { scale: 0.98 }
  };

  if (!currentRoundData && !gameOver) {
    return <Layout><BackButton /><div className="text-center p-8">Loading game...</div></Layout>;
  }

  return (
    <Layout>
      {showConfetti && <ConfettiAnimation />}
      <BackButton />
      <div className="container mx-auto px-4 py-8 md:py-12 text-center min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }} 
          className="text-3xl md:text-4xl font-bold text-primary font-heading mb-2 drop-shadow-md"
        >
          🕵️ Two Truths and a Lie
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="text-md text-gray-600 mb-6 md:mb-8"
        >
          {gameOver ? "Game Over!" : "Can you spot the lie?"}
        </motion.p>

        {!gameOver ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentRoundIndex} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="w-full max-w-3xl"
            >
              <div className="mb-4 flex justify-between items-center w-full px-2">
                <p className="text-sm text-mauve font-semibold">Round {currentRoundIndex + 1} of {rounds.length}</p>
                <div className="text-right">
                    <p className="text-sm text-primary font-semibold">Score: {score}</p>
                    {streak > 1 && <p className="text-xs text-lime animate-pulse font-bold">🔥 Streak: {streak}!</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {currentRoundData.options.map((option, index) => {
                  let bgColor = 'bg-white/60 backdrop-blur-sm hover:bg-white/80';
                  let borderColor = 'border-transparent';
                  let ringColor = '';
                  let resultIcon = null;

                  if (isAnswerRevealed) {
                    if (option.isLie) {
                      borderColor = 'border-green-500';
                      ringColor = 'ring-green-500';
                      bgColor = 'bg-green-500/20';
                      if (selectedCardIndex === index) {
                        resultIcon = <CheckCircle className="text-green-600" size={24} />;
                      } else {
                        borderColor = 'border-yellow-500';
                        ringColor = 'ring-yellow-500';
                        bgColor = 'bg-yellow-500/20';
                        resultIcon = <Target className="text-yellow-600 opacity-90" size={24} />;
                      }
                    } else if (selectedCardIndex === index && !option.isLie) {
                      borderColor = 'border-red-500';
                      ringColor = 'ring-red-500';
                      bgColor = 'bg-red-500/20';
                      resultIcon = <XCircle className="text-red-600" size={24} />;
                    } else {
                      bgColor = 'bg-gray-500/10';
                      borderColor = 'border-gray-300';
                    }
                  }

                  return (
                    <motion.div
                      key={option.id}
                      custom={index}
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={!isAnswerRevealed ? "hover" : undefined}
                      whileTap={!isAnswerRevealed ? "tap" : undefined}
                      onClick={() => handleCardSelect(index)}
                      onKeyDown={(e) => e.key === 'Enter' && !isAnswerRevealed && handleCardSelect(index)}
                      tabIndex={isAnswerRevealed ? -1 : 0}
                      role="button"
                      aria-pressed={selectedCardIndex === index}
                      aria-label={`Statement option ${index + 1}: ${option.text}${isAnswerRevealed ? (option.isLie ? '. This was the lie.' : '. This was true.') : '. Select if you think this is the lie.'}`}
                      className={`rounded-2xl p-6 shadow-lg min-h-[150px] md:min-h-[180px] flex flex-col justify-center items-center text-center relative cursor-pointer transition-all duration-200 ease-in-out border-2 ${bgColor} ${borderColor} ${ringColor ? 'ring-2 ' + ringColor : ''}`}
                    >
                      <p className={`text-md font-medium ${isAnswerRevealed && !option.isLie && selectedCardIndex !== index ? 'text-gray-500' : 'text-primary'}`}>{option.text}</p>
                      {isAnswerRevealed && resultIcon && (
                        <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} className="absolute top-2 right-2">
                          {resultIcon}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              {feedbackMessage && isAnswerRevealed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-lg font-semibold mb-4"
                >
                  {feedbackMessage}
                </motion.p>
              )}

              {isAnswerRevealed && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNextRound}
                  className="bg-primary text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-primary/80 transition-colors flex items-center mx-auto"
                >
                  {currentRoundIndex < rounds.length - 1 ? 'Next Round' : 'Finish Game'}
                  <Sparkles size={18} className="ml-2"/>
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} className="text-center bg-gradient-to-br from-aqua/30 to-mauve/30 p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md">
            <Trophy size={64} className="text-yellow-500 mx-auto mb-4 drop-shadow-lg"/>
            <h2 className="text-3xl font-bold text-primary mb-3 font-heading">
              Well Done{username ? `, ${username}` : ''}! 🎉
            </h2>
            <p className="text-xl text-gray-700 mb-2">You completed all rounds!</p>
            <p className="text-2xl font-semibold text-primary mb-6">Final Score: {score} / {rounds.length}</p>
            <div className="mb-6 p-3 bg-lime/30 rounded-lg">
                <p className="text-lg font-semibold text-green-700">You've earned the</p>
                <p className="text-xl font-bold text-primary flex items-center justify-center"><Award size={24} className="mr-2 text-mauve"/> Lie Detector Badge</p>
                <p className="text-xs text-gray-600 mt-1">(Badge system integration coming soon!)</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button onClick={restartGame} className="bg-lime text-primary font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-lime/80 transition-colors flex items-center justify-center" whileHover={{scale:1.05}} whileTap={{scale:0.95}}><RefreshCw size={18} className="mr-2"/> Play Again</motion.button>
                <motion.button onClick={() => router.push('/games')} className="bg-mauve text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-mauve/80 transition-colors flex items-center justify-center" whileHover={{scale:1.05}} whileTap={{scale:0.95}}><Sparkles size={18} className="mr-2"/> More Games</motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default TwoTruthsAndALiePage; 