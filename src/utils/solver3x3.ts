export async function solve(cubeString: string): Promise<string[]> {
  const { default: Cube } = await import('cubejs');
  Cube.initSolver();

  const cube = Cube.fromString(cubeString);
  const solution = cube.solve();
  
  return solution.split(' ').filter((m: string) => m);
}

export const GUIDE_DATA = {
  title: "How to Use the 3×3 Solver",
  subtitle: "Paint your physical cube's current state onto the 3D model, hit Solve, and follow the step-by-step instructions to reach a solved state.",
  steps: [
    {
      title: "Pick a Color from the Palette",
      desc: "Use the color palette in the panel to select a color. The 6 standard Rubik's Cube colors are available: **White, Yellow, Red, Orange, Blue,** and **Green**.",
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      border: "rgba(249,115,22,0.2)"
    },
    {
      title: "Paint the Cube Faces",
      desc: "Click on any tile of the 3D cube to paint it. Use the rotation buttons to spin the cube and reach all 6 faces. Paint every tile to match your physical cube exactly.",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)"
    },
    {
      title: "Verify Your Colors",
      desc: "Each color must appear exactly **9 times** across all faces. The center tile of each face determines that face's color — make sure all 6 centers are different colors.",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)"
    },
    {
      title: "Hit \"Solve!\" and Follow Along",
      desc: "Press the **Solve!** button. Follow each move instruction — hold your real cube in the orientation shown on screen and press **Next** to advance through the steps.",
      color: "#a855f7",
      bg: "rgba(168,85,247,0.1)",
      border: "rgba(168,85,247,0.2)"
    }
  ],
  colorLayoutSub: "The standard Rubik's Cube color scheme. Each face has a fixed center color.",
  cards: [
    {
      title: "About the Solver",
      desc: "Our 3×3 solver uses the **Kociemba two-phase algorithm**, one of the most efficient algorithms for solving the Rubik's Cube. It computes near-optimal solutions — typically **20 moves or fewer** — in under a second. The algorithm works by first reducing the cube to a simpler subgroup, then solving it completely.",
      icon: "sliders",
      accent: "#3b82f6",
      iconBg: "rgba(59,130,246,0.1)",
      iconBorder: "rgba(59,130,246,0.2)",
      iconColor: "#3b82f6"
    },
    {
      title: "Understanding Move Notation",
      desc: [
        "**R** — Rotate the right face 90° clockwise",
        "**R'** — Rotate the right face 90° counter-clockwise",
        "**R2** — Rotate the right face 180°",
        "**U, D, L, F, B** — Up, Down, Left, Front, Back faces"
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
        "Start by painting all **center tiles** first — they define each face's identity and cannot be swapped.",
        "Hold your physical cube in one fixed position while painting to avoid confusion.",
        "If you get an error, it usually means a color appears more or fewer than **9 times**.",
        "The solver auto-paints center tiles. You only need to paint the edge and corner stickers."
      ],
      icon: "check",
      accent: "#10b981",
      iconBg: "rgba(16,185,129,0.1)",
      iconBorder: "rgba(16,185,129,0.2)",
      iconColor: "#10b981",
      wide: true
    },
    {
      title: "About the 3×3×3 Rubik's Cube",
      desc: "The 3×3×3 Rubik's Cube is the world's most iconic puzzle, invented in **1974** by Ernő Rubik. It has **43 quintillion** possible states, yet any scramble can be solved in **20 moves or fewer** — a limit known as **God's Number**. The current world record for a single solve is **2.76 seconds**.",
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
  subtitle: "The iconic 3×3×3 Rubik's Cube — a deceptively simple puzzle hiding mind-blowing mathematical complexity and decades of history.",
  stats: [
    {
      icon: "calendar",
      number: "1974",
      label: "Year Invented",
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      border: "rgba(249,115,22,0.2)",
      accent: "linear-gradient(to right, #f97316, #ef4444)"
    },
    {
      icon: "cubes",
      number: "43.25 Quintillion",
      label: "Possible States",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)",
      accent: "linear-gradient(to right, #3b82f6, #6366f1)"
    },
    {
      icon: "bolt",
      number: "20 Moves",
      label: "God's Number",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
      accent: "linear-gradient(to right, #10b981, #06b6d4)"
    },
    {
      icon: "stopwatch",
      number: "2.76s",
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
      desc: "Invented in **1974** by **Ernő Rubik**, a professor of architecture in Budapest, Hungary. He originally designed it as a teaching tool to demonstrate three-dimensional movement. What began as a simple educational model quickly evolved into a global phenomenon, challenging millions of people with its mix of logic, memory, and spatial reasoning.",
      icon: "history",
      accent: "#f97316",
      iconBg: "rgba(249,115,22,0.1)",
      iconBorder: "rgba(249,115,22,0.2)",
      iconColor: "#f97316"
    },
    {
      title: "Anatomy of the Cube",
      desc: "The cube is made up of **26 visible pieces** — including **8 corners**, **12 edges**, and **6 fixed center pieces** that determine the color of each face. These center pieces act as reference points, helping solvers orient the cube correctly. The objective is to align all pieces so that each face shows a single solid color — a task requiring patterns, algorithms, and spatial reasoning.",
      icon: "puzzle",
      accent: "#3b82f6",
      iconBg: "rgba(59,130,246,0.1)",
      iconBorder: "rgba(59,130,246,0.2)",
      iconColor: "#3b82f6"
    },
    {
      title: "Mind-Blowing Complexity",
      desc: "One of the most fascinating aspects of the 3×3 cube is its staggering number of possible configurations. It has approximately **43,252,003,274,489,856,000** different states — that's 43 quintillion! To put that into perspective, this number is so massive that it far exceeds the number of seconds that have passed since the beginning of the universe. Despite this immense complexity, mathematicians have proven that any scrambled cube can be solved in **20 moves or fewer**, a limit known as **God's Number**.",
      icon: "brain",
      accent: "#10b981",
      iconBg: "rgba(16,185,129,0.1)",
      iconBorder: "rgba(16,185,129,0.2)",
      iconColor: "#10b981",
      wide: true
    },
    {
      title: "Competitive Speedcubing",
      desc: "The 3×3 cube is the centerpiece of competitive speedcubing, officially governed by the **World Cube Association**. Competitions are held worldwide, where participants aim to solve the cube as fast as possible under strict conditions. As of 2026, the world record stands at an incredible **2.76 seconds**, achieved by **Teodor Zajder** from Poland at the GLS Big Cubes Gdańsk 2026 competition. This remarkable achievement highlights just how far human skill and speed have progressed with this timeless puzzle.",
      icon: "trophy",
      accent: "#a855f7",
      iconBg: "rgba(168,85,247,0.1)",
      iconBorder: "rgba(168,85,247,0.2)",
      iconColor: "#a855f7",
      wide: true
    }
  ],
  timeline: [
    { year: "1974", label: "Invented by Ernő Rubik", color: "#f97316" },
    { year: "1980", label: "Global Commercial Release", color: "#3b82f6" },
    { year: "2003", label: "WCA Founded & First Competition", color: "#10b981" },
    { year: "2010", label: "God's Number Proven to be 20", color: "#a855f7" },
    { year: "2026", label: "World Record 2.76 seconds", color: "#ec4899" }
  ]
};
