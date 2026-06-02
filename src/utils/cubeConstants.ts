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

export const MOVES_4X4: Record<string, [Axis, number[], number]> = {
  'U': ['y', [1.5], -Math.PI / 2], 'D': ['y', [-1.5], Math.PI / 2],
  'L': ['x', [-1.5], Math.PI / 2], 'R': ['x', [1.5], -Math.PI / 2],
  'F': ['z', [1.5], -Math.PI / 2], 'B': ['z', [-1.5], Math.PI / 2],

  'Uw': ['y', [1.5, 0.5], -Math.PI / 2], 'Dw': ['y', [-1.5, -0.5], Math.PI / 2],
  'Lw': ['x', [-1.5, -0.5], Math.PI / 2], 'Rw': ['x', [1.5, 0.5], -Math.PI / 2],
  'Fw': ['z', [1.5, 0.5], -Math.PI / 2], 'Bw': ['z', [-1.5, -0.5], Math.PI / 2],

  'u': ['y', [0.5], -Math.PI / 2], 'd': ['y', [-0.5], Math.PI / 2],
  'l': ['x', [-0.5], Math.PI / 2], 'r': ['x', [0.5], -Math.PI / 2],
  'f': ['z', [0.5], -Math.PI / 2], 'b': ['z', [-0.5], Math.PI / 2],

  'M': ['x', [-0.5, 0.5], Math.PI / 2],
  'E': ['y', [-0.5, 0.5], Math.PI / 2],
  'S': ['z', [-0.5, 0.5], -Math.PI / 2],

  'x': ['x', [-1.5, -0.5, 0.5, 1.5], -Math.PI / 2],
  'y': ['y', [-1.5, -0.5, 0.5, 1.5], -Math.PI / 2],
  'z': ['z', [-1.5, -0.5, 0.5, 1.5], -Math.PI / 2]
};

export const MOVES_5X5: Record<string, [Axis, number[], number]> = {
  'U': ['y', [2], -Math.PI / 2], 'D': ['y', [-2], Math.PI / 2],
  'L': ['x', [-2], Math.PI / 2], 'R': ['x', [2], -Math.PI / 2],
  'F': ['z', [2], -Math.PI / 2], 'B': ['z', [-2], Math.PI / 2],

  'Uw': ['y', [1, 2], -Math.PI / 2], '2Uw': ['y', [1, 2], -Math.PI / 2],
  'Dw': ['y', [-2, -1], Math.PI / 2], '2Dw': ['y', [-2, -1], Math.PI / 2],
  'Lw': ['x', [-2, -1], Math.PI / 2], '2Lw': ['x', [-2, -1], Math.PI / 2],
  'Rw': ['x', [1, 2], -Math.PI / 2], '2Rw': ['x', [1, 2], -Math.PI / 2],
  'Fw': ['z', [1, 2], -Math.PI / 2], '2Fw': ['z', [1, 2], -Math.PI / 2],
  'Bw': ['z', [-2, -1], Math.PI / 2], '2Bw': ['z', [-2, -1], Math.PI / 2],

  '3Uw': ['y', [0, 1, 2], -Math.PI / 2], '3Dw': ['y', [-2, -1, 0], Math.PI / 2],
  '3Lw': ['x', [-2, -1, 0], Math.PI / 2], '3Rw': ['x', [0, 1, 2], -Math.PI / 2],
  '3Fw': ['z', [0, 1, 2], -Math.PI / 2], '3Bw': ['z', [-2, -1, 0], Math.PI / 2],

  'u': ['y', [1], -Math.PI / 2], '2U': ['y', [1], -Math.PI / 2],
  'd': ['y', [-1], Math.PI / 2], '2D': ['y', [-1], Math.PI / 2],
  'l': ['x', [-1], Math.PI / 2], '2L': ['x', [-1], Math.PI / 2],
  'r': ['x', [1], -Math.PI / 2], '2R': ['x', [1], -Math.PI / 2],
  'f': ['z', [1], -Math.PI / 2], '2F': ['z', [1], -Math.PI / 2],
  'b': ['z', [-1], Math.PI / 2], '2B': ['z', [-1], Math.PI / 2],

  'M': ['x', [0], Math.PI / 2], '3L': ['x', [0], Math.PI / 2],
  '3R': ['x', [0], -Math.PI / 2],
  'E': ['y', [0], Math.PI / 2], '3D': ['y', [0], Math.PI / 2],
  '3U': ['y', [0], -Math.PI / 2],
  'S': ['z', [0], -Math.PI / 2], '3F': ['z', [0], -Math.PI / 2],
  '3B': ['z', [0], Math.PI / 2],

  'x': ['x', [-2, -1, 0, 1, 2], -Math.PI / 2],
  'y': ['y', [-2, -1, 0, 1, 2], -Math.PI / 2],
  'z': ['z', [-2, -1, 0, 1, 2], -Math.PI / 2]
};
