import React from 'react';
import { PlaybackControls } from './PlaybackControls';

interface PlaybackPanelProps {
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

export const PlaybackPanel: React.FC<PlaybackPanelProps> = ({
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
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200">
                Undo Step {currentStepIndex + 1}: {currentMove.raw}'
              </span>
            ) : (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                Step {currentStepIndex}: {currentMove.raw}
              </span>
            )}
          </div>
        )}

        <div className="min-h-[60px] flex flex-col justify-center mt-2">
          <p className="text-[var(--text-primary)] font-medium text-base leading-relaxed pr-5">
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
                  ? 'bg-green-600 text-white'
                  : 'text-[var(--text-secondary)] bg-white bg-opacity-20'
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
        className="w-full py-4 rounded-2xl bg-white bg-opacity-10 hover:bg-opacity-20 text-[var(--text-primary)] font-semibold border border-white border-opacity-10 transition-all"
      >
        Back to Painting
      </button>
    </div>
  );
};
