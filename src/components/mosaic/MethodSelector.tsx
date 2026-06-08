import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface PaletteColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  textClass: string;
  code: string;
}

interface MethodSelectorProps {
  rawCroppedData: Uint8ClampedArray;
  cubesWide: number;
  cubesHigh: number;
  cubeSize: number;
  onSelectMethod: (methodName: string, indices: Uint8Array, params: any) => void;
  onBack: () => void;
  PALETTE: PaletteColor[];
}

// ---------------------------------------------------------
// Helper for uniform gradient range generation
// ---------------------------------------------------------
function createUniformRange(numBorders: number, scatter: number, position: number) {
  const rangeLength = 255 * scatter;
  const distance = numBorders > 1 ? rangeLength / (numBorders - 1) : 0;
  const x0 = (255 - rangeLength) * position;

  const range: number[] = [];
  for (let i = 0; i < numBorders; ++i) {
    range.push(Math.round(x0 + i * distance));
  }
  return range;
}

// Apply contrast/brightness adjustments to raw pixels in-place
const applyContrastBrightness = (data: Uint8ClampedArray, contrast: number, brightness: number = 0) => {
  const adjusted = new Uint8ClampedArray(data.length);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] + brightness;
    let g = data[i + 1] + brightness;
    let b = data[i + 2] + brightness;

    if (contrast !== 0) {
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;
    }

    adjusted[i] = Math.max(0, Math.min(255, r));
    adjusted[i + 1] = Math.max(0, Math.min(255, g));
    adjusted[i + 2] = Math.max(0, Math.min(255, b));
    adjusted[i + 3] = data[i + 3];
  }
  return adjusted;
};

// ---------------------------------------------------------
// Sub-component for individual variation thumbnail cards
// ---------------------------------------------------------
interface VariationCardProps {
  rawCroppedData: Uint8ClampedArray;
  wStickers: number;
  hStickers: number;
  PALETTE: PaletteColor[];
  methodId: string;
  params: {
    contrast?: number;
    scatter?: number;
    position?: number;
  };
  onClick: (indices: Uint8Array) => void;
  getClosestColorIndex: (r: number, g: number, b: number, filter?: (c: PaletteColor) => boolean) => number;
}

const VariationCard: React.FC<VariationCardProps> = ({
  rawCroppedData,
  wStickers,
  hStickers,
  PALETTE,
  methodId,
  params,
  onClick,
  getClosestColorIndex
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [computedIndices, setComputedIndices] = useState<Uint8Array | null>(null);

  // Compute sticker indices based on method parameters
  const indices = useMemo(() => {
    // 1. Apply contrast & brightness first for non-gradient methods
    const isDiffusionMethod = methodId === 'diffusion' || methodId === 'diffusion_no_blue' || methodId === 'diffusion_no_green';
    const defaultBrightness = isDiffusionMethod ? 50 : 0;

    const hasContrast = (params.contrast !== undefined && params.contrast !== 0) || defaultBrightness !== 0;
    const adjustedPixels = hasContrast
      ? applyContrastBrightness(rawCroppedData, params.contrast || 0, defaultBrightness)
      : rawCroppedData;

    const count = wStickers * hStickers;

    if (methodId === 'gradient') {
      // Gradient: Grayscale tone mapping
      const resultIndices = new Uint8Array(count);
      const scat = params.scatter ?? 0.65;
      const pos = params.position ?? 0.5;
      const ranges = createUniformRange(4, scat, pos);

      const gradColors = [
        PALETTE[5], // Blue
        PALETTE[3], // Red
        PALETTE[2], // Orange
        PALETTE[1], // Yellow
        PALETTE[0]  // White
      ];

      for (let i = 0; i < count; i++) {
        const r = rawCroppedData[i * 4];
        const g = rawCroppedData[i * 4 + 1];
        const b = rawCroppedData[i * 4 + 2];
        const tone = (r + g + b) / 3;

        let matchedColor = gradColors[gradColors.length - 1]; // Default White
        for (let j = 0; j < ranges.length; j++) {
          if (tone < ranges[j]) {
            matchedColor = gradColors[j];
            break;
          }
        }
        resultIndices[i] = PALETTE.findIndex(c => c.name === matchedColor.name);
      }
      return resultIndices;
    } else if (methodId === 'dithering') {
      // Closest color (Nearest neighbor)
      const resultIndices = new Uint8Array(count);
      for (let i = 0; i < count; i++) {
        resultIndices[i] = getClosestColorIndex(
          adjustedPixels[i * 4],
          adjustedPixels[i * 4 + 1],
          adjustedPixels[i * 4 + 2]
        );
      }
      return resultIndices;
    } else {
      // Floyd-Steinberg error diffusion methods
      const resultIndices = new Uint8Array(count);
      const buffer = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        buffer[i * 3] = adjustedPixels[i * 4];
        buffer[i * 3 + 1] = adjustedPixels[i * 4 + 1];
        buffer[i * 3 + 2] = adjustedPixels[i * 4 + 2];
      }

      // Filter definition for blue/green exclusion
      let colorFilter: ((c: PaletteColor) => boolean) | undefined;
      if (methodId === 'diffusion_no_blue') {
        colorFilter = c => c.name !== 'Blue';
      } else if (methodId === 'diffusion_no_green') {
        colorFilter = c => c.name !== 'Green';
      }

      for (let y = 0; y < hStickers; y++) {
        for (let x = 0; x < wStickers; x++) {
          const idx = (y * wStickers + x) * 3;
          const r = buffer[idx];
          const g = buffer[idx + 1];
          const b = buffer[idx + 2];

          const colorIdx = getClosestColorIndex(
            Math.max(0, Math.min(255, r)),
            Math.max(0, Math.min(255, g)),
            Math.max(0, Math.min(255, b)),
            colorFilter
          );
          resultIndices[y * wStickers + x] = colorIdx;

          const matchedRGB = PALETTE[colorIdx].rgb;
          const errR = r - matchedRGB[0];
          const errG = g - matchedRGB[1];
          const errB = b - matchedRGB[2];

          const diffuse = (nx: number, ny: number, weight: number) => {
            if (nx >= 0 && nx < wStickers && ny >= 0 && ny < hStickers) {
              const nIdx = (ny * wStickers + nx) * 3;
              buffer[nIdx] += errR * weight;
              buffer[nIdx + 1] += errG * weight;
              buffer[nIdx + 2] += errB * weight;
            }
          };

          diffuse(x + 1, y, 7 / 16);
          diffuse(x - 1, y + 1, 3 / 16);
          diffuse(x, y + 1, 5 / 16);
          diffuse(x + 1, y + 1, 1 / 16);
        }
      }
      return resultIndices;
    }
  }, [rawCroppedData, methodId, params, wStickers, hStickers, PALETTE, getClosestColorIndex]);

  // Draw dithered/gradient image onto thumbnail canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !indices) return;

    // Dynamically calculate small sticker display size (increased targetSize to 240 for larger images)
    const targetSize = 240;
    const stickerDisplay = Math.max(2, Math.floor(targetSize / Math.max(wStickers, hStickers)));
    canvas.width = wStickers * stickerDisplay;
    canvas.height = hStickers * stickerDisplay;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Drawing solid blocks without any gaps/lines to fulfill Request 1
    for (let r = 0; r < hStickers; r++) {
      for (let c = 0; c < wStickers; c++) {
        const colorIdx = indices[r * wStickers + c];
        ctx.fillStyle = PALETTE[colorIdx].hex;
        ctx.fillRect(c * stickerDisplay, r * stickerDisplay, stickerDisplay, stickerDisplay);
      }
    }

    setComputedIndices(indices);
  }, [indices, wStickers, hStickers, PALETTE]);

  // Render parameter text badge
  const paramText = useMemo(() => {
    if (methodId === 'gradient') {
      return `S: ${(params.scatter ?? 0).toFixed(2)} P: ${(params.position ?? 0).toFixed(2)}`;
    }
    const c = params.contrast ?? 0;
    return `Contrast: ${c > 0 ? '+' : ''}${c}`;
  }, [methodId, params]);

  // Dynamically calculate container dimensions based on the aspect ratio of the cropped image
  const aspect = wStickers / hStickers;
  const targetDimension = 260; // Max target dimension bounds
  let containerWidth = targetDimension;
  let containerHeight = targetDimension / aspect;

  if (containerHeight > 220) {
    containerHeight = 220;
    containerWidth = 220 * aspect;
  }

  return (
    <div 
      onClick={() => computedIndices && onClick(computedIndices)}
      className="flex flex-col items-center gap-2 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 hover:border-blue-500 hover:bg-blue-500/5 hover:shadow-md cursor-pointer transition-all flex-shrink-0"
    >
      <div 
        className="flex items-center justify-center overflow-hidden rounded-xl bg-transparent p-0"
        style={{ width: `${Math.round(containerWidth)}px`, height: `${Math.round(containerHeight)}px` }}
      >
        <canvas ref={canvasRef} className="w-full h-full object-contain rounded-md" />
      </div>
      <span className="text-[10px] font-bold font-mono text-[var(--text-secondary)] bg-white dark:bg-slate-950 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
        {paramText}
      </span>
    </div>
  );
};

// ---------------------------------------------------------
// Main Method Selector
// ---------------------------------------------------------
export const MethodSelector: React.FC<MethodSelectorProps> = ({
  rawCroppedData,
  cubesWide,
  cubesHigh,
  cubeSize,
  onSelectMethod,
  onBack,
  PALETTE
}) => {
  const wStickers = useMemo(() => cubesWide * cubeSize, [cubesWide, cubeSize]);
  const hStickers = useMemo(() => cubesHigh * cubeSize, [cubesHigh, cubeSize]);

  // Redmean color distance lookup
  const getClosestColorIndex = (r: number, g: number, b: number, filter?: (c: PaletteColor) => boolean): number => {
    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < PALETTE.length; i++) {
      if (filter && !filter(PALETTE[i])) continue;
      const p = PALETTE[i].rgb;
      const dr = r - p[0];
      const dg = g - p[1];
      const db = b - p[2];
      const rMean = (r + p[0]) / 2;

      const dist = (2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db;

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }
    return closestIndex;
  };

  // Define parameter ranges for the First Choice rows (matching Roman README screenshots layout)
  const firstChoiceRows = useMemo(() => {
    return [
      {
        id: 'gradient',
        name: 'Gradient',
        desc: 'Converts grayscale tones to Rubik\'s colors (excludes Green). Beautiful shadow transitions.',
        variations: [
          { scatter: 0.50, position: 0.25 },
          { scatter: 0.60, position: 0.35 },
          { scatter: 0.70, position: 0.45 },
          { scatter: 0.80, position: 0.55 },
          { scatter: 0.90, position: 0.40 },
          { scatter: 0.60, position: 0.60 },
        ]
      },
      {
        id: 'diffusion',
        name: 'Diffusion',
        desc: 'Floyd-Steinberg error diffusion dithering. Soft, smooth shading using the full palette.',
        variations: [
          { contrast: -35 },
          { contrast: -15 },
          { contrast: 0 },
          { contrast: 15 },
          { contrast: 30 },
          { contrast: 45 },
        ]
      },
      {
        id: 'dithering',
        name: 'Dithering',
        desc: 'Closest color matching (nearest neighbor). Sharp, clean, and classic blocky pixel art.',
        variations: [
          { contrast: -20 },
          { contrast: -10 },
          { contrast: 0 },
          { contrast: 10 },
          { contrast: 20 },
          { contrast: 30 },
        ]
      },
      {
        id: 'diffusion_no_blue',
        name: 'Diffusion without Blue',
        desc: 'Floyd-Steinberg error diffusion omitting Blue. Recommended for warmer skin tones.',
        variations: [
          { contrast: -15 },
          { contrast: 0 },
          { contrast: 15 },
          { contrast: 30 },
        ]
      },
      {
        id: 'diffusion_no_green',
        name: 'Diffusion without Green',
        desc: 'Floyd-Steinberg error diffusion omitting Green. Prevents muddy skin highlights.',
        variations: [
          { contrast: -15 },
          { contrast: 0 },
          { contrast: 15 },
          { contrast: 30 },
        ]
      }
    ];
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[var(--nav-border)] pb-4 gap-4">
        <button
          onClick={onBack}
          className="py-2 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Crop
        </button>

        <h2 className="text-xl font-bold font-heading text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Step 3: Choose Variation Method
        </h2>
      </div>

      {/* Matrix rows */}
      <div className="flex flex-col gap-6">
        {firstChoiceRows.map((row) => (
          <div
            key={row.id}
            className="rounded-3xl p-5 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-md flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[var(--nav-border)]/50 pb-2">
              <div>
                <h3 className="font-extrabold text-base text-[var(--text-primary)]">{row.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{row.desc}</p>
              </div>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
              {row.variations.map((v, idx) => (
                <VariationCard
                  key={idx}
                  rawCroppedData={rawCroppedData}
                  wStickers={wStickers}
                  hStickers={hStickers}
                  PALETTE={PALETTE}
                  methodId={row.id}
                  params={v}
                  getClosestColorIndex={getClosestColorIndex}
                  onClick={(indices) => {
                    const isDiffusionMethod = row.id === 'diffusion' || row.id === 'diffusion_no_blue' || row.id === 'diffusion_no_green';
                    onSelectMethod(row.name, indices, {
                      methodId: row.id,
                      brightness: isDiffusionMethod ? 50 : 0,
                      ...v
                    });
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
