import React from 'react';
import { motion } from 'framer-motion';

export const PuzzleArts: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full text-center"
    >
      <h1 className="text-4xl font-bold font-heading mb-6" style={{ color: 'var(--text-primary)' }}>
        Puzzle Arts Gallery
      </h1>
      <div 
        className="backdrop-blur-sm border rounded-2xl h-[600px] flex items-center justify-center shadow-sm"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>Puzzle Arts Gallery and Filter Sidebar Placeholder</p>
      </div>
    </motion.div>
  );
};
