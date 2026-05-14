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

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
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
            className="w-12 h-12 rounded-full bg-white text-blue-600 hover:bg-gray-100 flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-12 h-12 rounded-full bg-white text-blue-600 hover:bg-gray-100 flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Step"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-bold">
          <span>Slower</span>
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
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
