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
