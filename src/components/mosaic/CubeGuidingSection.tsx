import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Printer, Layers, BookOpen, FileText } from 'lucide-react';
import { generatePDFGuide } from '../../utils/pdfGenerator';

interface PaletteColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  textClass: string;
  code: string;
}

interface CubeGuidingSectionProps {
  methodName: string;
  cubeType: string;
  cubesWide: number;
  cubesHigh: number;
  cubeSize: number;
  currentIndices: Uint8Array;
  palette: PaletteColor[];
  statistics: {
    totalStickers: number;
    totalCubes: number;
    estimatedCost: string;
    colorStats: Array<PaletteColor & { count: number; percentage: string }>;
  };
  imageSrc: string;
}

export const CubeGuidingSection: React.FC<CubeGuidingSectionProps> = ({
  methodName,
  cubeType,
  cubesWide,
  cubesHigh,
  cubeSize,
  currentIndices,
  palette,
  statistics,
  imageSrc
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'stats' | 'guide'>('guide');
  const [selectedCube, setSelectedCube] = useState<{ row: number; col: number } | null>({ row: cubesHigh - 1, col: 0 });
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);

  const wStickers = cubesWide * cubeSize;

  const selectedCubeStickers = useMemo(() => {
    if (!selectedCube) return null;
    
    const { row, col } = selectedCube;
    const stickers: number[] = [];
    
    for (let r = 0; r < cubeSize; r++) {
      for (let c = 0; c < cubeSize; c++) {
        const stickerRow = row * cubeSize + r;
        const stickerCol = col * cubeSize + c;
        stickers.push(currentIndices[stickerRow * wStickers + stickerCol]);
      }
    }
    return stickers;
  }, [selectedCube, cubeSize, wStickers, currentIndices]);

  const handlePrevCube = () => {
    if (!selectedCube) return;
    const { row, col } = selectedCube;
    if (col > 0) {
      setSelectedCube({ row, col: col - 1 });
    } else if (row < cubesHigh - 1) {
      setSelectedCube({ row: row + 1, col: cubesWide - 1 });
    }
  };

  const handleNextCube = () => {
    if (!selectedCube) return;
    const { row, col } = selectedCube;
    if (col < cubesWide - 1) {
      setSelectedCube({ row, col: col + 1 });
    } else if (row > 0) {
      setSelectedCube({ row: row - 1, col: 0 });
    }
  };

  const triggerPDFExport = () => {
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
          palette,
          statistics,
          imageSrc
        });
      } catch (err) {
        console.error("PDF Export failed:", err);
        alert("Failed to export PDF guide.");
      } finally {
        setIsExportingPDF(false);
      }
    }, 100);
  };

  return (
    <div className="w-full">
      <div className="rounded-3xl backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg overflow-hidden flex flex-col w-full">
        
        {/* Tab Links */}
        <div className="flex border-b border-[var(--nav-border)] bg-slate-100/50 dark:bg-slate-950/20">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-4 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'guide' ? 'border-blue-500 text-blue-500 bg-white/40 dark:bg-slate-900/40' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Cube Builder
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-4 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'stats' ? 'border-blue-500 text-blue-500 bg-white/40 dark:bg-slate-900/40' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            Parts Stats
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-4 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'preview' ? 'border-blue-500 text-blue-500 bg-white/40 dark:bg-slate-900/40' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Printer className="w-3.5 h-3.5" />
            PDF & Print Guide
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            
            {/* 📄 PDF & PRINT INFO */}
            {activeTab === 'preview' && (
              <motion.div
                key="pdf-print-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4 text-sm"
              >
                <h3 className="font-bold text-[var(--text-primary)] text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Printable Instruction Booklet
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-xs">
                  Export a high-resolution, print-ready PDF guide that breaks down the mosaic layout row-by-row.
                </p>
                <div className="p-4 rounded-2xl border border-[var(--nav-border)] bg-slate-50 dark:bg-slate-900/30 flex flex-col gap-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 dark:bg-blue-500/25 flex items-center justify-center text-blue-500 font-extrabold flex-shrink-0">
                      🧩
                    </div>
                    <div>
                      <strong className="text-[var(--text-primary)] block font-semibold mb-0.5">Block-by-Block Blueprint</strong>
                      Divided into logical 3x3 cube segments so you can build and assemble your mosaic piece-by-piece with ease.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 dark:bg-indigo-500/25 flex items-center justify-center text-indigo-500 font-extrabold flex-shrink-0">
                      🎨
                    </div>
                    <div>
                      <strong className="text-[var(--text-primary)] block font-semibold mb-0.5">Sticker-Level Precision</strong>
                      Includes high-contrast color grids and text-labeled sticker codes (W, Y, O, R, G, B) to guarantee error-free physical builds.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/10 dark:bg-purple-500/25 flex items-center justify-center text-purple-500 font-extrabold flex-shrink-0">
                      🗺️
                    </div>
                    <div>
                      <strong className="text-[var(--text-primary)] block font-semibold mb-0.5">Smart Progress Minimaps</strong>
                      Features an interactive locator minimap on every instruction sheet to show exactly where the active block fits in your artwork.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/25 flex items-center justify-center text-emerald-500 font-extrabold flex-shrink-0">
                      📄
                    </div>
                    <div>
                      <strong className="text-[var(--text-primary)] block font-semibold mb-0.5">Premium Print-Ready Specs</strong>
                      Includes complete component summaries, color distributions, specifications, and side-by-side previews of your custom design.
                    </div>
                  </div>
                </div>

                <button
                  onClick={triggerPDFExport}
                  disabled={isExportingPDF}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:bg-slate-600 text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 text-sm"
                >
                  <Printer className="w-5 h-5" />
                  {isExportingPDF ? 'Compiling PDF Guide...' : 'Download Printable PDF Guide'}
                </button>
              </motion.div>
            )}

            {/* 📊 STATS PANEL */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-[var(--nav-border)] bg-slate-50 dark:bg-slate-900/40 text-center">
                    <div className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Total Cubes</div>
                    <div className="text-xl font-extrabold text-blue-500 mt-0.5">{statistics.totalCubes}</div>
                    <div className="text-[9px] text-[var(--text-secondary)]">({cubesWide}W × {cubesHigh}H)</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-[var(--nav-border)] bg-slate-50 dark:bg-slate-900/40 text-center">
                    <div className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Total Pixels</div>
                    <div className="text-xl font-extrabold text-emerald-500 mt-0.5">{statistics.totalStickers}</div>
                    <div className="text-[9px] text-[var(--text-secondary)]">({cubesWide * cubeSize}W × {cubesHigh * cubeSize}H stickers)</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Required Sticker count</h3>
                  <div className="flex flex-col gap-2.5">
                    {statistics.colorStats.map((color) => (
                      <div 
                        key={color.name}
                        className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-xs"
                      >
                        <div 
                          className="w-7 h-7 rounded-lg border border-black/10 shadow-xs flex-shrink-0 flex items-center justify-center font-bold text-[10px]"
                          style={{ backgroundColor: color.hex, color: color.name === 'White' || color.name === 'Yellow' ? '#0f172a' : '#ffffff' }}
                        >
                          {color.code}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center font-bold text-[var(--text-primary)]">
                            <span>{color.name}</span>
                            <span>{color.count}</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ width: `${color.percentage}%`, backgroundColor: color.hex }}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-[var(--text-secondary)] font-bold pl-1">{color.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 📖 CUBE BUILDER STEP GUIDE */}
            {activeTab === 'guide' && (
              <motion.div
                key="builder-guide-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
              >
                {/* Left side: Select Cube Coordinate */}
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                    <span>Select Cube Coordinate:</span>
                    {selectedCube && (
                      <span className="text-blue-500 font-bold bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full text-[10px]">
                        R{selectedCube.row + 1}, C{selectedCube.col + 1}
                      </span>
                    )}
                  </div>
                  
                  <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 overflow-auto shadow-inner w-full">
                    <div 
                      className="grid gap-0.5 mx-auto"
                      style={{
                        gridTemplateColumns: `repeat(${cubesWide}, minmax(12px, 1fr))`,
                        width: 'fit-content',
                        padding: '6px'
                      }}
                    >
                      {Array.from({ length: cubesHigh }).map((_, r) => (
                        Array.from({ length: cubesWide }).map((_, c) => {
                          const isSelected = selectedCube && selectedCube.row === r && selectedCube.col === c;
                          const cubeNumber = (cubesHigh - 1 - r) * cubesWide + c + 1;
                          return (
                            <button
                              key={`${r}-${c}`}
                              type="button"
                              onClick={() => setSelectedCube({ row: r, col: c })}
                              className={`w-3.5 h-3.5 rounded-xs border transition-all ${isSelected ? 'bg-blue-600 border-blue-700 ring-1 ring-blue-500 scale-110 z-10' : 'bg-slate-300 dark:bg-slate-700 border-slate-400/20 hover:border-slate-500'}`}
                              title={`Cube ${cubeNumber} (Row ${r + 1}, Col ${c + 1})`}
                            />
                          );
                        })
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Zoomed Selected Cube Instructions / Cube Details */}
                {selectedCube && selectedCubeStickers && (
                  <div className="flex flex-col gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
                    <div className="flex items-center justify-center">
                      <div 
                        className="grid gap-1 p-1.5 rounded-xl bg-[#0f172a] shadow-md border border-slate-700"
                        style={{ gridTemplateColumns: `repeat(${cubeSize}, minmax(0, 1fr))` }}
                      >
                        {selectedCubeStickers.map((colorIdx, i) => {
                          const color = palette[colorIdx];
                          return (
                            <div
                              key={i}
                              className={`w-10 h-10 rounded-lg shadow-xs flex items-center justify-center text-xs ${color.textClass} border border-black/10`}
                              style={{ backgroundColor: color.hex }}
                            >
                              {color.code}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex flex-col gap-1.5 text-[var(--text-secondary)]">
                        <span className="font-bold text-[var(--text-primary)]">Cube Details:</span>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {(() => {
                            const counts: Record<string, number> = {};
                            selectedCubeStickers.forEach(idx => {
                              const name = palette[idx].name;
                              counts[name] = (counts[name] || 0) + 1;
                            });
                            return Object.entries(counts).map(([name, count]) => {
                              const cDef = palette.find(c => c.name === name)!;
                              return (
                                <span 
                                  key={name} 
                                  className="px-2 py-0.5 rounded-full font-bold border border-black/5 flex items-center gap-1 bg-white dark:bg-slate-900"
                                  style={{ color: cDef.hex === '#FFFFFF' || cDef.hex === '#ffffff' ? 'var(--text-primary)' : cDef.hex }}
                                >
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cDef.hex }} />
                                  {cDef.code}:{count}
                                </span>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Steps Navigation */}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={handlePrevCube}
                          disabled={selectedCube.row === cubesHigh - 1 && selectedCube.col === 0}
                          className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-[10px] font-semibold text-[var(--text-primary)] flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Prev
                        </button>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                          Cube {(cubesHigh - 1 - selectedCube.row) * cubesWide + selectedCube.col + 1} / {cubesWide * cubesHigh}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextCube}
                          disabled={selectedCube.row === 0 && selectedCube.col === cubesWide - 1}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-[10px] font-semibold flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                        >
                          Next
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
