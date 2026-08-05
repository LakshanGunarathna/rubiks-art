import React, { useState, useCallback, Suspense, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Play, Pause, X, Loader2, Eye, BookOpen, Sparkles, Info, ArrowRight } from 'lucide-react';
import { MOVES_2X2, MOVES_3X3, MOVES_4X4, MOVES_5X5 } from '../../utils/cubeConstants';
import { cubeArts, type CubeArt } from '../../data/cubeArts';

import Cube3DWrapper from '../cube/Cube3DWrapper';

interface ArtPlayerProps {
  art: CubeArt;
  onExit: () => void;
}

const LoadingCube = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white rounded-3xl">
    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
    <p className="font-medium opacity-80">Loading 3D Cube...</p>
  </div>
);

const FACE_NAMES: Record<string, string> = {
  'U': 'TOP', 'D': 'BOTTOM', 'F': 'FRONT', 'B': 'BACK', 'L': 'LEFT', 'R': 'RIGHT',
  'M': 'MIDDLE', 'E': 'EQUATOR', 'S': 'STANDING',
  'l': 'LEFT INNER', 'r': 'RIGHT INNER', 'u': 'TOP INNER', 'd': 'BOTTOM INNER', 'f': 'FRONT INNER', 'b': 'BACK INNER',
  'Lw': 'LEFT WIDE', 'Rw': 'RIGHT WIDE', 'Uw': 'TOP WIDE', 'Dw': 'BOTTOM WIDE', 'Fw': 'FRONT WIDE', 'Bw': 'BACK WIDE',
  'x': 'ENTIRE CUBE (X-axis)', 'y': 'ENTIRE CUBE (Y-axis)', 'z': 'ENTIRE CUBE (Z-axis)'
};

function getHumanReadableMove(rawMove: string) {
  const face = rawMove.replace(/[2']+/g, "");
  const mod = rawMove.replace(/^[a-zA-Z]+/g, "");
  const faceName = FACE_NAMES[face] || face;
  if (mod.includes("'")) return `Turn the ${faceName} layer 90° counterclockwise.`;
  if (mod.includes("2")) return `Turn the ${faceName} layer 180°.`;
  return `Turn the ${faceName} layer 90° clockwise.`;
}

function getReverseHumanReadableMove(rawMove: string) {
  const face = rawMove.replace(/[2']+/g, "");
  const mod = rawMove.replace(/^[a-zA-Z]+/g, "");
  const faceName = FACE_NAMES[face] || face;
  if (mod.includes("'")) return `Turn the ${faceName} layer 90° clockwise.`;
  if (mod.includes("2")) return `Turn the ${faceName} layer 180°.`;
  return `Turn the ${faceName} layer 90° counterclockwise.`;
}

function getInverseMoveNotation(rawMove: string) {
  const face = rawMove.replace(/[2']+/g, "");
  const mod = rawMove.replace(/^[a-zA-Z]+/g, "");
  if (mod.includes("'")) return face;
  if (mod.includes("2")) return face + "2'";
  return face + "'";
}

export const ArtPlayer: React.FC<ArtPlayerProps> = ({ art, onExit }) => {
  const navigate = useNavigate();
  const size = art.type === '2x2x2' ? 2 : art.type === '4x4x4' ? 4 : art.type === '5x5x5' ? 5 : 3;
  const movesDict = size === 2 ? MOVES_2X2 : size === 4 ? MOVES_4X4 : size === 5 ? MOVES_5X5 : MOVES_3X3;

  const [engine, setEngine] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastActionDirection, setLastActionDirection] = useState(1);
  const [is3DViewOpen, setIs3DViewOpen] = useState(false);
  const [modalEngine, setModalEngine] = useState<any>(null);
  const [modalReadyTrigger, setModalReadyTrigger] = useState(0);
  const [isModalLoading, setIsModalLoading] = useState(true);

  // Auto playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const activeStepRef = useRef<HTMLSpanElement | null>(null);

  const handleModalEngineReady = useCallback((eng: any) => {
    const prevCb = eng.onCubiesInit;
    eng.onCubiesInit = () => {
      if (prevCb) prevCb();
      setModalReadyTrigger(prev => prev + 1);
    };
    setModalEngine(eng);
    if (eng.cubiesRef?.current?.length > 0 || eng.isReady) {
      setModalReadyTrigger(prev => prev + 1);
    }
  }, []);

  // Ensure modal cubie readiness is continuously checked when modal is opened
  useEffect(() => {
    if (is3DViewOpen && modalEngine) {
      let cancelled = false;
      const checkReady = () => {
        if (cancelled) return;
        if (modalEngine.cubiesRef?.current?.length > 0 || modalEngine.isReady) {
          setModalReadyTrigger(prev => prev + 1);
        } else {
          requestAnimationFrame(checkReady);
        }
      };
      checkReady();
      return () => { cancelled = true; };
    }
  }, [is3DViewOpen, modalEngine]);

  const parsedMoves = useMemo(() => {
    const rawArray = art.moves.trim().split(/\s+/).filter(m => m);
    return rawArray.map(m => {
      let face = m.replace(/[2']+/g, "");
      let modifier = m.replace(/^[a-zA-Z]+/g, "");
      let moveDef = movesDict[face];

      if (!moveDef) {
        console.warn("Unknown move notation:", face, "in", m);
        return null;
      }
      let angle = moveDef[2] as number;
      if (modifier.includes("'")) angle = -angle;
      if (modifier.includes("2")) angle = angle * 2;
      return { raw: m, axis: moveDef[0], layer: moveDef[1], angle };
    }).filter(Boolean) as { raw: string, axis: any, layer: any, angle: number }[];
  }, [art.moves, movesDict]);

  // Related Arts (same cube type, excluding current)
  const relatedArts = useMemo(() => {
    return cubeArts
      .filter(item => item.type === art.type && item.id !== art.id)
      .slice(0, 4);
  }, [art]);

  const handleNext = useCallback(async () => {
    if (!engine || engine.isAnimating || engine.isAnimatingRef?.current || currentStep >= parsedMoves.length) return;
    const move = parsedMoves[currentStep];
    setLastActionDirection(1);
    setCurrentStep(prev => prev + 1);
    await engine.rotateLayer(move.axis, move.layer, move.angle, 350, false);
  }, [engine, currentStep, parsedMoves]);

  const handleBack = useCallback(async () => {
    if (!engine || engine.isAnimating || engine.isAnimatingRef?.current || currentStep <= 0) return;
    const newStep = currentStep - 1;
    setLastActionDirection(-1);
    setCurrentStep(newStep);
    const move = parsedMoves[newStep];
    await engine.rotateLayer(move.axis, move.layer, -move.angle, 350, false);
  }, [engine, currentStep, parsedMoves]);

  // Auto-playback effect
  useEffect(() => {
    if (isPlaying && currentStep < parsedMoves.length && !engine?.isAnimating && !engine?.isAnimatingRef?.current) {
      const timer = setTimeout(() => handleNext(), playbackSpeed * 0.4);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= parsedMoves.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, parsedMoves, engine, playbackSpeed, handleNext]);

  // Auto-scroll active move into view
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStep]);

  const handleSelectRelated = (slug: string) => {
    navigate(`/arts/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (is3DViewOpen && modalEngine && modalEngine.cubiesRef?.current?.length > 0 && currentStep >= 0) {
      const syncModalCube = () => {
        setIsModalLoading(true);

        if (modalEngine.pivotRef?.current) {
          modalEngine.pivotRef.current.rotation.set(0, 0, 0);
          while (modalEngine.pivotRef.current.children.length > 0) {
            const child = modalEngine.pivotRef.current.children[0];
            modalEngine.cubeGroupRef?.current?.attach(child);
            child.updateMatrixWorld(true);
          }
        }

        const mainCubies = engine?.cubiesRef?.current;
        const modalCubies = modalEngine.cubiesRef.current;

        if (mainCubies && mainCubies.length === modalCubies.length) {
          for (let i = 0; i < mainCubies.length; i++) {
            const src = mainCubies[i];
            const dest = modalCubies[i];
            if (src && dest) {
              if (dest.parent !== modalEngine.cubeGroupRef.current) {
                modalEngine.cubeGroupRef.current.attach(dest);
              }
              dest.position.copy(src.position);
              dest.quaternion.copy(src.quaternion);
              dest.updateMatrixWorld(true);
            }
          }
        } else {
          modalEngine.snapReset();
          for (let i = 0; i < currentStep; i++) {
            const move = parsedMoves[i];
            modalEngine.rotateLayer(move.axis, move.layer, move.angle, 0, false);
          }
        }

        setIsModalLoading(false);
      };

      syncModalCube();
    }
  }, [is3DViewOpen, modalEngine, modalReadyTrigger, currentStep, parsedMoves, engine]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 pt-2 pb-16">
      
      {/* Header Bar */}
      <div className="w-full flex justify-between items-center px-2 sm:px-4">
        <div>
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">{art.type} Pattern</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            #{art.id} - {art.name}
          </h1>
        </div>
        <button
          onClick={onExit}
          className="p-2.5 rounded-xl transition-all border shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)', color: 'var(--text-primary)' }}
        >
          <X className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Gallery</span>
        </button>
      </div>

      {/* Main 3D Canvas & Playback Guide Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center"
      >
        {/* Cube Container */}
        <div className="w-full lg:w-2/3 h-[350px] lg:h-[530px] relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl">
          <Suspense fallback={<LoadingCube />}>
            <Cube3DWrapper size={size} onEngineReady={setEngine} disableControls={true} disableSliceMoves={true} />
          </Suspense>
        </div>

        {/* Playback Controls & Side Panel */}
        <div className="w-full lg:w-1/3 lg:h-[530px] flex flex-col">
          <div className="flex flex-col gap-3.5 h-full">
            {/* Playback Controls Card */}
            <div className="shrink-0 flex flex-col items-center gap-3 p-4 bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] shadow-lg w-full">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Step {currentStep} / {parsedMoves.length}
                </span>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  {(playbackSpeed / 1000).toFixed(1)}s / step
                </span>
              </div>

              <div className="flex items-center justify-center gap-5 w-full my-0.5">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0 || engine?.isAnimating || engine?.isAnimatingRef?.current}
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-500 flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep >= parsedMoves.length || engine?.isAnimating || engine?.isAnimatingRef?.current}
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

            {/* Instruction Card */}
            <div className="shrink-0 p-4 backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg relative overflow-hidden text-left">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Instruction</h2>
                {currentStep > 0 && currentStep <= parsedMoves.length && (
                  <div>
                    {lastActionDirection === -1 ? (
                      <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded-full border border-amber-500/30 backdrop-blur-sm">
                        Undo Step {currentStep + 1}: {getInverseMoveNotation(parsedMoves[currentStep].raw)}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-500 dark:text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30 backdrop-blur-sm">
                        Step {currentStep}: {parsedMoves[currentStep - 1].raw}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="min-h-[44px] flex items-center">
                <p className="text-[var(--text-primary)] font-semibold text-base leading-snug">
                  {currentStep === 0 && lastActionDirection === 1
                    ? "Hold your SOLVED Cube with front face facing you, hit 'next' to start step-by-step turns."
                    : lastActionDirection === -1
                      ? getReverseHumanReadableMove(parsedMoves[currentStep].raw)
                      : getHumanReadableMove(parsedMoves[currentStep - 1].raw)
                  }
                </p>
              </div>
            </div>

            {/* All Steps Card (Fills remaining height) */}
            <div className="flex-1 min-h-0 p-4 backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg flex flex-col text-left">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">All Steps</h2>
              </div>

              <div className="flex flex-wrap content-start items-start gap-1.5 overflow-y-auto custom-scrollbar flex-1 min-h-0 pr-1 py-1">
                {parsedMoves.map((step, i) => {
                  const isActive = i === currentStep - 1;
                  const isPassed = i < currentStep - 1;
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
                Follow the steps to build your pattern
              </p>
            </div>

            {/* Bottom 3D View Button */}
            <button
              onClick={() => {
                setIsModalLoading(true);
                setIs3DViewOpen(true);
              }}
              className="shrink-0 w-full py-3 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white font-bold border border-purple-700/40 transition-all shadow-lg shadow-purple-950/30 active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Eye size={18} />
              3D View
            </button>
          </div>
        </div>
      </motion.div>

      {/* Below Player Content & Instructions */}
      <div className="w-full space-y-10 text-left mt-4">

        {/* Move Sequence & Notation Explanation */}
        <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                Full Algorithm Notation
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Moves: {parsedMoves.length} turns</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] font-mono text-sm tracking-wide break-words" style={{ color: 'var(--text-primary)' }}>
            {art.moves}
          </div>

          <div className="text-xs leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <p><strong>Notation Guide:</strong> <code>R</code>, <code>L</code>, <code>U</code>, <code>D</code>, <code>F</code>, <code>B</code> refer to Right, Left, Up, Down, Front, and Back faces.</p>
            <p>A prime symbol (<code>'</code>) means turn 90° counter-clockwise. A number <code>2</code> means turn 180°.</p>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                How to Use the Art Player
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Follow these quick steps to build this pattern on your physical cube</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white font-bold text-xs flex items-center justify-center">1</div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Start Solved</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Begin with a completely solved Rubik's cube. Hold your cube with the front face facing toward you.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white font-bold text-xs flex items-center justify-center">2</div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Press "Next"</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Click <strong>Next</strong> to execute each move one at a time. Watch the 3D model demonstrate the exact layer rotation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white font-bold text-xs flex items-center justify-center">3</div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Step Back / Undo</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Made a wrong move? Press <strong>Back</strong> to see the inverse rotation required to fix your physical cube.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white font-bold text-xs flex items-center justify-center">4</div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>3D Inspection</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Click <strong>Interactive 3D View</strong> to rotate the finished pattern 360° and inspect all six cube sides.
              </p>
            </div>
          </div>
        </div>

        {/* Related Art Patterns */}
        {relatedArts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                    Related {art.type} Patterns
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>More cube art patterns for {art.type} Rubik's Cubes</p>
                </div>
              </div>

              <button
                onClick={onExit}
                className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedArts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => handleSelectRelated(rel.slug)}
                  className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/40 flex flex-col justify-between"
                >
                  <div className="w-full aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-800/50 overflow-hidden relative mb-3">
                    <img
                      src={rel.imageUrl}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x225.png?text=${rel.id}`;
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">{rel.type}</span>
                    <h3 className="text-sm font-bold truncate text-slate-800 dark:text-white mt-0.5">{rel.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">#{rel.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3D View Modal */}
      {is3DViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-[#e2e8f0] rounded-[2rem] p-6 flex flex-col shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-xl font-bold text-[#0e2a52] font-heading">
                #{art.id} - {art.name}
              </h3>
              <button
                onClick={() => {
                  setIs3DViewOpen(false);
                  setModalEngine(null);
                  setIsModalLoading(true);
                }}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300/40 shadow-sm flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal 3D Canvas */}
            <div className="relative w-full aspect-[1.8] bg-[#cbd5e1] rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
              <Suspense fallback={<LoadingCube />}>
                <Cube3DWrapper
                  size={size}
                  onEngineReady={handleModalEngineReady}
                  disableSliceMoves={true}
                />
              </Suspense>

              {isModalLoading && (
                <div className="absolute inset-0 bg-[#cbd5e1] flex flex-col items-center justify-center z-10 text-slate-800 rounded-2xl">
                  <Loader2 className="w-10 h-10 animate-spin text-slate-600 mb-4" />
                  <p className="font-semibold text-sm text-slate-600 opacity-90">Synchronizing 3D View...</p>
                </div>
              )}
            </div>

            {/* Modal Footer/Controls Info */}
            <div className="mt-4 text-center text-xs text-slate-600 italic font-medium">
              You can rotate to view the pattern from all sides.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
