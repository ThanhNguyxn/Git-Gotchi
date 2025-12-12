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
        'P': '#C678DD'
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
    const sprite = SPRITES[petType] || SPRITES['cat'];
    const baseColor = PET_COLORS[petType] || '#e5c07b';

    let renderSprite = [...sprite];

    if (mood === 'sleeping') {
        renderSprite = renderSprite.map(row => row.replace(/W/g, 'K'));
    }

    const pixelSize = 16;
    const width = 12 * pixelSize;
    const height = 12 * pixelSize;

    const finalBaseColor = mood === 'ghost' ? '#abb2bf' : baseColor;
    const groupOpacity = mood === 'ghost' ? '0.7' : '1';

    const pixelArt = renderPixelGrid(renderSprite, finalBaseColor, pixelSize);

    let animation = '';
    if (mood === 'happy') {
        animation = `<animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="0.5s" repeatCount="indefinite" />`;
    } else if (mood === 'sleeping') {
        animation = `<animateTransform attributeName="transform" type="scale" values="1 1; 1.02 0.98; 1 1" dur="2s" repeatCount="indefinite" />`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width + 40}" height="${height + 40}" viewBox="0 0 ${width + 40} ${height + 40}">
      <style>.pet { transform-origin: center; }</style>
      <rect width="100%" height="100%" fill="transparent" />
      <g transform="translate(20, 20)" opacity="${groupOpacity}">
        <g class="pet">${pixelArt}${animation}</g>
      </g>
    </svg>`;
}

// --- GENERATE GALLERY ---
if (!fs.existsSync('dist')) fs.mkdirSync('dist');

const pets = Object.keys(SPRITES);
console.log(`Generating ${pets.length} pets...`);

pets.forEach(pet => {
    const svg = generateSVG(pet, 'happy');
    fs.writeFileSync(`dist/${pet}.svg`, svg);
    console.log(`Generated dist/${pet}.svg`);
});

// Generate Mood Variants for Crab
['sleeping', 'ghost'].forEach(mood => {
    const svg = generateSVG('crab', mood);
    fs.writeFileSync(`dist/crab_${mood}.svg`, svg);
});

console.log('Done!');
