import React from 'react';
import type { Axis } from '../../types/cube';

interface CubeControlPanelProps {
  size: number;
  moves: Record<string, [Axis, any, number]>;
  isAnimating: boolean;
  rotateLayer: (axis: Axis, layer: number | number[], angle: number) => Promise<void>;
  shuffle?: () => void;
  reset?: () => void;
  resetCamera?: () => void;
  engineReady: boolean;
}

export const CubeControlPanel: React.FC<CubeControlPanelProps> = ({
  size,
  moves,
  isAnimating,
  rotateLayer,
  shuffle,
  reset,
  resetCamera,
  engineReady
}) => {
  const getDisplayKeys = (cubeSize: number): string[] => {
    if (cubeSize === 2) return ['U', 'D', 'L', 'R', 'F', 'B'];
    if (cubeSize === 3) return ['U', 'D', 'L', 'R', 'F', 'B', 'M', 'E', 'S'];
    if (cubeSize === 4 || cubeSize === 5) {
      return ['U', 'D', 'L', 'R', 'F', 'B', 'Uw', 'Dw', 'Lw', 'Rw', 'Fw', 'Bw'];
    }
    return ['U', 'D', 'L', 'R', 'F', 'B'];
  };

  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-6">
      {/* Controls Card */}
      <div className="p-6 backdrop-blur-2xl rounded-3xl border shadow-xl transition-colors duration-300"
           style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          Control Panel
        </h2>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {getDisplayKeys(size).map((key) => {
            const moveDef = moves[key];
            if (!moveDef) return null;
            return (
              <button
                key={key}
                onClick={() => rotateLayer(moveDef[0], moveDef[1], moveDef[2])}
                disabled={isAnimating}
                className={`
                  px-4 py-2.5 rounded-xl font-bold transition-all border
                  active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                  border-[var(--glass-border)] text-[var(--text-primary)]
                  bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20
                `}
              >
                {key}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => shuffle?.()}
            disabled={!engineReady}
            className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            Random Shuffle
          </button>
          <button
            onClick={() => reset?.()}
            disabled={!engineReady}
            className="w-full py-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 border border-[var(--glass-border)] text-[var(--text-primary)] bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
          >
            Reset to Solved
          </button>
          <button
            onClick={() => resetCamera?.()}
            disabled={!engineReady || !resetCamera}
            className="w-full py-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 border border-[var(--glass-border)] text-[var(--text-primary)] bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
          >
            Reset Orientation
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Card */}
      <div className="p-6 backdrop-blur-2xl rounded-3xl border shadow-xl transition-colors duration-300"
           style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
        <h3 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
          Keyboard Shortcuts
        </h3>
        <ul className="text-sm space-y-3">
          <li className="flex justify-between items-center text-[var(--text-primary)]">
            <span className="font-mono px-2 py-0.5 rounded text-xs border bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/10">
              R, L, U, D, F, B
            </span>
            <span className="text-[var(--text-secondary)] font-medium">Rotate Face</span>
          </li>
          <li className="flex justify-between items-center text-[var(--text-primary)]">
            <span className="font-mono px-2 py-0.5 rounded text-xs border bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/10">
              Shift + Key
            </span>
            <span className="text-[var(--text-secondary)] font-medium">Counter Clockwise</span>
          </li>
          <li className="flex justify-between items-center text-[var(--text-primary)]">
            <span className="font-mono px-2 py-0.5 rounded text-xs border bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/10">
              Arrow Keys
            </span>
            <span className="text-[var(--text-secondary)] font-medium">Rotate Cube</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
