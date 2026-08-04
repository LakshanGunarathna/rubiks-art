import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  onPrev,
  onNext,
  onTogglePlay,
}) => {
  return (
    <div className="shrink-0 flex flex-col items-center gap-3 p-4 bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] shadow-lg w-full">
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          Step {currentStep} / {totalSteps}
        </span>
        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
          {(playbackSpeed / 1000).toFixed(1)}s / step
        </span>
      </div>

      <div className="flex items-center justify-center gap-5 w-full my-0.5">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Previous Step"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <button
          onClick={onTogglePlay}
          className="w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-500 flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
        </button>

        <button
          onClick={onNext}
          disabled={currentStep === totalSteps}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Next Step"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="w-full flex items-center gap-2 pt-0.5">
        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Slower</span>
        <input 
          type="range" 
          min="300" 
          max="2000" 
          step="100"
          value={2300 - playbackSpeed} 
          onChange={(e) => setPlaybackSpeed(2300 - parseInt(e.target.value))}
          className="w-full h-1.5 bg-blue-200 dark:bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Faster</span>
      </div>
    </div>
  );
};

interface SolutionGuidePanelProps {
  currentStepIndex: number;
  solutionSteps: any[];
  isPlaying: boolean;
  lastActionDir: 1 | -1;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onBackToPaint: () => void;
  getInstruction: (step: string, isUndo: boolean) => string;
}

export const SolutionGuidePanel: React.FC<SolutionGuidePanelProps> = ({
  currentStepIndex,
  solutionSteps,
  isPlaying,
  lastActionDir,
  playbackSpeed,
  setPlaybackSpeed,
  onPrev,
  onNext,
  onTogglePlay,
  onBackToPaint,
  getInstruction,
}) => {
  const activeStepRef = useRef<HTMLSpanElement | null>(null);

  const isStart = currentStepIndex === 0 && lastActionDir === 1;
  const isEnd = currentStepIndex >= solutionSteps.length;

  const currentMove = lastActionDir === 1
    ? solutionSteps[currentStepIndex - 1]
    : solutionSteps[currentStepIndex];

  const instructionText = isStart
    ? "Hold your puzzle as shown below, hit 'next' to start."
    : isEnd
      ? "Cube Solved!"
      : getInstruction(currentMove.raw, lastActionDir === -1);

  // Auto-scroll active move into view
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStepIndex]);

  return (
    <div className="flex flex-col gap-3.5 h-full">
      <PlaybackControls
        currentStep={currentStepIndex}
        totalSteps={solutionSteps.length}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        onPrev={onPrev}
        onNext={onNext}
        onTogglePlay={onTogglePlay}
      />

      <div className="shrink-0 p-4 backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Instruction</h2>
          {!isStart && !isEnd && (
            <div>
              {lastActionDir === -1 ? (
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded-full border border-amber-500/30 backdrop-blur-sm">
                  Undo Step {currentStepIndex + 1}: {currentMove.raw}'
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-500 dark:text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30 backdrop-blur-sm">
                  Step {currentStepIndex}: {currentMove.raw}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="min-h-[44px] flex items-center">
          <p className="text-[var(--text-primary)] font-semibold text-base leading-snug">
            {instructionText}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-4 backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">All Steps</h2>
        </div>

        <div className="flex flex-wrap content-start items-start gap-1.5 overflow-y-auto custom-scrollbar flex-1 min-h-0 pr-1 py-1">
          {solutionSteps.map((step, i) => {
            const isActive = i === currentStepIndex - 1;
            const isPassed = i < currentStepIndex - 1;
            return (
              <span
                key={i}
                ref={isActive ? activeStepRef : null}
                className={`px-2.5 h-7 inline-flex items-center justify-center rounded-lg text-xs font-mono font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md scale-105 z-10'
                    : isPassed
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-[var(--text-primary)] bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10'
                }`}
              >
                {step.raw}
              </span>
            );
          })}
        </div>

        <p className="mt-2 text-[10px] text-center text-[var(--text-secondary)] font-medium shrink-0">
          Follow the steps to solve your cube
        </p>
      </div>

      <button
        onClick={onBackToPaint}
        className="shrink-0 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-bold border border-[var(--glass-border)] transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} />
        Back to Painting
      </button>
    </div>
  );
};
