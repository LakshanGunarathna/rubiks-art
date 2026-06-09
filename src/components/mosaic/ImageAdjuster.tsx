import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Grid, Info, RotateCcw, ArrowRight } from 'lucide-react';

interface ImageAdjusterProps {
  imageSrc: string;
  zoom: number;
  setZoom: (z: number) => void;
  panX: number;
  setPanX: (x: number) => void;
  panY: number;
  setPanY: (y: number) => void;
  cubesWide: number;
  setCubesWide: (w: number) => void;
  cubesHigh: number;
  setCubesHigh: (h: number) => void;
  cubeType: string;
  setCubeType: (t: string) => void;
  showCubeGrid: boolean;
  setShowCubeGrid: (g: boolean) => void;
  showStickerGrid: boolean;
  setShowStickerGrid: (g: boolean) => void;
  onGenerate: (data: Uint8ClampedArray, croppedImageSrc: string) => void;
  onBack: () => void;
  viewportDim: { width: number; height: number };
  cubeSize: number;
}

export const ImageAdjuster: React.FC<ImageAdjusterProps> = ({
  imageSrc,
  zoom,
  setZoom,
  panX,
  setPanX,
  panY,
  setPanY,
  cubesWide,
  setCubesWide,
  cubesHigh,
  setCubesHigh,
  cubeType,
  setCubeType,
  showCubeGrid,
  setShowCubeGrid,
  showStickerGrid,
  setShowStickerGrid,
  onGenerate,
  onBack,
  viewportDim,
  cubeSize
}) => {
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [naturalDim, setNaturalDim] = useState<{ width: number; height: number } | null>(null);

  // Reset naturalDim state when imageSrc changes
  useEffect(() => {
    setNaturalDim(null);
  }, [imageSrc]);

  const imgRatio = naturalDim ? naturalDim.width / naturalDim.height : 1;
  const viewportRatio = viewportDim.width / viewportDim.height;

  let imgWidth: string | number = '100%';
  let imgHeight: string | number = '100%';
  let isLoaded = false;

  if (naturalDim) {
    isLoaded = true;
    if (imgRatio > viewportRatio) {
      imgHeight = viewportDim.height;
      imgWidth = viewportDim.height * imgRatio;
    } else {
      imgWidth = viewportDim.width;
      imgHeight = viewportDim.width / imgRatio;
    }
  }

  // Drag handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    isDragging.current = true;
    startX.current = clientX - panX;
    startY.current = clientY - panY;
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    setPanX(clientX - startX.current);
    setPanY(clientY - startY.current);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full"
    >
      {/* 🛠️ Settings Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-[var(--nav-border)] pb-4">
            <Settings className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold font-heading text-[var(--text-primary)]">Step 2: Adjust Image</h2>
          </div>

          {/* Mosaic Dimensions (Cubes) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--text-primary)]">
                Width (Cubes)
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={cubesWide}
                onChange={(e) => setCubesWide(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500 shadow-sm font-mono font-bold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--text-primary)]">
                Height (Cubes)
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={cubesHigh}
                onChange={(e) => setCubesHigh(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500 shadow-sm font-mono font-bold"
              />
            </div>
          </div>

          {/* Total Cubes Needed display (Request 4) */}
          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Total Cubes Needed</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {cubesWide * cubesHigh} <span className="text-xs font-semibold text-[var(--text-secondary)]">cubes</span>
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">
                {cubesWide} W × {cubesHigh} H
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-secondary)] font-medium">
              Total Pixels: {(cubesWide * cubeSize) * (cubesHigh * cubeSize)} ({(cubesWide * cubeSize)}W × {(cubesHigh * cubeSize)}H stickers)
            </span>
          </div>

          {/* Cube Type Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--text-primary)]">Cube Type</label>
            <select
              value={cubeType}
              onChange={(e) => setCubeType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="1x1">1x1 (Mini-Pixels)</option>
              <option value="2x2">2x2 (Mini Cube)</option>
              <option value="3x3">3x3 (Standard Rubik's)</option>
              <option value="4x4">4x4 (Revenge Cube)</option>
              <option value="5x5">5x5 (Professor's)</option>
              <option value="6x6">6x6 (V-Cube 6)</option>
              <option value="7x7">7x7</option>
            </select>
          </div>

          {/* Zoom Slider */}
          <div className="flex flex-col gap-3 border-t border-[var(--nav-border)] pt-4">
            <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center justify-between">
              Image Zoom
              <span className="text-xs text-blue-500 font-bold">{zoom.toFixed(1)}x</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <button
                onClick={() => {
                  setZoom(1.2);
                  setPanX(0);
                  setPanY(0);
                }}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                title="Reset crop zoom and translation offsets"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Reset
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              Click and drag inside the right canvas grid to shift position.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 border-t border-[var(--nav-border)] pt-4">
            <button
              onClick={() => {
                if (!imageRef.current) return;

                const img = imageRef.current;
                const offscreen = document.createElement('canvas');
                const wStickers = cubesWide * cubeSize;
                const hStickers = cubesHigh * cubeSize;
                offscreen.width = wStickers;
                offscreen.height = hStickers;
                const ctx = offscreen.getContext('2d');
                if (!ctx) return;

                const imgRatio = img.naturalWidth / img.naturalHeight;
                const mosaicRatio = wStickers / hStickers;
                let drawW, drawH;
                if (imgRatio > mosaicRatio) {
                  drawH = hStickers;
                  drawW = hStickers * imgRatio;
                } else {
                  drawW = wStickers;
                  drawH = wStickers / imgRatio;
                }

                const ratioX = wStickers / viewportDim.width;
                const ratioY = hStickers / viewportDim.height;

                ctx.clearRect(0, 0, wStickers, hStickers);
                ctx.save();
                ctx.translate(wStickers / 2 + panX * ratioX, hStickers / 2 + panY * ratioY);
                ctx.scale(zoom, zoom);
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
                ctx.restore();

                const rawData = ctx.getImageData(0, 0, wStickers, hStickers).data;

                // High-resolution cropped image generation for PDF (original cropped section)
                const maxStickers = Math.max(wStickers, hStickers);
                const K = Math.max(1, Math.ceil(1500 / maxStickers));
                const highResW = wStickers * K;
                const highResH = hStickers * K;

                const highResCanvas = document.createElement('canvas');
                highResCanvas.width = highResW;
                highResCanvas.height = highResH;
                const hrCtx = highResCanvas.getContext('2d');
                let croppedImageBase64 = '';

                if (hrCtx) {
                  let drawW_hr, drawH_hr;
                  if (imgRatio > mosaicRatio) {
                    drawH_hr = highResH;
                    drawW_hr = highResH * imgRatio;
                  } else {
                    drawW_hr = highResW;
                    drawH_hr = highResW / imgRatio;
                  }

                  const ratioX_hr = highResW / viewportDim.width;
                  const ratioY_hr = highResH / viewportDim.height;

                  hrCtx.clearRect(0, 0, highResW, highResH);
                  hrCtx.save();
                  hrCtx.translate(highResW / 2 + panX * ratioX_hr, highResH / 2 + panY * ratioY_hr);
                  hrCtx.scale(zoom, zoom);
                  hrCtx.imageSmoothingEnabled = true;
                  hrCtx.imageSmoothingQuality = 'high';
                  hrCtx.drawImage(img, -drawW_hr / 2, -drawH_hr / 2, drawW_hr, drawH_hr);
                  hrCtx.restore();
                  croppedImageBase64 = highResCanvas.toDataURL('image/jpeg', 0.85);
                } else {
                  croppedImageBase64 = offscreen.toDataURL('image/jpeg', 0.85);
                }

                onGenerate(rawData, croppedImageBase64);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              Generate Mosaic Art
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onBack}
              className="w-full py-2.5 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-[var(--text-primary)] font-semibold transition-all text-sm cursor-pointer"
            >
              Upload Different Image
            </button>
          </div>
        </div>
      </div>

      {/* 🖥️ Viewport Workspace */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg flex flex-col items-center justify-center gap-4">
          <div className="w-full flex items-center justify-between border-b border-[var(--nav-border)] pb-4">
            <h2 className="text-lg font-bold font-heading text-[var(--text-primary)] flex items-center gap-2">
              <Grid className="w-5 h-5 text-indigo-500" />
              Adjust Position & Crop Box
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              Aspect Ratio: {cubesWide}:{cubesHigh}
            </span>
          </div>

          {/* Viewport Frame */}
          <div
            className="relative border border-slate-300 dark:border-slate-800 bg-[#0f172a] rounded-2xl shadow-inner cursor-move overflow-hidden select-none"
            style={{
              width: `${viewportDim.width}px`,
              height: `${viewportDim.height}px`,
              maxWidth: '100%'
            }}
            onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => {
              if (e.touches.length === 1) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches.length === 1) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={handleDragEnd}
          >
            {imageSrc && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Adjusting crop"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setNaturalDim({ width: img.naturalWidth, height: img.naturalHeight });
                }}
                className="pointer-events-none select-none absolute"
                style={{
                  width: isLoaded ? `${imgWidth}px` : '100%',
                  height: isLoaded ? `${imgHeight}px` : '100%',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  left: isLoaded ? '50%' : '0',
                  top: isLoaded ? '50%' : '0',
                  transform: isLoaded
                    ? `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`
                    : `translate(${panX}px, ${panY}px) scale(${zoom})`,
                  transformOrigin: '50% 50%',
                  objectFit: isLoaded ? undefined : 'cover'
                }}
              />
            )}

            {/* Grid Overlay */}
            {showCubeGrid && (
              <div
                className="absolute inset-0 grid pointer-events-none"
                style={{
                  gridTemplateColumns: `repeat(${cubesWide}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${cubesHigh}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: cubesWide * cubesHigh }).map((_, i) => (
                  <div key={i} className="border-r border-b border-white/20 relative">
                    {cubeSize > 1 && (
                      <span className="absolute left-0.5 top-0.5 text-[7px] text-white/30 font-mono">
                        {Math.floor(i / cubesWide) + 1},{i % cubesWide + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grid Visibility Controls */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[var(--text-secondary)] mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCubeGrid}
                onChange={(e) => setShowCubeGrid(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              Show Cube Boundaries
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showStickerGrid}
                onChange={(e) => setShowStickerGrid(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              Show Sticker Lines
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
