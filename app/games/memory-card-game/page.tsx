'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../../components/Shared/Layout';
import BackButton from '../../../components/Shared/BackButton';
import { Brain, CheckCircle, XCircle, RefreshCw, Award, ArrowRight, Shuffle } from 'lucide-react'; // Shuffle might fit memory game idea

// For a memory game, data would be pairs. For this template, it's still pick-one.
interface MemoryItemOption {
  id: number;
  text: string; // Represents an item/concept to remember or match
  isCorrectPick: boolean; // In this template, one is designated "correct" for the round
}

interface GameRound {
  id: string;
  prompt: string; // e.g., "Which of these terms was just shown?" or a matching question
  options: MemoryItemOption[];
}

const gameRounds: GameRound[] = [
  {
    id: 'memory_r1',
    prompt: 'Which FIDO Value is about continuous improvement and learning?',
    options: [
      { id: 1, text: 'Synergy', isCorrectPick: false },
      { id: 2, text: 'Kindness', isCorrectPick: false },
      { id: 3, text: 'Adaptability', isCorrectPick: true }, // Placeholder, actual value may vary
    ],
  },
  {
    id: 'memory_r2',
    prompt: 'What color is primarily associated with \'Playful Professionalism\' in FIDO Spark?',
    options: [
      { id: 1, text: 'Lime (#E8FF34)', isCorrectPick: true }, // Assuming Lime for playfulness
      { id: 2, text: 'Dark Grey', isCorrectPick: false },
      { id: 3, text: 'Crimson Red', isCorrectPick: false },
    ],
  },
  {
    id: 'memory_r3',
    prompt: 'Which path in FIDO Spark focuses on interactive challenges?',
    options: [
      { id: 1, text: 'The Resource Library', isCorrectPick: false },
      { id: 2, text: 'The Gaming Path', isCorrectPick: true },
      { id: 3, text: 'The Compliance Portal', isCorrectPick: false },
    ],
  },
];

const MemoryCardGamePage = () => {
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
    const wasCorrect = selectedOption.isCorrectPick;

    if (wasCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage("🧠 Sharp Memory! Correct!");
      const gameScore = { gameId: 'memoryCardGame', score: score + 1, roundsPlayed: gameRounds.length };
      localStorage.setItem('memoryCardGameScore', JSON.stringify(gameScore));
    } else {
      setFeedbackMessage("💨 Oops! Try to remember the next one.");
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
    initial: { opacity: 0, scale: 0.7, rotate: -15 },
    animate: (i:number) => ({
      opacity: 1, scale: 1, rotate: 0,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 100, damping: 11 }
    }),
    hover: { scale: 1.05, y:-2, boxShadow: "0px 5px 12px rgba(0,0,0,0.1)" },
    tap: { scale: 0.95 }
  };

  if (!currentRoundData && !gameOver) {
    return <Layout><BackButton /><div className="text-center p-8 text-xl text-slate-500">Shuffling cards...</div></Layout>;
  }

  return (
    <Layout>
      <BackButton />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-2xl text-center ring-1 ring-black/5"
        >
          <Brain className="mx-auto text-blue-600 mb-3 h-10 w-10 drop-shadow-md" />
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-bold text-primary font-heading mb-2 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Memory Match Challenge
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-6 md:mb-8"
          >
            {gameOver ? "Game Over! How good is your memory?" : `Round ${currentRoundIndex + 1} of ${gameRounds.length}. ${currentRoundData.prompt}`}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-6">
                  {currentRoundData.options.map((option, index) => {
                    let cardStyle = 'bg-white/70 hover:bg-white/90 backdrop-blur-sm';
                    let ringStyle = 'ring-slate-300 hover:ring-blue-500';
                    let iconToShow = null;
                    let isSelectedCorrect = selectedCardIndex !== null && currentRoundData.options[selectedCardIndex].isCorrectPick;

                    if (isAnswerRevealed) {
                      ringStyle = 'ring-2';
                      if (option.isCorrectPick) { // Always highlight the correct answer once revealed
                        cardStyle = 'bg-green-500/20';
                        ringStyle += ' ring-green-500';
                        iconToShow = <CheckCircle className="text-green-600" size={22} />;
                      } else if (selectedCardIndex === index && !option.isCorrectPick) { // If selected and wrong
                        cardStyle = 'bg-red-500/20';
                        ringStyle += ' ring-red-500';
                        iconToShow = <XCircle className="text-red-600" size={22} />;
                      } else { // Other non-correct, non-selected cards
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
                        className={`rounded-xl p-5 shadow-lg min-h-[120px] md:min-h-[140px] flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-150 ease-in-out ring-1 ${cardStyle} ${ringStyle}`}
                      >
                        <p className={`text-md font-semibold ${isAnswerRevealed && !option.isCorrectPick && selectedCardIndex !== index && !isSelectedCorrect ? 'text-slate-500' : 'text-slate-700'}`}>{option.text}</p>
                        {isAnswerRevealed && iconToShow && (
                          <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} className="absolute top-2 right-2">
                            {iconToShow}
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
                    className="text-center text-lg font-semibold my-4"
                  >
                    {feedbackMessage}
                  </motion.p>
                )}

                {isAnswerRevealed && (
                  <motion.button
                    onClick={handleNextRound}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-10 rounded-xl shadow-lg transition-colors flex items-center justify-center mx-auto text-lg mt-4"
                    whileHover={{scale:1.05, boxShadow: '0px 5px 15px rgba(0,0,0,0.2)'}}
                    whileTap={{scale:0.95}}
                  >
                    {currentRoundIndex < gameRounds.length - 1 ? 'Next Challenge' : 'Finish Game'} <ArrowRight size={22} className="ml-2" />
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
                Memory Mastered{username ? `, ${username}` : ''}! 🧠
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-2">Your memory served you well!</p>
              <p className="text-2xl md:text-3xl font-semibold text-lime drop-shadow-sm mb-8">
                Final Score: <span className="text-slate-700">{score}</span> / {gameRounds.length}
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

export default MemoryCardGamePage; 