import React from 'react';
import { motion } from 'framer-motion';

const backgroundShapeVariants = {
  animate: (custom) => ({
    x: custom.x,
    y: custom.y,
    scale: custom.scale,
    rotate: custom.rotate,
    opacity: custom.opacity,
    transition: {
      duration: custom.duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    },
  }),
};

const AnimatedBackground = ({ shapeCount = 3 }) => {
  const shapes = React.useMemo(() => {
    const generatedShapes = [];
    const colors = ['bg-fido-aqua/30', 'bg-fido-lime/30', 'bg-fido-cherry/20', 'bg-fido-mauve/40'];
    for (let i = 0; i < shapeCount; i++) {
      const size = Math.random() * 200 + 100; // 100px to 300px
      generatedShapes.push({
        id: `shape-${i}`,
        colorClass: colors[i % colors.length],
        style: {
          width: size,
          height: size,
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 80}%`,
        },
        customAnimation: {
          x: [Math.random() * 40 - 20, Math.random() * 40 - 20],
          y: [Math.random() * 40 - 20, Math.random() * 40 - 20],
          scale: [1, 1.05 + Math.random() * 0.2],
          rotate: [0, Math.random() * 60 - 30],
          opacity: [0.2, 0.4 + Math.random() * 0.3],
          duration: 25 + Math.random() * 15,
        }
      });
    }
    return generatedShapes;
  }, [shapeCount]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {shapes.map(shape => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.colorClass} rounded-full`}
          style={shape.style}
          variants={backgroundShapeVariants}
          custom={shape.customAnimation}
          animate="animate"
        />
      ))}
    </div>
  );
};

export default AnimatedBackground; 