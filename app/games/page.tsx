'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '../../components/Shared/Layout';
import BackButton from '../../components/Shared/BackButton';
import { Sparkles, Puzzle, CheckSquare, Users, Clock, Shuffle, Brain, Gamepad2 } from 'lucide-react'; // Example icons

interface GameInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode; // Can be an emoji string or a Lucide icon component
  routePath: string;
  gradient: string; // Tailwind CSS gradient classes
  hoverEffect?: string; // e.g. hover:shadow-lime/40
}

const games: GameInfo[] = [
  {
    id: 'two-truths-lie',
    name: 'Two Truths and a Lie',
    description: 'Pick the false statement from three facts about FIDO.',
    icon: <Users size={48} className="text-white/80 group-hover:text-white transition-colors" />,
    routePath: '/games/two-truths-lie',
    gradient: 'from-purple-500 to-pink-500',
    hoverEffect: 'hover:shadow-pink-500/40'
  },
  {
    id: 'agree-disagree',
    name: 'Agree or Disagree',
    description: 'Click left to disagree or right to agree with statements.',
    icon: <Shuffle size={48} className="text-white/80 group-hover:text-white transition-colors" />,
    routePath: '/games/agree-disagree',
    gradient: 'from-sky-500 to-indigo-500',
    hoverEffect: 'hover:shadow-indigo-500/40'
  },
  {
    id: 'speedy-fact-match',
    name: 'Speedy Fact Match',
    description: 'Drag and drop matching pairs of FIDO facts quickly.',
    icon: <Puzzle size={48} className="text-white/80 group-hover:text-white transition-colors" />,
    routePath: '/games/speedy-fact-match',
    gradient: 'from-green-500 to-teal-500',
    hoverEffect: 'hover:shadow-teal-500/40'
  },
  {
    id: 'policy-puzzle',
    name: 'Policy Puzzle',
    description: 'Assemble puzzle pieces representing company policies.',
    icon: <Puzzle size={48} className="text-white/80 group-hover:text-white transition-colors" />, // Re-using, can change
    routePath: '/games/policy-puzzle',
    gradient: 'from-yellow-500 to-amber-500',
    hoverEffect: 'hover:shadow-amber-500/40'
  },
  {
    id: 'true-false-rapid',
    name: 'True or False Rapid Fire',
    description: 'Answer true/false questions against the clock.',
    icon: <Clock size={48} className="text-white/80 group-hover:text-white transition-colors" />,
    routePath: '/games/true-false-rapid',
    gradient: 'from-red-500 to-orange-500',
    hoverEffect: 'hover:shadow-orange-500/40'
  },
  {
    id: 'scenario-roleplay',
    name: 'Scenario Roleplay Quiz',
    description: 'Choose the best action in real workplace scenarios.',
    icon: <Users size={48} className="text-white/80 group-hover:text-white transition-colors" />, // Re-using, can change
    routePath: '/games/scenario-roleplay',
    gradient: 'from-rose-500 to-fuchsia-500',
    hoverEffect: 'hover:shadow-fuchsia-500/40'
  },
  {
    id: 'memory-card-game',
    name: 'Memory Card Game',
    description: 'Flip cards to match pairs of onboarding content.',
    icon: <Brain size={48} className="text-white/80 group-hover:text-white transition-colors" />,
    routePath: '/games/memory-card-game',
    gradient: 'from-cyan-500 to-blue-500',
    hoverEffect: 'hover:shadow-blue-500/40'
  },
];

const GameSelectionPage = () => {
  const router = useRouter();

  const handleGameSelect = (path: string) => {
    // Optional: Add loading spinner or transition effect here
    router.push(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  return (
    <Layout>
      <BackButton />
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-primary font-heading mb-4 drop-shadow-md"
        >
          <Gamepad2 size={48} className="inline-block mr-3 mb-2 text-mauve"/> Choose Your Game!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-600 mb-10 md:mb-12"
        >
          Make onboarding fun by playing these exciting mini-games!
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              variants={cardVariants}
              className={`rounded-2xl shadow-lg overflow-hidden text-white cursor-pointer group relative ${game.hoverEffect || 'hover:shadow-xl'}`}
              style={{ background: `linear-gradient(to right, ${game.gradient.split(' ').join(', ')})` }} // Simplified gradient application
              onClick={() => handleGameSelect(game.routePath)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleGameSelect(game.routePath)}
              aria-label={`Play ${game.name}`}
            >
              <div className={`bg-gradient-to-r ${game.gradient} p-6 md:p-8 h-full flex flex-col items-center justify-center text-center min-h-[280px] md:min-h-[320px]`}>
                <motion.div 
                    className="mb-4 text-white drop-shadow-lg"
                    whileHover={{ rotate: [0, 10, -10, 10, 0], scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                  {React.isValidElement(game.icon) ? game.icon : <span className="text-5xl md:text-6xl">{game.icon}</span>}
                  <Sparkles size={24} className="absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping group-hover:animate-none" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold font-heading mb-2 drop-shadow-sm">{game.name}</h3>
                <p className="text-sm opacity-90 leading-relaxed px-2">{game.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default GameSelectionPage; 