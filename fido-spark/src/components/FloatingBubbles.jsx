import React, { useEffect, useState } from 'react';

const FloatingBubbles = ({ count = 20 }) => {
  const [bubbles, setBubbles] = useState([]);

  // Define theme colors to pick from. Ensure these match your tailwind.config.js
  const themeColorClasses = [
    'bg-primary', // LIME
    'bg-secondary', // AQUA
    'bg-accent',    // MAUVE
    // Add more if you like, e.g., a less intense version of destructive if suitable
  ];

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 60 + 10; // Bubbles between 10px and 70px
        const TthemeColorClass = themeColorClasses[Math.floor(Math.random() * themeColorClasses.length)];
        newBubbles.push({
          id: i,
          style: {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 15 + 10}s`, // Duration between 10s and 25s
            animationDelay: `${Math.random() * 10}s`,      // Delay up to 10s
            // Opacity can be handled by the animation or a base class
          },
          colorClass: TthemeColorClass,
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, [count]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`bubble ${bubble.colorClass}`}
          style={bubble.style}
        />
      ))}
    </div>
  );
};

export default FloatingBubbles; 