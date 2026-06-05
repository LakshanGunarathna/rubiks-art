import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { MOVES_2X2, MOVES_3X3, MOVES_4X4, MOVES_5X5 } from '../../utils/cubeConstants';
import { CubeControlPanel } from '../../components/cube/CubeControlPanel';
import * as Rubiks2x2Solver from '../../types/cube2x2';
import * as Rubiks3x3Solver from '../../types/cube3x3';
import * as Rubiks4x4Solver from '../../types/cube4x4';
import * as Rubiks5x5Solver from '../../types/cube5x5';
import { CubeFactsSection } from '../../components/cube/CubeFactsSection';

const Cube3DWrapper = lazy(() => import('../../components/cube/Cube3DWrapper'));

const LoadingCube = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white rounded-3xl">
    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
    <p className="font-medium opacity-80">Loading 3D Cube...</p>
  </div>
);

export const CubeView: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  let size = 3;
  if (type === '2x2') size = 2;
  else if (type === '3x3' || type === '3x3x3-cube') size = 3;
  else if (type === '4x4') size = 4;
  else if (type === '5x5') size = 5;

  let facts = Rubiks3x3Solver.FACTS_DATA;
  if (size === 2) facts = Rubiks2x2Solver.FACTS_DATA;
  else if (size === 4) facts = Rubiks4x4Solver.FACTS_DATA;
  else if (size === 5) facts = Rubiks5x5Solver.FACTS_DATA;

  const [engine, setEngine] = useState<any>(null);
  const rotateLayer = engine?.rotateLayer;
  const snapReset = engine?.snapReset;
  const shuffle = engine?.shuffle;
  const reset = engine?.reset;
  const isAnimating = engine?.isAnimating;

  useEffect(() => {
    if (snapReset) snapReset();
  }, [type, snapReset]);

  const moves = size === 2 ? MOVES_2X2 : size === 3 ? MOVES_3X3 : size === 4 ? MOVES_4X4 : MOVES_5X5;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6 pt-2 pb-12">
      {/* Title Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading transition-colors" style={{ color: 'var(--text-primary)' }}>
          {size === 2 ? "Mini Cube (2x2x2)" : size === 3 ? "Rubik's Cube (3x3x3)" : size === 4 ? "Rubik's Revenge (4x4x4)" : "Professor's Cube (5x5x5)"}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center"
      >
        {/* Cube Container */}
        <div className="w-full lg:w-2/3 h-[350px] lg:h-[530px] relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl transition-colors duration-300">
          {/* Instruction Overlay */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center w-full px-4">
            <p className="text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}>
              Drag to rotate layers • Arrow keys for cube rotation
            </p>
          </div>

          <Suspense fallback={<LoadingCube />}>
            <Cube3DWrapper 
              size={size} 
              onEngineReady={setEngine}
            />
          </Suspense>
        </div>

        {/* Controls Panel & Shortcuts */}
        <CubeControlPanel
          size={size}
          moves={moves}
          isAnimating={isAnimating}
          rotateLayer={rotateLayer}
          shuffle={shuffle}
          reset={reset}
          resetCamera={engine?.resetCamera}
          engineReady={!!engine}
        />
      </motion.div>

      {/* Facts & Information Section */}
      <CubeFactsSection facts={facts} />
    </div>
  );
};
