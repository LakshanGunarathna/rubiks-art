import React from 'react';

interface CubeControlPanelProps {
  isAnimating: boolean;
  shuffle?: () => void;
  reset?: () => void;
  resetCamera?: () => void;
  engineReady: boolean;
}

export const CubeControlPanel: React.FC<CubeControlPanelProps> = ({
  isAnimating,
  shuffle,
  reset,
  resetCamera,
  engineReady
}) => {
  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-6">
      {/* Controls Card */}
      <div className="p-6 backdrop-blur-2xl rounded-3xl border shadow-xl transition-colors duration-300"
           style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          Control Panel
        </h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => shuffle?.()}
            disabled={!engineReady || isAnimating}
            className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            Random Shuffle
          </button>
          <button
            onClick={() => reset?.()}
            disabled={!engineReady || isAnimating}
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
