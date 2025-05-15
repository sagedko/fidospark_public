import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 }); // Initial off-screen
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isClickedState, setIsClickedState] = useState(false); // To manage click visual state briefly

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsClickedState(true);
      // Keep 'clicked' variant for a short duration or until mouse up for visual feedback
      // The main 'clicked' variant handles the immediate visual change
    };
    
    const handleMouseUp = () => {
      setIsClickedState(false);
      // The cursorVariant will revert based on hover state in the other useEffect
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    // Debounce or throttle this if performance becomes an issue
    const elementMouseIsOver = document.elementFromPoint(mousePosition.x, mousePosition.y);
    let newVariant = 'default';

    if (elementMouseIsOver) {
      if (elementMouseIsOver.closest('[data-cursor-interactive="button"]')) {
        newVariant = 'hoverButton';
      } else if (elementMouseIsOver.closest('input, textarea, [data-cursor-interactive="text"]')) {
        newVariant = 'text';
      }
      // Add more conditions for other interactive elements if needed
    }
    
    // If currently clicked, override with 'clicked' variant, otherwise use detected variant
    setCursorVariant(isClickedState ? 'clicked' : newVariant);

  }, [mousePosition, isClickedState]);

  const mainDotSize = 12;
  const trailSize = 36;

  const cursorVariants = {
    default: {
      height: mainDotSize,
      width: mainDotSize,
      backgroundColor: 'hsl(var(--fido-aqua-hsl))',
      boxShadow: '0 0 12px hsl(var(--fido-aqua-hsl)), 0 0 20px hsl(var(--fido-aqua-hsl))',
      opacity: 0.85,
      scale: 1,
    },
    hoverButton: {
      height: mainDotSize * 1.5,
      width: mainDotSize * 1.5,
      backgroundColor: 'hsl(var(--fido-lime-hsl))', // Yellowish glow for buttons
      boxShadow: '0 0 15px hsl(var(--fido-lime-hsl)), 0 0 25px hsl(var(--fido-lime-hsl))',
      opacity: 0.9,
      scale: 1.1,
    },
    text: { // Slimmer, less obtrusive for text input
      height: mainDotSize * 1.2,
      width: 2,
      backgroundColor: 'hsl(var(--fido-mauve-hsl))',
      boxShadow: '0 0 8px hsl(var(--fido-mauve-hsl))',
      opacity: 0.8,
      borderRadius: '1px',
    },
    clicked: {
      height: mainDotSize, // Return to normal size or slightly smaller before scaling
      width: mainDotSize,
      backgroundColor: 'hsl(var(--fido-cherry-hsl))', // Cherry for click
      boxShadow: '0 0 18px hsl(var(--fido-cherry-hsl)), 0 0 30px hsl(var(--fido-cherry-hsl))',
      opacity: 1,
      scale: 1.3, // Main click scaling effect
    },
  };

  const trailSpring = { type: 'spring', stiffness: 250, damping: 25, mass: 0.8 };
  const dotSpring = { type: 'spring', stiffness: 450, damping: 30, mass: 0.5 };

  return (
    <>
      {/* Trail Element */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          width: trailSize,
          height: trailSize,
          border: '2px solid hsl(var(--fido-aqua-hsl))', // Default trail color
          opacity: 0.4,
        }}
        animate={{
          x: mousePosition.x - trailSize / 2,
          y: mousePosition.y - trailSize / 2,
          borderColor: cursorVariant === 'hoverButton' ? 'hsl(var(--fido-lime-hsl))' : 
                       cursorVariant === 'clicked' ? 'hsl(var(--fido-cherry-hsl))' : 
                       'hsl(var(--fido-aqua-hsl))',
          scale: cursorVariant === 'hoverButton' ? 1.2 : cursorVariant === 'clicked' ? 0.8 : 1,
        }}
        transition={trailSpring}
      />
      {/* Main Dot Element */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        variants={cursorVariants}
        animate={cursorVariant}
        initial="default"
        style={{
          x: mousePosition.x - mainDotSize / 2, // Centering based on initial size
          y: mousePosition.y - mainDotSize / 2,
        }}
        // Adjust x,y in variants if size changes, or transformOrigin: 'center center'
        // For simplicity, direct x,y adjustment is done here based on typical mainDotSize
        // More precise centering would recalculate x,y in each variant based on its specific size
        // Or, ensure the motion.div's transform-origin is center and only animate scale and background.
        // The current variants directly control height/width, so this x/y should be okay for centering the visual effect.
        transition={dotSpring}
      />
    </>
  );
};

export default CustomCursor; 