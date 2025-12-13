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
        'G': '#98c379'
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

function getThemeBackground(theme, width, height) {
    switch (theme) {
        case 'cyberpunk':
            return `
                <rect x="0" y="0" width="${width}" height="${height}" fill="#1a0a2e" rx="12" ry="12"/>
                <g stroke="#ff00ff" stroke-opacity="0.3" stroke-width="1">
                    ${Array.from({ length: 10 }, (_, i) =>
                `<line x1="${i * (width / 10)}" y1="0" x2="${i * (width / 10)}" y2="${height}"/>`
            ).join('')}
                    ${Array.from({ length: 10 }, (_, i) =>
                `<line x1="0" y1="${i * (height / 10)}" x2="${width}" y2="${i * (height / 10)}"/>`
            ).join('')}
                </g>
                <rect x="5" y="5" width="${width - 10}" height="${height - 10}" fill="none" stroke="#00ffff" stroke-width="2" rx="8" ry="8" stroke-opacity="0.5"/>
            `;
        case 'nature':
            return `
                <rect x="0" y="0" width="${width}" height="${height}" fill="#e8f5e9" rx="12" ry="12"/>
                <g fill="#a5d6a7" opacity="0.6">
                    <ellipse cx="${width * 0.2}" cy="${height * 0.15}" rx="20" ry="12"/>
                    <ellipse cx="${width * 0.25}" cy="${height * 0.12}" rx="15" ry="10"/>
                    <ellipse cx="${width * 0.8}" cy="${height * 0.2}" rx="18" ry="10"/>
                </g>
            `;
        case 'minimal':
        default:
            return `<rect x="5" y="5" width="${width - 10}" height="${height - 15}" rx="12" ry="12" fill="rgba(45, 51, 59, 0.15)"/>`;
    }
}

function generateSVG(petType, mood, options = {}) {
    const { theme = 'minimal', showLevel = false, stats = null, moodInfo = null } = options;

    const spriteSet = SPRITES[petType] || SPRITES['cat'];
    const moodKey = (mood === 'happy') ? 'normal' : mood;
    const spriteGrid = spriteSet[moodKey] || spriteSet['normal'];
    const baseColor = PET_COLORS[petType] || '#e5c07b';

    const pixelSize = 16;
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    const svgWidth = width + 40;
    const svgHeight = height + 40;

    const finalBaseColor = mood === 'ghost' ? '#abb2bf' : baseColor;
    const groupOpacity = mood === 'ghost' ? '0.7' : '1';
    const pixelArt = renderPixelGrid(spriteGrid, finalBaseColor, pixelSize);
    const themeBackground = getThemeBackground(theme, svgWidth, svgHeight);
    const textColor = theme === 'cyberpunk' ? '#00ffff' : (theme === 'nature' ? '#388e3c' : '#666');

    let animation = '';
    if (mood === 'happy') {
        animation = `<animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="0.5s" repeatCount="indefinite" />`;
    } else if (mood === 'sleeping') {
        animation = `<animateTransform attributeName="transform" type="scale" values="1 1; 1.02 0.98; 1 1" dur="2s" repeatCount="indefinite" />`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g transform="translate(20, 20)" opacity="${groupOpacity}">
        <g class="pet">${pixelArt}${animation}</g>
      </g>
      <text x="50%" y="${height + 35}" text-anchor="middle" font-family="monospace" font-size="12" fill="${textColor}">${mood.toUpperCase()}</text>
    </svg>`;
}

// --- GENERATE GALLERY ---
if (!fs.existsSync('dist')) fs.mkdirSync('dist');

const pets = Object.keys(SPRITES);
const themes = ['minimal', 'cyberpunk', 'nature'];
console.log(`Generating 3 states for ${pets.length} pets with ${themes.length} themes...`);

// Generate default (minimal theme) gallery
pets.forEach(pet => {
    ['happy', 'sleeping', 'ghost'].forEach(mood => {
        const svg = generateSVG(pet, mood, { theme: 'minimal' });
        const filename = (mood === 'happy') ? `${pet}.svg` : `${pet}_${mood}.svg`;
        fs.writeFileSync(`dist/${filename}`, svg);
        if (mood === 'happy') fs.writeFileSync(`dist/${pet}_happy.svg`, svg);
    });
});

// Generate theme demo files (first pet only as examples)
['cyberpunk', 'nature'].forEach(theme => {
    const svg = generateSVG('unicorn', 'happy', { theme });
    fs.writeFileSync(`dist/demo_${theme}.svg`, svg);
    console.log(`Generated demo_${theme}.svg`);
});

// Generate mood demo files with custom labels
const moodDemos = [
    { name: 'happy', label: '⚡ HAPPY', sprite: 'normal' },
    { name: 'sleeping', label: '💤 SLEEPING', sprite: 'sleep' },
    { name: 'ghost', label: '👻 GHOST', sprite: 'ghost' },
    { name: 'hyper', label: '🔥 HYPER', sprite: 'hyper' },
    { name: 'nightowl', label: '🦉 NIGHT OWL', sprite: 'nightowl' },
    { name: 'weekend', label: '🏖️ WEEKEND CHILL', sprite: 'weekend' }
];

moodDemos.forEach(({ name, label, sprite }) => {
    const spriteSet = SPRITES['unicorn'] || SPRITES['cat'];
    const moodKey = (sprite === 'happy') ? 'normal' : sprite;
    const spriteGrid = spriteSet[moodKey] || spriteSet['normal'];
    const baseColor = PET_COLORS['unicorn'] || '#e5c07b';

    const pixelSize = 16;
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    const svgWidth = width + 40;
    const svgHeight = height + 40;

    const finalBaseColor = sprite === 'ghost' ? '#abb2bf' : baseColor;
    const groupOpacity = sprite === 'ghost' ? '0.7' : '1';
    const pixelArt = renderPixelGrid(spriteGrid, finalBaseColor, pixelSize);
    const themeBackground = getThemeBackground('minimal', svgWidth, svgHeight);

    let animation = '';
    if (sprite === 'happy') {
        animation = `<animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="0.5s" repeatCount="indefinite" />`;
    } else if (sprite === 'sleeping') {
        animation = `<animateTransform attributeName="transform" type="scale" values="1 1; 1.02 0.98; 1 1" dur="2s" repeatCount="indefinite" />`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g transform="translate(20, 20)" opacity="${groupOpacity}">
        <g class="pet">${pixelArt}${animation}</g>
      </g>
      <text x="50%" y="${height + 35}" text-anchor="middle" font-family="monospace" font-size="11" fill="#666">${label}</text>
    </svg>`;

    fs.writeFileSync(`dist/mood_${name}.svg`, svg);
    console.log(`Generated mood_${name}.svg`);
});

console.log('Done!');
