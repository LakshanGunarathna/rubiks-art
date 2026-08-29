const fs = require('fs');
const path = require('path');

// Paths
const cubeArtsPath = path.join(__dirname, '../src/data/cubeArts.ts');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

// Read cubeArts.ts
const content = fs.readFileSync(cubeArtsPath, 'utf8');

// Regex to extract rawArtsData contents
// The format is:
// {
//   "id": "...",
//   "name": "...",
//   "moves": "...",
//   "imageUrl": "..."
// }
// We can use a regex to match all these objects
const objectRegex = /\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",[\s\S]*?"imageUrl":\s*"([^"]+)"\s*\}/g;
let match;
const arts = [];
while ((match = objectRegex.exec(content)) !== null) {
  const [_, id, name, imageUrl] = match;
  
  // Determine type based on prefix
  let type = '3x3';
  if (id.startsWith('2x2_')) type = '2x2';
  else if (id.startsWith('4x4_')) type = '4x4';
  else if (id.startsWith('5x5_')) type = '5x5';
  
  // Generate slug
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slug = `${cleanName}-${id}`;
  
  arts.push({ id, name, imageUrl, type, slug });
}

// Generate sitemap XML
const domain = 'https://www.rubiks-art.com';
const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Static Pages -->
  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${domain}/assets/og-home.png</image:loc>
      <image:title>Rubiks' Art Brand Logo</image:title>
      <image:caption>Interactive 3D Rubik's Cube Simulators, Solvers, and Puzzle Art Mosaics</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${domain}/arts</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${domain}/assets/og-arts.png</image:loc>
      <image:title>Puzzle Arts Gallery</image:title>
      <image:caption>Browse premium Rubik's Cube pixel art mosaic patterns with interactive guides</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${domain}/mosaic-generator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${domain}/assets/og-mosaic-generator.png</image:loc>
      <image:title>Rubik's Cube Mosaic Generator</image:title>
      <image:caption>Upload photos, select grid size, dither colors, and convert your images into Rubik's Cube mosaics with printable building guides.</image:caption>
    </image:image>
  </url>
  
  <!-- Company & Legal Pages -->
  <url>
    <loc>${domain}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/support</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/privacy-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${domain}/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Cube Playgrounds -->
  <url>
    <loc>${domain}/cubes/2x2</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${domain}/assets/og-cube-2x2.png</image:loc>
      <image:title>Mini Cube (2x2) Playground</image:title>
      <image:caption>Play with our interactive 3D 2x2 Mini Cube simulator</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${domain}/cubes/3x3</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${domain}/assets/og-cube-3x3.png</image:loc>
      <image:title>Rubik's Cube (3x3) Playground</image:title>
      <image:caption>Practice algorithms and turns on our high-fidelity 3D 3x3 Rubik's Cube simulator</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${domain}/cubes/4x4</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${domain}/assets/og-cube-4x4.png</image:loc>
      <image:title>Rubik's Revenge (4x4) Playground</image:title>
      <image:caption>Test your skills on our interactive 3D 4x4 Rubik's Revenge simulator</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${domain}/cubes/5x5</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${domain}/assets/og-cube-5x5.png</image:loc>
      <image:title>Professor's Cube (5x5) Playground</image:title>
      <image:caption>Practice layers and algorithms on our 3D 5x5 Professor's Cube simulator</image:caption>
    </image:image>
  </url>

  <!-- Solvers -->
  <url>
    <loc>${domain}/solvers/2x2</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${domain}/assets/og-solver-2x2.png</image:loc>
      <image:title>Mini Cube Solver (2x2)</image:title>
      <image:caption>Step-by-step interactive 3D solver for the 2x2 Pocket Cube</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${domain}/solvers/3x3</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${domain}/assets/og-solver-3x3.png</image:loc>
      <image:title>Rubik's Cube Solver (3x3)</image:title>
      <image:caption>Get step-by-step 3D solutions for your 3x3 Rubik's Cube with layer-by-layer/CFOP algorithms</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${domain}/solvers/4x4</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${domain}/assets/og-solver-4x4.png</image:loc>
      <image:title>Rubik's Revenge Solver (4x4)</image:title>
      <image:caption>Solve your 4x4 Rubik's Revenge step-by-step with parity-handling guide</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${domain}/solvers/5x5</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${domain}/assets/og-solver-5x5.png</image:loc>
      <image:title>Professor's Cube Solver (5x5)</image:title>
      <image:caption>Step-by-step 3D reduction and parity solver guide for the 5x5 Professor's Cube</image:caption>
    </image:image>
  </url>

  <!-- Dynamic Art Detail Pages with Image SEO -->`;

arts.forEach(art => {
  // Ensure the image URL has the absolute domain prefix for google crawler
  const fullImgUrl = `${domain}${art.imageUrl}`;
  xml += `
  <url>
    <loc>${domain}/arts/${art.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${fullImgUrl}</image:loc>
      <image:title>${art.name} - Rubik's Cube Art Pattern</image:title>
      <image:caption>Step-by-step 3D guide to create the ${art.name} pattern on a ${art.type} Rubik's Cube</image:caption>
    </image:image>
  </url>`;
});

xml += `
</urlset>
`;

fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Successfully generated sitemap with ${arts.length} dynamic art pages at: ${sitemapPath}`);
