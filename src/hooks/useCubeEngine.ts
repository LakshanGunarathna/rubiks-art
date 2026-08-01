import { useState, useRef, useCallback, useMemo } from 'react';

import * as THREE from 'three';
import type { Axis, AnimationState, HistoryItem } from '../types/cube';
import { MOVES_2X2, MOVES_3X3, MOVES_4X4, MOVES_5X5 } from '../utils/cubeConstants';



export const useCubeEngine = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const animationStateRef = useRef<AnimationState | null>(null);
  const [moveHistory, setMoveHistory] = useState<HistoryItem[]>([]);
  const cubiesRef = useRef<THREE.Object3D[]>([]);
  const cubeGroupRef = useRef<THREE.Group>(null!);
  const pivotRef = useRef<THREE.Object3D>(null!);

  const finishRotation = useCallback((activePieces: THREE.Object3D[], resolve?: () => void) => {
    if (!pivotRef.current || !cubeGroupRef.current) {
      isAnimatingRef.current = false;
      setIsAnimating(false);
      animationStateRef.current = null;
      if (resolve) resolve();
      return;
    }

    pivotRef.current.updateMatrixWorld(true);
    activePieces.forEach((c) => {
      if (c.parent === pivotRef.current) {
        cubeGroupRef.current?.attach(c);
      }
      
      // Snap position
      c.position.x = Math.round(c.position.x * 2) / 2;
      c.position.y = Math.round(c.position.y * 2) / 2;
      c.position.z = Math.round(c.position.z * 2) / 2;

      // Snap rotation
      const euler = new THREE.Euler().setFromQuaternion(c.quaternion);
      euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
      euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
      euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
      c.quaternion.setFromEuler(euler);
      c.updateMatrixWorld(true);
    });

    // Safety check: ensure no leftover pieces remain attached to pivotRef
    while (pivotRef.current.children.length > 0) {
      const child = pivotRef.current.children[0];
      cubeGroupRef.current.attach(child);
      child.updateMatrixWorld(true);
    }
    pivotRef.current.rotation.set(0, 0, 0);
    pivotRef.current.updateMatrixWorld(true);

    animationStateRef.current = null;
    isAnimatingRef.current = false;
    setIsAnimating(false);
    if (resolve) resolve();
  }, []);

  const rotateLayer = useCallback((axis: Axis, layer: number | number[], angle: number, duration = 300, record = true) => {
    return new Promise<void>((resolve) => {
      if (isAnimatingRef.current || animationStateRef.current !== null) {
        resolve();
        return;
      }
      if (!pivotRef.current || !cubeGroupRef.current) {
        resolve();
        return;
      }

      if (record) {
        setMoveHistory(prev => [...prev, { axis, layer, angle, wholeCube: false }]);
      }

      isAnimatingRef.current = true;
      setIsAnimating(true);

      const activeCubies = cubiesRef.current.filter((c) => {
        if (Array.isArray(layer)) {
          return layer.some(ly => Math.abs(c.position[axis] - ly) < 0.1);
        }
        return Math.abs(c.position[axis] - layer) < 0.1;
      });

      pivotRef.current.rotation.set(0, 0, 0);
      pivotRef.current.updateMatrixWorld(true);
      activeCubies.forEach((c) => pivotRef.current?.attach(c));

      if (duration > 0) {
        const totalRotation = Math.abs(angle);
        animationStateRef.current = {
          axis,
          targetRotation: angle,
          currentRotation: 0,
          speed: totalRotation / (duration / 1000),
          activePieces: activeCubies,
          resolve
        };
      } else {
        pivotRef.current.rotation[axis] = angle;
        pivotRef.current.updateMatrixWorld(true);
        finishRotation(activeCubies, resolve);
      }
    });
  }, [finishRotation]);

  const rotateWholeCube = useCallback((axis: Axis, angle: number, duration = 300, record = true) => {
    return new Promise<void>((resolve) => {
      if (isAnimatingRef.current || animationStateRef.current !== null) {
        resolve();
        return;
      }
      if (!pivotRef.current || !cubeGroupRef.current) {
        resolve();
        return;
      }

      if (record) {
        setMoveHistory(prev => [...prev, { axis, angle, wholeCube: true }]);
      }

      isAnimatingRef.current = true;
      setIsAnimating(true);

      pivotRef.current.rotation.set(0, 0, 0);
      pivotRef.current.updateMatrixWorld(true);
      const activeCubies = [...cubiesRef.current];
      activeCubies.forEach((c) => pivotRef.current?.attach(c));

      if (duration > 0) {
        const totalRotation = Math.abs(angle);
        animationStateRef.current = {
          axis,
          targetRotation: angle,
          currentRotation: 0,
          speed: totalRotation / (duration / 1000),
          activePieces: activeCubies,
          resolve
        };
      } else {
        pivotRef.current.rotation[axis] = angle;
        pivotRef.current.updateMatrixWorld(true);
        finishRotation(activeCubies, resolve);
      }
    });
  }, [finishRotation]);

  const shuffle = useCallback(async (count = 20) => {
    if (isAnimatingRef.current) return;
    
    const size = Math.round(Math.cbrt(cubiesRef.current.length)) || 3;
    let movesDict: Record<string, [Axis, any, number]> = MOVES_3X3;
    if (size === 2) movesDict = MOVES_2X2;
    else if (size === 4) movesDict = MOVES_4X4;
    else if (size === 5) movesDict = MOVES_5X5;

    // Filter out whole-cube rotations (x, y, z) if present in the moveset
    const keys = Object.keys(movesDict).filter(key => key !== 'x' && key !== 'y' && key !== 'z');
    let lastKey = '';
    let lastDir = 0;

    for (let i = 0; i < count; i++) {
        let key, m, dir;
        do {
            key = keys[Math.floor(Math.random() * keys.length)];
            m = movesDict[key];
            dir = Math.random() > 0.5 ? 1 : -1;
        } while (key === lastKey && dir === -lastDir);

        lastKey = key;
        lastDir = dir;
        await rotateLayer(m[0], m[1], m[2] * dir, 200);
    }
  }, [rotateLayer]);

  const reset = useCallback(async () => {
    if (isAnimatingRef.current || moveHistory.length === 0) return;

    const historyToReverse = [...moveHistory];
    setMoveHistory([]);

    for (let i = historyToReverse.length - 1; i >= 0; i--) {
        const m = historyToReverse[i];
        if (m.wholeCube) {
            await rotateWholeCube(m.axis, -m.angle, 150, false);
        } else {
            await rotateLayer(m.axis, m.layer!, -m.angle, 150, false);
        }
    }
  }, [rotateLayer, rotateWholeCube, moveHistory]);

  const snapReset = useCallback(() => {
    if (!cubeGroupRef.current) return;
    
    isAnimatingRef.current = false;
    setIsAnimating(false);
    setMoveHistory([]);
    animationStateRef.current = null;

    if (pivotRef.current) {
      pivotRef.current.rotation.set(0, 0, 0);
      while (pivotRef.current.children.length > 0) {
        const child = pivotRef.current.children[0];
        cubeGroupRef.current.attach(child);
        child.updateMatrixWorld(true);
      }
    }

    cubiesRef.current.forEach(c => {
        const orig = c.userData?.originalPos;
        if (orig) {
          if (c.parent !== cubeGroupRef.current) {
            cubeGroupRef.current.attach(c);
          }
          c.position.set(orig.x, orig.y, orig.z);
          c.quaternion.set(0, 0, 0, 1);
          c.updateMatrixWorld(true);
        }
    });
  }, []);

  return useMemo(() => ({
    isAnimating,
    isAnimatingRef,
    moveHistory,
    cubiesRef,
    cubeGroupRef,
    pivotRef,
    animationStateRef,
    rotateLayer,
    rotateWholeCube,
    finishRotation,
    shuffle,
    reset,
    snapReset
  }), [isAnimating, moveHistory, rotateLayer, rotateWholeCube, finishRotation, shuffle, reset, snapReset]);
};

