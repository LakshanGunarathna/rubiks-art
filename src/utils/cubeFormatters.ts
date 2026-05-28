import { FACE_NAMES } from './cubeConstants';

export function getHumanReadableMove(rawMove: string, isUndo: boolean = false): string {
  const face = rawMove[0];
  const mod = rawMove.length > 1 ? rawMove[1] : '';
  const faceName = FACE_NAMES[face] || face;

  if (isUndo) {
    if (mod === "'") return `Turn the ${faceName} layer 90° clockwise.`;
    if (mod === "2") return `Turn the ${faceName} layer 180°.`;
    return `Turn the ${faceName} layer 90° counterclockwise.`;
  }

  if (mod === "'") return `Turn the ${faceName} layer 90° counterclockwise.`;
  if (mod === "2") return `Turn the ${faceName} layer 180°.`;
  return `Turn the ${faceName} layer 90° clockwise.`;
}
