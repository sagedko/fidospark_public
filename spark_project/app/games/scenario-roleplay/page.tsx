'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { Users, MessageSquare, CheckCircle, XCircle, RefreshCw, Award, ArrowRight } from 'lucide-react';

interface ScenarioOption {
  id: number;
  text: string; // Represents a possible response or action in a scenario
  isBestResponse: boolean; // True if this is the most appropriate response
}

interface GameRound {
  id: string;
  scenarioDescription: string; // e.g., "A client seems unhappy with the project progress. What do you do?"
  options: ScenarioOption[];
}

const gameRounds: GameRound[] = [
  {
    id: 'scenario1',
    scenarioDescription: 'You receive an urgent email from a colleague asking for sensitive project data while their manager is away. What is your best course of action?',
    options: [
      { id: 1, text: 'Immediately send the data to be helpful.', isBestResponse: false },
      { id: 2, text: 'Politely explain you cannot share it without their manager\'s approval or verifying the request through another channel.', isBestResponse: true },
      { id: 3, text: 'Ignore the email as it seems suspicious.', isBestResponse: false }, // Verifying is better than ignoring
    ],
  },
  {
    id: 'scenario2',
    scenarioDescription: 'During a team meeting, a colleague presents an idea you strongly disagree with. How should you voice your opinion?',
    options: [
      { id: 1, text: 'Wait for them to finish, then respectfully offer your perspective and reasons.', isBestResponse: true },
      { id: 2, text: 'Interrupt them immediately to point out the flaws in their idea.', isBestResponse: false },
      { id: 3, text: 'Stay silent to avoid conflict, even if you think it\'s a bad idea.', isBestResponse: false },
    ],
  },
  {
    id: 'scenario3',
    scenarioDescription: 'You accidentally discover a minor security vulnerability in a FIDO system. What should you do?',
    options: [
      { id: 1, text: 'Try to fix it yourself quietly without telling anyone.', isBestResponse: false },
      { id: 2, text: 'Report it immediately through the designated FIDO security reporting channel.', isBestResponse: true },
      { id: 3, text: 'Post about it on the company\'s internal social chat to see if others noticed.', isBestResponse: false },
    ],
  },
];

const ScenarioRoleplayGamePage = () => {
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
    const wasCorrect = selectedOption.isBestResponse;

    if (wasCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage("👍 Great Choice! That was the best response.");
      const gameScore = { gameId: 'scenarioRoleplay', score: score + 1, roundsPlayed: gameRounds.length };
      localStorage.setItem('scenarioRoleplayScore', JSON.stringify(gameScore));
    } else {
      setFeedbackMessage("🤔 Not the ideal response. Let\'s see the next scenario.");
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
    initial: { opacity: 0, x: -30, rotateY: -20 },
    animate: (i:number) => ({
      opacity: 1, x: 0, rotateY: 0,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 100, damping: 14 }
    }),
    hover: { scale: 1.03, boxShadow: "0px 6px 14px rgba(0,0,0,0.09)" },
    tap: { scale: 0.98 }
  };

  if (!currentRoundData && !gameOver) {
    return <Layout><BackButton /><div className="text-center p-8 text-xl text-slate-500">Loading scenarios...</div></Layout>;
  }

  return (
    <Layout>
      <BackButton />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500">
        <motion.div 
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', damping:10 }}
          className="w-full max-w-3xl bg-white/85 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl text-center ring-1 ring-black/5"
        >
          <Users className="mx-auto text-fuchsia-600 mb-3 h-10 w-10 drop-shadow-md" />
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-bold text-primary font-heading mb-2 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-indigo-600"
          >
            Workplace Scenario Challenge
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-4 md:mb-6"
          >
            {gameOver ? "Challenge Complete!" : `Scenario ${currentRoundIndex + 1} of ${gameRounds.length}. Choose the best response!`}
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
                {currentRoundData?.scenarioDescription && (
                    <motion.div 
                        initial={{opacity:0, y:-10}}
                        animate={{opacity:1, y:0, transition: {delay:0.1, duration:0.3}}}
                        className="mb-5 p-4 bg-slate-500/10 rounded-xl shadow text-slate-700 text-left text-md md:text-lg italic"
                    >
                        <MessageSquare size={20} className="inline mr-2 mb-1 text-fuchsia-500"/> {currentRoundData.scenarioDescription}
                    </motion.div>
                )}
                <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6">
                  {currentRoundData.options.map((option, index) => {
                    let cardStyle = 'bg-white/60 hover:bg-white/80 backdrop-blur-sm';
                    let ringStyle = 'ring-slate-300 hover:ring-fuchsia-500';
                    let iconToShow = null;

                    if (isAnswerRevealed) {
                      ringStyle = 'ring-2';
                      if (option.isBestResponse) {
                        cardStyle = 'bg-green-500/20';
                        ringStyle += ' ring-green-500';
                        iconToShow = <CheckCircle className="text-green-600" size={20} />;
                      } else if (selectedCardIndex === index && !option.isBestResponse) {
                        cardStyle = 'bg-red-500/20';
                        ringStyle += ' ring-red-500';
                        iconToShow = <XCircle className="text-red-600" size={20} />;
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
                        className={`rounded-lg p-4 shadow-md min-h-[50px] flex justify-between items-center text-left cursor-pointer transition-all duration-150 ease-in-out ring-1 ${cardStyle} ${ringStyle}`}
                      >
                        <p className={`text-sm md:text-base font-medium ${isAnswerRevealed && !option.isBestResponse && selectedCardIndex !== index ? 'text-slate-500' : 'text-slate-700'}`}>{option.text}</p>
                        {isAnswerRevealed && iconToShow && (
                          <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} className="ml-2 flex-shrink-0">
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
                    className="text-center text-md md:text-lg font-semibold my-3"
                  >
                    {feedbackMessage}
                  </motion.p>
                )}

                {isAnswerRevealed && (
                  <motion.button
                    onClick={handleNextRound}
                    className="bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:from-fuchsia-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-colors flex items-center justify-center mx-auto text-md md:text-lg mt-3"
                    whileHover={{scale:1.05, boxShadow: '0px 4px 12px rgba(0,0,0,0.2)'}}
                    whileTap={{scale:0.95}}
                  >
                    {currentRoundIndex < gameRounds.length - 1 ? 'Next Scenario' : 'Finish Challenge'} <ArrowRight size={20} className="ml-2" />
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
              <Award size={50} className="text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_8px_#FDE047BB]"/>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 font-heading">
                Well Done{username ? `, ${username}` : ''}! 🎭
              </h2>
              <p className="text-md md:text-lg text-slate-600 mb-1">You've navigated the scenarios!</p>
              <p className="text-xl md:text-2xl font-semibold text-lime drop-shadow-sm mb-6">
                Final Score: <span className="text-slate-700">{score}</span> / {gameRounds.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button 
                  onClick={restartGame} 
                  className="bg-lime text-primary font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center text-md md:text-lg"
                  whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                >
                  <RefreshCw size={18} className="mr-1.5"/> Try Again
                </motion.button>
                <motion.button 
                  onClick={() => router.push('/games')}
                  className="bg-mauve text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center text-md md:text-lg"
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

export default ScenarioRoleplayGamePage; 