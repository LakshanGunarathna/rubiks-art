import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RUBIKS_CUBE_COLORS } from '../types/cube';

let cachedNoiseTexture: THREE.CanvasTexture | null = null;

export const createNoiseTexture = () => {
  if (cachedNoiseTexture) return cachedNoiseTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 128; // Reduced resolution
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 5000; i++) { // Reduced iterations
    context.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    context.fillRect(Math.random() * 128, Math.random() * 128, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  cachedNoiseTexture = texture;
  return texture;
};

const stickerMaterialCache = new Map<number, THREE.MeshStandardMaterial>();
let coreMaterial: THREE.MeshStandardMaterial | null = null;

export const getStickerMat = (color: number, noiseTexture: THREE.Texture | null) => {
  if (stickerMaterialCache.has(color)) return stickerMaterialCache.get(color)!;

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    metalness: 0.1,
    bumpMap: noiseTexture,
    bumpScale: 0.003
  });
  stickerMaterialCache.set(color, mat);
  return mat;
};

export const getCoreMat = () => {
  if (coreMaterial) return coreMaterial;
  coreMaterial = new THREE.MeshStandardMaterial({
    color: RUBIKS_CUBE_COLORS.darkGray,
    roughness: 0.7,
    metalness: 0.1
  });
  return coreMaterial;
};

let cachedGeometries: any = null;

export const getGeometries = () => {
  if (cachedGeometries) return cachedGeometries;
  cachedGeometries = {
    core: new RoundedBoxGeometry(0.99, 0.99, 0.99, 5, 0.10),
    stickerX: new RoundedBoxGeometry(0.06, 0.83, 0.83, 6, 0.12),
    stickerY: new RoundedBoxGeometry(0.83, 0.06, 0.83, 6, 0.12),
    stickerZ: new RoundedBoxGeometry(0.83, 0.83, 0.06, 6, 0.12)
  };
  return cachedGeometries;
};

export const getCandidateAxes = (faceAxis: string) => {
  if (faceAxis === 'x') return ['y', 'z'];
  if (faceAxis === 'y') return ['x', 'z'];
  return ['x', 'y'];
};

export const projectAxisToScreen = (axisVec: THREE.Vector3, worldPos: THREE.Vector3, camera: THREE.Camera) => {
  const p1 = worldPos.clone().project(camera);
  const p2 = worldPos.clone().add(axisVec).project(camera);
  const dir = new THREE.Vector2(p2.x - p1.x, p2.y - p1.y);
  dir.normalize();
  return dir;
};
