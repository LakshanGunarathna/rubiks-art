const fs = require('fs');
const path = require('path');

// Paths
const distPath = path.join(__dirname, '../dist');
const templateHtmlPath = path.join(distPath, 'index.html');
const cubeArtsPath = path.join(__dirname, '../src/data/cubeArts.ts');

if (!fs.existsSync(templateHtmlPath)) {
  console.error('Error: dist/index.html does not exist. Run "vite build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templateHtmlPath, 'utf8');
const domain = 'https://rubiks-art.com';

// 1. Static and Feature Routes
const routes = [
  {
    path: '/',
    title: "Rubiks' Art - Interactive 3D Rubik's Cube Simulators, Solvers & Mosaic Studio",
    description: "Experience interactive 3D Rubik's Cube simulators (2x2 to 5x5), step-by-step solvers, custom mosaic pixel art generator, and speedcubing pattern guides.",
    image: "/assets/og-home.png"
  },
  {
    path: '/arts',
    title: "Puzzle Arts & Cube Pattern Gallery | Rubiks' Art",
    description: "Browse 90+ Rubik's Cube pixel art patterns and algorithms. Step-by-step 3D visualizer guides for 2x2, 3x3, 4x4, and 5x5 cube designs.",
    image: "/assets/og-arts.png"
  },
  {
    path: '/mosaic-generator',
    title: "Online Rubik's Cube Mosaic Generator & Blueprint Studio | Rubiks' Art",
    description: "Convert photos into Rubik's Cube pixel art mosaics. Upload images, adjust grid size, apply 5 color-matching algorithms, and export printable building blueprints.",
    image: "/assets/og-mosaic-generator.png"
  },
  // Playgrounds
  {
    path: '/cubes/2x2',
    title: "Mini Cube (2x2) 3D Simulator | Rubiks' Art",
    description: "Play with our interactive 3D 2x2 Mini Cube simulator. Practice turns, shuffle scrambles, and explore permutations with real-time WebGL graphics.",
    image: "/assets/og-cube-2x2.png"
  },
  {
    path: '/cubes/3x3',
    title: "Rubik's Cube (3x3) 3D Simulator | Rubiks' Art",
    description: "Interact with the classic 3x3 Rubik's Cube in high-fidelity 3D. Practice algorithms, shuffle, and master layer turns with keyboard shortcuts.",
    image: "/assets/og-cube-3x3.png"
  },
  {
    path: '/cubes/4x4',
    title: "Rubik's Revenge (4x4) 3D Simulator | Rubiks' Art",
    description: "Test your skills on the 4x4 Rubik's Revenge simulator in 3D. Explore center permutations, edge pairing, and parity algorithms.",
    image: "/assets/og-cube-4x4.png"
  },
  {
    path: '/cubes/5x5',
    title: "Professor's Cube (5x5) 3D Simulator | Rubiks' Art",
    description: "Practice on the 5x5 Professor's Cube 3D simulator. Experience high-fidelity layer turns, camera rotations, and master complex algorithms.",
    image: "/assets/og-cube-5x5.png"
  },
  // Solvers
  {
    path: '/solvers/2x2',
    title: "2x2 Mini Cube Solver - Step-by-Step 3D Guide | Rubiks' Art",
    description: "Solve the 2x2 Pocket Cube step-by-step with our interactive 3D solver. Paint your cube's colors and follow animated layer-by-layer instructions.",
    image: "/assets/og-solver-2x2.png"
  },
  {
    path: '/solvers/3x3',
    title: "3x3 Rubik's Cube Solver - Interactive 3D Guide | Rubiks' Art",
    description: "Solve your 3x3 Rubik's Cube with our step-by-step 3D solver guide. Paint your scrambled layout and get optimal layer-by-layer/CFOP solutions.",
    image: "/assets/og-solver-3x3.png"
  },
  {
    path: '/solvers/4x4',
    title: "4x4 Rubik's Revenge Solver - Parity & Reduction Guide | Rubiks' Art",
    description: "Solve the 4x4 Rubik's Revenge step-by-step. Interactive 3D solver resolving center pairing, edge pairing, and OLL/PLL parities.",
    image: "/assets/og-solver-4x4.png"
  },
  {
    path: '/solvers/5x5',
    title: "5x5 Professor's Cube Solver - Interactive 3D Reduction | Rubiks' Art",
    description: "Step-by-step 3D reduction and parity solver guide for the 5x5 Professor's Cube. Paint your cube and follow animated solution moves.",
    image: "/assets/og-solver-5x5.png"
  },
  // Informational Pages
  {
    path: '/privacy-policy',
    title: "Privacy Policy | Rubiks' Art",
    description: "Official Privacy Policy for rubiks-art.com. GDPR compliance, Google AdSense disclosures, DART cookie opt-outs, and image privacy guarantees.",
    image: "/assets/og-home.png"
  },
  {
    path: '/terms',
    title: "Terms of Service | Rubiks' Art",
    description: "Read the Terms of Service for Rubiks' Art, including intellectual property notices, trademark disclaimers, and acceptable use policies.",
    image: "/assets/og-home.png"
  },
  {
    path: '/about',
    title: "About Us | Rubiks' Art",
    description: "Learn more about Rubiks' Art, our mission to advance speedcubing and puzzle mosaic art, our 3D technology, and platform features.",
    image: "/assets/og-home.png"
  },
  {
    path: '/support',
    title: "Support Us | Rubiks' Art",
    description: "Support Rubik's Art to keep our 3D Rubik's Cube simulators, step-by-step solvers, and mosaic generator fast and accessible for everyone.",
    image: "/assets/og-home.png"
  },
  {
    path: '/contact',
    title: "Contact Us | Rubiks' Art",
    description: "Contact the Rubiks' Art team for feedback, bug reports, feature suggestions, or collaboration inquiries.",
    image: "/assets/og-home.png"
  }
];

// 2. Parse Dynamic Puzzle Arts from cubeArts.ts
const artsList = [];
try {
  const content = fs.readFileSync(cubeArtsPath, 'utf8');
  const objectRegex = /\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"moves":\s*"([^"]*)",\s*"imageUrl":\s*"([^"]+)"\s*\}/g;
  let match;
  while ((match = objectRegex.exec(content)) !== null) {
    const [_, id, name, moves, imageUrl] = match;
    let type = '3x3x3';
    if (id.startsWith('2x2_')) type = '2x2x2';
    else if (id.startsWith('4x4_')) type = '4x4x4';
    else if (id.startsWith('5x5_')) type = '5x5x5';

    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${cleanName}-${id}`;

    const artItem = {
      id,
      name,
      moves,
      imageUrl,
      type,
      slug,
      path: `/arts/${slug}`,
      title: `${name} (${type}) Pattern Guide | Puzzle Arts | Rubiks' Art`,
      description: `Follow this interactive 3D guide to create the "${name}" mosaic pattern on a ${type} Rubik's Cube. Algorithm moves: ${moves}`,
      image: imageUrl
    };

    artsList.push(artItem);
    routes.push(artItem);
  }
} catch (err) {
  console.warn('Warning: Could not parse dynamic puzzle arts:', err.message);
}

// -------------------------------------------------------------
// Helper to build rich, crawlable semantic HTML body content
// -------------------------------------------------------------
function buildSemanticBody(route) {
  const navHeader = `
    <header style="background:#0f172a;color:#f8fafc;padding:1rem 1.5rem;border-bottom:1px solid #334155;">
      <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;">
        <a href="/" style="color:#38bdf8;text-decoration:none;font-size:1.4rem;font-weight:800;">Rubiks' Art</a>
        <nav style="display:flex;flex-wrap:wrap;gap:1rem;font-size:0.9rem;">
          <a href="/cubes/3x3" style="color:#cbd5e1;text-decoration:none;">3D Cubes</a>
          <a href="/solvers/3x3" style="color:#cbd5e1;text-decoration:none;">Solvers</a>
          <a href="/arts" style="color:#cbd5e1;text-decoration:none;">Puzzle Arts</a>
          <a href="/mosaic-generator" style="color:#cbd5e1;text-decoration:none;">Mosaic Studio</a>
          <a href="/about" style="color:#cbd5e1;text-decoration:none;">About Us</a>
          <a href="/contact" style="color:#cbd5e1;text-decoration:none;">Contact</a>
        </nav>
      </div>
    </header>
  `;

  const footer = `
    <footer style="background:#0f172a;color:#94a3b8;padding:2.5rem 1.5rem;border-top:1px solid #1e293b;font-size:0.85rem;margin-top:3rem;">
      <div style="max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:1.5rem;">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1.5rem;">
          <div>
            <p style="font-weight:700;color:#f8fafc;font-size:1rem;margin:0 0 0.5rem 0;">Rubiks' Art</p>
            <p style="margin:0;max-width:400px;line-height:1.5;">Interactive 3D Rubik's Cube simulators, step-by-step solvers, and custom mosaic generator.</p>
          </div>
          <div>
            <p style="font-weight:700;color:#f8fafc;margin:0 0 0.5rem 0;">Company & Legal</p>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.35rem;">
              <li><a href="/about" style="color:#94a3b8;text-decoration:none;">About Us</a></li>
              <li><a href="/contact" style="color:#94a3b8;text-decoration:none;">Contact Us</a></li>
              <li><a href="/privacy-policy" style="color:#94a3b8;text-decoration:none;">Privacy Policy</a></li>
              <li><a href="/terms" style="color:#94a3b8;text-decoration:none;">Terms of Service</a></li>
              <li><a href="/support" style="color:#94a3b8;text-decoration:none;">Support Us</a></li>
            </ul>
          </div>
        </div>
        <div style="border-top:1px solid #1e293b;padding-top:1rem;color:#64748b;font-size:0.75rem;line-height:1.6;">
          <p style="margin:0 0 0.5rem 0;">Disclaimer: This website is NOT derived from, is NOT associated with and is NOT endorsed or sponsored by the owner of the Rubik's Cube's Trademark - Spin Master Toys UK Limited.</p>
          <p style="margin:0;">&copy; ${new Date().getFullYear()} Rubiks' Art (rubiks-art.com). All rights reserved. Contact: contact@rubiks-art.com</p>
        </div>
      </div>
    </footer>
  `;

  let mainContent = '';

  if (route.path === '/') {
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">Interactive 3D Rubik's Cube Simulators, Solvers & Mosaic Studio</h1>
        <p style="font-size:1.1rem;color:#475569;margin-bottom:2rem;">Welcome to Rubiks' Art, the premier online platform combining timeless puzzle logic with high-performance 3D WebGL technology. Whether you want to practice algorithm turns, solve a scrambled cube step-by-step, explore classic mosaic patterns, or convert your own photos into printable Rubik's Cube pixel art, our free tools provide everything you need.</p>
        
        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Interactive 3D Cube Simulators</h2>
          <p>Practice turns, test algorithm sequences, and master spatial rotation on our interactive virtual cubes with full keyboard and mouse support:</p>
          <ul style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong><a href="/cubes/2x2" style="color:#2563eb;">2x2 Pocket Cube Simulator</a>:</strong> Master 3.67 million permutations on the classic 2x2 mini cube.</li>
            <li><strong><a href="/cubes/3x3" style="color:#2563eb;">3x3 Rubik's Cube Simulator</a>:</strong> The quintessential puzzle with 43 quintillion possible states.</li>
            <li><strong><a href="/cubes/4x4" style="color:#2563eb;">4x4 Rubik's Revenge Simulator</a>:</strong> Tackle floating centers and edge-pairing complexity.</li>
            <li><strong><a href="/cubes/5x5" style="color:#2563eb;">5x5 Professor's Cube Simulator</a>:</strong> Master big-cube reduction and advanced commutator turns.</li>
          </ul>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Step-by-Step 3D Rubik's Cube Solvers</h2>
          <p>Got a scrambled cube sitting on your desk? Paint your cube's colors onto our virtual 3D cube and our algorithm engines will calculate an optimal solution with step-by-step animated turns:</p>
          <ul style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong><a href="/solvers/2x2" style="color:#2563eb;">2x2 Cube Solver</a>:</strong> Fast solution engine using layer-by-layer and Ortega reduction.</li>
            <li><strong><a href="/solvers/3x3" style="color:#2563eb;">3x3 Cube Solver</a>:</strong> Clear, beginner-friendly CFOP (Cross, F2L, OLL, PLL) guided solutions.</li>
            <li><strong><a href="/solvers/4x4" style="color:#2563eb;">4x4 Cube Solver</a>:</strong> Complete guide resolving center grouping, edge pairs, and OLL/PLL parities.</li>
            <li><strong><a href="/solvers/5x5" style="color:#2563eb;">5x5 Cube Solver</a>:</strong> Advanced reduction methodology taking you from 5x5 down to 3x3 stage.</li>
          </ul>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Online Rubik's Cube Mosaic Generator</h2>
          <p>Transform your digital pictures, logos, and portraits into breathtaking Rubik's Cube mosaic art. Upload any image, configure grid dimensions (from small desk frames to giant wall murals), choose from 5 advanced dithering and color matching algorithms, and download printable PDF assembly blueprints with exact sticker checklists.</p>
          <p><a href="/mosaic-generator" style="display:inline-block;background:#2563eb;color:#ffffff;padding:0.6rem 1.2rem;border-radius:0.5rem;text-decoration:none;font-weight:700;">Open Mosaic Studio &rarr;</a></p>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Standard Cube Notation Primer</h2>
          <p>All algorithms on Rubiks' Art adhere to the international World Cube Association (WCA) Singmaster notation:</p>
          <ul style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>R, L, U, D, F, B:</strong> Turn the Right, Left, Up, Down, Front, or Back face 90 degrees clockwise.</li>
            <li><strong>Prime (R', U', F'):</strong> An apostrophe indicates a 90-degree counter-clockwise rotation.</li>
            <li><strong>Double Turn (R2, U2, F2):</strong> The number 2 indicates a 180-degree half turn in either direction.</li>
          </ul>
        </section>
      </main>
    `;
  } else if (route.path === '/arts') {
    const featuredArtsHtml = artsList.slice(0, 16).map(art => `
      <li style="margin-bottom:0.75rem;">
        <a href="${art.path}" style="color:#2563eb;font-weight:600;">${art.name} (${art.type})</a>
        <span style="color:#64748b;font-size:0.85rem;display:block;">Moves: ${art.moves || 'Pattern variant'}</span>
      </li>
    `).join('');

    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">Rubik's Cube Puzzle Arts & Pattern Gallery</h1>
        <p style="font-size:1.1rem;color:#475569;margin-bottom:2rem;">Explore our curated collection of over 90 captivating Rubik's Cube patterns, geometric designs, and pixel-art mosaics. Each pattern includes exact algorithm move sequences and an interactive 3D player guiding you move-by-move from a solved state.</p>
        
        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">How to Create Cube Patterns</h2>
          <p>Cube patterns are aesthetic arrangements created by applying specific reversible move sequences to an already solved Rubik's Cube. By rotating select layers symmetrically, you can produce checkerboards, stripes, cube-in-a-cube frames, and intricate geometric arrangements.</p>
          <ol style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>Start with a Solved Cube:</strong> Ensure all six faces are uniform before entering moves.</li>
            <li><strong>Follow the Algorithm:</strong> Execute the notation sequence shown on the pattern guide.</li>
            <li><strong>Use the 3D Player:</strong> Follow our step-by-step 3D visualizer to see how the faces transform in real time.</li>
          </ol>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Featured Pattern Algorithms</h2>
          <ul style="margin:1rem 0;padding-left:1.5rem;display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem;">
            ${featuredArtsHtml}
          </ul>
        </section>
      </main>
    `;
  } else if (route.path === '/mosaic-generator') {
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">Online Rubik's Cube Mosaic Generator & Blueprint Studio</h1>
        <p style="font-size:1.1rem;color:#475569;margin-bottom:2rem;">Turn any photograph, portrait, logo, or artwork into a real-world Rubik's Cube mosaic. Our browser-based studio converts continuous color photographs into the 6 official Rubik's Cube colors using advanced mathematical perceptual algorithms and produces printable assembly blueprints.</p>
        
        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">4-Step Mosaic Creation Process</h2>
          <ol style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>Upload Photo:</strong> Choose any image file from your device. All processing occurs 100% locally in your browser memory for complete privacy.</li>
            <li><strong>Set Grid Dimensions:</strong> Define your grid size (e.g. 15x20 cubes) and select your physical cube type (2x2, 3x3, 4x4, 5x5, or single tiles).</li>
            <li><strong>Choose Color Algorithm:</strong> Compare 5 specialized conversion methods tailored for portraits, logos, and high-contrast photos.</li>
            <li><strong>Build & Export Blueprint:</strong> Download printable PDF guides with row-by-row assembly coordinates and color sticker tallies.</li>
          </ol>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">5 Color Conversion Methods Explained</h2>
          <ul style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>1. Gradient Method (Grayscale Tone Mapping):</strong> Maps luminance values across Blue, Red, Orange, Yellow, and White. Perfect for monochrome portraits and architectural silhouettes.</li>
            <li><strong>2. Floyd-Steinberg Error Diffusion:</strong> Distributes quantization residual color error across neighboring stickers (7/16 right, 3/16 bottom-left, 5/16 bottom, 1/16 bottom-right). Delivers soft, photorealistic shading.</li>
            <li><strong>3. Nearest-Neighbor Dithering:</strong> Direct 3D Redmean color matching. Produces sharp, clean, high-contrast blocky pixel shapes ideal for corporate logos and 8-bit retro art.</li>
            <li><strong>4. Diffusion without Blue:</strong> Omits blue stickers to eliminate cold shadow speckles on skin tones. Recommended for family portraits and golden-hour lighting.</li>
            <li><strong>5. Diffusion without Green:</strong> Omits green stickers to remove artificial camera sensor casts on faces under indoor lighting.</li>
          </ul>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">100% Client-Side Local Browser Privacy</h2>
          <p>Unlike other online tools that upload your personal photos to remote cloud servers, Rubiks' Art runs entirely inside your client browser using WebGL and HTML5 Canvas. Your personal images never leave your computer or phone.</p>
        </section>
      </main>
    `;
  } else if (route.path.startsWith('/cubes/')) {
    const sizeName = route.title.split('|')[0].trim();
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">${sizeName}</h1>
        <p style="font-size:1.1rem;color:#475569;margin-bottom:2rem;">Explore our interactive 3D WebGL simulator for the ${sizeName}. Rotate layers freely, practice finger tricks and algorithm triggers, scramble permutations, and study cube mathematics in real time.</p>
        
        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Interactive Simulator Controls</h2>
          <p>Our 3D engine supports intuitive touch, mouse, and keyboard interaction:</p>
          <ul style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>Layer Turns:</strong> Click and drag any sticker face in the direction you wish to rotate.</li>
            <li><strong>Camera Orbit:</strong> Drag outside the cube boundary to inspect opposite sides and angles.</li>
            <li><strong>Keyboard Shortcuts:</strong> Press <code>R</code>, <code>L</code>, <code>U</code>, <code>D</code>, <code>F</code>, <code>B</code> on your keyboard for instant layer rotations. Hold <code>Shift</code> for counter-clockwise prime turns.</li>
            <li><strong>Shuffle & Reset:</strong> Use the control panel to generate official WCA-style scrambles or return to the solved state with one click.</li>
          </ul>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Need Help Solving?</h2>
          <p>If you scrambled a real physical cube and need step-by-step guidance to solve it, try our companion 3D solver:</p>
          <p><a href="/solvers/${route.path.split('/')[2]}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:0.6rem 1.2rem;border-radius:0.5rem;text-decoration:none;font-weight:700;">Open Step-by-Step Solver &rarr;</a></p>
        </section>
      </main>
    `;
  } else if (route.path.startsWith('/solvers/')) {
    const solverName = route.title.split('|')[0].trim();
    const cubeType = route.path.split('/')[2];
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">${solverName}</h1>
        <p style="font-size:1.1rem;color:#475569;margin-bottom:2rem;">Solve your scrambled ${cubeType} cube easily with our interactive 3D solver. Paint the current colors of your physical cube onto the virtual 3D model, and our solver algorithms will generate an animated, move-by-move solution.</p>
        
        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">How to Use the 3D Solver</h2>
          <ol style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>Select Paint Color:</strong> Choose from the 6 standard Rubik's colors (White, Yellow, Green, Blue, Red, Orange) in the color picker palette.</li>
            <li><strong>Paint Your Scramble:</strong> Click the stickers on the 3D cube model to match the colors on your physical cube. Drag outside the cube to rotate and access all 6 faces.</li>
            <li><strong>Click 'Solve Cube':</strong> Our solver validates your color configuration and calculates an optimal sequence of solution moves.</li>
            <li><strong>Follow 3D Playback:</strong> Step through the moves at your own pace using the playback controls (Play, Pause, Step Forward, Step Back).</li>
          </ol>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Understanding Solution Algorithms</h2>
          <p>Our solver utilizes established speedcubing and reduction methodologies:</p>
          <ul style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>White Cross & First Layer:</strong> Establishes the foundational reference plane and aligns adjacent center pieces.</li>
            <li><strong>Middle Layer (F2L):</strong> Pairs and inserts corner-edge slots to complete the lower two layers simultaneously.</li>
            <li><strong>Top Layer Orientation (OLL):</strong> Orients all yellow stickers facing upward.</li>
            <li><strong>Top Layer Permutation (PLL):</strong> Rearranges the final layer corners and edges to complete the puzzle.</li>
          </ul>
        </section>
      </main>
    `;
  } else if (route.path.startsWith('/arts/')) {
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">${route.name} (${route.type})</h1>
        <p style="font-size:1.1rem;color:#475569;margin-bottom:2rem;">Follow this step-by-step 3D interactive guide to create the stunning "${route.name}" pattern on your ${route.type} Rubik's Cube.</p>
        
        <section style="margin-bottom:2.5rem;background:#f8fafc;padding:1.5rem;border-radius:1rem;border:1px solid #e2e8f0;">
          <h2 style="font-size:1.3rem;color:#0f172a;margin-top:0;">Algorithm Move Sequence</h2>
          <p style="font-family:monospace;font-size:1.2rem;font-weight:700;color:#2563eb;background:#eff6ff;padding:1rem;border-radius:0.5rem;border:1px solid #bfdbfe;letter-spacing:1px;word-break:break-word;">
            ${route.moves || 'Symmetrical pattern'}
          </p>
          <p style="font-size:0.9rem;color:#64748b;margin-bottom:0;">Start with a solved cube holding the White face on top (U) and Green face in front (F). Execute each move in order.</p>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">Step-by-Step Execution Guide</h2>
          <ol style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>Ensure Solved State:</strong> Patterns only work properly when applied to a fully solved Rubik's Cube.</li>
            <li><strong>Hold Cube Orientation:</strong> Keep the cube in the exact same orientation without tilting the whole puzzle unless specified.</li>
            <li><strong>Follow WCA Notation:</strong> R (Right), L (Left), U (Up), D (Down), F (Front), B (Back). Apostrophe (') means counter-clockwise 90 degrees; 2 means 180 degrees.</li>
            <li><strong>Reverse to Return:</strong> Repeating the algorithm or executing it in reverse will return your cube back to the solved state.</li>
          </ol>
        </section>

        <p><a href="/arts" style="color:#2563eb;font-weight:700;">&larr; Back to All Puzzle Arts</a></p>
      </main>
    `;
  } else if (route.path === '/about') {
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">About Rubiks' Art</h1>
        <p style="font-size:1.1rem;color:#475569;margin-bottom:2rem;">Rubiks' Art is an independent interactive educational platform dedicated to the world of twisty puzzles, speedcubing algorithm exploration, and Rubik's Cube mosaic art.</p>
        
        <section style="margin-bottom:2rem;">
          <h2 style="font-size:1.4rem;color:#0f172a;">Our Mission</h2>
          <p>Our mission is to make Rubik's Cube solving and pixel art creation accessible, engaging, and enjoyable for people of all skill levels—from beginners learning their first cross to advanced cubers exploring commutators and artists designing large-scale cube mosaics.</p>
        </section>

        <section style="margin-bottom:2rem;">
          <h2 style="font-size:1.4rem;color:#0f172a;">Core Platform Features</h2>
          <ul style="margin:1rem 0;padding-left:1.5rem;">
            <li><strong>High-Fidelity 3D Simulators:</strong> Fluid WebGL rendering of 2x2, 3x3, 4x4, and 5x5 cubes with layer animations.</li>
            <li><strong>Interactive Step-by-Step Solvers:</strong> Paint your scramble and receive visual move-by-move solutions.</li>
            <li><strong>Curated Puzzle Arts Gallery:</strong> Over 90 classic patterns with step-by-step playback.</li>
            <li><strong>Online Mosaic Studio:</strong> Convert photos into Rubik's Cube pixel art with printable PDF blueprints.</li>
          </ul>
        </section>

        <section style="background:#fef2f2;border:1px solid #fecaca;padding:1.25rem;border-radius:0.75rem;">
          <h2 style="font-size:1.1rem;color:#991b1b;margin-top:0;">Trademark Notice & Disclaimer</h2>
          <p style="margin:0;font-size:0.85rem;color:#7f1d1d;line-height:1.6;">
            This website is NOT derived from, is NOT associated with and is NOT endorsed or sponsored by the owner of the Rubik's Cube's Trademark - Spin Master Toys UK Limited. "Rubik's" and "Rubik's Cube" are registered trademarks of Spin Master Toys UK Limited.
          </p>
        </section>
      </main>
    `;
  } else if (route.path === '/contact') {
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">Contact Us</h1>
        <p style="font-size:1.1rem;color:#475569;margin-bottom:2rem;">We love hearing from the speedcubing and puzzle art community! Whether you have feedback, feature requests, or questions, reach out to us:</p>
        <p><strong>Primary Contact Email:</strong> <a href="mailto:contact@rubiks-art.com" style="color:#2563eb;">contact@rubiks-art.com</a></p>
        <p><strong>Website:</strong> <a href="https://rubiks-art.com" style="color:#2563eb;">https://rubiks-art.com</a></p>
      </main>
    `;
  } else if (route.path === '/privacy-policy') {
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">Privacy Policy</h1>
        <p style="font-size:0.9rem;color:#64748b;margin-bottom:1.5rem;"><strong>Effective Date:</strong> August 5, 2026</p>
        <p>At rubiks-art.com, accessible from https://rubiks-art.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and how we use it.</p>
        <h2>1. GDPR Compliance</h2>
        <p>If you are a resident of the European Economic Area (EEA) or UK, your data rights are governed by GDPR. We process data under Consent, Legitimate Interests, and Contractual/Legal Obligations.</p>
        <h2>2. Image Privacy Guarantee</h2>
        <p>When using our Mosaic Generator, all image processing occurs 100% locally within your browser. We never upload, save, or store your photos on any external server.</p>
        <h2>3. Third-Party Advertising & Cookies</h2>
        <p>We work with third-party vendors such as Google AdSense who use cookies (including DART cookies) to serve relevant advertisements. You can opt out via Google Ads Settings (https://www.google.com/settings/ads) or www.aboutads.info.</p>
        <h2>4. Contact Us</h2>
        <p>If you have questions regarding this policy, contact us at contact@rubiks-art.com.</p>
      </main>
    `;
  } else if (route.path === '/terms') {
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">Terms of Service</h1>
        <p>Welcome to Rubiks' Art (rubiks-art.com). By using our website and tools, you agree to these Terms of Service.</p>
        <h2>Trademark Disclaimer</h2>
        <p>This website is NOT derived from, is NOT associated with and is NOT endorsed or sponsored by the owner of the Rubik's Cube's Trademark - Spin Master Toys UK Limited.</p>
        <h2>Intellectual Property & Fair Use</h2>
        <p>The code, 3D WebGL implementations, and user interfaces on this website are proprietary to Rubiks' Art. User-generated mosaic blueprints created from personal images remain the user's property.</p>
      </main>
    `;
  } else if (route.path === '/support') {
    mainContent = `
      <main style="max-width:1000px;margin:2rem auto;padding:0 1.5rem;color:#334155;line-height:1.7;">
        <h1 style="font-size:2.2rem;color:#0f172a;margin-bottom:0.75rem;">Support Rubiks' Art</h1>
        <p>Rubiks' Art is an independent community project dedicated to keeping high-performance 3D Rubik's Cube simulators, step-by-step solvers, and mosaic generator tools free and fast for everyone worldwide.</p>
        <p>Your support directly powers our high-performance solver servers, fuels new 3D features, and keeps our tools accessible to cubers everywhere.</p>
      </main>
    `;
  }

  return `
    <div id="root">
      ${navHeader}
      ${mainContent}
      ${footer}
    </div>
  `;
}

// -------------------------------------------------------------
// 3. Helper to replace/inject metadata in HTML
// -------------------------------------------------------------
function renderHtml(template, route) {
  let html = template;
  const cleanPath = route.path === '/' ? '/' : (route.path.endsWith('/') ? route.path : `${route.path}/`);
  const canonicalUrl = `${domain}${cleanPath}`;
  const fullImageUrl = route.image.startsWith('http') ? route.image : `${domain}${route.image}`;

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);

  // Replace or add <meta name="description">
  if (html.includes('name="description"')) {
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${route.description}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${route.description}" />\n</head>`);
  }

  // Replace or add Open Graph tags
  const ogTags = [
    { property: 'og:title', content: route.title },
    { property: 'og:description', content: route.description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: "Rubiks' Art" }
  ];

  ogTags.forEach(tag => {
    const regex = new RegExp(`<meta\\s+property="${tag.property}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
    if (regex.test(html)) {
      html = html.replace(regex, `<meta property="${tag.property}" content="${tag.content}" />`);
    } else {
      html = html.replace('</head>', `  <meta property="${tag.property}" content="${tag.content}" />\n</head>`);
    }
  });

  // Replace or add Twitter Card tags
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: route.title },
    { name: 'twitter:description', content: route.description },
    { name: 'twitter:image', content: fullImageUrl }
  ];

  twitterTags.forEach(tag => {
    const regex = new RegExp(`<meta\\s+name="${tag.name}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
    if (regex.test(html)) {
      html = html.replace(regex, `<meta name="${tag.name}" content="${tag.content}" />`);
    } else {
      html = html.replace('</head>', `  <meta name="${tag.name}" content="${tag.content}" />\n</head>`);
    }
  });

  // Canonical Link
  if (html.includes('rel="canonical"')) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // Inject Semantic Pre-rendered Body into <div id="root">
  const semanticBody = buildSemanticBody(route);
  html = html.replace(/<div\s+id="root">\s*<\/div>/i, semanticBody);

  return html;
}

// -------------------------------------------------------------
// 4. Generate Pre-rendered HTML for every route
// -------------------------------------------------------------
let count = 0;
routes.forEach(route => {
  const pageHtml = renderHtml(templateHtml, route);

  if (route.path === '/') {
    fs.writeFileSync(templateHtmlPath, pageHtml, 'utf8');
  } else {
    const routeFolder = path.join(distPath, route.path.replace(/^\//, ''));
    fs.mkdirSync(routeFolder, { recursive: true });
    fs.writeFileSync(path.join(routeFolder, 'index.html'), pageHtml, 'utf8');
  }
  count++;
});

console.log(`[SSG] Successfully pre-rendered ${count} semantic HTML pages with rich content into dist/`);
