import { MOVES_5X5 } from '../utils/cubeConstants';
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

export const FACTS_DATA = {
  subtitle: "The 5×5×5 Professor's Cube — the ultimate test of patience, strategy, and mastery. A puzzle so complex it earned the title reserved for scholars.",
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
      number: "2.83 × 10⁷⁴",
      label: "Possible States",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)",
      accent: "linear-gradient(to right, #3b82f6, #6366f1)"
    },
    {
      icon: "layerGroup",
      number: "98 Pieces",
      label: "Visible Cubies",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
      accent: "linear-gradient(to right, #10b981, #06b6d4)"
    },
    {
      icon: "stopwatch",
      number: "32.14s",
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
      desc: "The 5×5×5 cube was invented in **1981** by **Udo Krell**, a German inventor. It was marketed as the **\"Professor's Cube\"**, signifying that it required a professor-level intellect to solve. The name stuck, and it remains one of the most respected challenges in the twisty puzzle community. Its internal mechanism is a marvel of engineering, with over 120 individual parts working in harmony.",
      icon: "history",
      accent: "#f97316",
      iconBg: "rgba(249,115,22,0.1)",
      iconBorder: "rgba(249,115,22,0.2)",
      iconColor: "#f97316"
    },
    {
      title: "Anatomy of the Cube",
      desc: "The 5×5 has **98 visible pieces**: 8 corners, 36 edge pieces (including wing edges), and 54 center pieces. Each face has **9 center pieces** (compared to 4 on a 4×4 and 1 on a 3×3). The cube features fixed center pieces (like the 3×3), along with inner slice layers that add multiple new move types. This creates a puzzle with both familiar and entirely new challenges layered on top.",
      icon: "puzzle",
      accent: "#3b82f6",
      iconBg: "rgba(59,130,246,0.1)",
      iconBorder: "rgba(59,130,246,0.2)",
      iconColor: "#3b82f6"
    },
    {
      title: "Astronomical Complexity",
      desc: "The 5×5 cube has approximately **2.83 × 10⁷⁴** possible permutations — a number so vast it's nearly incomprehensible. To illustrate: if every atom in the observable universe represented a unique scramble, you'd still need more universes worth of atoms to represent all possible states. Unlike the 4×4, the 5×5 does **not suffer from parity errors** (since it has odd-numbered layers like the 3×3), but the sheer volume of pieces makes it a marathon of concentration and strategy.",
      icon: "brain",
      accent: "#10b981",
      iconBg: "rgba(16,185,129,0.1)",
      iconBorder: "rgba(16,185,129,0.2)",
      iconColor: "#10b981",
      wide: true
    },
    {
      title: "Solving Methods & Competition",
      desc: "The most popular method for solving the 5×5 is the **Reduction Method**, where solvers first pair up the center pieces, then the edge pieces, and finally solve it like a 3×3. Advanced speedcubers use the **Yau5 Method** — an optimized variant that reduces pauses and look-ahead breaks. As of 2025, the world record for a single solve stands at **32.14 seconds**, achieved by **Max Park** from the USA. The 5×5 event is considered one of the most prestigious in WCA competitions, requiring both speed and endurance.",
      icon: "trophy",
      accent: "#a855f7",
      iconBg: "rgba(168,85,247,0.1)",
      iconBorder: "rgba(168,85,247,0.2)",
      iconColor: "#a855f7",
      wide: true
    }
  ],
  timeline: [
    { year: "1981", label: "Invented by Udo Krell", color: "#f97316" },
    { year: "1982", label: "Released as \"Professor's Cube\"", color: "#3b82f6" },
    { year: "2003", label: "WCA Adds 5×5 as Official Event", color: "#10b981" },
    { year: "2017", label: "Sub-40 Second Records Broken", color: "#a855f7" },
    { year: "2025", label: "World Record 32.14 seconds", color: "#ec4899" }
  ]
};
