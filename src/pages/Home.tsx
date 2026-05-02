import React from 'react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Discover Rubiks' Art
        </h1>
        <p 
          className="text-lg md:text-xl max-w-2xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          Interactive high-fidelity 3D Rubik's cubes. Learn, solve, and create beautiful puzzle arts.
        </p>
      </div>

      {/* Responsive Grid System: 4 cols mobile, 8 cols tablet, 12 cols desktop */}
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-6">
        {/* 3D Showcase Area */}
        <div 
          className="col-span-4 md:col-span-8 lg:col-span-8 backdrop-blur-sm border rounded-2xl h-[500px] flex items-center justify-center relative overflow-hidden shadow-sm"
          style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
        >
          {/* Future 3D content or showcase will be implemented here */}
        </div>

        {/* Info Cards Area */}
        <div className="col-span-4 md:col-span-8 lg:col-span-4 flex flex-col gap-6">
          <div 
            className="backdrop-blur-sm border rounded-2xl p-6 flex-1 shadow-sm"
            style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
          >
            <h2 className="text-2xl font-semibold mb-2">Interactive Solvers</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Step-by-step interactive 3D guides to solve 2x2 to 5x5 cubes.</p>
          </div>
          <div 
            className="backdrop-blur-sm border rounded-2xl p-6 flex-1 shadow-sm"
            style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
          >
            <h2 className="text-2xl font-semibold mb-2">Puzzle Arts</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Explore and create amazing pixel art patterns on your cubes.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
