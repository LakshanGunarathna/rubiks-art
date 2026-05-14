import * as THREE from 'three';

export type Axis = 'x' | 'y' | 'z';


export interface Move {
  axis: Axis;
  layer: number;
  angle: number;
  duration?: number;
  record?: boolean;
}

export interface WholeCubeRotation {
  axis: Axis;
  angle: number;
  duration?: number;
  record?: boolean;
}

export interface HistoryItem {
  axis: Axis;
  layer?: number;
  angle: number;
  wholeCube: boolean;
}

export interface AnimationState {
  axis: Axis;
  targetRotation: number;
  currentRotation: number;
  speed: number;
  activePieces: THREE.Object3D[];
  resolve: () => void;
}

export interface CameraAnimState {
  startCamPos: THREE.Vector3;
  startTarget: THREE.Vector3;
  endCamPos: THREE.Vector3;
  endTarget: THREE.Vector3;
  duration: number;
  elapsed: number;
}

export interface PaintedPiece {
  cubie: THREE.Object3D;
  colors: number[];
}

export const RUBIKS_CUBE_COLORS = {
  blue: 0x2A62C9,
  green: 0x009E60,
  white: 0xFFFFFF,
  yellow: 0xFFD500,
  red: 0xC41E3A,
  orange: 0xFF5800,
  gray: 0x555555,
  darkGray: 0x222222
};

export const COLOR_MAP = {
  right: RUBIKS_CUBE_COLORS.blue,
  left: RUBIKS_CUBE_COLORS.green,
  top: RUBIKS_CUBE_COLORS.white,
  bottom: RUBIKS_CUBE_COLORS.yellow,
  front: RUBIKS_CUBE_COLORS.red,
  back: RUBIKS_CUBE_COLORS.orange
};
