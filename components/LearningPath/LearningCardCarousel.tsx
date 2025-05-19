'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../data/learningCourses'; // Use Card interface from new data file

interface LearningCardCarouselProps {
  cards: Card[];
  onComplete: () => void;
}

const LearningCardCarousel: React.FC<LearningCardCarouselProps> = ({ cards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); 

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      // Reached the end of cards
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (!cards || cards.length === 0) {
    return <p className="text-center text-gray-500">No learning cards available for this module.</p>;
  }

  const currentCard: Card = cards[currentIndex];
  const progressPercentage = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const isLastCard = currentIndex === cards.length - 1;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center font-sans my-6 md:my-10">
      {/* Progress Bar and Indicator */}
      <div className="w-full px-2 sm:px-0 mb-4">
        <div className="text-center text-primary font-semibold mb-2">
          Card {currentIndex + 1} of {cards.length}
        </div>
        <div className="h-2.5 w-full bg-gray-200 rounded-full">
          <motion.div 
            className="h-2.5 bg-gradient-to-r from-lime to-aqua rounded-full shadow-md"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
        </div>
      </div>

      <div className="relative w-full h-[480px] sm:h-[420px] flex items-center justify-center overflow-hidden mb-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex} 
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            className={`absolute w-[90%] sm:w-[85%] h-full p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center ${currentCard.bgColor || 'bg-gradient-to-br from-bg to-gray-100'}`}
          >
            <div className="flex flex-col items-center justify-center flex-grow">
              {currentCard.icon && (
                <motion.div 
                  className="text-5xl sm:text-6xl mb-4 text-primary drop-shadow-md"
                  initial={{ scale: 0.5, opacity: 0}}
                  animate={{ scale: 1, opacity: 1, transition: { delay: 0.2, type: 'spring' }}}
                >
                  {currentCard.icon}
                </motion.div>
              )}
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold text-primary font-heading mb-3 drop-shadow-sm"
                initial={{ y: -10, opacity: 0}}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 }}}
              >
                {currentCard.title}
              </motion.h2>
              <motion.p 
                className="text-gray-700 text-sm sm:text-md leading-relaxed max-h-[150px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent"
                initial={{ y: 10, opacity: 0}}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.4 }}}
              >
                {currentCard.body}
              </motion.p>
            </div>
            {currentCard.image && (
              <motion.img 
                src={currentCard.image} 
                alt={currentCard.title} 
                className="mt-4 rounded-lg max-h-28 sm:max-h-32 object-contain"
                initial={{ opacity: 0}}
                animate={{ opacity: 1, transition: { delay: 0.5 }}}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex w-full max-w-xs gap-4">
        <motion.button
          onClick={handlePrevious}
          className="flex-1 bg-mauve/70 hover:bg-mauve text-white font-bold py-3 px-6 rounded-xl shadow-soft hover:shadow-lg transition-all duration-200 font-heading disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentIndex === 0}
        >
          ⬅️ Prev
        </motion.button>
        <motion.button
          onClick={handleNext}
          className={`flex-1 text-white font-bold py-3 px-6 rounded-xl shadow-soft hover:shadow-lg transition-all duration-200 font-heading ${isLastCard ? 'bg-green-500 hover:bg-green-600' : 'bg-lime/90 hover:bg-lime text-primary'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLastCard ? 'Finish Module 🎉' : 'Next ➡️'}
        </motion.button>
      </div>
    </div>
  );
};

export default LearningCardCarousel; 