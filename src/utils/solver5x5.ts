import { MOVES_5X5 } from './cubeConstants';
import { useSiteConfig } from '../config/siteConfig';

export async function solve(cubeString: string, abortController: AbortController): Promise<any[]> {
  const apiBaseUrl = useSiteConfig.getState().apiBaseUrl;
  
  const response = await fetch(`${apiBaseUrl}/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: cubeString }),
    signal: abortController.signal
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error + (data.details ? ` - ${data.details}` : ''));
  }

  let rawOut = data.solution || data.raw;
  let moveline = rawOut.split('\n').find((l: string) => l.includes('Solution:')) || rawOut;
  let moveStr = moveline.replace('Solution:', '').trim();

  const movesArr = moveStr.split(' ').filter((m: string) => m);
  const solutionSteps = [];

  for (let m of movesArr) {
    let mapped = mapWcaToRotation5x5(m);
    if (mapped) {
      solutionSteps.push({ raw: m, axis: mapped.axis, layer: mapped.layers, angle: mapped.angle });
    }
  }

  return solutionSteps;
}

function mapWcaToRotation5x5(moveStr: string) {
  let face = moveStr[0];
  let mod = moveStr.substring(1);

  if (['2', '3'].includes(face) && moveStr.length > 1) {
    let digit = face;
    let baseFace = moveStr[1];
    mod = moveStr.substring(2);

    if (mod.startsWith('w')) {
      face = digit + baseFace + 'w';
      mod = mod.substring(1);
    } else {
      face = digit + baseFace;
    }
  } else if (mod.startsWith('w')) {
    face = face + 'w';
    mod = mod.substring(1);
  }

  const moveDef = MOVES_5X5[face];
  if (!moveDef) return null;

  const axis = moveDef[0];
  const ls = moveDef[1];
  let angle = moveDef[2];

  if (mod.includes("'")) angle = -angle;
  if (mod.includes("2")) angle = angle * 2;

  return { axis, layers: ls, angle };
}

export const GUIDE_DATA = {
  title: "How to Use the 5×5 Solver",
  subtitle: "Paint your Professor's Cube's current state onto the 3D model, press Solve, and follow the step-by-step instructions to reach a solved state.",
  steps: [
    {
      title: "Pick a Color from the Palette",
      desc: "Use the color palette in the panel. Select from the 6 standard colors: **White, Yellow, Red, Orange, Blue,** and **Green**.",
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      border: "rgba(249,115,22,0.2)"
    },
    {
      title: "Paint All 150 Tiles",
      desc: "Click on any tile to paint it. Use the rotation buttons to access all 6 faces. Each face has 25 tiles (5×5 grid) — this is the most tile-intensive cube, so paint carefully.",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)"
    },
    {
      title: "Verify Your Colors",
      desc: "Each color must appear exactly **25 times** across all faces. The 5×5 has a fixed center tile on each face (like the 3×3), which helps orient your painting.",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)"
    },
    {
      title: "Hit \"Solve!\" and Follow Along",
      desc: "Press **Solve!** to validate and compute a solution. The 5×5 solver may take several seconds due to the puzzle's immense complexity. Follow each move in playback mode using **Next** and **Back**.",
      color: "#a855f7",
      bg: "rgba(168,85,247,0.1)",
      border: "rgba(168,85,247,0.2)"
    }
  ],
  colorLayoutSub: "The standard color scheme for the 5×5 Professor's Cube.",
  cards: [
    {
      title: "About the Solver",
      desc: "Our 5×5 solver uses the Reduction Method — it first groups the 9 center pieces per face, then pairs the edge pieces, and finally solves it as a 3×3. Solutions typically require **60–80 moves**. With **2.83 × 10⁷⁴** possible states, this is by far the most complex cube we solve.",
      icon: "sliders",
      accent: "#3b82f6",
      iconBg: "rgba(59,130,246,0.1)",
      iconBorder: "rgba(59,130,246,0.2)",
      iconColor: "#3b82f6"
    },
    {
      title: "Understanding Move Notation",
      desc: [
        "**R, L, U, D, F, B** — Outer face moves (same as 3×3)",
        "**r, l, u, d, f, b** — Inner slice moves (second layer from outside)",
        "**M, E, S** — Middle slice moves (center layer)",
        "**Rw, Lw, Uw** — Wide moves (outer + adjacent inner layer)",
        "**'** suffix — Counter-clockwise; **2** suffix — 180°"
      ],
      icon: "cubes",
      accent: "#a855f7",
      iconBg: "rgba(168,85,247,0.1)",
      iconBorder: "rgba(168,85,247,0.2)",
      iconColor: "#a855f7"
    },
    {
      title: "Tips for Accurate Painting",
      desc: [
        "Start with the fixed center tile on each face — it defines that face's color.",
        "With 150 total tiles (25 per face), take your time and rotate frequently to verify.",
        "If you get an error, a color likely appears more or fewer than **25 times**.",
        "The 5×5 has no parity issues (unlike the 4×4), so if your painting is correct, the solver will always find a solution."
      ],
      icon: "check",
      accent: "#10b981",
      iconBg: "rgba(16,185,129,0.1)",
      iconBorder: "rgba(16,185,129,0.2)",
      iconColor: "#10b981",
      wide: true
    },
    {
      title: "About the 5×5×5 Professor's Cube",
      desc: "Invented in **1981** by Udo Krell, the Professor's Cube has 98 visible pieces and an astronomical **2.83 × 10⁷⁴** possible states. Unlike the 4×4, it has no parity errors thanks to its odd-numbered layers. The world record is **32.14 seconds** by Max Park.",
      icon: "trophy",
      accent: "#f97316",
      iconBg: "rgba(249,115,22,0.1)",
      iconBorder: "rgba(249,115,22,0.2)",
      iconColor: "#f97316",
      wide: true
    }
  ]
};
