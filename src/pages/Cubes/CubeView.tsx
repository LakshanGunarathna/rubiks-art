import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CubeView: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full h-full text-center"
    >
      <h1 className="text-4xl font-bold font-heading mb-6" style={{ color: 'var(--text-primary)' }}>
        Rubik's {type}
      </h1>
      <div
        className="backdrop-blur-sm border rounded-2xl h-[600px] flex items-center justify-center shadow-sm"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>Interactive {type} Cube Canvas Placeholder</p>
      </div>
    </motion.div>
  );
};
