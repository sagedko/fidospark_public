'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { CheckCircle, XCircle, Sparkles, RefreshCw, Award, ArrowRight, Zap, Shuffle } from 'lucide-react';

interface FactOption {
  id: number;
  text: string;
  isCorrectMatch: boolean; // True if this is the correct fact to pick in the round
}

interface GameRound {
  id: string;
  prompt?: string; // Optional prompt for the round
  options: FactOption[];
}

const gameRounds: GameRound[] = [
  {
    id: 'round1',
    prompt: 'Which of these is a core FIDO S.P.A.R.K. value?',
    options: [
      { id: 1, text: 'Perfectionism', isCorrectMatch: false },
      { id: 2, text: 'Resilience', isCorrectMatch: true },
      { id: 3, text: 'Caution', isCorrectMatch: false },
    ],
  },
  {
    id: 'round2',
    prompt: 'What is the primary purpose of the FIDO Spark Learning Path?',
    options: [
      { id: 1, text: 'Advanced Software Development Training', isCorrectMatch: false },
      { id: 2, text: 'Annual Performance Reviews', isCorrectMatch: false },
      { id: 3, text: 'Employee Onboarding and Foundational Knowledge', isCorrectMatch: true },
    ],
  },
  {
    id: 'round3',
    prompt: 'Which technology is FIDO Spark primarily built with for its frontend?',
    options: [
      { id: 1, text: 'Next.js (React)', isCorrectMatch: true },
      { id: 2, text: 'Angular', isCorrectMatch: false },
      { id: 3, text: 'Vue.js', isCorrectMatch: false },
    ],
  },
];

const SpeedyFactMatchGamePage = () => {
  const router = useRouter();
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const currentRoundData = gameRounds[currentRoundIndex];

  const handleCardSelect = (selectedIndex: number) => {
    if (isAnswerRevealed) return;

    setSelectedCardIndex(selectedIndex);
    setIsAnswerRevealed(true);
    const selectedOption = currentRoundData.options[selectedIndex];
    const wasCorrect = selectedOption.isCorrectMatch;

    if (wasCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage("⚡️ Quick and Correct!");
      const gameScore = { gameId: 'speedyFactMatch', score: score + 1, roundsPlayed: gameRounds.length };
      localStorage.setItem('speedyFactMatchScore', JSON.stringify(gameScore));
    } else {
      setFeedbackMessage("🐌 A bit off! Try the next one.");
    }
  };

  const handleNextRound = () => {
    setFeedbackMessage(null);
    if (currentRoundIndex < gameRounds.length - 1) {
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
    setGameOver(false);
    setFeedbackMessage(null);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.85 },
    animate: (i:number) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 110, damping: 13 }
    }),
    hover: { scale: 1.04, boxShadow: "0px 8px 18px rgba(0,0,0,0.08)" },
    tap: { scale: 0.96 }
  };

  if (!currentRoundData && !gameOver) {
    return <Layout><BackButton /><div className="text-center p-8 text-xl text-slate-500">Loading facts...</div></Layout>;
  }

  return (
    <Layout>
      <BackButton />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-lime via-aqua to-green-400">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl text-center ring-1 ring-black/5"
        >
          <Zap className="mx-auto text-yellow-400 mb-3 h-10 w-10 drop-shadow-lg" />
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-bold text-primary font-heading mb-1 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-lime"
          >
            Speedy Fact Match
          </motion.h1>
          {currentRoundData?.prompt && !gameOver && (
             <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.05 }}
                className="text-slate-600 mb-1 text-lg"
             >
                {currentRoundData.prompt}
             </motion.p>
          )}
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-6 md:mb-8"
          >
            {gameOver ? "Game Over! How speedy were you?" : `Round ${currentRoundIndex + 1} of ${gameRounds.length}. Pick the correct fact!`}
          </motion.p>

          {!gameOver ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentRoundIndex} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="w-full"
              >
                <div className="grid grid-cols-1 gap-4 md:gap-5 mb-6">
                  {currentRoundData.options.map((option, index) => {
                    let cardStyle = 'bg-white/70 hover:bg-white/90 backdrop-blur-sm';
                    let ringStyle = 'ring-slate-300 hover:ring-lime';
                    let iconToShow = null;

                    if (isAnswerRevealed) {
                      ringStyle = 'ring-2';
                      if (option.isCorrectMatch) {
                        cardStyle = 'bg-green-500/20';
                        ringStyle += ' ring-green-500';
                        iconToShow = <CheckCircle className="text-green-600" size={22} />;
                      } else if (selectedCardIndex === index && !option.isCorrectMatch) {
                        cardStyle = 'bg-red-500/20';
                        ringStyle += ' ring-red-500';
                        iconToShow = <XCircle className="text-red-600" size={22} />;
                      } else {
                        cardStyle = 'bg-slate-500/10 opacity-60';
                        ringStyle += ' ring-slate-400';
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
                        className={`rounded-xl p-4 shadow-md min-h-[60px] flex justify-between items-center text-left cursor-pointer transition-all duration-150 ease-in-out ring-1 ${cardStyle} ${ringStyle}`}
                      >
                        <p className={`text-md font-medium ${isAnswerRevealed && !option.isCorrectMatch && selectedCardIndex !== index ? 'text-slate-500' : 'text-slate-700'}`}>{option.text}</p>
                        {isAnswerRevealed && iconToShow && (
                          <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} className="ml-3 flex-shrink-0">
                            {iconToShow}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                {feedbackMessage && isAnswerRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-lg font-semibold my-4 flex items-center justify-center gap-2"
                  >
                    {feedbackMessage.startsWith('⚡️') ? <Sparkles size={22} className="text-yellow-500"/> : <Shuffle size={22} className="text-red-500"/> }
                    <span>{feedbackMessage}</span>
                  </motion.div>
                )}

                {isAnswerRevealed && (
                  <motion.button
                    onClick={handleNextRound}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-10 rounded-xl shadow-lg transition-colors flex items-center justify-center mx-auto text-lg mt-4"
                    variants={cardVariants} // Re-using for consistency, can be different
                    whileHover="hover" 
                    whileTap="tap"
                  >
                    {currentRoundIndex < gameRounds.length - 1 ? 'Next Round' : 'Finish Game'} <ArrowRight size={22} className="ml-2" />
                  </motion.button>
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
                Great Job{username ? `, ${username}` : ''}! ⚡️
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-2">You've matched the facts!</p>
              <p className="text-2xl md:text-3xl font-semibold text-lime drop-shadow-sm mb-8">
                Final Score: <span className="text-slate-700">{score}</span> / {gameRounds.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  onClick={restartGame} 
                  className="bg-lime text-primary font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center text-lg"
                  //variants={choiceButtonVariants} whileHover="hover" whileTap="tap" // choiceButtonVariants not defined here, using simple hover
                  whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                >
                  <RefreshCw size={20} className="mr-2"/> Play Again
                </motion.button>
                <motion.button 
                  onClick={() => router.push('/games')}
                  className="bg-mauve text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center text-lg"
                  //variants={choiceButtonVariants} whileHover="hover" whileTap="tap"
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

export default SpeedyFactMatchGamePage; 