import * as THREE from 'three';
import { RUBIKS_CUBE_COLORS } from '../types/cube';
import type { Axis } from '../types/cube';

export function getCubeArray2x2(cubiesRef: any): number[] {
  if (!cubiesRef?.current) return [];

  const colorMap: Record<number, number> = {
    [RUBIKS_CUBE_COLORS.yellow]: 0,
    [RUBIKS_CUBE_COLORS.green]: 1,
    [RUBIKS_CUBE_COLORS.orange]: 2,
    [RUBIKS_CUBE_COLORS.white]: 3,
    [RUBIKS_CUBE_COLORS.blue]: 4,
    [RUBIKS_CUBE_COLORS.red]: 5
  };

  const getColorIndex = (x: number, y: number, z: number, faceAxis: Axis) => {
    const cubie = cubiesRef.current.find((c: any) =>
      Math.abs(c.position.x - x) < 0.1 &&
      Math.abs(c.position.y - y) < 0.1 &&
      Math.abs(c.position.z - z) < 0.1
    );
    if (!cubie) throw new Error(`Missing cubie at ${x},${y},${z}`);

    const sticker = cubie.children.find((child: any) => {
      if (!child.userData || !child.userData.isSticker) return false;
      const childWorldPos = new THREE.Vector3();
      child.getWorldPosition(childWorldPos);
      const cubieWorldPos = new THREE.Vector3();
      cubie.getWorldPosition(cubieWorldPos);
      const diff = childWorldPos.clone().sub(cubieWorldPos);
      return Math.abs(diff[faceAxis]) > 0.1;
    });

    if (!sticker) return -1;
    const hex = sticker.material.color.getHex();
    if (colorMap[hex] === undefined && hex !== RUBIKS_CUBE_COLORS.gray) {
      throw new Error("Unknown color");
    }
    return hex === RUBIKS_CUBE_COLORS.gray ? -1 : colorMap[hex];
  };

  const posit = new Array(24);
  posit[15] = getColorIndex(0.5, 0.5, 0.5, 'y');
  posit[14] = getColorIndex(-0.5, 0.5, 0.5, 'y');
  posit[13] = getColorIndex(0.5, 0.5, -0.5, 'y');
  posit[12] = getColorIndex(-0.5, 0.5, -0.5, 'y');

  posit[3] = getColorIndex(0.5, -0.5, 0.5, 'y');
  posit[2] = getColorIndex(-0.5, -0.5, 0.5, 'y');
  posit[1] = getColorIndex(0.5, -0.5, -0.5, 'y');
  posit[0] = getColorIndex(-0.5, -0.5, -0.5, 'y');

  posit[21] = getColorIndex(0.5, 0.5, 0.5, 'z');
  posit[20] = getColorIndex(-0.5, 0.5, 0.5, 'z');
  posit[23] = getColorIndex(0.5, -0.5, 0.5, 'z');
  posit[22] = getColorIndex(-0.5, -0.5, 0.5, 'z');

  posit[9] = getColorIndex(0.5, 0.5, -0.5, 'z');
  posit[8] = getColorIndex(-0.5, 0.5, -0.5, 'z');
  posit[11] = getColorIndex(0.5, -0.5, -0.5, 'z');
  posit[10] = getColorIndex(-0.5, -0.5, -0.5, 'z');

  posit[16] = getColorIndex(0.5, 0.5, 0.5, 'x');
  posit[17] = getColorIndex(0.5, 0.5, -0.5, 'x');
  posit[18] = getColorIndex(0.5, -0.5, 0.5, 'x');
  posit[19] = getColorIndex(0.5, -0.5, -0.5, 'x');

  posit[4] = getColorIndex(-0.5, 0.5, 0.5, 'x');
  posit[5] = getColorIndex(-0.5, 0.5, -0.5, 'x');
  posit[6] = getColorIndex(-0.5, -0.5, 0.5, 'x');
  posit[7] = getColorIndex(-0.5, -0.5, -0.5, 'x');

  if (posit.includes(-1)) throw new Error("Cube is not fully painted!");
  return posit;
}

export function getCubeString3x3(cubiesRef: any): string {
  if (!cubiesRef?.current) return "";

  const getColor = (x: number, y: number, z: number, faceAxis: Axis) => {
    const cubie = cubiesRef.current.find((c: any) =>
      Math.round(c.position.x) === x &&
      Math.round(c.position.y) === y &&
      Math.round(c.position.z) === z
    );

    if (!cubie) throw new Error(`Missing cubie at ${x},${y},${z}`);

    const sticker = cubie.children.find((child: THREE.Object3D) => {
      if (!child.userData?.isSticker) return false;
      const worldPos = new THREE.Vector3();
      child.getWorldPosition(worldPos);
      const cubiePos = new THREE.Vector3();
      cubie.getWorldPosition(cubiePos);
      const diff = worldPos.clone().sub(cubiePos);
      return Math.abs(diff[faceAxis]) > 0.1;
    }) as THREE.Mesh;

    if (!sticker) throw new Error(`Missing sticker on face ${faceAxis} at ${x},${y},${z}`);
    const colorHex = (sticker.material as THREE.MeshStandardMaterial).color.getHex();
    if (colorHex === RUBIKS_CUBE_COLORS.gray) throw new Error("Cube is not fully painted!");
    return colorHex;
  };

  const centerColors: Record<number, string> = {};
  centerColors[getColor(0, 1, 0, 'y')] = 'U';
  centerColors[getColor(1, 0, 0, 'x')] = 'R';
  centerColors[getColor(0, 0, 1, 'z')] = 'F';
  centerColors[getColor(0, -1, 0, 'y')] = 'D';
  centerColors[getColor(-1, 0, 0, 'x')] = 'L';
  centerColors[getColor(0, 0, -1, 'z')] = 'B';

  if (Object.keys(centerColors).length !== 6) {
    throw new Error("Center tiles must have 6 distinct colors! Ensure the middle of each face is uniquely colored.");
  }

  let str = '';
  // Form U (Top)
  for (let z of [-1, 0, 1]) for (let x of [-1, 0, 1]) str += centerColors[getColor(x, 1, z, 'y')];
  // R (Right)
  for (let y of [1, 0, -1]) for (let z of [1, 0, -1]) str += centerColors[getColor(1, y, z, 'x')];
  // F (Front)
  for (let y of [1, 0, -1]) for (let x of [-1, 0, 1]) str += centerColors[getColor(x, y, 1, 'z')];
  // D (Bottom)
  for (let z of [1, 0, -1]) for (let x of [-1, 0, 1]) str += centerColors[getColor(x, -1, z, 'y')];
  // L (Left)
  for (let y of [1, 0, -1]) for (let z of [-1, 0, 1]) str += centerColors[getColor(-1, y, z, 'x')];
  // B (Back)
  for (let y of [1, 0, -1]) for (let x of [1, 0, -1]) str += centerColors[getColor(x, y, -1, 'z')];

  return str;
}

export function getCubeString4x4(cubiesRef: any): string {
  if (!cubiesRef?.current) return "";

  const getColor = (x: number, y: number, z: number, faceAxis: Axis) => {
    const cubie = cubiesRef.current.find((c: any) =>
      Math.abs(c.position.x - x) < 0.1 &&
      Math.abs(c.position.y - y) < 0.1 &&
      Math.abs(c.position.z - z) < 0.1
    );
    if (!cubie) throw new Error(`Missing cubie at ${x},${y},${z}`);

    const sticker = cubie.children.find((child: THREE.Object3D) => {
      if (!child.userData?.isSticker) return false;
      const childWorldPos = new THREE.Vector3();
      child.getWorldPosition(childWorldPos);
      const cubieWorldPos = new THREE.Vector3();
      cubie.getWorldPosition(cubieWorldPos);
      return Math.abs(childWorldPos[faceAxis] - cubieWorldPos[faceAxis]) > 0.1;
    }) as THREE.Mesh;
    if (!sticker) throw new Error(`Missing sticker on face ${faceAxis} at ${x},${y},${z}`);
    return (sticker.material as THREE.MeshStandardMaterial).color.getHex();
  };

  const colors: Record<number, string> = {
    [RUBIKS_CUBE_COLORS.white]: 'U',
    [RUBIKS_CUBE_COLORS.yellow]: 'D',
    [RUBIKS_CUBE_COLORS.red]: 'R',
    [RUBIKS_CUBE_COLORS.orange]: 'L',
    [RUBIKS_CUBE_COLORS.blue]: 'B',
    [RUBIKS_CUBE_COLORS.green]: 'F'
  };

  let str = '';
  // U
  for (let z of [-1.5, -0.5, 0.5, 1.5]) for (let x of [-1.5, -0.5, 0.5, 1.5]) str += colors[getColor(x, 1.5, z, 'y')];
  // R
  for (let y of [1.5, 0.5, -0.5, -1.5]) for (let z of [1.5, 0.5, -0.5, -1.5]) str += colors[getColor(1.5, y, z, 'x')];
  // F
  for (let y of [1.5, 0.5, -0.5, -1.5]) for (let x of [-1.5, -0.5, 0.5, 1.5]) str += colors[getColor(x, y, 1.5, 'z')];
  // D
  for (let z of [1.5, 0.5, -0.5, -1.5]) for (let x of [-1.5, -0.5, 0.5, 1.5]) str += colors[getColor(x, -1.5, z, 'y')];
  // L
  for (let y of [1.5, 0.5, -0.5, -1.5]) for (let z of [-1.5, -0.5, 0.5, 1.5]) str += colors[getColor(-1.5, y, z, 'x')];
  // B
  for (let y of [1.5, 0.5, -0.5, -1.5]) for (let x of [1.5, 0.5, -0.5, -1.5]) str += colors[getColor(x, y, -1.5, 'z')];
  
  return str;
}

export function getCubeString5x5(cubiesRef: any): string {
  if (!cubiesRef?.current) return "";

  const getColor = (x: number, y: number, z: number, faceAxis: Axis) => {
    const cubie = cubiesRef.current.find((c: any) =>
      Math.abs(c.position.x - x) < 0.1 &&
      Math.abs(c.position.y - y) < 0.1 &&
      Math.abs(c.position.z - z) < 0.1
    );
    if (!cubie) throw new Error(`Missing cubie at ${x},${y},${z}`);

    const sticker = cubie.children.find((child: THREE.Object3D) => {
      if (!child.userData?.isSticker) return false;
      const childWorldPos = new THREE.Vector3();
      child.getWorldPosition(childWorldPos);
      const cubieWorldPos = new THREE.Vector3();
      cubie.getWorldPosition(cubieWorldPos);
      return Math.abs(childWorldPos[faceAxis] - cubieWorldPos[faceAxis]) > 0.1;
    }) as THREE.Mesh;
    if (!sticker) throw new Error(`Missing sticker on face ${faceAxis} at ${x},${y},${z}`);
    return (sticker.material as THREE.MeshStandardMaterial).color.getHex();
  };

  const centerColors: Record<number, string> = {};
  centerColors[getColor(0, 2, 0, 'y')] = 'U';
  centerColors[getColor(2, 0, 0, 'x')] = 'R';
  centerColors[getColor(0, 0, 2, 'z')] = 'F';
  centerColors[getColor(0, -2, 0, 'y')] = 'D';
  centerColors[getColor(-2, 0, 0, 'x')] = 'L';
  centerColors[getColor(0, 0, -2, 'z')] = 'B';

  if (Object.keys(centerColors).length !== 6) {
    throw new Error("Center tiles must have 6 distinct colors! Ensure the middle of each face is uniquely colored.");
  }

  let str = '';
  // U
  for (let z of [-2, -1, 0, 1, 2]) for (let x of [-2, -1, 0, 1, 2]) str += centerColors[getColor(x, 2, z, 'y')];
  // R
  for (let y of [2, 1, 0, -1, -2]) for (let z of [2, 1, 0, -1, -2]) str += centerColors[getColor(2, y, z, 'x')];
  // F
  for (let y of [2, 1, 0, -1, -2]) for (let x of [-2, -1, 0, 1, 2]) str += centerColors[getColor(x, y, 2, 'z')];
  // D
  for (let z of [2, 1, 0, -1, -2]) for (let x of [-2, -1, 0, 1, 2]) str += centerColors[getColor(x, -2, z, 'y')];
  // L
  for (let y of [2, 1, 0, -1, -2]) for (let z of [-2, -1, 0, 1, 2]) str += centerColors[getColor(-2, y, z, 'x')];
  // B
  for (let y of [2, 1, 0, -1, -2]) for (let x of [2, 1, 0, -1, -2]) str += centerColors[getColor(x, y, -2, 'z')];

  return str;
}
