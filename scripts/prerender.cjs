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
const domain = 'https://www.rubiks-art.com';

// 1. Static and Feature Routes
const routes = [
  {
    path: '/',
    title: "Rubiks' Art - Interactive Rubik's Cube Experience",
    description: "Rubiks' Art combines the timeless logic of Rubik's Cubes with modern 3D technology, offering an immersive platform for enthusiasts of all skill levels.",
    image: "/assets/og-home.png"
  },
  {
    path: '/arts',
    title: "Puzzle Arts | Rubiks' Art",
    description: "Create premium pixel-art mosaics using Rubik's Cubes. Select patterns, filter by difficulty, and follow animated 3D guides to build stunning puzzle art.",
    image: "/assets/og-arts.png"
  },
  {
    path: '/mosaic-generator',
    title: "Online Rubik's Cube Mosaic Generator | Rubiks' Art",
    description: "Convert your photos into stunning Rubik's Cube pixel mosaics. Upload images, adjust crop/zoom, select grid sizes and cube types (1x1 to 5x5), apply dithering, download patterns, and follow a step-by-step building guide.",
    image: "/assets/og-mosaic-generator.png"
  },
  // Playgrounds
  {
    path: '/cubes/2x2',
    title: "Mini Cube (2x2) | Rubiks' Art",
    description: "Play with our interactive 3D 2x2 Mini Cube. Rotate layers, shuffle, and explore permutations in real time with high-fidelity WebGL graphics.",
    image: "/assets/og-cube-2x2.png"
  },
  {
    path: '/cubes/3x3',
    title: "Rubik's Cube (3x3) | Rubiks' Art",
    description: "Interact with the classic 3x3 Rubik's Cube in high-fidelity 3D. Play, shuffle, practice algorithms, and explore cube history.",
    image: "/assets/og-cube-3x3.png"
  },
  {
    path: '/cubes/4x4',
    title: "Rubik's Revenge (4x4) | Rubiks' Art",
    description: "Test your skills on the 4x4 Rubik's Revenge in 3D. Rotate, shuffle, and learn facts about center parities and permutations.",
    image: "/assets/og-cube-4x4.png"
  },
  {
    path: '/cubes/5x5',
    title: "Professor's Cube (5x5) | Rubiks' Art",
    description: "Practice on the 5x5 Professor's Cube simulator. Experience high-fidelity 3D layer turns, camera rotations, and master complex algorithms.",
    image: "/assets/og-cube-5x5.png"
  },
  // Solvers
  {
    path: '/solvers/2x2',
    title: "Mini Cube Solver (2x2) | Rubiks' Art",
    description: "Solve the 2x2 Mini Cube step-by-step with our interactive 3D solver. Enter your cube's colors and follow guided layer-by-layer instructions.",
    image: "/assets/og-solver-2x2.png"
  },
  {
    path: '/solvers/3x3',
    title: "Rubik's Cube Solver (3x3) | Rubiks' Art",
    description: "Solve your 3x3 Rubik's Cube with our step-by-step interactive 3D solver guide. Paint your cube's layout and get optimal CFOP/layer-by-layer solutions.",
    image: "/assets/og-solver-3x3.png"
  },
  {
    path: '/solvers/4x4',
    title: "Rubik's Revenge Solver (4x4) | Rubiks' Art",
    description: "Learn to solve the 4x4 Rubik's Revenge. Our interactive 3D solver helps you resolve center parities and edge-pairing step-by-step.",
    image: "/assets/og-solver-4x4.png"
  },
  {
    path: '/solvers/5x5',
    title: "Professor's Cube Solver (5x5) | Rubiks' Art",
    description: "Solve the 5x5 Professor's Cube. Step-by-step interactive 3D reduction and parity solver guide to mastering the 5x5 cube.",
    image: "/assets/og-solver-5x5.png"
  },
  // Informational Pages
  {
    path: '/privacy-policy',
    title: "Privacy Policy | Rubiks' Art",
    description: "Read the Privacy Policy for Rubiks' Art. Learn how we handle information, analytics, and your rights.",
    image: "/assets/og-home.png"
  },
  {
    path: '/terms',
    title: "Terms of Service | Rubiks' Art",
    description: "Read the Terms of Service for Rubiks' Art.",
    image: "/assets/og-home.png"
  },
  {
    path: '/about',
    title: "About Us | Rubiks' Art",
    description: "Learn more about Rubiks' Art, our mission, 3D cube simulators, and puzzle art mosaic technology.",
    image: "/assets/og-home.png"
  },
  {
    path: '/support',
    title: "Support Us | Rubiks' Art",
    description: "Support Rubik's Art to keep our 3D Rubik's Cube simulators, step-by-step solvers, and mosaic generator free and ad-free.",
    image: "/assets/og-home.png"
  },
  {
    path: '/contact',
    title: "Contact Us | Rubiks' Art",
    description: "Contact the Rubiks' Art team for feedback, inquiries, or support.",
    image: "/assets/og-home.png"
  }
];

// 2. Parse Dynamic Puzzle Arts from cubeArts.ts
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

    routes.push({
      path: `/arts/${slug}`,
      title: `${name} | Puzzle Arts | Rubiks' Art`,
      description: `Follow this interactive 3D guide to build the "${name}" mosaic pattern on a ${type} cube. Moves: ${moves}`,
      image: imageUrl
    });
  }
} catch (err) {
  console.warn('Warning: Could not parse dynamic puzzle arts:', err.message);
}

// 3. Helper to replace/inject metadata in HTML
function renderHtml(template, route) {
  let html = template;
  const canonicalUrl = `${domain}${route.path === '/' ? '' : route.path}`;
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

  return html;
}

// 4. Generate Pre-rendered HTML for every route
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

console.log(`[SSG] Successfully pre-rendered ${count} static HTML pages into dist/`);
