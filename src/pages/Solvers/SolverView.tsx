import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import * as Rubiks2x2Solver from '../../utils/solver2x2';
import * as Rubiks3x3Solver from '../../utils/solver3x3';
import * as Rubiks4x4Solver from '../../utils/solver4x4';
import * as Rubiks5x5Solver from '../../utils/solver5x5';

const Solver3DWrapper = lazy(() => import('../../components/solver/Solver3DWrapper'));

import { RUBIKS_CUBE_COLORS } from '../../types/cube';
import type { PaintedPiece } from '../../types/cube';
import { getStickerMat } from '../../utils/cubeUtils';
import { Loader2 } from 'lucide-react';

import { CubePainterPanel } from '../../components/solver/CubePainterPanel';
import { SolutionGuidePanel } from '../../components/solver/SolutionGuidePanel';
import { ErrorModal, SolvedModal, ResetConfirmation, LoadingOverlay } from '../../components/solver/SolverOverlays';

import { getHumanReadableMove } from '../../utils/cubeFormatters';
import { OPPOSITE_COLORS, MOVES_2X2, MOVES_3X3 } from '../../utils/cubeConstants';
import { getCubeArray2x2, getCubeString3x3, getCubeString4x4, getCubeString5x5 } from '../../utils/cubeStateUtils';
import { autoDeducePieces, autoFillCenters } from '../../utils/cubeAutoPainter';
import { 
  validate2x2, validate3x3, validate4x4, validate5x5, 
  checkIfSolved2x2, checkIfSolved3x3, checkIfSolved4x4, checkIfSolved5x5 
} from '../../utils/cubeValidation';

const LoadingCube = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white rounded-3xl">
    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
    <p className="font-medium opacity-80">Loading 3D Cube...</p>
  </div>
);

export const SolverView: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  let size: number = 3;
  if (type === '2x2') size = 2;
  else if (type === '4x4') size = 4;
  else if (type === '5x5') size = 5;

  const [engine, setEngine] = useState<any>(null);
  const cubiesRef = engine?.cubiesRef;
  const rotateLayer = engine?.rotateLayer;
  const rotateWholeCube = engine?.rotateWholeCube;
  const snapReset = engine?.snapReset;
  const isAnimating = engine?.isAnimating || false;

  const [phase, setPhase] = useState<'paint' | 'playback'>('paint');
  const [selectedColor, setSelectedColor] = useState(RUBIKS_CUBE_COLORS.white);
  const [solutionSteps, setSolutionSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(500);

  const solveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solveAbortControllerRef = useRef<AbortController | null>(null);
  const [lastActionDir, setLastActionDir] = useState<1 | -1>(1);

  // Overlay states
  const [errors, setErrors] = useState<string[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSolvedModalOpen, setIsSolvedModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoadingOverlayOpen, setIsLoadingOverlayOpen] = useState(false);

  const resetToGray = useCallback(() => {
    if (!cubiesRef?.current) return;
    const noiseTexture = engine?.noiseTexture || null;
    cubiesRef.current.forEach((cubie: any) => {
      cubie.children.forEach((child: any) => {
        if (child.userData.isSticker) {
          child.material = getStickerMat(RUBIKS_CUBE_COLORS.gray, noiseTexture);
        }
      });
    });
    setPhase('paint');
    setErrors([]);
    setSolutionSteps([]);
    setCurrentStepIndex(0);
  }, [cubiesRef, engine]);

  const initializedRef = useRef<string | null>(null);
  useEffect(() => {
    if (engine && initializedRef.current !== type) {
      if (snapReset) snapReset();
      resetToGray();
      initializedRef.current = type || '3x3';
    }
  }, [engine, type, snapReset, resetToGray]);



  const handleStickerClick = useCallback((cubie: any, sticker: any) => {
    if (phase !== 'paint') return;
    if (!sticker.userData?.isSticker) return;
    const noiseTexture = engine?.noiseTexture || null;
    sticker.material = getStickerMat(selectedColor, noiseTexture);

    const absSum = Math.abs(Math.round(cubie.position.x)) +
      Math.abs(Math.round(cubie.position.y)) +
      Math.abs(Math.round(cubie.position.z));

    if (absSum === 1) {
      const oppositeColor = OPPOSITE_COLORS[selectedColor];
      if (oppositeColor !== undefined) {
        const oppX = -Math.round(cubie.position.x);
        const oppY = -Math.round(cubie.position.y);
        const oppZ = -Math.round(cubie.position.z);
        const oppCubie = cubiesRef?.current?.find((c: any) =>
          Math.round(c.position.x) === oppX &&
          Math.round(c.position.y) === oppY &&
          Math.round(c.position.z) === oppZ
        );
        if (oppCubie) {
          const oppSticker = oppCubie.children.find((child: any) => child.userData?.isSticker);
          if (oppSticker) {
            oppSticker.material = getStickerMat(oppositeColor, noiseTexture);
          }
        }
      }
    }

    autoFillCenters(cubiesRef, engine, size);
    setTimeout(() => autoDeducePieces(cubiesRef, engine, size), 0);
  }, [phase, selectedColor, engine, cubiesRef, size]);

  const handleStartSolve = async () => {
    setErrors([]);

    try {
      if (solveAbortControllerRef.current) {
        solveAbortControllerRef.current.abort();
      }
      solveAbortControllerRef.current = new AbortController();

      const colorCounts: Record<number, number> = {};
      let hasUnpainted = false;
      const paintedPieces: PaintedPiece[] = [];

      cubiesRef.current.forEach((cubie: THREE.Object3D) => {
        const stickers = cubie.children.filter((c: any) => c.userData?.isSticker);
        const pieceColors: number[] = [];
        stickers.forEach((s: any) => {
          const hex = s.material.color.getHex();
          if (hex === RUBIKS_CUBE_COLORS.gray) hasUnpainted = true;
          else {
            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            pieceColors.push(hex);
          }
        });
        if (pieceColors.length > 0) paintedPieces.push({ cubie, colors: pieceColors });
      });

      if (size === 2) {
        const colorErrors = validate2x2(hasUnpainted, colorCounts);
        if (colorErrors.length > 0) {
          setErrors(colorErrors);
          setIsErrorModalOpen(true);
          return;
        }

        const posit = getCubeArray2x2(cubiesRef);
        if (checkIfSolved2x2(posit)) {
          setIsSolvedModalOpen(true);
          return;
        }

        setIsLoadingOverlayOpen(true);

        const movesArr = Rubiks2x2Solver.solve(posit);
        if (typeof movesArr === 'string') {
          throw new Error(movesArr);
        }

        const steps = movesArr.map((m: string) => {
          const face = m[0];
          const mod = m.length > 1 ? m[1] : '';
          const moveDef = MOVES_2X2[face];
          let angle = moveDef[2];
          if (mod === "'") angle = -angle;
          if (mod === "2") angle = angle * 2;
          return { raw: m, axis: moveDef[0], layer: moveDef[1], angle };
        });

        setSolutionSteps(steps);
      } else if (size === 3) {
        const validationErrors = validate3x3(hasUnpainted, colorCounts, paintedPieces);
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          setIsErrorModalOpen(true);
          return;
        }

        const cubeString = getCubeString3x3(cubiesRef);
        if (checkIfSolved3x3(cubeString)) {
          setIsSolvedModalOpen(true);
          return;
        }

        setIsLoadingOverlayOpen(true);

        const movesArr = await Rubiks3x3Solver.solve(cubeString);

        const steps = movesArr.map((m: string) => {
          const face = m[0];
          const mod = m[1] || '';
          const moveDef = MOVES_3X3[face];
          let angle = moveDef[2];
          if (mod === "'") angle = -angle;
          if (mod === "2") angle = angle * 2;
          return { raw: m, axis: moveDef[0], layer: moveDef[1], angle };
        });

        setSolutionSteps(steps);
      } else if (size === 4) {
        const colorErrors = validate4x4(hasUnpainted, colorCounts, paintedPieces);
        if (colorErrors.length > 0) {
          setErrors(colorErrors);
          setIsErrorModalOpen(true);
          return;
        }

        const cubeString = getCubeString4x4(cubiesRef);
        if (checkIfSolved4x4(cubeString)) {
          setIsSolvedModalOpen(true);
          return;
        }

        setIsLoadingOverlayOpen(true);
        const steps = await Rubiks4x4Solver.solve(cubeString, solveAbortControllerRef.current);
        setSolutionSteps(steps);
      } else if (size === 5) {
        const colorErrors = validate5x5(hasUnpainted, colorCounts);
        if (colorErrors.length > 0) {
          setErrors(colorErrors);
          setIsErrorModalOpen(true);
          return;
        }

        const cubeString = getCubeString5x5(cubiesRef);
        if (checkIfSolved5x5(cubeString)) {
          setIsSolvedModalOpen(true);
          return;
        }

        setIsLoadingOverlayOpen(true);
        const steps = await Rubiks5x5Solver.solve(cubeString, solveAbortControllerRef.current);
        setSolutionSteps(steps);
      }

      solveTimerRef.current = setTimeout(() => {
        setIsLoadingOverlayOpen(false);
        setPhase('playback');
        setCurrentStepIndex(0);
        solveTimerRef.current = null;
      }, 3000);

    } catch (err: any) {
      setIsLoadingOverlayOpen(false);
      if (err.name === 'AbortError') {
        console.log('Solve request cancelled.');
        return;
      }
      setErrors([err.message || "Your puzzle cannot be solved. Please check your color layout."]);
      setIsErrorModalOpen(true);
    }
  };

  const handleCancelSolve = () => {
    if (solveTimerRef.current) {
      clearTimeout(solveTimerRef.current);
      solveTimerRef.current = null;
    }
    if (solveAbortControllerRef.current) {
      solveAbortControllerRef.current.abort();
      solveAbortControllerRef.current = null;
    }
    setIsLoadingOverlayOpen(false);
  };

  const handleStep = async (direction: 1 | -1, isAuto: boolean = false) => {
    if (isAnimating) return;

    const duration = isAuto ? playbackSpeed * 0.6 : 500;

    if (direction === 1) {
      if (currentStepIndex >= solutionSteps.length) return;
      const step = solutionSteps[currentStepIndex];
      setLastActionDir(1);
      setCurrentStepIndex(prev => prev + 1);
      await rotateLayer(step.axis, step.layer, step.angle, duration);
    } else {
      if (currentStepIndex <= 0) return;
      const step = solutionSteps[currentStepIndex - 1];
      setLastActionDir(-1);
      setCurrentStepIndex(prev => prev - 1);
      await rotateLayer(step.axis, step.layer, -step.angle, duration);
    }
  };

  useEffect(() => {
    if (isPlaying && currentStepIndex < solutionSteps.length && !isAnimating) {
      const timer = setTimeout(() => handleStep(1, true), playbackSpeed * 0.4);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStepIndex >= solutionSteps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStepIndex, solutionSteps, isAnimating, playbackSpeed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6 pt-2 pb-12"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading transition-colors" style={{ color: 'var(--text-primary)' }}>
          {size === 2 ? "Mini Cube (2x2x2)" : size === 3 ? "Rubik's Cube (3x3x3)" : `Rubik's ${size}x${size}x${size}`}
        </h1>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-2/3 h-[350px] lg:h-[530px] relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl transition-colors duration-300">
          <Suspense fallback={<LoadingCube />}>
            <Solver3DWrapper
              size={size}
              phase={phase}
              onStickerClick={handleStickerClick}
              onEngineReady={setEngine}
            />
          </Suspense>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {phase === 'paint' ? (
              <motion.div key="paint" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CubePainterPanel
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  rotateWholeCube={rotateWholeCube}
                  onSolve={handleStartSolve}
                  onResetRequest={() => setIsResetModalOpen(true)}
                  isAnimating={isAnimating}
                  engineReady={!!engine}
                />
              </motion.div>
            ) : (
              <motion.div key="playback" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SolutionGuidePanel
                  currentStepIndex={currentStepIndex}
                  solutionSteps={solutionSteps}
                  isPlaying={isPlaying}
                  lastActionDir={lastActionDir}
                  playbackSpeed={playbackSpeed}
                  setPlaybackSpeed={setPlaybackSpeed}
                  onPrev={() => handleStep(-1)}
                  onNext={() => handleStep(1)}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                  onBackToPaint={() => setPhase('paint')}
                  getInstruction={(step, isUndo) => getHumanReadableMove(step, isUndo)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <LoadingOverlay isOpen={isLoadingOverlayOpen} onCancel={handleCancelSolve} />
      <ErrorModal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} errors={errors} />
      <SolvedModal isOpen={isSolvedModalOpen} onClose={() => setIsSolvedModalOpen(false)} />
      <ResetConfirmation isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} onConfirm={resetToGray} />
    </motion.div>
  );
};
