import * as THREE from 'three';
import { RUBIKS_CUBE_COLORS } from '../types/cube';
import type { Axis } from '../types/cube';

export const OPPOSITE_COLORS: Record<number, number> = {
  [RUBIKS_CUBE_COLORS.white]: RUBIKS_CUBE_COLORS.yellow,
  [RUBIKS_CUBE_COLORS.yellow]: RUBIKS_CUBE_COLORS.white,
  [RUBIKS_CUBE_COLORS.blue]: RUBIKS_CUBE_COLORS.green,
  [RUBIKS_CUBE_COLORS.green]: RUBIKS_CUBE_COLORS.blue,
  [RUBIKS_CUBE_COLORS.red]: RUBIKS_CUBE_COLORS.orange,
  [RUBIKS_CUBE_COLORS.orange]: RUBIKS_CUBE_COLORS.red,
};

export const ALL_COLORS = [
  RUBIKS_CUBE_COLORS.white, RUBIKS_CUBE_COLORS.yellow, RUBIKS_CUBE_COLORS.blue,
  RUBIKS_CUBE_COLORS.green, RUBIKS_CUBE_COLORS.red, RUBIKS_CUBE_COLORS.orange
];

export const VALID_EDGES: [number, number][] = [];
for (let i = 0; i < ALL_COLORS.length; i++) {
  for (let j = i + 1; j < ALL_COLORS.length; j++) {
    const c1 = ALL_COLORS[i];
    const c2 = ALL_COLORS[j];
    if (OPPOSITE_COLORS[c1] !== c2) {
      VALID_EDGES.push([c1, c2]);
    }
  }
}

export const VALID_CORNERS: [number, number, number][] = [];
for (let i = 0; i < ALL_COLORS.length; i++) {
  for (let j = i + 1; j < ALL_COLORS.length; j++) {
    for (let k = j + 1; k < ALL_COLORS.length; k++) {
      const c1 = ALL_COLORS[i];
      const c2 = ALL_COLORS[j];
      const c3 = ALL_COLORS[k];
      if (OPPOSITE_COLORS[c1] !== c2 && OPPOSITE_COLORS[c1] !== c3 && OPPOSITE_COLORS[c2] !== c3) {
        VALID_CORNERS.push([c1, c2, c3]);
      }
    }
  }
}

export const CANONICAL_NORMALS: Record<number, THREE.Vector3> = {
  [RUBIKS_CUBE_COLORS.white]: new THREE.Vector3(0, 1, 0),
  [RUBIKS_CUBE_COLORS.yellow]: new THREE.Vector3(0, -1, 0),
  [RUBIKS_CUBE_COLORS.red]: new THREE.Vector3(0, 0, 1),
  [RUBIKS_CUBE_COLORS.orange]: new THREE.Vector3(0, 0, -1),
  [RUBIKS_CUBE_COLORS.blue]: new THREE.Vector3(1, 0, 0),
  [RUBIKS_CUBE_COLORS.green]: new THREE.Vector3(-1, 0, 0),
};

export const COLOR_FROM_NORMAL: Record<string, number> = {
  "0,1,0": RUBIKS_CUBE_COLORS.white, "0,-1,0": RUBIKS_CUBE_COLORS.yellow,
  "0,0,1": RUBIKS_CUBE_COLORS.red, "0,0,-1": RUBIKS_CUBE_COLORS.orange,
  "1,0,0": RUBIKS_CUBE_COLORS.blue, "-1,0,0": RUBIKS_CUBE_COLORS.green
};

export const HEX_TO_NAME: Record<number, string> = {
  [RUBIKS_CUBE_COLORS.white]: 'white',
  [RUBIKS_CUBE_COLORS.yellow]: 'yellow',
  [RUBIKS_CUBE_COLORS.blue]: 'blue',
  [RUBIKS_CUBE_COLORS.green]: 'green',
  [RUBIKS_CUBE_COLORS.red]: 'red',
  [RUBIKS_CUBE_COLORS.orange]: 'orange',
};

export const FACE_NAMES: Record<string, string> = {
  'U': 'TOP', 'D': 'BOTTOM', 'F': 'FRONT', 'B': 'BACK', 'L': 'LEFT', 'R': 'RIGHT'
};

export const MOVES_3X3: Record<string, [Axis, number, number]> = {
  'L': ['x', -1, Math.PI / 2], 'M': ['x', 0, Math.PI / 2], 'R': ['x', 1, -Math.PI / 2],
  'U': ['y', 1, -Math.PI / 2], 'E': ['y', 0, Math.PI / 2], 'D': ['y', -1, Math.PI / 2],
  'F': ['z', 1, -Math.PI / 2], 'S': ['z', 0, -Math.PI / 2], 'B': ['z', -1, Math.PI / 2]
};

export const MOVES_2X2: Record<string, [Axis, number, number]> = {
  'L': ['x', -0.5, Math.PI / 2], 'R': ['x', 0.5, -Math.PI / 2],
  'U': ['y', 0.5, -Math.PI / 2], 'D': ['y', -0.5, Math.PI / 2],
  'F': ['z', 0.5, -Math.PI / 2], 'B': ['z', -0.5, Math.PI / 2]
};
