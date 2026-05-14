import React from 'react';
import { ColorPalette } from './ColorPalette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUp, faArrowDown, faPlay, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

interface SolverSidebarProps {
  selectedColor: number;
  setSelectedColor: (color: number) => void;
  rotateWholeCube?: (axis: 'x' | 'y' | 'z', angle: number) => void;
  onSolve: () => void;
  onResetRequest: () => void;
  onDebugFill?: () => void;
  isAnimating: boolean;
  engineReady: boolean;
}

export const SolverSidebar: React.FC<SolverSidebarProps> = ({
  selectedColor,
  setSelectedColor,
  rotateWholeCube,
  onSolve,
  onResetRequest,
  onDebugFill,
  isAnimating,
  engineReady,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 backdrop-blur-2xl rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl transition-colors duration-300">
        <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Select Color to Paint</h2>
        <ColorPalette selectedColor={selectedColor} onSelectColor={setSelectedColor} />
        <p className="mt-4 italic text-xs text-center text-[var(--text-secondary)]">
          Select a color and click on tiles to paint the cube
        </p>
      </div>

      <div className="p-6 backdrop-blur-2xl rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl transition-colors duration-300">
        <h2 className="font-semibold mb-4 text-[var(--text-primary)]">Rotate Cube</h2>
        <div className="flex gap-2">
          <button onClick={() => rotateWholeCube?.('y', -Math.PI / 2)} className="flex-1 py-3 rounded-lg bg-white bg-opacity-10 text-[var(--text-primary)] hover:bg-opacity-20 transition-all disabled:opacity-50" disabled={!rotateWholeCube}><FontAwesomeIcon icon={faArrowLeft} /></button>
          <button onClick={() => rotateWholeCube?.('x', -Math.PI / 2)} className="flex-1 py-3 rounded-lg bg-white bg-opacity-10 text-[var(--text-primary)] hover:bg-opacity-20 transition-all disabled:opacity-50" disabled={!rotateWholeCube}><FontAwesomeIcon icon={faArrowUp} /></button>
          <button onClick={() => rotateWholeCube?.('x', Math.PI / 2)} className="flex-1 py-3 rounded-lg bg-white bg-opacity-10 text-[var(--text-primary)] hover:bg-opacity-20 transition-all disabled:opacity-50" disabled={!rotateWholeCube}><FontAwesomeIcon icon={faArrowDown} /></button>
          <button onClick={() => rotateWholeCube?.('y', Math.PI / 2)} className="flex-1 py-3 rounded-lg bg-white bg-opacity-10 text-[var(--text-primary)] hover:bg-opacity-20 transition-all disabled:opacity-50" disabled={!rotateWholeCube}><FontAwesomeIcon icon={faArrowRight} /></button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <button 
          onClick={onSolve} 
          disabled={!engineReady || isAnimating}
          className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faPlay} />
          Solve Now
        </button>
        <button 
          onClick={onResetRequest} 
          disabled={!engineReady || isAnimating}
          className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faRotateLeft} />
          Reset
        </button>

        {import.meta.env.DEV && onDebugFill && (
          <button 
            onClick={onDebugFill}
            className="w-full py-2 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white/60 hover:border-white/40 text-xs transition-all mt-2"
          >
            [DEV] Quick Fill (Scramble)
          </button>
        )}
      </div>
    </div>
  );
};
