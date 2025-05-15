import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground'; // Assuming this is in the same components folder

// Animation variants (can be shared or component-specific)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

function WelcomeMessageView({ currentUser, onContinue }) {
  const userName = currentUser || "New Spark";

  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8  text-foreground relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedBackground shapeCount={4} />

      <motion.div 
        variants={itemVariants} // Card itself can animate in as an item
        className="relative z-10 bg-app-white/95 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl lg:max-w-3xl text-center"
      >
        <motion.h1 
          variants={itemVariants} 
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-fido-cherry mb-6 sm:mb-8 drop-shadow-lg"
        >
          🌟 Welcome to FIDO Spark, <span className="text-fido-aqua">{userName}</span>! 🌟
        </motion.h1>
        
        {/* Scrollable content area for the message */}
        <motion.div 
          variants={itemVariants}
          className="text-left space-y-4 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-h-[50vh] sm:max-h-[45vh] overflow-y-auto px-2 sm:px-4 rounded-lg custom-scrollbar"
        >
          {/* We can stagger these paragraphs too if desired */}
          <motion.p variants={itemVariants}>Congratulations, and welcome aboard! 🎉</motion.p>
          <motion.p variants={itemVariants}>Your journey to making a lasting impact in the lives of millions of Africans has just begun—and we're thrilled to have you with us.</motion.p>
          <motion.p variants={itemVariants}>You are now part of a mission-driven team that believes in empowering people and transforming communities. Take pride in the journey you're embarking on—you're not just joining a company, you're joining a movement.</motion.p>
          <motion.p variants={itemVariants}>Your onboarding will be hosted on Fido Spark, our virtual onboarding platform. The program runs over a 2-week window, and the best part? It's flexible—you can go through the modules at your own pace, and return at any time during the period.</motion.p>
          <motion.p variants={itemVariants}>💬 Got questions as you go along? Each module has a Q&A section where you can drop your queries. The right person from the team will jump in to provide answers and guidance.</motion.p>
          <motion.p variants={itemVariants}>At the end of your onboarding, you'll take a gamified test to wrap things up. Aim high—you'll need to score at least 90% to pass!</motion.p>
          <motion.p variants={itemVariants} className="font-semibold text-gray-800">We're excited for all you'll learn, contribute, and accomplish at Fido. Let's spark something great together.</motion.p>
          <motion.p variants={itemVariants} className="font-bold text-fido-cherry mt-4">Welcome to the team. Welcome to Fido.</motion.p>
        </motion.div>

        <motion.button 
          variants={itemVariants}
          onClick={onContinue}
          className="w-full sm:w-auto bg-fido-cherry text-app-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl shadow-lg text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-fido-cherry focus:ring-offset-2 focus:ring-offset-app-white/80 transform transition-all duration-150 ease-in-out"
          whileHover={{ scale: 1.05, y: -3, boxShadow: "0px 10px 20px rgba(214, 8, 107, 0.3)" }}
          whileTap={{ scale: 0.98, y: 0 }}
        >
          Let's Go! &rarr;
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default WelcomeMessageView; 