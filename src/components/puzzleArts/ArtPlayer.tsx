import React, { useState, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Loader2, Eye } from 'lucide-react';
import { MOVES_2X2, MOVES_3X3, MOVES_4X4, MOVES_5X5 } from '../../utils/cubeConstants';
import type { CubeArt } from '../../data/cubeArts';

const Cube3DWrapper = lazy(() => import('../cube/Cube3DWrapper'));

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
  const size = art.type === '2x2x2' ? 2 : art.type === '4x4x4' ? 4 : art.type === '5x5x5' ? 5 : 3;
  const movesDict = size === 2 ? MOVES_2X2 : size === 4 ? MOVES_4X4 : size === 5 ? MOVES_5X5 : MOVES_3X3;

  const [engine, setEngine] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastActionDirection, setLastActionDirection] = useState(1);
  const [is3DViewOpen, setIs3DViewOpen] = useState(false);
  const [modalEngine, setModalEngine] = useState<any>(null);
  const [modalReadyTrigger, setModalReadyTrigger] = useState(0);
  const [isModalLoading, setIsModalLoading] = useState(true);

  const handleModalEngineReady = useCallback((eng: any) => {
    eng.onCubiesInit = () => {
      setModalReadyTrigger(prev => prev + 1);
    };
    setModalEngine(eng);
    if (eng.cubiesRef?.current?.length > 0) {
      setModalReadyTrigger(prev => prev + 1);
    }
  }, []);

  const parsedMoves = React.useMemo(() => {
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

  const handleNext = useCallback(async () => {
    if (!engine || engine.isAnimating || engine.isAnimatingRef?.current || currentStep >= parsedMoves.length) return;
    const move = parsedMoves[currentStep];
    setLastActionDirection(1);
    setCurrentStep(prev => prev + 1);
    await engine.rotateLayer(move.axis, move.layer, move.angle, 450, false);
  }, [engine, currentStep, parsedMoves]);

  const handleBack = useCallback(async () => {
    if (!engine || engine.isAnimating || engine.isAnimatingRef?.current || currentStep <= 0) return;
    const newStep = currentStep - 1;
    setLastActionDirection(-1);
    setCurrentStep(newStep);
    const move = parsedMoves[newStep];
    await engine.rotateLayer(move.axis, move.layer, -move.angle, 450, false);
  }, [engine, currentStep, parsedMoves]);

  React.useEffect(() => {
    if (modalEngine && modalEngine.cubiesRef?.current?.length > 0 && currentStep >= 0) {
      const initModalCube = async () => {
        setIsModalLoading(true);
        modalEngine.snapReset();
        for (let i = 0; i < currentStep; i++) {
          const move = parsedMoves[i];
          await modalEngine.rotateLayer(move.axis, move.layer, move.angle, 0, false);
        }
        setIsModalLoading(false);
      };
      initModalCube();
    }
  }, [modalEngine, modalReadyTrigger, currentStep, parsedMoves]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6 pt-2 pb-12">
      <div className="w-full flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
          #{art.id} - {art.name}
        </h1>
        <button
          onClick={onExit}
          className="p-2 rounded-xl transition-all border shadow-sm hover:shadow cursor-pointer"
          style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)', color: 'var(--text-primary)' }}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

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

        {/* Playback Controls */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="p-6 rounded-3xl backdrop-blur-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl">
            <h2 className="text-xl font-bold font-heading mb-4" style={{ color: 'var(--text-primary)' }}>Playback Guide</h2>

            <div className="mb-6">
              {currentStep === 0 && lastActionDirection === 1 ? (
                <>
                  <p className="text-sm font-semibold text-green-500 mb-2">READY TO MAKE</p>
                  <p style={{ color: 'var(--text-secondary)' }}>Hold your SOLVED Cube as shown, press "Next" to start.</p>
                </>
              ) : lastActionDirection === -1 ? (
                <>
                  <p className="text-sm font-semibold text-yellow-500 mb-2">Undo Step {currentStep + 1} / {parsedMoves.length}: {getInverseMoveNotation(parsedMoves[currentStep].raw)}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{getReverseHumanReadableMove(parsedMoves[currentStep].raw)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-blue-500 mb-2">Step {currentStep} / {parsedMoves.length}: {parsedMoves[currentStep - 1].raw}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{getHumanReadableMove(parsedMoves[currentStep - 1].raw)}</p>
                </>
              )}
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={currentStep === 0 || engine?.isAnimating || engine?.isAnimatingRef?.current}
                className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--text-primary)', border: '1px solid var(--nav-border)' }}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep >= parsedMoves.length || engine?.isAnimating || engine?.isAnimatingRef?.current}
                className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-500 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                setIsModalLoading(true);
                setIs3DViewOpen(true);
              }}
              className="w-full mt-4 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Eye className="w-5 h-5" />
              3D View
            </button>
          </div>
        </div>
      </motion.div>

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
