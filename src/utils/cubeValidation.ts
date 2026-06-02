import { ALL_COLORS, HEX_TO_NAME, OPPOSITE_COLORS } from './cubeConstants';
import type { PaintedPiece } from '../types/cube';

export function validate2x2(hasUnpainted: boolean, colorCounts: Record<number, number>): string[] {
  const colorErrors: string[] = [];
  if (hasUnpainted) {
    colorErrors.push("You have unpainted tiles on the cube.");
  }
  ALL_COLORS.forEach(hex => {
    const name = HEX_TO_NAME[hex];
    const count = colorCounts[hex] || 0;
    if (count < 4) colorErrors.push(`You do not have enough ${name} tiles (${count}/4).`);
    else if (count > 4) colorErrors.push(`You have too many ${name} tiles (${count}/4).`);
  });
  return colorErrors;
}

export function validate3x3(
  hasUnpainted: boolean,
  colorCounts: Record<number, number>,
  paintedPieces: PaintedPiece[]
): string[] {
  const validationErrors: string[] = [];

  if (hasUnpainted) {
    validationErrors.push("You have unpainted tiles on the cube.");
  }

  ALL_COLORS.forEach(hex => {
    const name = HEX_TO_NAME[hex];
    const count = colorCounts[hex] || 0;
    if (count < 9) validationErrors.push(`You do not have enough ${name} tiles (${count}/9).`);
    else if (count > 9) validationErrors.push(`You have too many ${name} tiles (${count}/9).`);
  });

  if (hasUnpainted) {
    return validationErrors;
  }

  // Check centers
  const centerPieces = paintedPieces.filter(p => p.colors.length === 1);
  if (centerPieces.length !== 6) {
    validationErrors.push("Invalid center pieces detected.");
    return validationErrors;
  }

  const centerOpposites = new Map<number, number>();
  centerPieces.forEach(p => {
    const x = Math.round(p.cubie.position.x);
    const y = Math.round(p.cubie.position.y);
    const z = Math.round(p.cubie.position.z);
    const oppP = centerPieces.find(op =>
      Math.round(op.cubie.position.x) === -x &&
      Math.round(op.cubie.position.y) === -y &&
      Math.round(op.cubie.position.z) === -z
    );
    if (oppP) centerOpposites.set(p.colors[0], oppP.colors[0]);
  });

  if (centerOpposites.size !== 6) {
    validationErrors.push("Invalid center orientation detected.");
    return validationErrors;
  }

  let edgeErrors = 0;
  let cornerErrors = 0;
  paintedPieces.forEach(p => {
    if (p.colors.length > 1) {
      let hasError = false;
      for (let i = 0; i < p.colors.length; i++) {
        for (let j = i + 1; j < p.colors.length; j++) {
          if (centerOpposites.get(p.colors[i]) === p.colors[j]) hasError = true;
        }
      }
      if (hasError) {
        if (p.colors.length === 2) edgeErrors++;
        else if (p.colors.length === 3) cornerErrors++;
      }
    }
  });

  if (edgeErrors > 0 || cornerErrors > 0) {
    if (edgeErrors > 0) validationErrors.push(`${edgeErrors} edge piece(s) have opposite face colors.`);
    if (cornerErrors > 0) validationErrors.push(`${cornerErrors} corner piece(s) have opposite face colors.`);
  }

  return validationErrors;
}

export function checkIfSolved2x2(posit: number[]): boolean {
  const faces = [
    [12, 13, 14, 15], // U
    [0, 1, 2, 3],     // D
    [20, 21, 22, 23], // F
    [8, 9, 10, 11],   // B
    [16, 17, 18, 19], // R
    [4, 5, 6, 7]      // L
  ];
  for (const face of faces) {
    const firstColor = posit[face[0]];
    if (!face.every(idx => posit[idx] === firstColor)) {
      return false;
    }
  }
  return true;
}

export function checkIfSolved3x3(cubeString: string): boolean {
  for (let i = 0; i < 54; i += 9) {
    const segment = cubeString.substring(i, i + 9);
    if (new Set(segment).size > 1) {
      return false;
    }
  }
  return true;
}

export function validate4x4(
  hasUnpainted: boolean,
  colorCounts: Record<number, number>,
  paintedPieces: PaintedPiece[]
): string[] {
  const validationErrors: string[] = [];

  if (hasUnpainted) {
    validationErrors.push("You have unpainted tiles on the cube.");
  }

  ALL_COLORS.forEach(hex => {
    const name = HEX_TO_NAME[hex];
    const count = colorCounts[hex] || 0;
    if (count < 16) validationErrors.push(`You do not have enough ${name} tiles (${count}/16).`);
    else if (count > 16) validationErrors.push(`You have too many ${name} tiles (${count}/16).`);
  });

  if (hasUnpainted) {
    return validationErrors;
  }

  let edgeErrors = 0;
  let cornerErrors = 0;
  paintedPieces.forEach(p => {
    if (p.colors.length > 1) {
      let hasError = false;
      for (let i = 0; i < p.colors.length; i++) {
        for (let j = i + 1; j < p.colors.length; j++) {
          if (OPPOSITE_COLORS[p.colors[i]] === p.colors[j]) hasError = true;
          if (p.colors[i] === p.colors[j]) hasError = true;
        }
      }
      if (hasError) {
        if (p.colors.length === 2) edgeErrors++;
        else cornerErrors++;
      }
    }
  });

  if (edgeErrors || cornerErrors) {
    if (edgeErrors) validationErrors.push(`${edgeErrors} edge piece(s) have invalid color combinations.`);
    if (cornerErrors) validationErrors.push(`${cornerErrors} corner piece(s) have invalid color combinations.`);
  }

  return validationErrors;
}

export function checkIfSolved4x4(cubeString: string): boolean {
  for (let i = 0; i < 96; i += 16) {
    const segment = cubeString.substring(i, i + 16);
    if (new Set(segment).size > 1) {
      return false;
    }
  }
  return true;
}

export function validate5x5(
  hasUnpainted: boolean,
  colorCounts: Record<number, number>
): string[] {
  const validationErrors: string[] = [];

  if (hasUnpainted) {
    validationErrors.push("You have unpainted tiles on the cube.");
  }

  ALL_COLORS.forEach(hex => {
    const name = HEX_TO_NAME[hex];
    const count = colorCounts[hex] || 0;
    if (count < 25) validationErrors.push(`You do not have enough ${name} tiles (${count}/25).`);
    else if (count > 25) validationErrors.push(`You have too many ${name} tiles (${count}/25).`);
  });

  return validationErrors;
}

export function checkIfSolved5x5(cubeString: string): boolean {
  for (let i = 0; i < 150; i += 25) {
    const segment = cubeString.substring(i, i + 25);
    if (new Set(segment).size > 1) {
      return false;
    }
  }
  return true;
}
