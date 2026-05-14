import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const Solver3DWrapper = lazy(() => import('../../components/cube/Solver3DWrapper'));

import { RUBIKS_CUBE_COLORS } from '../../types/cube';
import type { Axis, PaintedPiece } from '../../types/cube';
import { getStickerMat } from '../../utils/cubeUtils';
import { Loader2 } from 'lucide-react';

import { SolverSidebar } from '../../components/solver/SolverSidebar';
import { PlaybackPanel } from '../../components/solver/PlaybackPanel';
import { ErrorModal, SolvedModal, ResetConfirmation, LoadingOverlay } from '../../components/solver/SolverOverlays';

const OPPOSITE_COLORS: Record<number, number> = {
  [RUBIKS_CUBE_COLORS.white]: RUBIKS_CUBE_COLORS.yellow,
  [RUBIKS_CUBE_COLORS.yellow]: RUBIKS_CUBE_COLORS.white,
  [RUBIKS_CUBE_COLORS.blue]: RUBIKS_CUBE_COLORS.green,
  [RUBIKS_CUBE_COLORS.green]: RUBIKS_CUBE_COLORS.blue,
  [RUBIKS_CUBE_COLORS.red]: RUBIKS_CUBE_COLORS.orange,
  [RUBIKS_CUBE_COLORS.orange]: RUBIKS_CUBE_COLORS.red,
};

const ALL_COLORS = [
  RUBIKS_CUBE_COLORS.white, RUBIKS_CUBE_COLORS.yellow, RUBIKS_CUBE_COLORS.blue,
  RUBIKS_CUBE_COLORS.green, RUBIKS_CUBE_COLORS.red, RUBIKS_CUBE_COLORS.orange
];

const VALID_EDGES: [number, number][] = [];
for (let i = 0; i < ALL_COLORS.length; i++) {
  for (let j = i + 1; j < ALL_COLORS.length; j++) {
    const c1 = ALL_COLORS[i];
    const c2 = ALL_COLORS[j];
    if (OPPOSITE_COLORS[c1] !== c2) {
      VALID_EDGES.push([c1, c2]);
    }
  }
}

const VALID_CORNERS: [number, number, number][] = [];
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

const CANONICAL_NORMALS: Record<number, THREE.Vector3> = {
  [RUBIKS_CUBE_COLORS.white]: new THREE.Vector3(0, 1, 0),
  [RUBIKS_CUBE_COLORS.yellow]: new THREE.Vector3(0, -1, 0),
  [RUBIKS_CUBE_COLORS.red]: new THREE.Vector3(0, 0, 1),
  [RUBIKS_CUBE_COLORS.orange]: new THREE.Vector3(0, 0, -1),
  [RUBIKS_CUBE_COLORS.blue]: new THREE.Vector3(1, 0, 0),
  [RUBIKS_CUBE_COLORS.green]: new THREE.Vector3(-1, 0, 0),
};

const COLOR_FROM_NORMAL: Record<string, number> = {
  "0,1,0": RUBIKS_CUBE_COLORS.white, "0,-1,0": RUBIKS_CUBE_COLORS.yellow,
  "0,0,1": RUBIKS_CUBE_COLORS.red, "0,0,-1": RUBIKS_CUBE_COLORS.orange,
  "1,0,0": RUBIKS_CUBE_COLORS.blue, "-1,0,0": RUBIKS_CUBE_COLORS.green
};

const HEX_TO_NAME: Record<number, string> = {
  [RUBIKS_CUBE_COLORS.white]: 'white',
  [RUBIKS_CUBE_COLORS.yellow]: 'yellow',
  [RUBIKS_CUBE_COLORS.blue]: 'blue',
  [RUBIKS_CUBE_COLORS.green]: 'green',
  [RUBIKS_CUBE_COLORS.red]: 'red',
  [RUBIKS_CUBE_COLORS.orange]: 'orange',
};

const FACE_NAMES: Record<string, string> = {
  'U': 'TOP', 'D': 'BOTTOM', 'F': 'FRONT', 'B': 'BACK', 'L': 'LEFT', 'R': 'RIGHT'
};

function getHumanReadableMove(rawMove: string, isUndo: boolean = false) {
  const face = rawMove[0];
  const mod = rawMove.length > 1 ? rawMove[1] : '';
  const faceName = FACE_NAMES[face] || face;

  if (isUndo) {
    if (mod === "'") return `Turn the ${faceName} layer 90° clockwise.`;
    if (mod === "2") return `Turn the ${faceName} layer 180°.`;
    return `Turn the ${faceName} layer 90° counterclockwise.`;
  }

  if (mod === "'") return `Turn the ${faceName} layer 90° counterclockwise.`;
  if (mod === "2") return `Turn the ${faceName} layer 180°.`;
  return `Turn the ${faceName} layer 90° clockwise.`;
}


const LoadingCube = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white rounded-3xl">
    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
    <p className="font-medium opacity-80">Loading 3D Cube...</p>
  </div>
);

export const SolverView: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const size: number = 3;

  const [engine, setEngine] = useState<any>(null);
  const cubiesRef = engine?.cubiesRef;
  const rotateLayer = engine?.rotateLayer;
  const rotateWholeCube = engine?.rotateWholeCube;
  const snapReset = engine?.snapReset;
  const isAnimating = engine?.isAnimating || false;

  const [phase, setPhase] = useState<'paint' | 'playback'>('paint');
  const [selectedColor, setSelectedColor] = useState(RUBIKS_CUBE_COLORS.white);
  const [solutionSteps, setSolutionSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Overlay states
  const [errors, setErrors] = useState<string[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSolvedModalOpen, setIsSolvedModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoadingOverlayOpen, setIsLoadingOverlayOpen] = useState(false);
  const [lastActionDir, setLastActionDir] = useState<1 | -1>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  const solveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToGray = useCallback(() => {
    if (!cubiesRef?.current) return;
    const noiseTexture = engine?.noiseTexture || null;
    cubiesRef.current.forEach((cubie: any) => {
      cubie.children.forEach((child: any) => {
        if (child.userData.isSticker) {
          child.material = getStickerMat(RUBIKS_CUBE_COLORS.gray, noiseTexture);
        }
      });
    });
    setPhase('paint');
    setErrors([]);
    setSolutionSteps([]);
    setCurrentStepIndex(0);
  }, [cubiesRef, engine]);


  const initializedRef = useRef<string | null>(null);
  useEffect(() => {
    if (engine && initializedRef.current !== type) {
      if (snapReset) snapReset();
      resetToGray();
      initializedRef.current = type || '3x3';
    }
  }, [engine, type, snapReset, resetToGray]);

  const debugFill = useCallback(() => {
    if (!cubiesRef?.current) return;
    const noiseTexture = engine?.noiseTexture || null;

    // 1. Reset to solved state first
    cubiesRef.current.forEach((cubie: any) => {
      cubie.children.forEach((child: any) => {
        if (child.userData.isSticker) {
          const face = child.userData.faceName;
          const defaultColors: any = {
            top: RUBIKS_CUBE_COLORS.white, bottom: RUBIKS_CUBE_COLORS.yellow,
            front: RUBIKS_CUBE_COLORS.red, back: RUBIKS_CUBE_COLORS.orange,
            left: RUBIKS_CUBE_COLORS.green, right: RUBIKS_CUBE_COLORS.blue
          };
          child.material = getStickerMat(defaultColors[face], noiseTexture);
        }
      });
    });

    // 2. Apply a few real moves without animation to get a valid scramble
    const scrambleMoves = [
      { axis: 'x', layer: 1, angle: Math.PI / 2 },
      { axis: 'y', layer: 1, angle: Math.PI / 2 },
      { axis: 'z', layer: 1, angle: Math.PI / 2 },
      { axis: 'x', layer: -1, angle: -Math.PI / 2 },
    ];

    (async () => {
      for (const m of scrambleMoves) {
        await rotateLayer(m.axis, m.layer as any, m.angle, 0);
      }
    })();
  }, [cubiesRef, engine, rotateLayer]);


  const autoDeducePieces = useCallback(() => {
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

    if (madeChanges) autoDeducePieces();
  }, [cubiesRef, engine]);

  const autoFillCenters = useCallback(() => {
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
  }, [cubiesRef, engine]);


  const handleStickerClick = useCallback((cubie: any, sticker: any) => {
    if (phase !== 'paint') return;
    if (!sticker.userData?.isSticker) return;
    const noiseTexture = (engine as any).noiseTexture || null;
    sticker.material = getStickerMat(selectedColor, noiseTexture);

    const absSum = Math.abs(Math.round(cubie.position.x)) +
      Math.abs(Math.round(cubie.position.y)) +
      Math.abs(Math.round(cubie.position.z));

    if (absSum === 1) {
      const oppositeColor = OPPOSITE_COLORS[selectedColor];
      if (oppositeColor !== undefined) {
        const oppX = -Math.round(cubie.position.x);
        const oppY = -Math.round(cubie.position.y);
        const oppZ = -Math.round(cubie.position.z);
        const oppCubie = cubiesRef?.current?.find((c: any) =>
          Math.round(c.position.x) === oppX &&
          Math.round(c.position.y) === oppY &&
          Math.round(c.position.z) === oppZ
        );
        if (oppCubie) {
          const oppSticker = oppCubie.children.find((child: any) => child.userData?.isSticker);
          if (oppSticker) {
            oppSticker.material = getStickerMat(oppositeColor, noiseTexture);
          }
        }
      }
    }

    autoFillCenters();
    setTimeout(() => autoDeducePieces(), 0);
  }, [phase, selectedColor, engine, cubiesRef, autoFillCenters, autoDeducePieces]);


  const getCubeString = useCallback(() => {
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

    const centerColors: any = {};
    centerColors[getColor(0, 1, 0, 'y')] = 'U';
    centerColors[getColor(1, 0, 0, 'x')] = 'R';
    centerColors[getColor(0, 0, 1, 'z')] = 'F';
    centerColors[getColor(0, -1, 0, 'y')] = 'D';
    centerColors[getColor(-1, 0, 0, 'x')] = 'L';
    centerColors[getColor(0, 0, -1, 'z')] = 'B';

    if (Object.keys(centerColors).length !== 6) throw new Error("Center tiles must have 6 distinct colors! Ensure the middle of each face is uniquely colored.");

    let str = '';
    for (let z of [-1, 0, 1]) for (let x of [-1, 0, 1]) str += centerColors[getColor(x, 1, z, 'y')];
    for (let y of [1, 0, -1]) for (let z of [1, 0, -1]) str += centerColors[getColor(1, y, z, 'x')];
    for (let y of [1, 0, -1]) for (let x of [-1, 0, 1]) str += centerColors[getColor(x, y, 1, 'z')];
    for (let z of [1, 0, -1]) for (let x of [-1, 0, 1]) str += centerColors[getColor(x, -1, z, 'y')];
    for (let y of [1, 0, -1]) for (let z of [-1, 0, 1]) str += centerColors[getColor(-1, y, z, 'x')];
    for (let y of [1, 0, -1]) for (let x of [1, 0, -1]) str += centerColors[getColor(x, y, -1, 'z')];

    return str;
  }, [cubiesRef]);

  const MOVES_3X3: Record<string, [Axis, number, number]> = {
    'L': ['x', -1, Math.PI / 2], 'M': ['x', 0, Math.PI / 2], 'R': ['x', 1, -Math.PI / 2],
    'U': ['y', 1, -Math.PI / 2], 'E': ['y', 0, Math.PI / 2], 'D': ['y', -1, Math.PI / 2],
    'F': ['z', 1, -Math.PI / 2], 'S': ['z', 0, -Math.PI / 2], 'B': ['z', -1, Math.PI / 2]
  };

  const handleStartSolve = async () => {
    setErrors([]);

    try {
      const colorCounts: Record<number, number> = {};
      let hasUnpainted = false;
      const paintedPieces: PaintedPiece[] = [];

      cubiesRef.current.forEach((cubie: THREE.Object3D) => {
        const stickers = cubie.children.filter((c: any) => c.userData?.isSticker);
        const pieceColors: number[] = [];
        stickers.forEach((s: any) => {
          const hex = s.material.color.getHex();
          if (hex === RUBIKS_CUBE_COLORS.gray) hasUnpainted = true;
          else {
            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            pieceColors.push(hex);
          }
        });
        if (pieceColors.length > 0) paintedPieces.push({ cubie, colors: pieceColors });
      });

      if (hasUnpainted) {
        const validationErrors = ["You have unpainted tiles on the cube."];
        ALL_COLORS.forEach(hex => {
          const name = HEX_TO_NAME[hex];
          const count = colorCounts[hex] || 0;
          if (count < 9) validationErrors.push(`You do not have enough ${name} tiles (${count}/9).`);
          else if (count > 9) validationErrors.push(`You have too many ${name} tiles (${count}/9).`);
        });
        setErrors(validationErrors);
        setIsErrorModalOpen(true);
        return;
      }

      const colorErrors: string[] = [];
      ALL_COLORS.forEach(hex => {
        const name = HEX_TO_NAME[hex];
        const count = colorCounts[hex] || 0;
        if (count < 9) colorErrors.push(`You do not have enough ${name} tiles (${count}/9).`);
        else if (count > 9) colorErrors.push(`You have too many ${name} tiles (${count}/9).`);
      });

      if (colorErrors.length > 0) {
        setErrors(colorErrors);
        setIsErrorModalOpen(true);
        return;
      }

      const centerPieces = paintedPieces.filter(p => p.colors.length === 1);
      if (centerPieces.length !== 6) {
        setErrors(["Invalid center pieces detected."]);
        setIsErrorModalOpen(true);
        return;
      }

      const centerOpposites = new Map<number, number>();
      centerPieces.forEach(p => {
        const x = Math.round(p.cubie.position.x);
        const y = Math.round(p.cubie.position.y);
        const z = Math.round(p.cubie.position.z);
        const oppP = centerPieces.find(op =>
          Math.round(op.cubie.position.x) === -x &&
          Math.round(op.cubie.position.y) === -y &&
          Math.round(op.cubie.position.z) === -z
        );
        if (oppP) centerOpposites.set(p.colors[0], oppP.colors[0]);
      });

      if (centerOpposites.size !== 6) {
        setErrors(["Invalid center orientation detected."]);
        setIsErrorModalOpen(true);
        return;
      }

      let edgeErrors = 0;
      let cornerErrors = 0;
      paintedPieces.forEach(p => {
        if (p.colors.length > 1) {
          let hasError = false;
          for (let i = 0; i < p.colors.length; i++) {
            for (let j = i + 1; j < p.colors.length; j++) {
              if (centerOpposites.get(p.colors[i]) === p.colors[j]) hasError = true;
            }
          }
          if (hasError) {
            if (p.colors.length === 2) edgeErrors++;
            else if (p.colors.length === 3) cornerErrors++;
          }
        }
      });

      if (edgeErrors > 0 || cornerErrors > 0) {
        const pieceValidationErrors = [];
        if (edgeErrors > 0) pieceValidationErrors.push(`${edgeErrors} edge piece(s) have opposite face colors.`);
        if (cornerErrors > 0) pieceValidationErrors.push(`${cornerErrors} corner piece(s) have opposite face colors.`);
        setErrors(pieceValidationErrors);
        setIsErrorModalOpen(true);
        return;
      }

      const cubeString = getCubeString();

      let isSolved = true;
      for (let i = 0; i < 54; i += 9) {
        const segment = cubeString.substring(i, i + 9);
        if (new Set(segment).size > 1) {
          isSolved = false;
          break;
        }
      }

      if (isSolved) {
        setIsSolvedModalOpen(true);
        return;
      }

      setIsLoadingOverlayOpen(true);

      const { default: Cube } = await import('cubejs');
      Cube.initSolver();

      const cube = Cube.fromString(cubeString);
      const solution = cube.solve();

      const steps = solution.split(' ').filter((m: string) => m).map((m: string) => {
        const face = m[0];
        const mod = m[1] || '';
        const moveDef = MOVES_3X3[face];
        let angle = moveDef[2];
        if (mod === "'") angle = -angle;
        if (mod === "2") angle = angle * 2;
        return { raw: m, axis: moveDef[0], layer: moveDef[1], angle };
      });

      setSolutionSteps(steps);

      solveTimerRef.current = setTimeout(() => {
        setIsLoadingOverlayOpen(false);
        setPhase('playback');
        setCurrentStepIndex(0);
        solveTimerRef.current = null;
      }, 3000);

    } catch (err: any) {
      setIsLoadingOverlayOpen(false);
      setErrors(["Your puzzle cannot be solved. Please check your color layout."]);
      setIsErrorModalOpen(true);
    }
  };

  const handleCancelSolve = () => {
    if (solveTimerRef.current) {
      clearTimeout(solveTimerRef.current);
      solveTimerRef.current = null;
    }
    setIsLoadingOverlayOpen(false);
  };

  const handleStep = async (direction: 1 | -1, isAuto: boolean = false) => {
    if (isAnimating) return;

    // Manual moves use a fixed 1000ms (1s) speed. Auto-play uses the adjustable speed.
    const duration = isAuto ? playbackSpeed * 0.6 : 500;

    if (direction === 1) {
      if (currentStepIndex >= solutionSteps.length) return;
      const step = solutionSteps[currentStepIndex];
      setLastActionDir(1);
      setCurrentStepIndex(prev => prev + 1);
      await rotateLayer(step.axis, step.layer, step.angle, duration);
    } else {
      if (currentStepIndex <= 0) return;
      const step = solutionSteps[currentStepIndex - 1];
      setLastActionDir(-1);
      setCurrentStepIndex(prev => prev - 1);
      await rotateLayer(step.axis, step.layer, -step.angle, duration);
    }
  };

  useEffect(() => {
    if (isPlaying && currentStepIndex < solutionSteps.length && !isAnimating) {
      const timer = setTimeout(() => handleStep(1, true), playbackSpeed * 0.4);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStepIndex >= solutionSteps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStepIndex, solutionSteps, isAnimating, playbackSpeed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6 pt-2 pb-12"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading transition-colors" style={{ color: 'var(--text-primary)' }}>
          {size === 2 ? "Mini Cube (2x2x2)" : size === 3 ? "Rubik's Cube (3x3x3)" : `Rubik's ${size}x${size}x${size}`}
        </h1>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-2/3 h-[350px] lg:h-[530px] relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl transition-colors duration-300">
          <Suspense fallback={<LoadingCube />}>
            <Solver3DWrapper
              size={size}
              phase={phase}
              onStickerClick={handleStickerClick}
              onEngineReady={setEngine}
            />
          </Suspense>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {phase === 'paint' ? (
              <motion.div key="paint" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SolverSidebar
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  rotateWholeCube={rotateWholeCube}
                  onSolve={handleStartSolve}
                  onResetRequest={() => setIsResetModalOpen(true)}
                  onDebugFill={debugFill}
                  isAnimating={isAnimating}
                  engineReady={!!engine}
                />
              </motion.div>
            ) : (
              <motion.div key="playback" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <PlaybackPanel
                  currentStepIndex={currentStepIndex}
                  solutionSteps={solutionSteps}
                  isPlaying={isPlaying}
                  lastActionDir={lastActionDir}
                  playbackSpeed={playbackSpeed}
                  setPlaybackSpeed={setPlaybackSpeed}
                  onPrev={() => handleStep(-1)}
                  onNext={() => handleStep(1)}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                  onBackToPaint={() => setPhase('paint')}
                  getInstruction={(step, isUndo) => getHumanReadableMove(step, isUndo)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <LoadingOverlay isOpen={isLoadingOverlayOpen} onCancel={handleCancelSolve} />
      <ErrorModal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} errors={errors} />
      <SolvedModal isOpen={isSolvedModalOpen} onClose={() => setIsSolvedModalOpen(false)} />
      <ResetConfirmation isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} onConfirm={resetToGray} />
    </motion.div>
  );
};
