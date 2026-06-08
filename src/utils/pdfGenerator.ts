import { jsPDF } from 'jspdf';
import type { PaletteColor } from './mosaicAlgorithms';

interface PDFGeneratorOptions {
  methodName: string;
  cubeType: string;
  cubesWide: number;
  cubesHigh: number;
  cubeSize: number;
  currentIndices: Uint8Array;
  palette: PaletteColor[];
  statistics: {
    colorStats: Array<PaletteColor & { count: number; percentage: string }>;
    totalCubes: number;
    totalStickers: number;
  };
}

export const generatePDFGuide = ({
  methodName,
  cubeType,
  cubesWide,
  cubesHigh,
  cubeSize,
  currentIndices,
  palette,
  statistics
}: PDFGeneratorOptions) => {
  const wStickers = cubesWide * cubeSize;
  const hStickers = cubesHigh * cubeSize;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cover Page
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text("Rubik's Cube Mosaic Pattern Instruction Guide", pageWidth / 2, 50, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(156, 163, 175); 
  doc.text(`Rendering Style: ${methodName} | Cube size: ${cubeType}`, pageWidth / 2, 65, { align: 'center' });
  doc.text(`Grid Dimensions: ${cubesWide}x${cubesHigh} Cubes`, pageWidth / 2, 75, { align: 'center' });
  doc.text(`Total Cubes: ${cubesWide * cubesHigh} | Total Stickers: ${wStickers * hStickers}`, pageWidth / 2, 85, { align: 'center' });

  // Parts list box on cover page
  doc.setDrawColor(55, 65, 81);
  doc.setFillColor(30, 41, 59);
  doc.rect(40, 105, pageWidth - 80, 75, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("Parts List (Stickers & Cube Colors Count):", 50, 115);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let yOffset = 126;
  let xOffset = 50;

  statistics.colorStats.forEach((color, idx) => {
    doc.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
    doc.setDrawColor(100, 116, 139);
    doc.rect(xOffset, yOffset - 3, 4, 4, 'FD');
    
    doc.setTextColor(255, 255, 255);
    doc.text(`${color.name} (${color.code}): ${color.count} stickers`, xOffset + 7, yOffset);

    yOffset += 11;
    if (idx === 2) {
      yOffset = 126;
      xOffset = pageWidth / 2 + 10;
    }
  });

  // PAGE 2+: Cube row grids page-by-page instructions (looping bottom-to-top)
  for (let r = cubesHigh - 1; r >= 0; r--) {
    doc.addPage();
    
    // Row header bar
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Grid Row ${cubesHigh - r} of ${cubesHigh} - Cube Placement Guide`, 15, 13);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text(`Format: ${cubeType} cubes (Left to Right)`, pageWidth - 15, 13, { align: 'right' });

    // Draw row cubes
    const maxCubesPerRowInPDF = 8;
    const cubeMarginX = 10; 
    const stickerRenderSize = 3; 
    const cubeRenderSize = cubeSize * stickerRenderSize; 

    const startX = 15;
    const startY = 35;

    for (let c = 0; c < cubesWide; c++) {
      const cubeRowInPage = Math.floor(c / maxCubesPerRowInPDF);
      const cubeColInPage = c % maxCubesPerRowInPDF;

      // Compute position coordinates
      const cx = startX + cubeColInPage * (cubeRenderSize + cubeMarginX + 8);
      const cy = startY + cubeRowInPage * (cubeRenderSize + 20);

      // Title above cube
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      const cubeNumber = c * cubesHigh + (cubesHigh - 1 - r) + 1;
      doc.text(`Cube ${cubeNumber} (Col ${c + 1})`, cx, cy - 3);

      // Cube face stickers
      for (let sr = 0; sr < cubeSize; sr++) {
        for (let sc = 0; sc < cubeSize; sc++) {
          const stickerRow = r * cubeSize + sr;
          const stickerCol = c * cubeSize + sc;
          const colorIdx = currentIndices[stickerRow * wStickers + stickerCol];
          const color = palette[colorIdx];

          const sx = cx + sc * stickerRenderSize;
          const sy = cy + sr * stickerRenderSize;
          
          doc.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.08);
          doc.rect(sx, sy, stickerRenderSize, stickerRenderSize, 'FD');

          // Contrast label
          doc.setFont('courier', 'bold');
          doc.setFontSize(5);
          if (color.name === 'White' || color.name === 'Yellow') {
            doc.setTextColor(0, 0, 0);
          } else {
            doc.setTextColor(255, 255, 255);
          }
          doc.text(color.code, sx + stickerRenderSize / 2 - 0.6, sy + stickerRenderSize / 2 + 0.7);
        }
      }

      // List color codes summary below each cube grid
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      
      const cubeStickersList: number[] = [];
      for (let sr = 0; sr < cubeSize; sr++) {
        for (let sc = 0; sc < cubeSize; sc++) {
          const stickerRow = r * cubeSize + sr;
          const stickerCol = c * cubeSize + sc;
          cubeStickersList.push(currentIndices[stickerRow * wStickers + stickerCol]);
        }
      }

      const counts: Record<string, number> = {};
      cubeStickersList.forEach(idx => {
        counts[palette[idx].code] = (counts[palette[idx].code] || 0) + 1;
      });

      const countStr = Object.entries(counts)
        .map(([code, count]) => `${code}:${count}`)
        .join(' ');
      doc.text(countStr, cx, cy + cubeRenderSize + 3);
    }
  }

  doc.save(`rubiks_mosaic_guide_${cubesWide}x${cubesHigh}_${cubeType}_${methodName.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};
