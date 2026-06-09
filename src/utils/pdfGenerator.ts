import { jsPDF } from 'jspdf';
import type { PaletteColor } from './mosaicAlgorithms';
import logoPng from '../assets/Logo_50x50.png';

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
    estimatedCost: string;
  };
  imageSrc: string;
}

export const generatePDFGuide = async ({
  methodName,
  cubeType,
  cubesWide,
  cubesHigh,
  cubeSize,
  currentIndices,
  palette,
  statistics,
  imageSrc
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

  const numBlocksWide = Math.ceil(cubesWide / 3);
  const numBlocksHigh = Math.ceil(cubesHigh / 3);
  const blockStickersSize = 3 * cubeSize;
  const totalPages = 2 + numBlocksWide * numBlocksHigh;

  // Load the logo image asynchronously
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = logoPng;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  } catch (e) {
    console.warn("Failed to load footer logo image:", e);
  }

  // Helper function to draw consistent footer on every page
  const drawFooter = (pageIndex: number, centerText: string) => {
    // Separator line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.2);
    doc.line(15, 197, 282, 197);

    // PNG Footer Logo
    const logoX = 15;
    const logoY = 199.5;
    const logoWidth = 4.5;
    const logoHeight = 4.5;

    if (logoImg) {
      try {
        doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (err) {
        console.warn("Failed drawing footer logo image:", err);
      }
    } else {
      // Fallback tiny rect if logo failed loading
      doc.setFillColor(37, 99, 235);
      doc.rect(logoX, logoY, logoWidth, logoHeight, 'F');
    }

    // Logo Name: Rubiks' Art
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("Rubiks' Art", logoX + 5.5, logoY + 3.0);

    // URL Separator |
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text("|", logoX + 22.5, logoY + 3.0);

    // Website URL link in footer
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text("www.rubiks-art.com", logoX + 25, logoY + 3.0);
    doc.link(logoX + 25, logoY + 0.5, 28, 3.5, { url: 'https://www.rubiks-art.com/' });

    // Center Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(centerText, pageWidth / 2, logoY + 3.2, { align: 'center' });

    // Page Number
    doc.text(`Page ${pageIndex} of ${totalPages}`, 282, logoY + 3.2, { align: 'right' });
  };

  // ==========================================
  // --- Page 1: Premium Cover Page ---
  // ==========================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Title & Subtitle
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text("Rubik's Cube Mosaic - Block Map Layout", pageWidth / 2, 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Complete Building Instruction Booklet & Part List Guide", pageWidth / 2, 26, { align: 'center' });

  // Draw Side-by-Side Images in Center
  const maxW = 120;
  const maxH = 72;
  const imgScale = Math.min(maxW / wStickers, maxH / hStickers);
  const imgW = wStickers * imgScale;
  const imgH = hStickers * imgScale;

  const gap = 10;
  const totalW = 2 * imgW + gap;
  const startX = (pageWidth - totalW) / 2;
  const startY = 32 + (maxH - imgH) / 2;

  // Left side: Uploaded Original Image
  if (imageSrc) {
    try {
      const format = imageSrc.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(imageSrc, format, startX, startY, imgW, imgH);

      // Draw subtle border around uploaded image
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.3);
      doc.rect(startX, startY, imgW, imgH, 'D');
    } catch (e) {
      console.warn("Failed drawing original image in PDF:", e);
      // Fallback border box
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.rect(startX, startY, imgW, imgH, 'D');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("[Original Image]", startX + imgW / 2, startY + imgH / 2, { align: 'center' });
    }
  }

  // Right side: Seamless generated mosaic (No borders, no gaps)
  const rightX = startX + imgW + gap;
  for (let r = 0; r < hStickers; r++) {
    for (let c = 0; c < wStickers; c++) {
      const colorIdx = currentIndices[r * wStickers + c];
      const color = palette[colorIdx];
      const sx = rightX + c * imgScale;
      const sy = startY + r * imgScale;
      doc.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
      // Small overlap of 0.05 to prevent rendering whitespace grid lines
      doc.rect(sx, sy, imgScale + 0.05, imgScale + 0.05, 'F');
    }
  }

  // Draw border around generated mosaic
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(rightX, startY, imgW, imgH, 'D');

  // Captions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Uploaded Original", startX + imgW / 2, startY + imgH + 4, { align: 'center' });
  doc.text("Mosaic Art Preview", rightX + imgW / 2, startY + imgH + 4, { align: 'center' });

  // --- Bottom Stats Cards & Config (Left side) ---
  // TOTAL CUBES Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, 126, 58, 27, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL CUBES", 15 + 29, 132, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(statistics.totalCubes.toString(), 15 + 29, 142, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`(${cubesWide}W x ${cubesHigh}H)`, 15 + 29, 148, { align: 'center' });

  // TOTAL PIXELS Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(77, 126, 58, 27, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL PIXELS", 77 + 29, 132, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(22, 163, 74); // green-600
  doc.text(statistics.totalStickers.toString(), 77 + 29, 142, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`(${wStickers}W x ${hStickers}H stickers)`, 77 + 29, 148, { align: 'center' });

  // CONFIGURATION Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, 157, 120, 31, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("MOSAIC DESIGN CONFIGURATION", 20, 163);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42); // slate-900

  doc.setFont('helvetica', 'bold');
  doc.text("Style:", 20, 169.5);
  doc.setFont('helvetica', 'normal');
  doc.text(methodName, 43, 169.5);

  doc.setFont('helvetica', 'bold');
  doc.text("Grid Size:", 20, 176.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${cubesWide} x ${cubesHigh} Cubes (${statistics.totalCubes} Cubes)`, 43, 176.5);

  doc.setFont('helvetica', 'bold');
  doc.text("Cube Type:", 20, 183.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${cubeType} (${cubeSize}x${cubeSize} stickers per cube)`, 43, 183.5);

  // --- Required Sticker Counts List (Right side) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("REQUIRED STICKER COUNT", 145, 123);

  const standardNames = ['White', 'Yellow', 'Orange', 'Red', 'Green', 'Blue'];
  const colorRows = standardNames.map(name => {
    const found = statistics.colorStats.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (found) {
      return found;
    }
    const defaultColor = palette.find(p => p.name.toLowerCase() === name.toLowerCase()) || {
      name,
      hex: name === 'White' ? '#FFFFFF' : name === 'Yellow' ? '#FFD500' : name === 'Orange' ? '#FF5800' : name === 'Red' ? '#C41E3A' : name === 'Green' ? '#009E60' : '#0051BA',
      rgb: name === 'White' ? [255, 255, 255] : name === 'Yellow' ? [255, 213, 0] : name === 'Orange' ? [255, 88, 0] : name === 'Red' ? [196, 30, 58] : name === 'Green' ? [0, 158, 96] : [0, 81, 186],
      code: name[0].toUpperCase()
    };
    return {
      ...defaultColor,
      count: 0,
      percentage: '0.0'
    };
  });

  colorRows.forEach((color, i) => {
    const rowY = 126 + i * 10.5;

    // Row background card
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.setLineWidth(0.2);
    doc.roundedRect(145, rowY, 137, 9.5, 1.5, 1.5, 'FD');

    // Color Badge
    const rgb = color.rgb;
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.15);
    doc.roundedRect(147.5, rowY + 1.75, 6, 6, 1.2, 1.2, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    if (color.name === 'White' || color.name === 'Yellow') {
      doc.setTextColor(15, 23, 42); // slate-900
    } else {
      doc.setTextColor(255, 255, 255);
    }
    doc.text(color.code, 150.5, rowY + 5.9, { align: 'center' });

    // Color Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(color.name, 156.5, rowY + 4.6);

    // Count & Percentage
    const countStr = color.count.toString();
    const percentStr = `${color.percentage}%`;
    doc.text(`${countStr}   (${percentStr})`, 279, rowY + 4.6, { align: 'right' });

    // Progress Bar background
    doc.setFillColor(226, 232, 240); // slate-200 base bar
    doc.rect(156.5, rowY + 6.4, 122.5, 1.2, 'F');

    // Progress Bar fill
    const pct = Math.min(100, parseFloat(color.percentage));
    if (pct > 0) {
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      doc.rect(156.5, rowY + 6.4, 122.5 * (pct / 100), 1.2, 'F');
    }
  });

  drawFooter(1, "Cover Page - Instructions & Specifications");

  // ==========================================
  // --- Page 2: Block Map Layout Overview ---
  // ==========================================
  doc.addPage();

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text("Grid Block Map Layout Overview", pageWidth / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Divided into ${numBlocksWide}x${numBlocksHigh} blocks of up to 3x3 cubes. Start building bottom-up starting with block A1.`,
    pageWidth / 2,
    21,
    { align: 'center' }
  );

  // Enlarged Overview Image size & centering
  const maxOverviewW = 210;
  const maxOverviewH = 136;
  const overviewScale = Math.min(maxOverviewW / wStickers, maxOverviewH / hStickers);
  const renderW = wStickers * overviewScale;
  const renderH = hStickers * overviewScale;

  const offsetX = (pageWidth - renderW) / 2;
  const offsetY = 38 + (maxOverviewH - renderH) / 2;

  // Draw overview mosaic stickers
  for (let r = 0; r < hStickers; r++) {
    for (let c = 0; c < wStickers; c++) {
      const colorIdx = currentIndices[r * wStickers + c];
      const color = palette[colorIdx];
      const sx = offsetX + c * overviewScale;
      const sy = offsetY + r * overviewScale;
      doc.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
      doc.rect(sx, sy, overviewScale + 0.05, overviewScale + 0.05, 'F');
    }
  }

  // Draw thin grey lines for individual cubes
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.12);
  for (let c = 0; c <= cubesWide; c++) {
    const x = offsetX + c * cubeSize * overviewScale;
    doc.line(x, offsetY, x, offsetY + renderH);
  }
  for (let r = 0; r <= cubesHigh; r++) {
    const y = offsetY + r * cubeSize * overviewScale;
    doc.line(offsetX, y, offsetX + renderW, y);
  }

  // Draw thick lines for block boundaries and label cell grid
  doc.setDrawColor(15, 23, 42); // slate-900
  doc.setLineWidth(0.5);

  // Horizontal dividers extending to label cells
  for (let by = 0; by <= numBlocksHigh; by++) {
    const y = offsetY + renderH - Math.min(hStickers, by * blockStickersSize) * overviewScale;
    doc.line(offsetX - 10, y, offsetX + renderW + 10, y);
  }
  // Vertical dividers extending to label cells
  for (let bx = 0; bx <= numBlocksWide; bx++) {
    const x = offsetX + Math.min(wStickers, bx * blockStickersSize) * overviewScale;
    doc.line(x, offsetY - 10, x, offsetY + renderH + 10);
  }

  // Outer border lines enclosing the entire extended grid cells
  doc.line(offsetX - 10, offsetY - 10, offsetX + renderW + 10, offsetY - 10);
  doc.line(offsetX - 10, offsetY + renderH + 10, offsetX + renderW + 10, offsetY + renderH + 10);
  doc.line(offsetX - 10, offsetY - 10, offsetX - 10, offsetY + renderH + 10);
  doc.line(offsetX + renderW + 10, offsetY - 10, offsetX + renderW + 10, offsetY + renderH + 10);

  // Print Horizontal Block Letters (A, B, C...) in top & bottom cells
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  for (let bx = 0; bx < numBlocksWide; bx++) {
    const sc_start = bx * blockStickersSize;
    const sc_end = Math.min(wStickers, (bx + 1) * blockStickersSize);
    const cx = offsetX + ((sc_start + sc_end) / 2) * overviewScale;
    const label = String.fromCharCode(65 + bx);

    // Top letter (centered in cell between offsetY - 10 and offsetY)
    doc.setFontSize(14);
    doc.text(label, cx, offsetY - 3.5, { align: 'center' });
    // Bottom letter (centered in cell between offsetY + renderH and offsetY + renderH + 10)
    doc.text(label, cx, offsetY + renderH + 7, { align: 'center' });
  }

  // Print Vertical Block Numbers (1, 2, 3...) in left & right cells
  for (let by = 0; by < numBlocksHigh; by++) {
    const sr_end = hStickers - by * blockStickersSize;
    const sr_start = Math.max(0, hStickers - (by + 1) * blockStickersSize);
    const cy = offsetY + ((sr_start + sr_end) / 2) * overviewScale;
    const label = (by + 1).toString();

    // Left number (centered horizontally in cell between offsetX - 10 and offsetX)
    doc.setFontSize(11);
    doc.text(label, offsetX - 5, cy + 2, { align: 'center' });
    // Right number (centered horizontally in cell between offsetX + renderW and offsetX + renderW + 10)
    doc.text(label, offsetX + renderW + 5, cy + 2, { align: 'center' });
  }

  drawFooter(2, "Overview Block Grid Map - Layout Grid");

  // ==========================================
  // --- Pages 3+: Page-per-block detailed instructions ---
  // ==========================================
  for (let by = 0; by < numBlocksHigh; by++) {
    for (let bx = 0; bx < numBlocksWide; bx++) {
      doc.addPage();

      const blockLabel = String.fromCharCode(65 + bx) + (by + 1);
      const pageIndex = 3 + by * numBlocksWide + bx;

      // Page header bar
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 22, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Instruction Block ${blockLabel} Guide`, 15, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Block position: Horizontal ${String.fromCharCode(65 + bx)} | Vertical ${by + 1} (from bottom)`,
        pageWidth - 15,
        14,
        { align: 'right' }
      );

      // --- Left side: Render up to 3x3 cubes within this block ---
      const r_max = cubesHigh - 1 - by * 3;
      const r_min = Math.max(0, cubesHigh - 1 - by * 3 - 2);

      const maxCubesW = 3;
      const maxCubesH = 3;
      const cubeMarginX = 14;
      const cubeMarginY = 16;
      const startCubesX = 15;
      const startCubesY = 38;

      // Available left width is 185mm (leaving right side 200mm+ for locator map)
      const availW = 185 - (maxCubesW - 1) * cubeMarginX;
      const availH = pageHeight - 60 - (maxCubesH - 1) * cubeMarginY;
      const stickerRenderSize = Math.min(availW / (maxCubesW * cubeSize), availH / (maxCubesH * cubeSize));
      const cubeRenderSize = cubeSize * stickerRenderSize;

      // Draw the cubes in the block
      for (let br = 0; br < 3; br++) {
        const r = r_max - (2 - br);
        if (r < r_min || r > r_max) continue;

        for (let bc = 0; bc < 3; bc++) {
          const c = bx * 3 + bc;
          if (c >= cubesWide) continue;

          const cx = startCubesX + bc * (cubeRenderSize + cubeMarginX);
          const cy = startCubesY + br * (cubeRenderSize + cubeMarginY);

          // Cube Title
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          const cubeNumber = (cubesHigh - 1 - r) * cubesWide + c + 1;
          doc.text(`Cube ${cubeNumber} (Row ${r + 1}, Col ${c + 1})`, cx, cy - 2.5);

          // Draw the cube stickers
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

              // Print sticker color code
              doc.setFont('courier', 'bold');
              doc.setFontSize(Math.max(4, stickerRenderSize * 1.5));
              if (color.name === 'White' || color.name === 'Yellow') {
                doc.setTextColor(0, 0, 0);
              } else {
                doc.setTextColor(255, 255, 255);
              }
              doc.text(
                color.code,
                sx + stickerRenderSize / 2,
                sy + stickerRenderSize / 2 + 0.6,
                { align: 'center' }
              );
            }
          }

          // Count codes summary below cube
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

      // --- Right side: Draw the Minimap / Locator Map in blue ---
      const minimapCenterX = 245;
      const minimapCenterY = 115;
      const maxMinimapW = 60;
      const maxMinimapH = 95;

      const blockScale = Math.min(maxMinimapW / numBlocksWide, maxMinimapH / numBlocksHigh);
      const blockW = Math.min(12, blockScale);
      const blockH = Math.min(12, blockScale);

      const minimapW = numBlocksWide * blockW;
      const minimapH = numBlocksHigh * blockH;
      const minimapOffsetX = minimapCenterX - minimapW / 2;
      const minimapOffsetY = minimapCenterY - minimapH / 2;

      // Header for locator map
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text("Block Locator Map", minimapCenterX, minimapOffsetY - 5, { align: 'center' });

      // Draw locator map blocks
      for (let my = 0; my < numBlocksHigh; my++) {
        for (let mx = 0; mx < numBlocksWide; mx++) {
          const bx_x = minimapOffsetX + mx * blockW;
          const bx_y = minimapOffsetY + minimapH - (my + 1) * blockH;
          const isCurrentBlock = (mx === bx && my === by);

          if (isCurrentBlock) {
            doc.setFillColor(0, 81, 186); // Rubik's Blue
            doc.setDrawColor(0, 81, 186);
            doc.rect(bx_x, bx_y, blockW, blockH, 'FD');
            doc.setTextColor(255, 255, 255);
          } else {
            doc.setFillColor(241, 245, 249); // light grey slate-100
            doc.setDrawColor(203, 213, 225); // slate-300
            doc.rect(bx_x, bx_y, blockW, blockH, 'FD');
            doc.setTextColor(71, 85, 105); // slate-600
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(Math.max(5.5, Math.floor(blockW * 0.55)));
          const mLabel = String.fromCharCode(65 + mx) + (my + 1);
          doc.text(mLabel, bx_x + blockW / 2, bx_y + blockH / 2 + 0.8, { align: 'center' });
        }
      }

      drawFooter(pageIndex, `Instruction Guide - Block ${blockLabel}`);
    }
  }

  doc.save(
    `rubiks_mosaic_block_guide_${cubesWide}x${cubesHigh}_${cubeType}_${methodName
      .toLowerCase()
      .replace(/\s+/g, '_')}.pdf`
  );
};
