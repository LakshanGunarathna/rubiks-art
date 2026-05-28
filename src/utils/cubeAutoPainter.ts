import * as THREE from 'three';
import { RUBIKS_CUBE_COLORS } from '../types/cube';
import { getStickerMat } from './cubeUtils';
import {
  VALID_EDGES,
  VALID_CORNERS,
  CANONICAL_NORMALS,
  COLOR_FROM_NORMAL
} from './cubeConstants';

export function autoDeducePieces(cubiesRef: any, engine: any): void {
  if (!cubiesRef?.current) return;
  let madeChanges = false;
  const noiseTexture = engine?.noiseTexture || null;

  const pieces: any[] = [];
  cubiesRef.current.forEach((cubie: any) => {
    const stickers = cubie.children.filter((c: any) => c.userData?.isSticker);
    if (stickers.length > 1) {
      pieces.push({
        cubie,
        stickers,
        colors: stickers.map((s: any) => s.material.color.getHex()),
        isEdge: stickers.length === 2,
        isCorner: stickers.length === 3
      });
    }
  });

  const fullyPaintedEdges = pieces.filter(p => p.isEdge && !p.colors.includes(RUBIKS_CUBE_COLORS.gray)).map(p => p.colors);
  const fullyPaintedCorners = pieces.filter(p => p.isCorner && !p.colors.includes(RUBIKS_CUBE_COLORS.gray)).map(p => p.colors);

  pieces.forEach(p => {
    if (p.colors.includes(RUBIKS_CUBE_COLORS.gray)) {
      const paintedColors = p.colors.filter((c: number) => c !== RUBIKS_CUBE_COLORS.gray);

      if (p.isEdge && paintedColors.length === 1) {
        const c1 = paintedColors[0];
        const possiblePairs = VALID_EDGES.filter(pair => pair.includes(c1));
        const remainingPairs = possiblePairs.filter(pair => {
          return !fullyPaintedEdges.some(fp => fp.includes(pair[0]) && fp.includes(pair[1]));
        });

        if (remainingPairs.length === 1) {
          const deducedColor = remainingPairs[0].find(c => c !== c1);
          const unpaintedSticker = p.stickers.find((s: any) => s.material.color.getHex() === RUBIKS_CUBE_COLORS.gray);
          if (unpaintedSticker && deducedColor !== undefined) {
            unpaintedSticker.material = getStickerMat(deducedColor, noiseTexture);
            madeChanges = true;
          }
        }
      }
      else if (p.isCorner && paintedColors.length === 2) {
        const c1 = paintedColors[0];
        const c2 = paintedColors[1];
        const possibleTriplets = VALID_CORNERS.filter(trip => trip.includes(c1) && trip.includes(c2));
        const remainingTriplets = possibleTriplets.filter(trip => {
          return !fullyPaintedCorners.some(fp => fp.includes(trip[0]) && fp.includes(trip[1]) && fp.includes(trip[2]));
        });

        if (remainingTriplets.length === 1) {
          const deducedColor = remainingTriplets[0].find(c => c !== c1 && c !== c2);
          const unpaintedSticker = p.stickers.find((s: any) => s.material.color.getHex() === RUBIKS_CUBE_COLORS.gray);
          if (unpaintedSticker && deducedColor !== undefined) {
            unpaintedSticker.material = getStickerMat(deducedColor, noiseTexture);
            madeChanges = true;
          }
        }
      }
    }
  });

  if (madeChanges) {
    autoDeducePieces(cubiesRef, engine);
  }
}

export function autoFillCenters(cubiesRef: any, engine: any): void {
  if (!cubiesRef?.current) return;
  const noiseTexture = engine?.noiseTexture || null;

  const centerStickers: any[] = [];
  cubiesRef.current.forEach((c: any) => {
    const absSum = Math.abs(Math.round(c.position.x)) + Math.abs(Math.round(c.position.y)) + Math.abs(Math.round(c.position.z));
    if (absSum === 1) {
      const st = c.children.find((child: any) => child.userData?.isSticker);
      if (st) {
        centerStickers.push({
          sticker: st,
          normal: new THREE.Vector3(Math.round(c.position.x), Math.round(c.position.y), Math.round(c.position.z)),
          color: st.material.color.getHex()
        });
      }
    }
  });

  const painted = centerStickers.filter(s => s.color !== RUBIKS_CUBE_COLORS.gray);
  let s1 = null, s2 = null;
  for (let i = 0; i < painted.length; i++) {
    for (let j = i + 1; j < painted.length; j++) {
      if (painted[i].normal.dot(painted[j].normal) === 0) {
        s1 = painted[i];
        s2 = painted[j];
        break;
      }
    }
    if (s1) break;
  }

  if (s1 && s2) {
    const v1 = CANONICAL_NORMALS[s1.color];
    const v2 = CANONICAL_NORMALS[s2.color];
    if (!v1 || !v2) return;

    const n3 = new THREE.Vector3().crossVectors(s1.normal, s2.normal);
    const v3 = new THREE.Vector3().crossVectors(v1, v2);

    const mapping = [
      { n: s1.normal, v: v1 },
      { n: new THREE.Vector3(-s1.normal.x, -s1.normal.y, -s1.normal.z), v: new THREE.Vector3(-v1.x, -v1.y, -v1.z) },
      { n: s2.normal, v: v2 },
      { n: new THREE.Vector3(-s2.normal.x, -s2.normal.y, -s2.normal.z), v: new THREE.Vector3(-v2.x, -v2.y, -v2.z) },
      { n: n3, v: v3 },
      { n: new THREE.Vector3(-n3.x, -n3.y, -n3.z), v: new THREE.Vector3(-v3.x, -v3.y, -v3.z) }
    ];

    centerStickers.forEach(cs => {
      const mapItem = mapping.find(m => m.n.equals(cs.normal));
      if (mapItem) {
        const canonicalKey = `${Math.round(mapItem.v.x)},${Math.round(mapItem.v.y)},${Math.round(mapItem.v.z)}`;
        const targetHex = COLOR_FROM_NORMAL[canonicalKey];
        if (targetHex !== undefined && cs.color !== targetHex) {
          cs.sticker.material = getStickerMat(targetHex, noiseTexture);
        }
      }
    });
  }
}
