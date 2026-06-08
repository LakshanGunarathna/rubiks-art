export interface PaletteColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  textClass: string;
  code: string;
}

// Adjust contrast/brightness
export const applyContrastBrightness = (data: Uint8ClampedArray, contrast: number, brightness: number) => {
  const adjusted = new Uint8ClampedArray(data.length);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] + brightness;
    let g = data[i+1] + brightness;
    let b = data[i+2] + brightness;
    
    if (contrast !== 0) {
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;
    }
    
    adjusted[i] = Math.max(0, Math.min(255, r));
    adjusted[i+1] = Math.max(0, Math.min(255, g));
    adjusted[i+2] = Math.max(0, Math.min(255, b));
    adjusted[i+3] = data[i+3];
  }
  return adjusted;
};

// Helper for uniform gradient range generation
export function createUniformRange(numBorders: number, scatter: number, position: number) {
  const rangeLength = 255 * scatter;
  const distance = numBorders > 1 ? rangeLength / (numBorders - 1) : 0;
  const x0 = (255 - rangeLength) * position;

  const range: number[] = [];
  for (let i = 0; i < numBorders; ++i) {
    range.push(Math.round(x0 + i * distance));
  }
  return range;
}

// Redmean color distance matching
export const getClosestColorIndex = (
  r: number,
  g: number,
  b: number,
  palette: PaletteColor[],
  filter?: (c: PaletteColor) => boolean
): number => {
  let minDistance = Infinity;
  let closestIndex = 0;
  
  for (let i = 0; i < palette.length; i++) {
    if (filter && !filter(palette[i])) continue;
    const p = palette[i].rgb;
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

// Main generator function
export function generateMosaicIndices(
  methodId: string,
  rawCroppedData: Uint8ClampedArray,
  wStickers: number,
  hStickers: number,
  contrast: number,
  brightness: number,
  scatter: number,
  position: number,
  palette: PaletteColor[]
): Uint8Array {
  const count = wStickers * hStickers;
  const adjustedPixels = applyContrastBrightness(rawCroppedData, contrast, brightness);

  if (methodId === 'gradient') {
    const resultIndices = new Uint8Array(count);
    const ranges = createUniformRange(4, scatter, position);
    
    const gradColors = [
      palette[5], // Blue
      palette[3], // Red
      palette[2], // Orange
      palette[1], // Yellow
      palette[0]  // White
    ];

    for (let i = 0; i < count; i++) {
      const r = adjustedPixels[i * 4];
      const g = adjustedPixels[i * 4 + 1];
      const b = adjustedPixels[i * 4 + 2];
      const tone = (r + g + b) / 3;

      let matchedColor = gradColors[gradColors.length - 1]; // Default White
      for (let j = 0; j < ranges.length; j++) {
        if (tone < ranges[j]) {
          matchedColor = gradColors[j];
          break;
        }
      }
      resultIndices[i] = palette.findIndex(c => c.name === matchedColor.name);
    }
    return resultIndices;
  } else if (methodId === 'dithering') {
    const resultIndices = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
      resultIndices[i] = getClosestColorIndex(
        adjustedPixels[i * 4],
        adjustedPixels[i * 4 + 1],
        adjustedPixels[i * 4 + 2],
        palette
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
          Math.max(0, Math.min(255, g)),
          Math.max(0, Math.min(255, b)),
          palette,
          colorFilter
        );
        resultIndices[y * wStickers + x] = colorIdx;

        const matchedRGB = palette[colorIdx].rgb;
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
}
