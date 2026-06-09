import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  ArrowLeft,
  Printer,
  Sliders
} from 'lucide-react';
import { CubeGuidingSection } from './CubeGuidingSection';
import { generateMosaicIndices, type PaletteColor } from '../../utils/mosaicAlgorithms';
import { generatePDFGuide } from '../../utils/pdfGenerator';

interface MosaicViewerProps {
  methodName: string;
  rawCroppedData: Uint8ClampedArray;
  initialParams: any; // includes methodId, contrast, scatter, position
  cubesWide: number;
  cubesHigh: number;
  cubeSize: number;
  cubeType: string;
  showCubeGrid: boolean;
  setShowCubeGrid: (g: boolean) => void;
  showStickerGrid: boolean;
  setShowStickerGrid: (g: boolean) => void;
  onBackToAdjust: () => void;
  onBackToSelect: () => void;
  PALETTE: PaletteColor[];
  imageSrc: string;
}

export const MosaicViewer: React.FC<MosaicViewerProps> = ({
  methodName,
  rawCroppedData,
  initialParams,
  cubesWide,
  cubesHigh,
  cubeSize,
  cubeType,
  showCubeGrid,
  setShowCubeGrid,
  showStickerGrid,
  setShowStickerGrid,
  onBackToAdjust,
  onBackToSelect,
  PALETTE,
  imageSrc
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [activePalette, setActivePalette] = useState<PaletteColor[]>(PALETTE);

  const handleColorChange = (index: number, selectedColor: PaletteColor) => {
    setActivePalette(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        name: selectedColor.name,
        hex: selectedColor.hex,
        rgb: selectedColor.rgb,
        textClass: selectedColor.textClass,
        code: selectedColor.code
      };
      return next;
    });
  };

  const handleResetPalette = () => {
    setActivePalette(PALETTE);
  };

  // Manual adjustment slider states initialized with chosen preview parameters
  const [contrast, setContrast] = useState<number>(initialParams.contrast ?? 0);
  const [brightness, setBrightness] = useState<number>(initialParams.brightness ?? 0);
  const [scatter, setScatter] = useState<number>(initialParams.scatter ?? 0.65);
  const [position, setPosition] = useState<number>(initialParams.position ?? 0.5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const wStickers = cubesWide * cubeSize;
  const hStickers = cubesHigh * cubeSize;

  // Compute final mosaic indices based on adjustments
  const currentIndices = useMemo(() => {
    return generateMosaicIndices(
      initialParams.methodId,
      rawCroppedData,
      wStickers,
      hStickers,
      contrast,
      brightness,
      scatter,
      position,
      activePalette
    );
  }, [initialParams.methodId, rawCroppedData, wStickers, hStickers, contrast, brightness, scatter, position, activePalette]);

  // Render mosaic on canvas
  const drawMosaic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentIndices) return;

    const stickerSize = 14;
    const stickerGap = showStickerGrid ? 1 : 0;
    const cubeGap = showCubeGrid ? 3 : 0;

    const canvasW = wStickers * stickerSize + (wStickers - 1) * stickerGap + (cubesWide - 1) * cubeGap;
    const canvasH = hStickers * stickerSize + (hStickers - 1) * stickerGap + (cubesHigh - 1) * cubeGap;

    canvas.width = canvasW;
    canvas.height = canvasH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvasW, canvasH);

    for (let r = 0; r < hStickers; r++) {
      const cubeRow = Math.floor(r / cubeSize);
      const y = r * stickerSize + r * stickerGap + cubeRow * cubeGap;

      for (let c = 0; c < wStickers; c++) {
        const cubeCol = Math.floor(c / cubeSize);
        const x = c * stickerSize + c * stickerGap + cubeCol * cubeGap;

        const colorIdx = currentIndices[r * wStickers + c];
        const color = activePalette[colorIdx];

        ctx.fillStyle = color.hex;
        
        const radius = 2; 
        ctx.beginPath();
        ctx.roundRect(x, y, stickerSize, stickerSize, radius);
        ctx.fill();
      }
    }
  }, [currentIndices, wStickers, hStickers, cubeSize, cubesWide, cubesHigh, showCubeGrid, showStickerGrid, activePalette]);

  useEffect(() => {
    drawMosaic();
  }, [drawMosaic]);

  // Dynamic Statistics
  const statistics = useMemo(() => {
    const totalStickers = wStickers * hStickers;
    const totalCubes = cubesWide * cubesHigh;
    
    const counts = new Array(activePalette.length).fill(0);
    for (let i = 0; i < totalStickers; i++) {
      counts[currentIndices[i]]++;
    }
    
    const colorStats = activePalette.map((color, index) => {
      const stickerCount = counts[index];
      const percentage = totalStickers > 0 ? ((stickerCount / totalStickers) * 100).toFixed(1) : '0';
      return {
        ...color,
        count: stickerCount,
        percentage,
        originalIndex: index
      };
    });

    const cubeCost = totalCubes * 1.50;
    
    return {
      totalStickers,
      totalCubes,
      colorStats,
      estimatedCost: cubeCost.toFixed(2)
    };
  }, [currentIndices, wStickers, hStickers, cubesWide, cubesHigh, activePalette]);



  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `rubiks_mosaic_${cubesWide}x${cubesHigh}_${cubeType}_${methodName.toLowerCase().replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // 📄 Exporter function: Generates landscape guide PDF book
  const handleDownloadPDF = () => {
    setIsExportingPDF(true);
    setTimeout(async () => {
      try {
        await generatePDFGuide({
          methodName,
          cubeType,
          cubesWide,
          cubesHigh,
          cubeSize,
          currentIndices,
          palette: activePalette,
          statistics,
          imageSrc
        });
      } catch (err) {
        console.error("Failed compiling PDF:", err);
        alert("Could not generate PDF booklet. See developer console.");
      } finally {
        setIsExportingPDF(false);
      }
    }, 100);
  };

  // Determine if Gradient method is selected
  const isGradient = initialParams.methodId === 'gradient';
  


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-8 w-full"
    >
      {/* 🚀 Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--nav-border)] pb-4 gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onBackToSelect}
            className="py-2 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Change Style
          </button>
          <button
            onClick={onBackToAdjust}
            className="py-2 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
          >
            Adjust Crop Area
          </button>
        </div>

        <div className="flex flex-col items-start sm:items-end">
          <h2 className="text-xl font-bold font-heading text-[var(--text-primary)]">
            Mosaic Pattern: {methodName}
          </h2>
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            Grid size: {cubesWide}x{cubesHigh} cubes ({cubeType})
          </span>
        </div>
      </div>

      {/* 🔮 Top Section: Mosaic Image & Manual Sliders side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Top Left Column: Mosaic Preview Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg flex flex-col items-center justify-between gap-6 h-full">
            <div className="border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden p-2 bg-slate-100 dark:bg-slate-900 w-full flex items-center justify-center shadow-inner" style={{ minHeight: '350px' }}>
              <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto object-contain rounded-lg"
                style={{ maxHeight: '550px' }} // Increased size of image to fulfill Request 2
              />
            </div>

            {/* Grid display checkboxes and download buttons under canvas */}
            <div className="w-full flex flex-col gap-4">
              {/* Grid display checkboxes */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[var(--text-secondary)] border-t border-[var(--nav-border)] pt-4 w-full">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCubeGrid}
                    onChange={(e) => setShowCubeGrid(e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  Show Cube Borders
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

              <div className="flex flex-wrap gap-4 justify-center border-t border-[var(--nav-border)] pt-4 w-full">
                <button
                  onClick={downloadPNG}
                  className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PNG Preview
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  disabled={isExportingPDF}
                  className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Printer className="w-4 h-4 animate-pulse" />
                  {isExportingPDF ? 'Creating Guide PDF...' : 'Download PDF Guide'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Column: Manual Sliders Fine-Tuning Console */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          <div className="rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg flex flex-col justify-between h-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] border-b border-[var(--nav-border)] pb-3">
                <Sliders className="w-4 h-4 text-blue-500" />
                <span>Fine-Tune Parameters Manually</span>
              </div>

              {isGradient ? (
                // 🎨 Gradient Sliders
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[var(--text-primary)] flex justify-between">
                      Gradient Range Width (Scatter)
                      <span className="font-mono text-blue-500 font-bold">{scatter.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.01"
                      value={scatter}
                      onChange={(e) => setScatter(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[var(--text-primary)] flex justify-between">
                      Gradient Center Offset (Position)
                      <span className="font-mono text-blue-500 font-bold">{position.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      value={position}
                      onChange={(e) => setPosition(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                         {/* Contrast adjustment also available for gradient mapping */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[var(--text-primary)] flex justify-between">
                      Tone Contrast Offset
                      <span className="font-mono text-blue-500 font-bold">{contrast > 0 ? '+' : ''}{contrast}</span>
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                // ⚙️ Contrast/Brightness Sliders (for Dithering & Diffusion)
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[var(--text-primary)] flex justify-between">
                      Contrast Adjustment
                      <span className="font-mono text-blue-500 font-bold">{contrast > 0 ? '+' : ''}{contrast}</span>
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[var(--text-primary)] flex justify-between">
                      Brightness Adjustment
                      <span className="font-mono text-blue-500 font-bold">{brightness > 0 ? '+' : ''}{brightness}</span>
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* used colors customization */}
              <div className="flex flex-col gap-3 border-t border-[var(--nav-border)] pt-4 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">Custom Palette (Choose Rubik's Colors):</span>
                  <button
                    onClick={handleResetPalette}
                    className="text-[10px] text-blue-500 hover:text-blue-600 font-bold transition-all hover:underline cursor-pointer"
                  >
                    Reset Colors
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  {statistics.colorStats
                    .filter(color => color.count > 0)
                    .map((color) => {
                      const paletteIdx = color.originalIndex;
                      const originalColorDef = PALETTE[paletteIdx];
                      return (
                        <div 
                          key={color.name + '-' + paletteIdx}
                          className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 gap-3 hover:border-blue-500/30 transition-all text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-5 h-5 rounded-md border border-black/10 shadow-xs flex-shrink-0 flex items-center justify-center font-bold text-[9px]"
                              style={{ 
                                backgroundColor: color.hex, 
                                color: color.name === 'White' || color.name === 'Yellow' ? '#0f172a' : '#ffffff' 
                              }}
                            >
                              {color.code}
                            </div>
                            <span className="font-bold text-[var(--text-primary)]">
                              Slot {paletteIdx + 1} ({originalColorDef.name})
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <select
                              value={color.name}
                              onChange={(e) => {
                                const selectedStdColor = PALETTE.find(c => c.name === e.target.value);
                                if (selectedStdColor) {
                                  handleColorChange(paletteIdx, selectedStdColor);
                                }
                              }}
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-xs font-semibold text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {PALETTE.map((stdColor) => (
                                <option 
                                  key={stdColor.name} 
                                  value={stdColor.name}
                                >
                                  {stdColor.name} ({stdColor.code})
                                </option>
                              ))}
                            </select>
                            
                            <span className="font-mono text-[var(--text-secondary)] font-bold min-w-[50px] text-right">
                              {color.count} px
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="text-xs text-[var(--text-secondary)] leading-relaxed mt-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
              Drag the sliders to adjust tone matching parameters. Changes are processed and updated on the left canvas in real-time.
            </div>
          </div>
        </div>
      </div>

      {/* 🔮 Bottom Section: Cubing/Builder Guide Section */}
      <CubeGuidingSection
        methodName={methodName}
        cubeType={cubeType}
        cubesWide={cubesWide}
        cubesHigh={cubesHigh}
        cubeSize={cubeSize}
        currentIndices={currentIndices}
        palette={activePalette}
        statistics={statistics}
        imageSrc={imageSrc}
      />
    </motion.div>
  );
};
