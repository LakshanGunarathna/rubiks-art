import { useState, useRef, useCallback, useMemo } from 'react';

import * as THREE from 'three';
import type { Axis, AnimationState, HistoryItem } from '../types/cube';


export const useCubeEngine = () => {

  const [isAnimating, setIsAnimating] = useState(false);
  const animationStateRef = useRef<AnimationState | null>(null);
  const [moveHistory, setMoveHistory] = useState<HistoryItem[]>([]);
  const cubiesRef = useRef<THREE.Object3D[]>([]);
  const cubeGroupRef = useRef<THREE.Group>(null!);
  const pivotRef = useRef<THREE.Object3D>(null!);

  const finishRotation = useCallback((activePieces: THREE.Object3D[], resolve?: () => void) => {
    if (!pivotRef.current || !cubeGroupRef.current) return;

    pivotRef.current.updateMatrixWorld();
    activePieces.forEach((c) => {
      cubeGroupRef.current?.attach(c);
      
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
    });

    animationStateRef.current = null;
    setIsAnimating(false);
    if (resolve) resolve();
  }, []);

  const rotateLayer = useCallback((axis: Axis, layer: number | number[], angle: number, duration = 300, record = true) => {
    return new Promise<void>((resolve) => {
      if (isAnimating && duration > 0) {
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

      setIsAnimating(true);

      const activeCubies = cubiesRef.current.filter((c) => {
        if (Array.isArray(layer)) {
          return layer.some(ly => Math.abs(c.position[axis] - ly) < 0.1);
        }
        return Math.abs(c.position[axis] - layer) < 0.1;
      });

      pivotRef.current.rotation.set(0, 0, 0);
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
        finishRotation(activeCubies, resolve);
      }
    });
  }, [isAnimating, finishRotation]);

  const rotateWholeCube = useCallback((axis: Axis, angle: number, duration = 300, record = true) => {
    return new Promise<void>((resolve) => {
      if (isAnimating && duration > 0) {
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

      setIsAnimating(true);

      pivotRef.current.rotation.set(0, 0, 0);
      cubiesRef.current.forEach((c) => pivotRef.current?.attach(c));

      const totalRotation = Math.abs(angle);
      animationStateRef.current = {
        axis,
        targetRotation: angle,
        currentRotation: 0,
        speed: totalRotation / (duration / 1000),
        activePieces: [...cubiesRef.current],
        resolve
      };
    });
  }, [isAnimating]);

  const shuffle = useCallback(async (count = 20) => {
    if (isAnimating) return;
    
    // Base moves for 3x3
    const moves: Record<string, [Axis, number, number]> = {
        L: ['x', -1, Math.PI / 2], M: ['x', 0, Math.PI / 2], R: ['x', 1, -Math.PI / 2],
        U: ['y', 1, -Math.PI / 2], E: ['y', 0, Math.PI / 2], D: ['y', -1, Math.PI / 2],
        F: ['z', 1, -Math.PI / 2], S: ['z', 0, -Math.PI / 2], B: ['z', -1, Math.PI / 2]
    };
    
    const keys = Object.keys(moves);
    let lastMove = { axis: '', layer: 0, dir: 0 };

    for (let i = 0; i < count; i++) {
        let key, m, dir;
        do {
            key = keys[Math.floor(Math.random() * keys.length)];
            m = moves[key];
            dir = Math.random() > 0.5 ? 1 : -1;
        } while (m[0] === lastMove.axis && m[1] === lastMove.layer && dir === -lastMove.dir);

        lastMove = { axis: m[0], layer: m[1], dir };
        await rotateLayer(m[0], m[1], m[2] * dir, 200);
    }
  }, [isAnimating, rotateLayer]);

  const reset = useCallback(async () => {
    if (isAnimating || moveHistory.length === 0) return;

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
  }, [isAnimating, moveHistory, rotateLayer, rotateWholeCube]);

  const snapReset = useCallback(() => {
    if (!cubeGroupRef.current) return;
    
    setIsAnimating(false);
    setMoveHistory([]);
    animationStateRef.current = null;

    cubiesRef.current.forEach(c => {
        const orig = c.userData.originalPos;
        c.position.set(orig.x, orig.y, orig.z);
        c.quaternion.set(0, 0, 0, 1);
        cubeGroupRef.current.attach(c);
    });
  }, []);

  return useMemo(() => ({
    isAnimating,
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

