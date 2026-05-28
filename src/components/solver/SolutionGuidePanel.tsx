import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

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
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-100/50 backdrop-blur-md rounded-2xl border border-[var(--glass-border)] shadow-xl w-full">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="text-[var(--text-secondary)] font-medium text-sm">
          Step {currentStep} / {totalSteps}
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-100 flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-full bg-blue-600 text-white hover:bg-blue-500 flex items-center justify-center transition-all shadow-lg active:scale-95 scale-110"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={onNext}
            disabled={currentStep === totalSteps}
            className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-100 flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Step"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-bold">
          <span>Slower</span>
          <span className="text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 shadow-sm">
            {(playbackSpeed / 1000).toFixed(1)}s / step
          </span>
          <span>Faster</span>
        </div>
        <input 
          type="range" 
          min="300" 
          max="2000" 
          step="100"
          value={2300 - playbackSpeed} 
          onChange={(e) => setPlaybackSpeed(2300 - parseInt(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
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

  return (
    <div className="flex flex-col gap-6">
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

      <div className="p-6 backdrop-blur-2xl rounded-3xl border border-[var(--glass-border)] bg-gray-100/50 shadow-xl transition-colors duration-300 relative overflow-hidden">
        <h2 className="font-semibold mb-2 text-[var(--text-primary)]">Instruction</h2>

        {!isStart && !isEnd && (
          <div className="absolute top-4 right-6">
            {lastActionDir === -1 ? (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold rounded-full border border-yellow-500/30 backdrop-blur-sm">
                Undo Step {currentStepIndex + 1}: {currentMove.raw}'
              </span>
            ) : (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30 backdrop-blur-sm">
                Step {currentStepIndex}: {currentMove.raw}
              </span>
            )}
          </div>
        )}

        <div className="min-h-[60px] flex flex-col justify-center mt-2">
          <p className="text-[var(--text-primary)] font-medium text-lg leading-relaxed pr-16">
            {instructionText}
          </p>
        </div>
      </div>

      <div className="p-6 backdrop-blur-2xl rounded-3xl border border-[var(--glass-border)] bg-gray-100/50 shadow-xl transition-colors duration-300">
        <h2 className="font-semibold mb-4 text-[var(--text-primary)]">All Steps</h2>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {solutionSteps.map((step, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-md text-sm font-mono font-bold transition-all duration-300 ${i === currentStepIndex - 1
                ? 'bg-blue-600 text-white shadow-md scale-110 z-10'
                : i < currentStepIndex - 1
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-[var(--text-primary)] bg-white/10 border border-white/5'
                }`}
            >
              {step.raw}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-center text-[var(--text-secondary)] font-medium">
          Follow the steps to solve your cube
        </p>
      </div>

      <button
        onClick={onBackToPaint}
        className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-bold border border-[var(--glass-border)] transition-all shadow-lg active:scale-95"
      >
        Back to Painting
      </button>
    </div>
  );
};
