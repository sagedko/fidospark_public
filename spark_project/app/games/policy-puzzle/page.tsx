'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { CheckCircle, XCircle, Puzzle, RefreshCw, Award, ArrowRight, Lightbulb } from 'lucide-react';

interface PuzzlePieceOption {
  id: number;
  text: string; // Represents a policy statement or a piece of a policy
  isCorrectPiece: boolean; // True if this is the correct piece to solve the current puzzle aspect
}

interface GameRound {
  id: string;
  puzzlePrompt: string; // e.g., "Which policy covers remote work etiquette?"
  options: PuzzlePieceOption[];
}

const gameRounds: GameRound[] = [
  {
    id: 'puzzle1',
    puzzlePrompt: 'Which of these is part of our Data Security Policy?',
    options: [
      { id: 1, text: 'Use strong, unique passwords.', isCorrectPiece: true },
      { id: 2, text: 'Share login details with team members for efficiency.', isCorrectPiece: false },
      { id: 3, text: 'Store sensitive data on personal USB drives.', isCorrectPiece: false },
    ],
  },
  {
    id: 'puzzle2',
    puzzlePrompt: 'What is a key component of the FIDO Code of Conduct?',
    options: [
      { id: 1, text: 'Respectful communication with colleagues.', isCorrectPiece: true },
      { id: 2, text: 'Prioritizing personal tasks over team goals during work hours.', isCorrectPiece: false },
      { id: 3, text: 'Ignoring company-wide announcements.', isCorrectPiece: false },
    ],
  },
  {
    id: 'puzzle3',
    puzzlePrompt: 'Our Social Media Policy advises employees to:',
    options: [
      { id: 1, text: 'Always state that their personal opinions represent FIDO.', isCorrectPiece: false },
      { id: 2, text: 'Be mindful of confidentiality when posting online.', isCorrectPiece: true },
      { id: 3, text: 'Engage in online arguments to defend the company brand aggressively.', isCorrectPiece: false },
    ],
  },
];

const PolicyPuzzleGamePage = () => {
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
    const wasCorrect = selectedOption.isCorrectPiece;

    if (wasCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage("🧩 Piece Fitted! Correct!");
      const gameScore = { gameId: 'policyPuzzle', score: score + 1, roundsPlayed: gameRounds.length };
      localStorage.setItem('policyPuzzleScore', JSON.stringify(gameScore));
    } else {
      setFeedbackMessage("🤔 That piece doesn't seem to fit...");
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
    initial: { opacity: 0, rotateY: 90 },
    animate: (i:number) => ({
      opacity: 1, rotateY: 0,
      transition: { delay: i * 0.15, type: 'spring', stiffness: 90, damping: 10 }
    }),
    hover: { scale: 1.03, y: -5, boxShadow: "0px 7px 15px rgba(0,0,0,0.07)" },
    tap: { scale: 0.97 }
  };

  if (!currentRoundData && !gameOver) {
    return <Layout><BackButton /><div className="text-center p-8 text-xl text-slate-500">Loading puzzle pieces...</div></Layout>;
  }

  return (
    <Layout>
      <BackButton />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness:100, damping:12 }}
          className="w-full max-w-2xl bg-white/85 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl text-center ring-1 ring-black/5"
        >
          <Puzzle className="mx-auto text-orange-600 mb-3 h-10 w-10 drop-shadow-md" />
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-bold text-primary font-heading mb-1 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-red-600"
          >
            Policy Puzzle Challenge
          </motion.h1>
          {currentRoundData?.puzzlePrompt && !gameOver && (
             <motion.p 
                initial={{ opacity: 0}}
                animate={{ opacity: 1}} 
                transition={{ delay: 0.05 }}
                className="text-slate-600 mb-1 text-lg"
             >
                {currentRoundData.puzzlePrompt}
             </motion.p>
          )}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-6 md:mb-8"
          >
            {gameOver ? "Puzzle Mastered!" : `Puzzle ${currentRoundIndex + 1} of ${gameRounds.length}. Find the correct piece!`}
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
                    let ringStyle = 'ring-slate-300 hover:ring-amber-500';
                    let iconToShow = null;

                    if (isAnswerRevealed) {
                      ringStyle = 'ring-2';
                      if (option.isCorrectPiece) {
                        cardStyle = 'bg-green-500/20';
                        ringStyle += ' ring-green-500';
                        iconToShow = <CheckCircle className="text-green-600" size={22} />;
                      } else if (selectedCardIndex === index && !option.isCorrectPiece) {
                        cardStyle = 'bg-red-500/20';
                        ringStyle += ' ring-red-500';
                        iconToShow = <XCircle className="text-red-600" size={22} />;
                      } else {
                        cardStyle = 'bg-slate-500/10 opacity-70';
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
                        className={`rounded-xl p-5 shadow-lg min-h-[70px] flex justify-between items-center text-left cursor-pointer transition-all duration-150 ease-in-out ring-1 ${cardStyle} ${ringStyle}`}
                      >
                        <p className={`text-md font-medium ${isAnswerRevealed && !option.isCorrectPiece && selectedCardIndex !== index ? 'text-slate-500' : 'text-slate-800'}`}>{option.text}</p>
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
                    {feedbackMessage.startsWith('🧩') ? <Lightbulb size={22} className="text-yellow-500"/> : <Puzzle size={22} className="text-red-500"/> }
                    <span>{feedbackMessage}</span>
                  </motion.div>
                )}

                {isAnswerRevealed && (
                  <motion.button
                    onClick={handleNextRound}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-10 rounded-xl shadow-lg transition-colors flex items-center justify-center mx-auto text-lg mt-4"
                    whileHover={{scale:1.05, boxShadow: '0px 5px 15px rgba(0,0,0,0.2)'}}
                    whileTap={{scale:0.95}}
                  >
                    {currentRoundIndex < gameRounds.length - 1 ? 'Next Puzzle Piece' : 'Finish Puzzle'} <ArrowRight size={22} className="ml-2" />
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
                Puzzle Solved{username ? `, ${username}` : ''}! 🧩
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-2">You've pieced together the policies!</p>
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

export default PolicyPuzzleGamePage; 