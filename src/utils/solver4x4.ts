import { MOVES_4X4 } from './cubeConstants';
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
    let mapped = mapWcaToRotation4x4(m);
    if (mapped) {
      solutionSteps.push({ raw: m, axis: mapped.axis, layer: mapped.layers, angle: mapped.angle });
    }
  }

  return solutionSteps;
}

function mapWcaToRotation4x4(moveStr: string) {
  let face = moveStr[0];
  let mod = moveStr.substring(1);

  if (['2', '3'].includes(face) && moveStr.length > 1) {
    let innerFace = moveStr[1];
    mod = moveStr.substring(2);
    face = innerFace.toLowerCase();
  }

  if (mod.startsWith('w')) {
    face = face + 'w';
    mod = mod.substring(1);
  }

  const moveDef = MOVES_4X4[face];
  if (!moveDef) return null;

  const axis = moveDef[0];
  const ls = moveDef[1];
  let angle = moveDef[2];

  if (mod.includes("'")) angle = -angle;
  if (mod.includes("2")) angle = angle * 2;

  return { axis, layers: ls, angle };
}

export const GUIDE_DATA = {
  title: "How to Use the 4×4 Solver",
  subtitle: "Paint your Revenge Cube's current state onto the 3D model, press Solve, and follow the step-by-step instructions to reach a solved state.",
  steps: [
    {
      title: "Pick a Color from the Palette",
      desc: "Use the color palette in the panel. Select from the 6 standard colors: **White, Yellow, Red, Orange, Blue,** and **Green**.",
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      border: "rgba(249,115,22,0.2)"
    },
    {
      title: "Paint All 96 Tiles",
      desc: "Click on any tile to paint it. Use the rotation buttons to reach all 6 faces. Each face has 16 tiles (4×4 grid). Match every tile to your physical cube's state exactly.",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)"
    },
    {
      title: "Verify Your Colors",
      desc: "Each color must appear exactly **16 times** across all faces. The 4×4 has no fixed centers — the solver uses the 4 center tiles per face to determine orientation.",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)"
    },
    {
      title: "Hit \"Solve!\" and Follow Along",
      desc: "Press **Solve!** to validate and compute a solution. The 4×4 solver may take a few moments due to the puzzle's complexity. Follow each move in playback mode using **Next** and **Back**.",
      color: "#a855f7",
      bg: "rgba(168,85,247,0.1)",
      border: "rgba(168,85,247,0.2)"
    }
  ],
  colorLayoutSub: "The standard color scheme for the 4×4 Revenge Cube.",
  cards: [
    {
      title: "About the Solver",
      desc: "Our 4×4 solver uses a reduction-based approach — it first pairs centers and edges to reduce the puzzle to a 3×3-equivalent state, then applies the Kociemba algorithm. Solutions typically require **40–60 moves** and may take a few seconds to compute due to the **7.40 × 10⁴⁵** possible states.",
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
        "**r, l, u, d, f, b** — Inner slice moves (second layer)",
        "**Rw, Lw, Uw** — Wide moves (outer + inner layers together)",
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
        "The 4×4 has **4 center tiles per face** — paint them first to establish each face's identity.",
        "With 96 total tiles, take your time and rotate frequently to verify all faces.",
        "If you get an error, a color likely appears more or fewer than **16 times**.",
        "The solver handles parity errors automatically — just paint what you see."
      ],
      icon: "check",
      accent: "#10b981",
      iconBg: "rgba(16,185,129,0.1)",
      iconBorder: "rgba(16,185,129,0.2)",
      iconColor: "#10b981",
      wide: true
    },
    {
      title: "About the 4×4×4 Revenge Cube",
      desc: "Invented in **1981** by Péter Sebestény, the Revenge Cube has 56 visible pieces and **7.40 × 10⁴⁵** possible states. It's infamous for parity errors — situations impossible on a 3×3 that require special algorithms. The world record is **16.79 seconds** by Max Park.",
      icon: "trophy",
      accent: "#f97316",
      iconBg: "rgba(249,115,22,0.1)",
      iconBorder: "rgba(249,115,22,0.2)",
      iconColor: "#f97316",
      wide: true
    }
  ]
};

export const FACTS_DATA = {
  subtitle: "The 4×4×4 Rubik's Revenge — a step beyond the classic, introducing parity errors and entirely new solving challenges that even experienced cubers must master.",
  stats: [
    {
      icon: "calendar",
      number: "1981",
      label: "Year Invented",
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      border: "rgba(249,115,22,0.2)",
      accent: "linear-gradient(to right, #f97316, #ef4444)"
    },
    {
      icon: "cubes",
      number: "7.40 × 10⁴⁵",
      label: "Possible States",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)",
      accent: "linear-gradient(to right, #3b82f6, #6366f1)"
    },
    {
      icon: "layerGroup",
      number: "56 Pieces",
      label: "Visible Cubies",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
      accent: "linear-gradient(to right, #10b981, #06b6d4)"
    },
    {
      icon: "stopwatch",
      number: "16.79s",
      label: "World Record",
      color: "#a855f7",
      bg: "rgba(168,85,247,0.1)",
      border: "rgba(168,85,247,0.2)",
      accent: "linear-gradient(to right, #a855f7, #ec4899)"
    }
  ],
  cards: [
    {
      title: "The Origin Story",
      desc: "The 4×4×4 cube was invented in **1981** by **Péter Sebestény**. Originally marketed as \"Rubik's Revenge\" (implying it was the cube \"taking revenge\" on those who mastered the 3×3), it represented the next evolution in twisty puzzles. Unlike the 3×3, the 4×4 has no fixed center pieces, making it fundamentally different in how it must be approached and solved.",
      icon: "history",
      accent: "#f97316",
      iconBg: "rgba(249,115,22,0.1)",
      iconBorder: "rgba(249,115,22,0.2)",
      iconColor: "#f97316"
    },
    {
      title: "Anatomy of the Cube",
      desc: "The 4×4 consists of **56 visible pieces**: 8 corners, 24 edge pieces (in 12 pairs), and 24 center pieces (in 6 groups of 4). Unlike the 3×3 where each face has one fixed center, the 4×4 has **four movable centers per face** — meaning solvers must first figure out which colors belong where before reducing it to a 3×3-like solve.",
      icon: "puzzle",
      accent: "#3b82f6",
      iconBg: "rgba(59,130,246,0.1)",
      iconBorder: "rgba(59,130,246,0.2)",
      iconColor: "#3b82f6"
    },
    {
      title: "The Dreaded Parity Errors",
      desc: "The 4×4 is infamous for introducing **parity errors** — situations that are impossible on a standard 3×3. These occur because multiple internal pieces can appear identical, leading to states where a single edge or pair of edges appear swapped in a way that seems unsolvable with normal 3×3 algorithms. Solvers must learn special **parity algorithms** (like the OLL parity and PLL parity) to handle these cases. Parity is often the biggest hurdle for cubers transitioning from the 3×3 to the 4×4.",
      icon: "exclamation",
      accent: "#10b981",
      iconBg: "rgba(16,185,129,0.1)",
      iconBorder: "rgba(16,185,129,0.2)",
      iconColor: "#10b981",
      wide: true
    },
    {
      title: "Complexity & Competition",
      desc: "The 4×4 has an astronomical **7.40 × 10⁴⁵** possible permutations — that's roughly 7.4 septillion times more than the 3×3! The most popular solving method is the **Yau Method**, which involves solving two opposite centers, then three cross edges, then the remaining centers, edges, and finally the 3×3 stage. As of 2025, the current world record for a single solve is **16.79 seconds**, achieved by **Max Park** from the USA, demonstrating mastery of both speed and the complex reduction process.",
      icon: "trophy",
      accent: "#a855f7",
      iconBg: "rgba(168,85,247,0.1)",
      iconBorder: "rgba(168,85,247,0.2)",
      iconColor: "#a855f7",
      wide: true
    }
  ],
  timeline: [
    { year: "1981", label: "Invented by Péter Sebestény", color: "#f97316" },
    { year: "1982", label: "Released as \"Rubik's Revenge\"", color: "#3b82f6" },
    { year: "2003", label: "WCA Adds 4×4 as Official Event", color: "#10b981" },
    { year: "2017", label: "Yau Method Becomes Dominant", color: "#a855f7" },
    { year: "2025", label: "World Record 16.79 seconds", color: "#ec4899" }
  ]
};
