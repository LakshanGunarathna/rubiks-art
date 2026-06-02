import { MOVES_4X4 } from './cubeConstants';
import { useSiteConfig } from '../config/siteConfig';

export async function solve(cubeString: string, abortController: AbortController): Promise<any[]> {
  const apiBaseUrl = useSiteConfig.getState().apiBaseUrl;
  
  const response = await fetch(`${apiBaseUrl}/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: cubeString }),
    signal: abortController.signal
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error + (data.details ? ` - ${data.details}` : ''));
  }

  let rawOut = data.solution || data.raw;
  let moveline = rawOut.split('\n').find((l: string) => l.includes('Solution:')) || rawOut;
  let moveStr = moveline.replace('Solution:', '').trim();

  const movesArr = moveStr.split(' ').filter((m: string) => m);
  const solutionSteps = [];

  for (let m of movesArr) {
    let mapped = mapWcaToRotation4x4(m);
    if (mapped) {
      solutionSteps.push({ raw: m, axis: mapped.axis, layer: mapped.layers, angle: mapped.angle });
    }
  }

  return solutionSteps;
}

function mapWcaToRotation4x4(moveStr: string) {
  let face = moveStr[0];
  let mod = moveStr.substring(1);

  if (['2', '3'].includes(face) && moveStr.length > 1) {
    let innerFace = moveStr[1];
    mod = moveStr.substring(2);
    face = innerFace.toLowerCase();
  }

  if (mod.startsWith('w')) {
    face = face + 'w';
    mod = mod.substring(1);
  }

  const moveDef = MOVES_4X4[face];
  if (!moveDef) return null;

  const axis = moveDef[0];
  const ls = moveDef[1];
  let angle = moveDef[2];

  if (mod.includes("'")) angle = -angle;
  if (mod.includes("2")) angle = angle * 2;

  return { axis, layers: ls, angle };
}
