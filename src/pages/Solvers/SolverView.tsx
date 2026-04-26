import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SolverView: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full h-full flex flex-col gap-6"
    >
      <h1 className="text-4xl font-bold font-heading text-center" style={{ color: 'var(--text-primary)' }}>
        {type} Solver
      </h1>
      <div className="grid grid-cols-4 md:grid-cols-12 gap-6 flex-1">
        <div 
          className="col-span-4 md:col-span-8 backdrop-blur-sm border rounded-2xl h-[500px] flex items-center justify-center shadow-sm"
          style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>Interactive {type} Solver Canvas Placeholder</p>
        </div>
        <div 
          className="col-span-4 md:col-span-4 backdrop-blur-sm border rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
        >
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Color picker and solver controls will go here.</p>
        </div>
      </div>
    </motion.div>
  );
};
