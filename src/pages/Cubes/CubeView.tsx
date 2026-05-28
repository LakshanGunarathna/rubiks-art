import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
const Cube3DWrapper = lazy(() => import('../../components/cube/Cube3DWrapper'));

import type { Axis } from '../../types/cube';

const LoadingCube = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white rounded-3xl">
    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
    <p className="font-medium opacity-80">Loading 3D Cube...</p>
  </div>
);

export const CubeView: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const is3x3 = type === '3x3x3-cube';
  const size = is3x3 ? 3 : 2;

  const [engine, setEngine] = useState<any>(null);
  const rotateLayer = engine?.rotateLayer;
  const snapReset = engine?.snapReset;
  const shuffle = engine?.shuffle;
  const reset = engine?.reset;
  const isAnimating = engine?.isAnimating;

  useEffect(() => {
    if (snapReset) snapReset();
  }, [type, snapReset]);


  const MOVES_3X3: Record<string, [Axis, number, number]> = {
    'L': ['x', -1, Math.PI / 2], 'M': ['x', 0, Math.PI / 2], 'R': ['x', 1, -Math.PI / 2],
    'U': ['y', 1, -Math.PI / 2], 'E': ['y', 0, Math.PI / 2], 'D': ['y', -1, Math.PI / 2],
    'F': ['z', 1, -Math.PI / 2], 'S': ['z', 0, -Math.PI / 2], 'B': ['z', -1, Math.PI / 2],
  };

  const MOVES_2X2: Record<string, [Axis, number, number]> = {
    'L': ['x', -0.5, Math.PI / 2], 'R': ['x', 0.5, -Math.PI / 2],
    'U': ['y', 0.5, -Math.PI / 2], 'D': ['y', -0.5, Math.PI / 2],
    'F': ['z', 0.5, -Math.PI / 2], 'B': ['z', -0.5, Math.PI / 2],
  };

  const moves = is3x3 ? MOVES_3X3 : MOVES_2X2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center pt-8"
    >
      {/* Cube Container */}
      <div className="w-full lg:w-2/3 h-[400px] lg:h-[550px] relative rounded-3xl overflow-hidden backdrop-blur-2xl border shadow-2xl transition-colors duration-300"
           style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
        <Suspense fallback={<LoadingCube />}>
          <Cube3DWrapper 
            size={size} 
            onEngineReady={setEngine}
          />
        </Suspense>
        
        {/* Info Overlay */}
        <div className="absolute top-6 left-6 pointer-events-none">
          <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">
            Rubik's {size}x{size}
          </h1>
          <p className="text-white text-opacity-60 text-sm">
            Drag to rotate layers • Arrow keys for cube rotation
          </p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="p-6 backdrop-blur-2xl rounded-3xl border shadow-xl transition-colors duration-300"
             style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Control Panel
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {Object.keys(moves).map((key) => (
              <button
                key={key}
                onClick={() => rotateLayer(...moves[key])}
                disabled={isAnimating}
                className={`
                  px-4 py-2 rounded-lg font-bold transition-all
                  bg-opacity-10 backdrop-blur-md border
                  hover:bg-opacity-20 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  border-white border-opacity-20 text-white
                `}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => shuffle?.()}
              disabled={!engine || isAnimating}
              className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              Random Shuffle
            </button>
            <button
              onClick={() => reset?.()}
              disabled={!engine || isAnimating}
              className="w-full py-4 rounded-xl font-bold bg-white bg-opacity-10 hover:bg-opacity-20 text-white border border-white border-opacity-10 transition-all active:scale-95 disabled:opacity-50"
            >
              Reset to Solved
            </button>
          </div>
        </div>

        <div className="p-6 backdrop-blur-2xl rounded-3xl border shadow-xl transition-colors duration-300"
             style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
            Keyboard Shortcuts
          </h3>
          <ul className="text-white text-opacity-80 text-sm space-y-2">
            <li className="flex justify-between"><span className="font-mono bg-white bg-opacity-10 px-1.5 rounded">R, L, U, D, F, B</span> <span>Rotate Face</span></li>
            <li className="flex justify-between"><span className="font-mono bg-white bg-opacity-10 px-1.5 rounded">Shift + Key</span> <span>Counter Clockwise</span></li>
            <li className="flex justify-between"><span className="font-mono bg-white bg-opacity-10 px-1.5 rounded">Arrow Keys</span> <span>Rotate Cube</span></li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
