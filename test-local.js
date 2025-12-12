const fs = require('fs');

// --- READ ASSETS FROM INDEX.JS ---
const indexContent = fs.readFileSync('index.js', 'utf8');

// Extract SPRITES
const spritesMatch = indexContent.match(/const SPRITES = ({[\s\S]*?});/);
if (!spritesMatch) { console.error("Could not parse SPRITES"); process.exit(1); }
const SPRITES = eval('(' + spritesMatch[1] + ')');

// Extract PET_COLORS
const colorsMatch = indexContent.match(/const PET_COLORS = ({[\s\S]*?});/);
if (!colorsMatch) { console.error("Could not parse PET_COLORS"); process.exit(1); }
const PET_COLORS = eval('(' + colorsMatch[1] + ')');

// --- RENDER ENGINE (Copied/Adapted from index.js) ---
function renderPixelGrid(grid, baseColor, pixelSize = 10) {
    let rects = '';
    const colorMap = {
        ' ': null,
        'X': baseColor,
        'W': '#ffffff',
        'K': '#2d333b',
        'O': '#FF9F00',
        'R': '#FF0000',
        'Y': '#FFD700',
        'B': '#00ADD8',
        'P': '#C678DD',
        'G': '#98c379' // Added Green
    };

    grid.forEach((rowString, y) => {
        const row = rowString.split('');
        row.forEach((char, x) => {
            const color = colorMap[char];
            if (color) {
                rects += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
            }
        });
    });
    return rects;
}

function generateSVG(petType, mood) {
    // 1. Select the Sprite Set
    const spriteSet = SPRITES[petType] || SPRITES['cat'];

    // 2. Select the specific Mood Grid
    // 2. Select the specific Mood Grid
    const spriteGrid = spriteSet[mood] || spriteSet['normal'];

    const baseColor = PET_COLORS[petType] || '#e5c07b';

    const pixelSize = 16;
    // Dynamic Size Logic
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;

    // Ghost Logic: Override Base Color
    const finalBaseColor = mood === 'ghost' ? '#abb2bf' : baseColor;
    const groupOpacity = mood === 'ghost' ? '0.7' : '1';

    const pixelArt = renderPixelGrid(spriteGrid, finalBaseColor, pixelSize);

    let animation = '';
    if (mood === 'happy') {
        animation = `<animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="0.5s" repeatCount="indefinite" />`;
    } else if (mood === 'sleeping') {
        animation = `<animateTransform attributeName="transform" type="scale" values="1 1; 1.02 0.98; 1 1" dur="2s" repeatCount="indefinite" />`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width + 40}" height="${height + 40}" viewBox="0 0 ${width + 40} ${height + 40}">
      <style>.pet { transform-origin: center; }</style>
      <rect x="5" y="5" width="${width + 30}" height="${height + 25}" rx="12" ry="12" fill="rgba(45, 51, 59, 0.15)" />
      <g transform="translate(20, 20)" opacity="${groupOpacity}">
        <g class="pet">${pixelArt}${animation}</g>
      </g>
      <text x="50%" y="${height + 35}" text-anchor="middle" font-family="monospace" font-size="12" fill="#666">${mood.toUpperCase()}</text>
    </svg>`;
}

// --- GENERATE GALLERY ---
if (!fs.existsSync('dist')) fs.mkdirSync('dist');

const pets = Object.keys(SPRITES);
console.log(`Generating 3 states for ${pets.length} pets...`);

pets.forEach(pet => {
    ['happy', 'sleeping', 'ghost'].forEach(mood => {
        const svg = generateSVG(pet, mood);
        const filename = (mood === 'happy') ? `${pet}.svg` : `${pet}_${mood}.svg`;
        fs.writeFileSync(`dist/${filename}`, svg);
        if (mood === 'happy') fs.writeFileSync(`dist/${pet}_happy.svg`, svg);
    });
});

console.log('Done!');
