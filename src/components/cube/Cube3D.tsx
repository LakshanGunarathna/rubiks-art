import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { RUBIKS_CUBE_COLORS } from '../../types/cube';
import type { Axis, CameraAnimState } from '../../types/cube';

import { createNoiseTexture, getStickerMat, getCoreMat, getGeometries, getCandidateAxes, projectAxisToScreen } from '../../utils/cubeUtils';

interface Cube3DProps {
  size: number;
  engine: any; // Ideally typed to useCubeEngine return type
  isActive: boolean;
  onStickerClick?: (cubie: THREE.Object3D, sticker: THREE.Mesh) => void;
  isPaintingMode?: boolean;
  isSolverMode?: boolean;
  initialColors?: number[]; // Optional if we want to set specific colors
}

const CubeContent: React.FC<Cube3DProps> = ({ size, engine, isActive, onStickerClick, isPaintingMode, isSolverMode }) => {
  const { camera, raycaster, pointer } = useThree();


  const cubeGroupRef = useRef<THREE.Group>(null!);
  const pivotRef = useRef<THREE.Object3D>(null!);
  const controlsRef = useRef<any>(null!);

  const noiseTexture = useMemo(() => createNoiseTexture(), []);
  const coreMat = useMemo(() => getCoreMat(), []);

  const {
    animationStateRef,
    cubiesRef,
    finishRotation,
    rotateLayer,
    rotateWholeCube,
  } = engine;

  // Camera animation state
  const cameraAnimStateRef = useRef<CameraAnimState | null>(null);

  // Initialize cubies
  useEffect(() => {
    if (!cubeGroupRef.current) return;

    const geometries = getGeometries();

    // Clear existing cubies safely
    const children = [...cubeGroupRef.current.children];
    children.forEach(child => {
      if (child !== pivotRef.current) {
        cubeGroupRef.current.remove(child);
      }
    });
    // Clear pivot children
    while (pivotRef.current.children.length > 0) {
      pivotRef.current.remove(pivotRef.current.children[0]);
    }

    const newCubies: THREE.Object3D[] = [];
    const offset = (size - 1) / 2;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const posX = x - offset;
          const posY = y - offset;
          const posZ = z - offset;

          const cubieGroup = new THREE.Group();
          cubieGroup.position.set(posX, posY, posZ);
          cubieGroup.userData.originalPos = { x: posX, y: posY, z: posZ };

          const core = new THREE.Mesh(geometries.core, coreMat);
          cubieGroup.add(core);

          const addSticker = (geom: THREE.BufferGeometry, col: number, pos: [number, number, number], name: string) => {
            const mat = getStickerMat(col, noiseTexture);
            const stick = new THREE.Mesh(geom, mat);
            stick.position.set(...pos);
            stick.userData = { isSticker: true, originalColor: col, faceName: name };
            cubieGroup.add(stick);
          };

          // Logic for stickers based on position
          const getInitialColor = (face: string, defaultColor: number) => {
            if (isSolverMode) return RUBIKS_CUBE_COLORS.gray;
            return engine.colors?.[face] || defaultColor;
          };

          if (x === size - 1) addSticker(geometries.stickerX, getInitialColor('right', 0x2A62C9), [0.49, 0, 0], 'right');
          if (x === 0) addSticker(geometries.stickerX, getInitialColor('left', 0x009E60), [-0.49, 0, 0], 'left');
          if (y === size - 1) addSticker(geometries.stickerY, getInitialColor('top', 0xFFFFFF), [0, 0.49, 0], 'top');
          if (y === 0) addSticker(geometries.stickerY, getInitialColor('bottom', 0xFFD500), [0, -0.49, 0], 'bottom');
          if (z === size - 1) addSticker(geometries.stickerZ, getInitialColor('front', 0xC41E3A), [0, 0, 0.49], 'front');
          if (z === 0) addSticker(geometries.stickerZ, getInitialColor('back', 0xFF5800), [0, 0, -0.49], 'back');

          cubeGroupRef.current.add(cubieGroup);
          newCubies.push(cubieGroup);
        }
      }
    }
    cubiesRef.current = newCubies;

    // Set refs and assets in engine
    engine.cubeGroupRef.current = cubeGroupRef.current;
    engine.pivotRef.current = pivotRef.current;
    engine.noiseTexture = noiseTexture;
  }, [size, noiseTexture, coreMat]);

  // Animation Loop
  useFrame((_state, delta) => {
    if (!isActive) return;

    // Rotation Animation
    if (animationStateRef.current) {
      const anim = animationStateRef.current;
      const direction = Math.sign(anim.targetRotation);
      const step = anim.speed * delta * direction;
      anim.currentRotation += step;

      if (Math.abs(anim.currentRotation) >= Math.abs(anim.targetRotation)) {
        if (anim.axis === 'x') pivotRef.current.rotation.x = anim.targetRotation;
        if (anim.axis === 'y') pivotRef.current.rotation.y = anim.targetRotation;
        if (anim.axis === 'z') pivotRef.current.rotation.z = anim.targetRotation;
        finishRotation(anim.activePieces, anim.resolve);
      } else {
        if (anim.axis === 'x') pivotRef.current.rotation.x = anim.currentRotation;
        if (anim.axis === 'y') pivotRef.current.rotation.y = anim.currentRotation;
        if (anim.axis === 'z') pivotRef.current.rotation.z = anim.currentRotation;
      }
    }

    // Camera Animation
    if (cameraAnimStateRef.current) {
      const camAnim = cameraAnimStateRef.current;
      camAnim.elapsed += delta * 1000;
      const t = Math.min(camAnim.elapsed / camAnim.duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      camera.position.lerpVectors(camAnim.startCamPos, camAnim.endCamPos, ease);
      controlsRef.current.target.lerpVectors(camAnim.startTarget, camAnim.endTarget, ease);

      if (t >= 1) cameraAnimStateRef.current = null;
    }

    if (controlsRef.current) controlsRef.current.update();
  });

  // Pointer Interactions
  const dragStateRef = useRef<any>(null);

  const handlePointerDown = (e: any) => {
    if (!isActive || engine.isAnimating) return;

    // Check for hits
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(cubeGroupRef.current.children, true);

    if (intersects.length === 0) return;

    const hit = intersects[0];
    if (!hit.face) return;

    // For painting mode, handle separately
    if (isPaintingMode && onStickerClick) {
      // Painting logic handled on pointer up to distinguish from drag
    }

    // Drag Setup
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
    const worldNormal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
    const absN = new THREE.Vector3(Math.abs(worldNormal.x), Math.abs(worldNormal.y), Math.abs(worldNormal.z));

    let faceAxis: Axis, faceSign;
    if (absN.x >= absN.y && absN.x >= absN.z) { faceAxis = 'x'; faceSign = Math.sign(worldNormal.x); }
    else if (absN.y >= absN.x && absN.y >= absN.z) { faceAxis = 'y'; faceSign = Math.sign(worldNormal.y); }
    else { faceAxis = 'z'; faceSign = Math.sign(worldNormal.z); }

    let cubie: THREE.Object3D | null = hit.object;
    while (cubie && !cubie.userData.originalPos) cubie = cubie.parent;
    if (!cubie) return;

    dragStateRef.current = {
      faceAxis,
      faceSign,
      piece: cubie,
      screenStart: new THREE.Vector2(e.clientX, e.clientY),
      pieceWorldPos: new THREE.Vector3().setFromMatrixPosition(cubie.matrixWorld),
      hitObject: hit.object
    };

    controlsRef.current.enabled = false;
  };

  const handlePointerMove = (e: any) => {
    if (!dragStateRef.current || !isActive || engine.isAnimating) return;

    const dx = e.clientX - dragStateRef.current.screenStart.x;
    const dy = e.clientY - dragStateRef.current.screenStart.y;
    if (Math.sqrt(dx * dx + dy * dy) < 10) return;

    const dragDir = new THREE.Vector2(dx, -dy).normalize();
    const candidates = getCandidateAxes(dragStateRef.current.faceAxis);
    const axisVectors = {
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1)
    };

    let bestAxis: Axis | null = null, bestDot = -Infinity, bestScreenDir = null;
    for (const axis of candidates) {
      const screenAxis = projectAxisToScreen(axisVectors[axis as Axis], dragStateRef.current.pieceWorldPos, camera);
      const dot = Math.abs(dragDir.dot(screenAxis));
      if (dot > bestDot) { bestDot = dot; bestAxis = axis as Axis; bestScreenDir = screenAxis; }
    }

    if (!bestAxis || !bestScreenDir) return;

    const dragSign = dragDir.dot(bestScreenDir) > 0 ? 1 : -1;
    const faceNormalVec = axisVectors[dragStateRef.current.faceAxis as Axis].clone().multiplyScalar(dragStateRef.current.faceSign);
    const cross = new THREE.Vector3().crossVectors(faceNormalVec, axisVectors[bestAxis]);
    const absCross = new THREE.Vector3(Math.abs(cross.x), Math.abs(cross.y), Math.abs(cross.z));

    let rotAxis: Axis, rotSign;
    if (absCross.x >= absCross.y && absCross.x >= absCross.z) { rotAxis = 'x'; rotSign = Math.sign(cross.x); }
    else if (absCross.y >= absCross.x && absCross.y >= absCross.z) { rotAxis = 'y'; rotSign = Math.sign(cross.y); }
    else { rotAxis = 'z'; rotSign = Math.sign(cross.z); }

    let sliceVal = 0;
    if (rotAxis === 'x') sliceVal = Math.round(dragStateRef.current.piece.position.x * 2) / 2;
    if (rotAxis === 'y') sliceVal = Math.round(dragStateRef.current.piece.position.y * 2) / 2;
    if (rotAxis === 'z') sliceVal = Math.round(dragStateRef.current.piece.position.z * 2) / 2;
    const angle = (Math.PI / 2) * dragSign * rotSign;

    dragStateRef.current = null;
    if (isSolverMode) {
      if (isPaintingMode) {
        engine.rotateWholeCube(rotAxis, angle, 300);
      }
    } else {
      rotateLayer(rotAxis, sliceVal, angle, 300);
    }
  };

  const handlePointerUp = (e: any) => {
    if (dragStateRef.current) {
      // Check if it was a click for painting
      const dx = e.clientX - dragStateRef.current.screenStart.x;
      const dy = e.clientY - dragStateRef.current.screenStart.y;
      if (Math.sqrt(dx * dx + dy * dy) < 5 && isPaintingMode && onStickerClick) {
        onStickerClick(dragStateRef.current.piece, dragStateRef.current.hitObject);
      }
      dragStateRef.current = null;
    }
    if (isActive) controlsRef.current.enabled = true;
  };

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || engine.isAnimating) return;

      const key = e.key.toLowerCase();
      const shift = e.shiftKey;

      // Simple mapping for now, can be expanded
      const MOVES_3X3: any = {
        r: ['x', 1, -Math.PI / 2], l: ['x', -1, Math.PI / 2],
        u: ['y', 1, -Math.PI / 2], d: ['y', -1, Math.PI / 2],
        f: ['z', 1, -Math.PI / 2], b: ['z', -1, Math.PI / 2],
      };

      if (MOVES_3X3[key]) {
        if (isSolverMode) return;
        let [axis, layer, angle] = MOVES_3X3[key];
        if (shift) angle = -angle;
        rotateLayer(axis, layer, angle, 300);
      } else if (isPaintingMode && (key === 'arrowleft' || key === 'arrowright')) {
        rotateWholeCube('y', (Math.PI / 2) * (key === 'arrowleft' ? -1 : 1), 300);
      } else if (isPaintingMode && (key === 'arrowup' || key === 'arrowdown')) {
        rotateWholeCube('x', (Math.PI / 2) * (key === 'arrowup' ? -1 : 1), 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, engine.isAnimating, rotateLayer, rotateWholeCube, isPaintingMode]);


  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 8]} fov={30} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        enablePan={false}
        enableZoom={false}
        enableRotate={!isSolverMode}
      />

      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />
      <directionalLight position={[-10, 10, -10]} intensity={1.0} />
      <directionalLight position={[10, -10, -10]} intensity={1.0} />

      <group ref={cubeGroupRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <object3D ref={pivotRef} />
      </group>
    </>
  );
};

export const Cube3D: React.FC<Cube3DProps> = (props) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 2]} flat gl={{ antialias: true, alpha: true }}>
        <CubeContent {...props} />
      </Canvas>
    </div>
  );
};
