/*
  Generate favicon.svg using Dancing Script outlines for text "DL"
  Usage:
    npm i -D @fontsource/dancing-script text-to-svg
    npm run generate:favicon
*/

const fs = require('fs')
const path = require('path')
const TextToSVG = require('text-to-svg')

function resolveFontPath() {
  // Try a few likely paths from @fontsource
  const candidates = [
    'node_modules/@fontsource/dancing-script/files/dancing-script-latin-700-normal.ttf',
    'node_modules/@fontsource/dancing-script/files/dancing-script-latin-700-normal.woff',
    'node_modules/@fontsource/dancing-script/files/dancing-script-latin-400-normal.ttf',
  ]
  for (const rel of candidates) {
    const p = path.resolve(process.cwd(), rel)
    if (fs.existsSync(p)) return p
  }
  console.error('Could not find Dancing Script TTF. Ensure @fontsource/dancing-script is installed.')
  console.error('Checked candidates:\n' + candidates.join('\n'))
  process.exit(1)
}

function generate() {
  const fontPath = resolveFontPath()
  const textToSVG = TextToSVG.loadSync(fontPath)

  // Canvas size
  const SIZE = 64
  const CENTER_X = SIZE / 2
  const CENTER_Y = SIZE / 2 + 4 // slight vertical optical adjustment

  // Compute path for "DL"
  const attributes = { fill: '#ffffff' }
  const options = {
    x: CENTER_X,
    y: CENTER_Y,
    fontSize: 42, // tuned for legibility at 16px
    anchor: 'center middle',
    attributes,
  }

  const pathData = textToSVG.getD('DL', options)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg" aria-label="DanceLink favicon">
  <defs>
    <linearGradient id="dlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b35"/>
      <stop offset="100%" stop-color="#f72585"/>
    </linearGradient>
  </defs>
  <!-- Rounded gradient background -->
  <rect x="2" y="2" width="${SIZE - 4}" height="${SIZE - 4}" rx="14" ry="14" fill="url(#dlGrad)"/>
  <!-- Dancing Script DL -->
  <path d="${pathData}" fill="#ffffff"/>
</svg>
`

  const outPath = path.resolve(process.cwd(), 'public', 'favicon.svg')
  fs.writeFileSync(outPath, svg)
  console.log(`✔ Wrote ${outPath}`)
}

generate()
