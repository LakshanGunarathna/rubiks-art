import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, BookOpen, Layers, Palette, Info, CheckCircle2, Cpu } from 'lucide-react';

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

  const indices = useMemo(() => {
    const isDiffusionMethod = methodId === 'diffusion' || methodId === 'diffusion_no_blue' || methodId === 'diffusion_no_green';
    const defaultBrightness = isDiffusionMethod ? 50 : 0;

    const hasContrast = (params.contrast !== undefined && params.contrast !== 0) || defaultBrightness !== 0;
    const adjustedPixels = hasContrast
      ? applyContrastBrightness(rawCroppedData, params.contrast || 0, defaultBrightness)
      : rawCroppedData;

    const count = wStickers * hStickers;

    if (methodId === 'gradient') {
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

        let matchedColor = gradColors[gradColors.length - 1];
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
      const resultIndices = new Uint8Array(count);
      const buffer = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        buffer[i * 3] = adjustedPixels[i * 4];
        buffer[i * 3 + 1] = adjustedPixels[i * 4 + 1];
        buffer[i * 3 + 2] = adjustedPixels[i * 4 + 2];
      }

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
            Math.max(0, Math.min(255, b)),
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !indices) return;

    const targetSize = 240;
    const stickerDisplay = Math.max(2, Math.floor(targetSize / Math.max(wStickers, hStickers)));
    canvas.width = wStickers * stickerDisplay;
    canvas.height = hStickers * stickerDisplay;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let r = 0; r < hStickers; r++) {
      for (let c = 0; c < wStickers; c++) {
        const colorIdx = indices[r * wStickers + c];
        ctx.fillStyle = PALETTE[colorIdx].hex;
        ctx.fillRect(c * stickerDisplay, r * stickerDisplay, stickerDisplay, stickerDisplay);
      }
    }

    setComputedIndices(indices);
  }, [indices, wStickers, hStickers, PALETTE]);

  const paramText = useMemo(() => {
    if (methodId === 'gradient') {
      return `S: ${(params.scatter ?? 0).toFixed(2)} P: ${(params.position ?? 0).toFixed(2)}`;
    }
    const c = params.contrast ?? 0;
    return `Contrast: ${c > 0 ? '+' : ''}${c}`;
  }, [methodId, params]);

  const aspect = wStickers / hStickers;
  const targetDimension = 260;
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
    <div className="w-full flex flex-col gap-8 text-left">
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

      {/* Method Explanations & Detailed Features Guide Section */}
      <div className="mt-6 p-6 sm:p-8 rounded-3xl backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-[var(--text-primary)]">
              Comprehensive Conversion Method Guide
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">Detailed mathematical breakdown, algorithm behavior, and recommended use cases for each variation style</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Method 1: Gradient */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2">
              <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-500" /> 1. Gradient Method (Grayscale Tone Mapping)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">Grayscale Mapping</span>
            </div>
            <p className="leading-relaxed text-[var(--text-secondary)]">
              The <strong>Gradient Method</strong> converts pixel brightness (luminance) into a smooth 5-color ordered spectrum: <em>Blue → Red → Orange → Yellow → White</em>.
            </p>
            <div className="space-y-1.5 text-[var(--text-secondary)]">
              <p><strong>• Algorithm Mechanics:</strong> Evaluates pixel lightness values (Y = 0.299R + 0.587G + 0.114B) and maps them into 4 uniform threshold intervals governed by Scatter (S) and Position (P) parameters.</p>
              <p><strong>• Why Exclude Green?</strong> Green is intentionally excluded from the gradient scale to prevent unnatural greenish noise in shadow transitions.</p>
            </div>
            <div className="pt-2 flex items-start gap-2 text-[var(--text-primary)] font-medium bg-blue-500/5 p-2.5 rounded-xl border border-blue-500/10">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Ideal For:</strong> Monochrome portraits, high-contrast black-and-white photos, architectural shapes, silhouettes, and dramatic lighting.</span>
            </div>
          </div>

          {/* Method 2: Floyd-Steinberg Diffusion */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2">
              <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> 2. Floyd-Steinberg Error Diffusion
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Full Palette Realism</span>
            </div>
            <p className="leading-relaxed text-[var(--text-secondary)]">
              The <strong>Floyd-Steinberg Diffusion</strong> method distributes color quantization error from each sticker to neighboring un-rendered stickers.
            </p>
            <div className="space-y-1.5 text-[var(--text-secondary)]">
              <p><strong>• Error Spreading Weights:</strong> For every sticker, the RGB difference between the original pixel and matched Rubik's color is calculated and pushed to adjacent pixels (7/16 right, 3/16 bottom-left, 5/16 bottom, 1/16 bottom-right).</p>
              <p><strong>• Visual Effect:</strong> Eliminates harsh color banding, producing organic shading, soft textures, and subtle skin gradients.</p>
            </div>
            <div className="pt-2 flex items-start gap-2 text-[var(--text-primary)] font-medium bg-indigo-500/5 p-2.5 rounded-xl border border-indigo-500/10">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span><strong>Ideal For:</strong> Complex full-color pictures, landscapes, fine-detailed artwork, and natural lighting scenes.</span>
            </div>
          </div>

          {/* Method 3: Dithering Nearest Neighbor */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2">
              <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> 3. Dithering (Nearest-Neighbor Matching)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">Sharp Retro Pixel Art</span>
            </div>
            <p className="leading-relaxed text-[var(--text-secondary)]">
              The <strong>Nearest-Neighbor Dithering</strong> method evaluates each pixel in isolation, mapping it to the closest Rubik's color using 3D Redmean color distance.
            </p>
            <div className="space-y-1.5 text-[var(--text-secondary)]">
              <p><strong>• Redmean Distance Formula:</strong> Perception-weighted distance calculation accounting for human eye sensitivity across Red, Green, and Blue color spectrums.</p>
              <p><strong>• Visual Effect:</strong> Delivers crisp, zero-blur, high-contrast blocky pixel shapes with clean edges.</p>
            </div>
            <div className="pt-2 flex items-start gap-2 text-[var(--text-primary)] font-medium bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Ideal For:</strong> Company logos, vector graphics, icons, typography, retro 8-bit game art, and bold geometric shapes.</span>
            </div>
          </div>

          {/* Method 4: Diffusion Without Blue */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2">
              <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-500" /> 4. Diffusion without Blue
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20">Warm Skin Tones</span>
            </div>
            <p className="leading-relaxed text-[var(--text-secondary)]">
              Executes Floyd-Steinberg error diffusion while strictly excluding the <strong>Blue</strong> palette color choice (using White, Yellow, Orange, Red, Green).
            </p>
            <div className="space-y-1.5 text-[var(--text-secondary)]">
              <p><strong>• Why Omit Blue?</strong> Blue stickers can introduce unpleasant cold speckles on human cheeks and foreheads where light shadows occur.</p>
              <p><strong>• Visual Effect:</strong> Preserves warm skin undertones, golden highlights, and rich reddish-yellow facial detail.</p>
            </div>
            <div className="pt-2 flex items-start gap-2 text-[var(--text-primary)] font-medium bg-purple-500/5 p-2.5 rounded-xl border border-purple-500/10">
              <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span><strong>Ideal For:</strong> Human face portraits, warm indoor lighting, sunset photography, and family photos.</span>
            </div>
          </div>

          {/* Method 5: Diffusion Without Green */}
          <div className="p-5 bg-slate-500/5 border border-[var(--glass-border)] rounded-2xl space-y-3 md:col-span-2">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2">
              <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-500" /> 5. Diffusion without Green
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Clean Facial Highlights</span>
            </div>
            <p className="leading-relaxed text-[var(--text-secondary)]">
              Executes Floyd-Steinberg error diffusion while restricting palette choices to White, Yellow, Orange, Red, and Blue (omitting Green).
            </p>
            <div className="space-y-1.5 text-[var(--text-secondary)]">
              <p><strong>• Why Omit Green?</strong> Camera sensors often reflect subtle green color noise under artificial or indoor lighting. Omitting green prevents greenish or olive-tinted artifacts across facial skin highlights.</p>
              <p><strong>• Visual Effect:</strong> Delivers clean, vibrant facial highlights, rich red lips, and deep blue background contrasts.</p>
            </div>
            <div className="pt-2 flex items-start gap-2 text-[var(--text-primary)] font-medium bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Ideal For:</strong> Studio portraits, flash photography, close-up face shots, and photos taken under fluorescent or tungsten indoor lighting.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
