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

// Extract LEGENDARY_SPRITES using simpler marker approach
const legSpritesStart = indexContent.indexOf('const LEGENDARY_SPRITES = {');
const mythicalMarker = '// MYTHICAL PET SPRITES';
const mythicalIdx = indexContent.indexOf(mythicalMarker);
const legSpritesEnd = indexContent.lastIndexOf('};', mythicalIdx);
let LEGENDARY_SPRITES = {};
if (legSpritesStart !== -1 && legSpritesEnd !== -1) {
    // Extract just the object part starting from {
    const legSpritesStr = indexContent.substring(legSpritesStart + 'const LEGENDARY_SPRITES = '.length, legSpritesEnd + 1);
    try {
        LEGENDARY_SPRITES = eval('(' + legSpritesStr + ')');
        console.log('Loaded LEGENDARY_SPRITES with keys:', Object.keys(LEGENDARY_SPRITES).join(', '));
    } catch (e) {
        console.error('Could not parse LEGENDARY_SPRITES:', e.message);
        console.error('Trying to parse:', legSpritesStr.substring(0, 100) + '...');
    }
}

// Extract LEGENDARY_COLORS
const legendaryColorsMatch = indexContent.match(/const LEGENDARY_COLORS = ({[\s\S]*?});/);
const LEGENDARY_COLORS = legendaryColorsMatch ? eval('(' + legendaryColorsMatch[1] + ')') : {};

// Extract MYTHICAL_SPRITES
const mythicalSpritesMatch = indexContent.match(/const MYTHICAL_SPRITES = ({[\s\S]*?});\s*\nconst SPRITES/);
const MYTHICAL_SPRITES = mythicalSpritesMatch ? eval('(' + mythicalSpritesMatch[1] + ')') : {};

// Extract MYTHICAL_COLORS
const mythicalColorsMatch = indexContent.match(/const MYTHICAL_COLORS = ({[\s\S]*?});/);
const MYTHICAL_COLORS = mythicalColorsMatch ? eval('(' + mythicalColorsMatch[1] + ')') : {};

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
        case 'synthwave':
            // 80s retro sunset with grid
            return `
                <defs>
                    <linearGradient id="synthwaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#2d1b69"/>
                        <stop offset="40%" style="stop-color:#7c3aed"/>
                        <stop offset="60%" style="stop-color:#f472b6"/>
                        <stop offset="80%" style="stop-color:#fb923c"/>
                        <stop offset="100%" style="stop-color:#1e1b4b"/>
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="${width}" height="${height}" fill="url(#synthwaveGrad)" rx="12" ry="12"/>
                <!-- Sun -->
                <circle cx="${width / 2}" cy="${height * 0.4}" r="30" fill="#ff6b9d" opacity="0.8"/>
                <rect x="${width / 2 - 35}" y="${height * 0.4 - 5}" width="70" height="3" fill="#2d1b69"/>
                <rect x="${width / 2 - 35}" y="${height * 0.4 + 3}" width="70" height="4" fill="#2d1b69"/>
                <rect x="${width / 2 - 35}" y="${height * 0.4 + 10}" width="70" height="5" fill="#2d1b69"/>
                <!-- Grid lines -->
                <g stroke="#ff00ff" stroke-opacity="0.4" stroke-width="1">
                    ${Array.from({ length: 8 }, (_, i) =>
                `<line x1="${i * (width / 8)}" y1="${height * 0.6}" x2="${width / 2 + (i - 4) * 20}" y2="${height}"/>`
            ).join('')}
                </g>
            `;
        case 'matrix':
            // Digital rain with dark green
            return `
                <rect x="0" y="0" width="${width}" height="${height}" fill="#0d0d0d" rx="12" ry="12"/>
                <g font-family="monospace" font-size="10" fill="#00ff00" opacity="0.3">
                    ${Array.from({ length: 12 }, (_, i) => {
                const x = 10 + (i * (width / 12));
                const chars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', '力', '七', '九'];
                return Array.from({ length: 6 }, (_, j) =>
                    `<text x="${x}" y="${15 + j * 15}">${chars[Math.floor(Math.random() * chars.length)]}</text>`
                ).join('');
            }).join('')}
                </g>
                <rect x="5" y="5" width="${width - 10}" height="${height - 10}" fill="none" stroke="#00ff00" stroke-width="1" rx="8" ry="8" stroke-opacity="0.3"/>
            `;
        case 'ocean':
            // Deep sea with waves and bubbles
            return `
                <defs>
                    <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#0077b6"/>
                        <stop offset="50%" style="stop-color:#023e8a"/>
                        <stop offset="100%" style="stop-color:#03045e"/>
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="${width}" height="${height}" fill="url(#oceanGrad)" rx="12" ry="12"/>
                <!-- Bubbles -->
                <g fill="#90e0ef" opacity="0.4">
                    <circle cx="${width * 0.15}" cy="${height * 0.7}" r="5"/>
                    <circle cx="${width * 0.2}" cy="${height * 0.6}" r="3"/>
                    <circle cx="${width * 0.8}" cy="${height * 0.75}" r="6"/>
                    <circle cx="${width * 0.85}" cy="${height * 0.65}" r="4"/>
                    <circle cx="${width * 0.5}" cy="${height * 0.8}" r="4"/>
                </g>
                <!-- Light rays -->
                <g stroke="#caf0f8" stroke-opacity="0.15" stroke-width="15">
                    <line x1="${width * 0.3}" y1="0" x2="${width * 0.35}" y2="${height * 0.6}"/>
                    <line x1="${width * 0.6}" y1="0" x2="${width * 0.55}" y2="${height * 0.5}"/>
                </g>
            `;
        case 'minimal':
        default:
            return `<rect x="5" y="5" width="${width - 10}" height="${height - 15}" rx="12" ry="12" fill="rgba(45, 51, 59, 0.15)"/>`;
    }
}

function getTextColor(theme) {
    switch(theme) {
        case 'cyberpunk': return '#00ffff';
        case 'nature': return '#388e3c';
        case 'synthwave': return '#ff6b9d';
        case 'matrix': return '#00ff00';
        case 'ocean': return '#90e0ef';
        default: return '#666';
    }
}

function getWeatherEffects(weather, width, height) {
    switch (weather) {
        case 'rain':
            return `
                <g opacity="0.6">
                    ${Array.from({ length: 15 }, (_, i) => {
                const x = 10 + (i * (width / 15));
                const delay = (i * 0.1) % 1;
                return `<line x1="${x}" y1="-10" x2="${x - 5}" y2="10" stroke="#4FC3F7" stroke-width="2" stroke-linecap="round">
                    <animate attributeName="y1" values="-10;${height + 10}" dur="0.7s" begin="${delay}s" repeatCount="indefinite"/>
                    <animate attributeName="y2" values="10;${height + 30}" dur="0.7s" begin="${delay}s" repeatCount="indefinite"/>
                </line>`;
            }).join('')}
                </g>
            `;
        case 'snow':
            return `
                <g fill="#ffffff">
                    ${Array.from({ length: 20 }, (_, i) => {
                const x = 5 + (i * (width / 20));
                const size = 2 + Math.random() * 4;
                const dur = 2 + Math.random() * 3;
                const delay = Math.random() * 2;
                return `<circle cx="${x}" cy="0" r="${size}" opacity="0.8">
                    <animate attributeName="cy" values="0;${height}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
                </circle>`;
            }).join('')}
                </g>
            `;
        case 'stars':
            return `
                <g fill="#FFD700">
                    ${Array.from({ length: 12 }, (_, i) => {
                const x = 10 + Math.random() * (width - 20);
                const y = 10 + Math.random() * (height * 0.5);
                const size = 1 + Math.random() * 2;
                const dur = 1 + Math.random() * 2;
                return `<circle cx="${x}" cy="${y}" r="${size}">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="${dur}s" repeatCount="indefinite"/>
                </circle>`;
            }).join('')}
                </g>
            `;
        case 'fireflies':
            return `
                <g>
                    ${Array.from({ length: 8 }, (_, i) => {
                const startX = 20 + Math.random() * (width - 40);
                const startY = 20 + Math.random() * (height - 40);
                const endX = startX + (Math.random() - 0.5) * 60;
                const endY = startY + (Math.random() - 0.5) * 60;
                const dur = 3 + Math.random() * 4;
                return `<circle cx="${startX}" cy="${startY}" r="3" fill="#FFEB3B" opacity="0.8">
                    <animate attributeName="cx" values="${startX};${endX};${startX}" dur="${dur}s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="${startY};${endY};${startY}" dur="${dur}s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite"/>
                </circle>`;
            }).join('')}
                </g>
            `;
        case 'leaves':
            return `
                <g>
                    ${Array.from({ length: 10 }, (_, i) => {
                const x = 10 + (i * (width / 10));
                const dur = 4 + Math.random() * 3;
                const delay = Math.random() * 3;
                const colors = ['#FF9800', '#F44336', '#795548', '#FFC107'];
                const color = colors[i % colors.length];
                return `<g>
                    <path d="M${x},0 Q${x+5},-5 ${x+10},0 Q${x+5},5 ${x},0" fill="${color}" opacity="0.8">
                        <animateTransform attributeName="transform" type="translate" values="0,0;${Math.random() * 30},${height}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
                    </path>
                </g>`;
            }).join('')}
                </g>
            `;
        default:
            return '';
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
    const textColor = getTextColor(theme);

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
const themes = ['minimal', 'cyberpunk', 'nature', 'synthwave', 'matrix', 'ocean'];
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
['cyberpunk', 'nature', 'synthwave', 'matrix', 'ocean'].forEach(theme => {
    // Theme demos use generateSVG which checks LEGENDARY_SPRITES first, so this is fine.
    const svg = generateSVG('unicorn', 'happy', { theme });
    fs.writeFileSync(`dist/demo_${theme}.svg`, svg);
    console.log(`Generated demo_${theme}.svg`);
});

// Generate weather effect demo files
const weatherDemos = [
    { name: 'rain', label: '🌧️ RAIN', weather: 'rain' },
    { name: 'snow', label: '❄️ SNOW', weather: 'snow' },
    { name: 'stars', label: '✨ STARS', weather: 'stars' },
    { name: 'fireflies', label: '🪲 FIREFLIES', weather: 'fireflies' },
    { name: 'leaves', label: '🍂 LEAVES', weather: 'leaves' }
];

weatherDemos.forEach(({ name, label, weather }) => {
    const spriteSet = LEGENDARY_SPRITES['unicorn'] || SPRITES['cat'];
    const spriteGrid = spriteSet['normal'];
    const baseColor = PET_COLORS['unicorn'] || '#e5c07b';

    const pixelSize = 16;
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    const svgWidth = width + 40;
    const svgHeight = height + 40;

    const pixelArt = renderPixelGrid(spriteGrid, baseColor, pixelSize);
    const themeBackground = getThemeBackground('minimal', svgWidth, svgHeight);
    const weatherEffects = getWeatherEffects(weather, svgWidth, svgHeight);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g class="weather-layer" style="pointer-events: none;">
        ${weatherEffects}
      </g>
      <g transform="translate(20, 20)">
        <g class="pet">${pixelArt}<animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="0.5s" repeatCount="indefinite" /></g>
      </g>
      <text x="50%" y="${height + 35}" text-anchor="middle" font-family="monospace" font-size="11" fill="#666">${label}</text>
    </svg>`;

    fs.writeFileSync(`dist/weather_${name}.svg`, svg);
    console.log(`Generated weather_${name}.svg`);
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
    const spriteSet = LEGENDARY_SPRITES['unicorn'] || SPRITES['cat'];
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

// --- SEASONAL EVENT DEMOS ---
// Extract HEAD_POSITION_OFFSETS from index.js
const HEAD_POSITION_OFFSETS = {
    // Unicorn: shift left (-48) and down (+48) to get from horn tip to actual head center
    unicorn: { x: -48, y: 48 }
};

// Calculate head position with pet-specific offsets
function calculateHeadPosition(spriteGrid, petType = '') {
    const pixelSize = 16;
    if (!spriteGrid || !Array.isArray(spriteGrid)) {
        return { x: 100, y: 20 };
    }

    const headOffset = HEAD_POSITION_OFFSETS[petType] || { y: 0 };

    for (let row = 0; row < spriteGrid.length; row++) {
        const line = spriteGrid[row];
        const firstPixel = line.search(/\S/);
        if (firstPixel !== -1) {
            const lastPixel = line.length - 1 - line.split('').reverse().join('').search(/\S/);
            const centerX = ((firstPixel + lastPixel) / 2) * pixelSize + (pixelSize / 2) + (headOffset.x || 0);
            const topY = row * pixelSize + (headOffset.y || 0);
            return { x: centerX, y: topY };
        }
    }
    return { x: 100, y: 20 };
}

// Relative accessory offsets
const RELATIVE_ACCESSORY_OFFSETS = {
    NEW_YEAR: { x: -15, y: -45 },
    VALENTINE: { x: 0, y: -35 },
    WOMENS_DAY: { x: -10, y: -5 },
    PROGRAMMER_DAY: { x: 25, y: 0 },
    HALLOWEEN: { x: 0, y: -10 },
    MENS_DAY: { x: -25, y: 80 },
    CHRISTMAS: { x: -30, y: -45 },
    LUNAR_NEW_YEAR: { x: 20, y: 0 },
    FRIDAY_13: { x: -35, y: -5 },
    APRIL_FOOLS: { x: -30, y: -45 },
    ST_PATRICKS: { x: -15, y: -50 },
    NOWRUZ: { x: -10, y: -20 },
    EASTER: { x: -15, y: -55 },
    MID_AUTUMN: { x: -5, y: -60 },
    DIWALI: { x: -10, y: -30 },
    THANKSGIVING: { x: -15, y: -50 },
    HOLI: { x: -10, y: -30 },
    EID: { x: -10, y: -40 },
    EARTH_DAY: { x: -10, y: -30 },
    LABOR_DAY: { x: -15, y: -45 },
    PRIDE: { x: -15, y: -50 },
    HANUKKAH: { x: -15, y: -40 },
    PI_DAY: { x: -15, y: -45 },
    STAR_WARS_DAY: { x: 20, y: -5 },
    PIRATE_DAY: { x: -15, y: -50 },
    SINGLES_DAY: { x: -15, y: -35 },
    SYSADMIN_DAY: { x: -10, y: -30 }
};

// Accessory SVG generators
const SEASONAL_ACCESSORIES_FN = {
    NEW_YEAR: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <polygon points="15,50 30,5 0,5" fill="#FF6B6B"/>
            <polygon points="15,50 30,5 22,5 15,35 8,5 0,5" fill="#4ECDC4"/>
            <polygon points="15,50 22,5 15,35" fill="#FFE66D"/>
            <circle cx="15" cy="3" r="5" fill="#FFE66D"/>
            <rect x="0" y="45" width="30" height="5" rx="2" fill="#2D333B"/>
        </g>
    `,
    VALENTINE: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <rect x="4" y="0" width="8" height="4" fill="#FF6B9D"/>
            <rect x="16" y="0" width="8" height="4" fill="#FF6B9D"/>
            <rect x="0" y="4" width="28" height="4" fill="#FF6B9D"/>
            <rect x="0" y="8" width="28" height="4" fill="#FF8FAB"/>
            <rect x="4" y="12" width="20" height="4" fill="#FF8FAB"/>
            <rect x="8" y="16" width="12" height="4" fill="#FFB3C6"/>
            <rect x="12" y="20" width="4" height="4" fill="#FFB3C6"/>
            <circle cx="8" cy="6" r="2" fill="#FFFFFF" opacity="0.7"/>
        </g>
    `,
    CHRISTMAS: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <path d="M0,45 Q-5,25 20,10 Q45,0 60,30 L55,50 Z" fill="#D32F2F"/>
            <path d="M5,42 Q0,25 22,13 Q42,5 55,30 L52,47 Z" fill="#E53935"/>
            <ellipse cx="28" cy="48" rx="32" ry="8" fill="#FAFAFA"/>
            <ellipse cx="28" cy="48" rx="28" ry="5" fill="#EEEEEE"/>
            <circle cx="60" cy="28" r="10" fill="#FAFAFA"/>
            <circle cx="62" cy="26" r="4" fill="#EEEEEE"/>
        </g>
    `,
    HALLOWEEN: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <rect x="18" y="0" width="6" height="8" rx="2" fill="#2D6A4F"/>
            <ellipse cx="21" cy="25" rx="20" ry="18" fill="#FF6D00"/>
            <ellipse cx="21" cy="25" rx="16" ry="15" fill="#FF8500"/>
            <polygon points="10,20 15,15 18,22" fill="#2D333B"/>
            <polygon points="24,22 27,15 32,20" fill="#2D333B"/>
            <path d="M12,30 Q21,38 30,30" stroke="#2D333B" stroke-width="3" fill="none"/>
        </g>
    `,
    LUNAR_NEW_YEAR: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <rect x="0" y="0" width="35" height="50" rx="3" fill="#D32F2F"/>
            <rect x="2" y="2" width="31" height="46" rx="2" fill="#E53935"/>
            <rect x="5" y="5" width="25" height="40" rx="1" stroke="#FFD700" stroke-width="2" fill="none"/>
            <circle cx="17.5" cy="25" r="10" fill="#FFD700"/>
            <circle cx="17.5" cy="25" r="7" fill="#FFC107"/>
        </g>
    `,
    PROGRAMMER_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <rect x="0" y="10" width="25" height="28" rx="3" fill="#8B4513"/>
            <rect x="3" y="13" width="19" height="22" rx="2" fill="#5C4033"/>
            <rect x="4" y="14" width="17" height="12" fill="#3C2415"/>
            <path d="M25,15 Q35,15 35,24 Q35,33 25,33" stroke="#8B4513" stroke-width="4" fill="none"/>
        </g>
    `,
    WOMENS_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <ellipse cx="15" cy="12" rx="8" ry="6" fill="#E63946"/>
            <ellipse cx="10" cy="15" rx="6" ry="5" fill="#D62839"/>
            <ellipse cx="20" cy="15" rx="6" ry="5" fill="#D62839"/>
            <ellipse cx="15" cy="18" rx="7" ry="5" fill="#C1121F"/>
            <circle cx="15" cy="14" r="4" fill="#780000"/>
            <rect x="14" y="22" width="2" height="12" fill="#2D6A4F"/>
        </g>
    `,
    MENS_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <path d="M0,10 Q0,0 15,5 L15,15 Q0,20 0,10" fill="#1E88E5"/>
            <path d="M35,5 Q50,0 50,10 Q50,20 35,15 L35,5" fill="#1E88E5"/>
            <rect x="15" y="5" width="20" height="10" rx="2" fill="#0D47A1"/>
        </g>
    `,
    FRIDAY_13: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <ellipse cx="35" cy="40" rx="32" ry="38" fill="#F5F5F5"/>
            <ellipse cx="35" cy="40" rx="28" ry="34" fill="#EEEEEE"/>
            <ellipse cx="22" cy="32" rx="8" ry="10" fill="#1A1A1A"/>
            <ellipse cx="48" cy="32" rx="8" ry="10" fill="#1A1A1A"/>
            <circle cx="32" cy="48" r="3" fill="#1A1A1A"/>
            <circle cx="38" cy="48" r="3" fill="#1A1A1A"/>
            <polygon points="35,15 25,35 45,35" fill="#B71C1C"/>
        </g>
    `,
    APRIL_FOOLS: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <path d="M20,50 Q5,30 15,5 Q20,0 25,5 L30,50 Z" fill="#9C27B0"/>
            <circle cx="15" cy="5" r="6" fill="#FFD700"/>
            <path d="M35,50 Q35,25 40,0 Q45,0 50,25 L55,50 Z" fill="#4CAF50"/>
            <circle cx="42" cy="0" r="6" fill="#FFD700"/>
            <path d="M60,50 Q70,30 65,5 Q70,0 75,5 L70,50 Z" fill="#2196F3"/>
            <circle cx="70" cy="5" r="6" fill="#FFD700"/>
            <rect x="15" y="45" width="60" height="8" rx="3" fill="#E91E63"/>
        </g>
    `,
    ST_PATRICKS: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Leprechaun Hat -->
            <ellipse cx="25" cy="50" rx="30" ry="6" fill="#1B5E20"/>
            <rect x="8" y="15" width="34" height="35" rx="3" fill="#2E7D32"/>
            <rect x="5" y="45" width="40" height="8" fill="#1B5E20"/>
            <!-- Gold buckle -->
            <rect x="15" y="35" width="20" height="15" rx="2" fill="#FFD700"/>
            <rect x="19" y="39" width="12" height="7" fill="#2E7D32"/>
            <!-- Shamrock -->
            <g transform="translate(35, 5)">
                <ellipse cx="0" cy="-5" rx="5" ry="4" fill="#4CAF50"/>
                <ellipse cx="-5" cy="0" rx="4" ry="5" fill="#4CAF50"/>
                <ellipse cx="5" cy="0" rx="4" ry="5" fill="#4CAF50"/>
                <rect x="-1" y="3" width="2" height="8" fill="#2E7D32"/>
            </g>
        </g>
    `,
    NOWRUZ: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Haft-sin table simplified -->
            <ellipse cx="25" cy="45" rx="28" ry="8" fill="#8D6E63"/>
            <!-- Sabzeh (sprouts) -->
            <g fill="#4CAF50">
                <rect x="8" y="30" width="2" height="15"/>
                <rect x="12" y="28" width="2" height="17"/>
                <rect x="16" y="32" width="2" height="13"/>
            </g>
            <!-- Goldfish bowl -->
            <ellipse cx="35" cy="38" rx="8" ry="6" fill="#81D4FA"/>
            <ellipse cx="36" cy="39" rx="3" ry="2" fill="#FF9800"/>
            <!-- Candle -->
            <rect x="22" y="25" width="6" height="20" fill="#FFECB3"/>
            <ellipse cx="25" cy="22" rx="4" ry="6" fill="#FF9800"/>
            <ellipse cx="25" cy="20" rx="2" ry="4" fill="#FFEB3B"/>
        </g>
    `,
    EASTER: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Easter Bunny Ears -->
            <ellipse cx="12" cy="25" rx="8" ry="25" fill="#FFCCBC"/>
            <ellipse cx="12" cy="25" rx="5" ry="20" fill="#FFAB91"/>
            <ellipse cx="38" cy="25" rx="8" ry="25" fill="#FFCCBC"/>
            <ellipse cx="38" cy="25" rx="5" ry="20" fill="#FFAB91"/>
            <!-- Easter Egg -->
            <ellipse cx="25" cy="55" rx="12" ry="15" fill="#E1BEE7"/>
            <path d="M15,50 Q25,45 35,50" stroke="#7B1FA2" stroke-width="3" fill="none"/>
            <path d="M15,55 Q25,60 35,55" stroke="#7B1FA2" stroke-width="3" fill="none"/>
            <circle cx="20" cy="52" r="2" fill="#FFEB3B"/>
            <circle cx="30" cy="58" r="2" fill="#4CAF50"/>
        </g>
    `,
    MID_AUTUMN: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Lantern -->
            <rect x="22" y="0" width="6" height="8" fill="#D84315"/>
            <ellipse cx="25" cy="30" rx="18" ry="22" fill="#FF5722"/>
            <ellipse cx="25" cy="30" rx="14" ry="18" fill="#FF7043"/>
            <!-- Lantern lines -->
            <line x1="25" y1="8" x2="25" y2="52" stroke="#BF360C" stroke-width="2"/>
            <path d="M10,20 Q25,15 40,20" stroke="#BF360C" stroke-width="1.5" fill="none"/>
            <path d="M10,40 Q25,45 40,40" stroke="#BF360C" stroke-width="1.5" fill="none"/>
            <!-- Glow effect -->
            <ellipse cx="25" cy="30" rx="10" ry="12" fill="#FFEB3B" opacity="0.3"/>
            <!-- Tassel -->
            <rect x="23" y="52" width="4" height="5" fill="#D84315"/>
            <line x1="22" y1="57" x2="22" y2="65" stroke="#FF5722" stroke-width="2"/>
            <line x1="25" y1="57" x2="25" y2="68" stroke="#FF5722" stroke-width="2"/>
            <line x1="28" y1="57" x2="28" y2="65" stroke="#FF5722" stroke-width="2"/>
        </g>
    `,
    DIWALI: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Diya (oil lamp) -->
            <ellipse cx="25" cy="45" rx="20" ry="8" fill="#8D6E63"/>
            <ellipse cx="25" cy="42" rx="16" ry="6" fill="#A1887F"/>
            <ellipse cx="25" cy="40" rx="12" ry="4" fill="#FFB300"/>
            <!-- Flame -->
            <ellipse cx="25" cy="30" rx="6" ry="12" fill="#FF9800"/>
            <ellipse cx="25" cy="28" rx="4" ry="8" fill="#FFEB3B"/>
            <ellipse cx="25" cy="26" rx="2" ry="5" fill="#FFFFFF"/>
            <!-- Sparkles around -->
            <circle cx="8" cy="20" r="2" fill="#FFD700">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="42" cy="25" r="2" fill="#FFD700">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="15" cy="55" r="1.5" fill="#FFD700">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="38" cy="50" r="1.5" fill="#FFD700">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="0.9s" repeatCount="indefinite"/>
            </circle>
        </g>
    `,
    THANKSGIVING: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Pilgrim Hat -->
            <ellipse cx="25" cy="50" rx="28" ry="6" fill="#212121"/>
            <rect x="8" y="20" width="34" height="30" rx="2" fill="#424242"/>
            <rect x="5" y="45" width="40" height="8" fill="#212121"/>
            <!-- Buckle -->
            <rect x="17" y="35" width="16" height="12" rx="1" fill="#FFD700"/>
            <rect x="20" y="38" width="10" height="6" fill="#424242"/>
        </g>
    `,
    HOLI: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Color powder splashes -->
            <circle cx="15" cy="20" r="12" fill="#E91E63" opacity="0.8"/>
            <circle cx="35" cy="15" r="10" fill="#2196F3" opacity="0.8"/>
            <circle cx="25" cy="35" r="14" fill="#FFEB3B" opacity="0.8"/>
            <circle cx="40" cy="40" r="8" fill="#4CAF50" opacity="0.8"/>
            <circle cx="10" cy="40" r="9" fill="#9C27B0" opacity="0.8"/>
            <!-- Powder particles -->
            <circle cx="20" cy="10" r="3" fill="#FF9800"/>
            <circle cx="45" cy="25" r="2" fill="#E91E63"/>
            <circle cx="5" cy="30" r="2" fill="#2196F3"/>
        </g>
    `,
    EID: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Crescent moon -->
            <circle cx="25" cy="25" r="18" fill="#1A237E"/>
            <circle cx="32" cy="20" r="14" fill="#0D1B2A"/>
            <!-- Star -->
            <polygon points="40,30 42,36 48,36 43,40 45,46 40,42 35,46 37,40 32,36 38,36" fill="#FFD700"/>
            <!-- Mosque silhouette -->
            <rect x="10" y="45" width="30" height="15" fill="#1A237E"/>
            <ellipse cx="25" cy="45" rx="10" ry="8" fill="#1A237E"/>
            <rect x="8" y="40" width="4" height="20" fill="#1A237E"/>
            <rect x="38" y="40" width="4" height="20" fill="#1A237E"/>
        </g>
    `,
    EARTH_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Earth Globe -->
            <circle cx="25" cy="25" r="22" fill="#4169E1"/>
            <ellipse cx="20" cy="18" rx="10" ry="6" fill="#228B22" transform="rotate(-20 20 18)"/>
            <ellipse cx="32" cy="30" rx="8" ry="10" fill="#228B22" transform="rotate(30 32 30)"/>
            <ellipse cx="15" cy="35" rx="5" ry="4" fill="#228B22"/>
            <!-- Leaf -->
            <ellipse cx="40" cy="5" rx="8" ry="12" fill="#32CD32" transform="rotate(30 40 5)"/>
        </g>
    `,
    LABOR_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Hard Hat -->
            <ellipse cx="25" cy="40" rx="28" ry="8" fill="#FFA000"/>
            <ellipse cx="25" cy="30" rx="24" ry="18" fill="#FFD700"/>
            <rect x="22" y="10" width="6" height="20" rx="3" fill="#FFC107"/>
            <ellipse cx="15" cy="25" rx="6" ry="8" fill="#FFEB3B" opacity="0.4"/>
        </g>
    `,
    PRIDE: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Rainbow stripes -->
            <rect x="0" y="15" width="50" height="5" fill="#E40303"/>
            <rect x="0" y="20" width="50" height="5" fill="#FF8C00"/>
            <rect x="0" y="25" width="50" height="5" fill="#FFED00"/>
            <rect x="0" y="30" width="50" height="5" fill="#008026"/>
            <rect x="0" y="35" width="50" height="5" fill="#004DFF"/>
            <rect x="0" y="40" width="50" height="5" fill="#750787"/>
            <!-- Crown spikes -->
            <polygon points="5,15 10,0 15,15" fill="#FFD700"/>
            <polygon points="20,15 25,-5 30,15" fill="#FFD700"/>
            <polygon points="35,15 40,0 45,15" fill="#FFD700"/>
        </g>
    `,
    HANUKKAH: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <!-- Menorah base -->
            <rect x="20" y="50" width="20" height="5" rx="2" fill="#FFD700"/>
            <rect x="25" y="40" width="10" height="12" fill="#FFD700"/>
            <!-- Center shamash -->
            <rect x="28" y="15" width="4" height="25" fill="#FFD700"/>
            <ellipse cx="30" cy="10" rx="4" ry="6" fill="#FF6347"/>
            <ellipse cx="30" cy="8" rx="2" ry="4" fill="#FFEB3B"/>
            <!-- Candles -->
            <rect x="10" y="25" width="3" height="15" fill="#87CEEB"/>
            <ellipse cx="11.5" cy="22" rx="2" ry="4" fill="#FF6347"/>
            <rect x="47" y="25" width="3" height="15" fill="#87CEEB"/>
            <ellipse cx="48.5" cy="22" rx="2" ry="4" fill="#FF6347"/>
            <!-- Arms -->
            <path d="M12,40 Q12,35 22,35 L38,35 Q48,35 48,40" stroke="#FFD700" stroke-width="3" fill="none"/>
        </g>
    `
};

const seasonalDemos = [
    { name: 'christmas', label: '🎅 CHRISTMAS', event: 'CHRISTMAS' },
    { name: 'newyear', label: '🎉 NEW YEAR', event: 'NEW_YEAR' },
    { name: 'valentine', label: '💕 VALENTINE', event: 'VALENTINE' },
    { name: 'halloween', label: '🎃 HALLOWEEN', event: 'HALLOWEEN' },
    { name: 'tet', label: '🧧 LUNAR NEW YEAR', event: 'LUNAR_NEW_YEAR' },
    { name: 'programmer', label: '☕ PROGRAMMER DAY', event: 'PROGRAMMER_DAY' },
    { name: 'womensday', label: '🌹 WOMENS DAY', event: 'WOMENS_DAY' },
    { name: 'mensday', label: '🎩 MENS DAY', event: 'MENS_DAY' },
    { name: 'friday13', label: '👻 FRIDAY 13TH', event: 'FRIDAY_13' },
    { name: 'aprilfools', label: '🤡 APRIL FOOLS', event: 'APRIL_FOOLS' },
    { name: 'stpatricks', label: '☘️ ST PATRICKS', event: 'ST_PATRICKS' },
    { name: 'nowruz', label: '🌸 NOWRUZ', event: 'NOWRUZ' },
    { name: 'easter', label: '🐰 EASTER', event: 'EASTER' },
    { name: 'midautumn', label: '🥮 MID AUTUMN', event: 'MID_AUTUMN' },
    { name: 'diwali', label: '🪔 DIWALI', event: 'DIWALI' },
    { name: 'thanksgiving', label: '🦃 THANKSGIVING', event: 'THANKSGIVING' }
];

seasonalDemos.forEach(({ name, label, event }) => {
    const petType = 'unicorn';
    const spriteSet = LEGENDARY_SPRITES[petType] || SPRITES['cat'];
    const spriteGrid = spriteSet['normal'];
    const baseColor = PET_COLORS[petType] || '#ffffff';

    const pixelSize = 16;
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    const svgWidth = width + 40;
    const svgHeight = height + 50;

    const pixelArt = renderPixelGrid(spriteGrid, baseColor, pixelSize);
    const themeBackground = getThemeBackground('minimal', svgWidth, svgHeight);

    // Calculate head position dynamically with pet-specific offset
    const headPos = calculateHeadPosition(spriteGrid, petType);
    const offset = RELATIVE_ACCESSORY_OFFSETS[event] || { x: 0, y: 0 };
    const accessoryX = headPos.x + offset.x;
    const accessoryY = headPos.y + offset.y;

    // Get accessory with dynamic position
    const accessoryFn = SEASONAL_ACCESSORIES_FN[event];
    const accessory = accessoryFn ? accessoryFn(accessoryX, accessoryY) : '';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g transform="translate(20, 20)">
        <g class="pet">${pixelArt}</g>
        ${accessory}
      </g>
      <text x="50%" y="${height + 40}" text-anchor="middle" font-family="monospace" font-size="10" fill="#666">${label}</text>
    </svg>`;

    fs.writeFileSync(`dist/seasonal_${name}.svg`, svg);
    console.log(`Generated seasonal_${name}.svg`);
});

// --- LEGENDARY PET DEMOS ---
{
    const legendaryDemos = [
        { name: 'mecha_rex', label: '🦖 MECHA-REX', color: '#2e7d32' },
        { name: 'hydra', label: '🐉 HYDRA', color: '#6a1b9a' },
        { name: 'void_spirit', label: '👻 VOID SPIRIT', color: '#311b92' },
        { name: 'cyber_golem', label: '🗿 CYBER GOLEM', color: '#37474f' },
        { name: 'unicorn', label: '🦄 UNICORN', color: '#ffffff' }
    ];

    legendaryDemos.forEach(({ name, label, color }) => {
        const spriteSet = LEGENDARY_SPRITES[name];
        if (!spriteSet) {
            console.log(`Skipping ${name} - sprite not found`);
            return;
        }
        const spriteGrid = spriteSet['normal'];
        const baseColor = color;

        const pixelSize = 16;
        const rows = spriteGrid.length;
        const cols = spriteGrid[0].length;
        const width = cols * pixelSize;
        const height = rows * pixelSize;
        const svgWidth = width + 40;
        const svgHeight = height + 50;

        const pixelArt = renderPixelGrid(spriteGrid, baseColor, pixelSize);
        const themeBackground = getThemeBackground('cyberpunk', svgWidth, svgHeight);

        // Bounce animation (same as normal pets)
        const animation = `
            <animateTransform 
                attributeName="transform" 
                type="translate" 
                values="0 0; 0 -8; 0 0" 
                dur="0.6s" 
                repeatCount="indefinite" 
            />`;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
          <style>.pet { transform-origin: center; }</style>
          ${themeBackground}
          <g transform="translate(20, 20)">
            <g class="pet">
              ${pixelArt}
              ${animation}
            </g>
          </g>
          <text x="50%" y="${height + 40}" text-anchor="middle" font-family="monospace" font-size="10" fill="#00ffff">${label}</text>
        </svg>`;

        fs.writeFileSync(`dist/legendary_${name}.svg`, svg);
        console.log(`Generated legendary_${name}.svg`);
    });
}

// --- MYTHICAL PET DEMOS ---
{
    const mythicalDemos = [
        { name: 'dragon', label: '🐉 DRAGON', color: '#b71c1c' },
        { name: 'thunderbird', label: '⚡ THUNDERBIRD', color: '#1565c0' },
        { name: 'kitsune', label: '🦊 KITSUNE', color: '#ff6f00' },
        { name: 'leviathan', label: '🌊 LEVIATHAN', color: '#004d40' },
        { name: 'celestial', label: '⭐ CELESTIAL', color: '#7c4dff' }
    ];

    mythicalDemos.forEach(({ name, label, color }) => {
        const spriteSet = MYTHICAL_SPRITES[name];
        if (!spriteSet) {
            console.log(`Skipping mythical ${name} - sprite not found`);
            return;
        }
        const spriteGrid = spriteSet['normal'];
        const baseColor = color;

        const pixelSize = 16;
        const rows = spriteGrid.length;
        const cols = spriteGrid[0].length;
        const width = cols * pixelSize;
        const height = rows * pixelSize;
        const svgWidth = width + 40;
        const svgHeight = height + 50;

        const pixelArt = renderPixelGrid(spriteGrid, baseColor, pixelSize);
        
        // Special mythical background with sparkles
        const mythicalBackground = `
            <defs>
                <radialGradient id="mythical_${name}" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:#0a0a1a;stop-opacity:1"/>
                </radialGradient>
            </defs>
            <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="url(#mythical_${name})" rx="12" ry="12"/>
            <g fill="#ffffff" opacity="0.6">
                <circle cx="${svgWidth * 0.1}" cy="${svgHeight * 0.2}" r="1.5">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="${svgWidth * 0.9}" cy="${svgHeight * 0.15}" r="1">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="${svgWidth * 0.8}" cy="${svgHeight * 0.8}" r="1.5">
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="${svgWidth * 0.15}" cy="${svgHeight * 0.75}" r="1">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite"/>
                </circle>
            </g>
        `;

        // Mythical float animation
        const animation = `
            <animateTransform 
                attributeName="transform" 
                type="translate" 
                values="0 0; 0 -6; 0 0" 
                dur="1.5s" 
                repeatCount="indefinite" 
            />`;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
          <style>.pet { transform-origin: center; }</style>
          ${mythicalBackground}
          <g transform="translate(20, 20)">
            <g class="pet">
              ${pixelArt}
              ${animation}
            </g>
          </g>
          <text x="50%" y="${height + 40}" text-anchor="middle" font-family="monospace" font-size="10" fill="${color}">${label}</text>
        </svg>`;

        fs.writeFileSync(`dist/mythical_${name}.svg`, svg);
        console.log(`Generated mythical_${name}.svg`);
    });
}

// --- WAVE 3 PETS DEMO ---
const wave3Pets = [
    { name: 'salamander', label: '🦎 Salamander (Zig)', color: '#f7a41d' },
    { name: 'hedgehog', label: '🦔 Hedgehog (Haskell)', color: '#5e5086' },
    { name: 'octopus', label: '🐙 Octopus (Clojure)', color: '#5881d8' },
    { name: 'ant', label: '🐜 Ant (Assembly)', color: '#4d4d4d' },
    { name: 'dino', label: '🦕 Dino (COBOL)', color: '#4b6c8c' },
    { name: 'lion', label: '🦁 Lion (Nim)', color: '#ffe953' }
];

wave3Pets.forEach(({ name, label, color }) => {
    const spriteSet = SPRITES[name];
    if (!spriteSet) {
        console.log(`Skipping ${name} - no sprite found`);
        return;
    }
    
    const spriteGrid = spriteSet['normal'];
    const pixelSize = 16;
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    const svgWidth = width + 40;
    const svgHeight = height + 50;

    const pixelArt = renderPixelGrid(spriteGrid, color, pixelSize);
    const themeBackground = getThemeBackground('minimal', svgWidth, svgHeight);

    const animation = `<animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="0.5s" repeatCount="indefinite" />`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g transform="translate(20, 20)">
        <g class="pet">${pixelArt}${animation}</g>
      </g>
      <text x="50%" y="${height + 40}" text-anchor="middle" font-family="monospace" font-size="9" fill="#666">${label}</text>
    </svg>`;

    fs.writeFileSync(`dist/wave3_${name}.svg`, svg);
    console.log(`Generated wave3_${name}.svg`);
});

// --- NEW HOLIDAYS DEMO ---
const newHolidayAccessories = {
    PI_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <path d="M25,30 L45,30 A20,20 0 0,0 25,10 Z" fill="#8B4513"/>
            <path d="M25,30 L43,28 A18,18 0 0,0 25,12 Z" fill="#FFA726"/>
            <path d="M25,30 L45,30 A20,20 0 0,0 25,10" stroke="#D2691E" stroke-width="3" fill="none"/>
            <text x="15" y="25" font-family="serif" font-size="24" font-weight="bold" fill="#1565C0">π</text>
            <circle cx="35" cy="22" r="4" fill="#FFFAF0"/>
        </g>
    `,
    STAR_WARS: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <rect x="22" y="40" width="8" height="20" rx="2" fill="#424242"/>
            <rect x="20" y="55" width="12" height="5" rx="2" fill="#616161"/>
            <circle cx="26" cy="50" r="2" fill="#F44336"/>
            <rect x="23" y="5" width="6" height="35" rx="3" fill="#4FC3F7">
                <animate attributeName="opacity" values="0.9;1;0.9" dur="0.1s" repeatCount="indefinite"/>
            </rect>
            <rect x="24" y="7" width="4" height="31" rx="2" fill="#FFFFFF"/>
        </g>
    `,
    PIRATE_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <ellipse cx="25" cy="45" rx="30" ry="8" fill="#212121"/>
            <path d="M5,45 Q5,20 25,15 Q45,20 45,45" fill="#212121"/>
            <circle cx="25" cy="32" r="8" fill="#FFFDE7"/>
            <circle cx="22" cy="30" r="2" fill="#212121"/>
            <circle cx="28" cy="30" r="2" fill="#212121"/>
            <line x1="15" y1="38" x2="35" y2="44" stroke="#FFFDE7" stroke-width="3"/>
            <line x1="35" y1="38" x2="15" y2="44" stroke="#FFFDE7" stroke-width="3"/>
            <path d="M5,45 Q25,38 45,45" stroke="#FFD700" stroke-width="2" fill="none"/>
        </g>
    `,
    SINGLES_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <rect x="10" y="20" width="35" height="35" rx="3" fill="#FF5722"/>
            <path d="M18,20 Q18,10 27.5,10 Q37,10 37,20" stroke="#D84315" stroke-width="4" fill="none"/>
            <text x="15" y="42" font-family="Arial" font-size="12" font-weight="bold" fill="#FFFFFF">11.11</text>
            <polygon points="45,15 47,20 52,20 48,24 50,29 45,26 40,29 42,24 38,20 43,20" fill="#FFD700">
                <animate attributeName="transform" values="rotate(0 45 22);rotate(360 45 22)" dur="4s" repeatCount="indefinite"/>
            </polygon>
        </g>
    `,
    SYSADMIN_DAY: (x, y) => `
        <g transform="translate(${x}, ${y})">
            <rect x="10" y="10" width="35" height="45" rx="3" fill="#37474F"/>
            <rect x="13" y="15" width="29" height="8" fill="#263238"/>
            <rect x="13" y="26" width="29" height="8" fill="#263238"/>
            <rect x="13" y="37" width="29" height="8" fill="#263238"/>
            <circle cx="17" cy="19" r="2" fill="#4CAF50">
                <animate attributeName="fill" values="#4CAF50;#8BC34A;#4CAF50" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="17" cy="30" r="2" fill="#4CAF50"/>
            <circle cx="17" cy="41" r="2" fill="#FF9800"/>
            <rect x="48" y="40" width="10" height="12" rx="2" fill="#795548"/>
        </g>
    `
};

const newHolidays = [
    { name: 'pi_day', label: '🥧 Pi Day (Mar 14)', event: 'PI_DAY' },
    { name: 'star_wars', label: '⚔️ Star Wars Day (May 4)', event: 'STAR_WARS' },
    { name: 'pirate_day', label: '🏴‍☠️ Pirate Day (Sep 19)', event: 'PIRATE_DAY' },
    { name: 'singles_day', label: '🛒 Singles Day (Nov 11)', event: 'SINGLES_DAY' },
    { name: 'sysadmin_day', label: '🖥️ SysAdmin Day (Jul)', event: 'SYSADMIN_DAY' }
];

newHolidays.forEach(({ name, label, event }) => {
    const spriteSet = SPRITES['cat'];
    const spriteGrid = spriteSet['normal'];
    const petColor = PET_COLORS['cat'];
    const petType = 'cat';
    
    const pixelSize = 16;
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    const svgWidth = width + 80;
    const svgHeight = height + 60;

    const pixelArt = renderPixelGrid(spriteGrid, petColor, pixelSize);
    const themeBackground = getThemeBackground('minimal', svgWidth, svgHeight);
    
    const headPos = calculateHeadPosition(spriteGrid, petType);
    const accessoryOffset = { x: -10, y: -40 };
    const accessoryX = headPos.x + accessoryOffset.x;
    const accessoryY = headPos.y + accessoryOffset.y;
    const accessorySvg = newHolidayAccessories[event](accessoryX, accessoryY);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g transform="translate(30, 30)">
        <g class="pet">${pixelArt}</g>
        ${accessorySvg}
      </g>
      <text x="50%" y="${height + 52}" text-anchor="middle" font-family="monospace" font-size="9" fill="#666">${label}</text>
    </svg>`;

    fs.writeFileSync(`dist/holiday_${name}.svg`, svg);
    console.log(`Generated holiday_${name}.svg`);
});

// --- ACHIEVEMENT BADGE DEMOS ---
const ACHIEVEMENTS = {
    FIRST_COMMIT: { icon: '🌱', name: 'First Sprout', desc: 'First commit ever' },
    COMMIT_100: { icon: '💯', name: 'Centurion', desc: '100 commits' },
    COMMIT_1000: { icon: '🏆', name: 'Git Master', desc: '1,000 commits' },
    STREAK_7: { icon: '🔥', name: 'Weekly Warrior', desc: '7 day streak' },
    STREAK_30: { icon: '🌙', name: 'Month Master', desc: '30 day streak' },
    LEVEL_10: { icon: '✨', name: 'Shining', desc: 'Level 10' },
    NIGHT_OWL: { icon: '🦉', name: 'Night Owl', desc: 'Late night commit' },
    POLYGLOT: { icon: '🌐', name: 'Polyglot', desc: 'Used 5+ languages' }
};

function generateAchievementBadges(achievements, maxShow = 6) {
    if (!achievements || achievements.length === 0) return '';
    
    const toShow = achievements.slice(-maxShow);
    const badgeWidth = 22;
    const startX = 5;
    
    const badges = toShow.map((ach, i) => {
        const x = startX + (i * (badgeWidth + 3));
        return `
            <g transform="translate(${x}, 0)">
                <title>${ach.name}: ${ach.desc}</title>
                <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.9)" stroke="#ddd" stroke-width="1"/>
                <text x="10" y="14" text-anchor="middle" font-size="11">${ach.icon}</text>
            </g>
        `;
    }).join('');
    
    const moreCount = achievements.length - toShow.length;
    const moreText = moreCount > 0 ? 
        `<text x="${startX + toShow.length * (badgeWidth + 3) + 5}" y="14" font-family="monospace" font-size="9" fill="#666">+${moreCount}</text>` : '';
    
    return `<g class="achievements">${badges}${moreText}</g>`;
}

// Generate achievement demo
(() => {
    const spriteSet = LEGENDARY_SPRITES['unicorn'] || SPRITES['cat'];
    const spriteGrid = spriteSet['normal'];
    const baseColor = PET_COLORS['unicorn'] || '#e5c07b';

    const pixelSize = 16;
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    const svgWidth = width + 40;
    const svgHeight = height + 70;

    const pixelArt = renderPixelGrid(spriteGrid, baseColor, pixelSize);
    const themeBackground = getThemeBackground('minimal', svgWidth, svgHeight);
    
    // Demo achievements
    const demoAchievements = [
        ACHIEVEMENTS.FIRST_COMMIT,
        ACHIEVEMENTS.COMMIT_100,
        ACHIEVEMENTS.STREAK_7,
        ACHIEVEMENTS.LEVEL_10,
        ACHIEVEMENTS.NIGHT_OWL,
        ACHIEVEMENTS.POLYGLOT
    ];
    
    const achievementBadges = generateAchievementBadges(demoAchievements);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g transform="translate(20, 20)">
        <g class="pet">${pixelArt}</g>
      </g>
      <text x="50%" y="${height + 38}" text-anchor="middle" font-family="monospace" font-size="11" fill="#666">🏅 ACHIEVEMENTS</text>
      <g transform="translate(15, ${height + 45})">
        ${achievementBadges}
      </g>
    </svg>`;

    fs.writeFileSync(`dist/achievements_demo.svg`, svg);
    console.log(`Generated achievements_demo.svg`);
})();

// Evolution Effects Generator
function getEvolutionEffects(evolutionStage, isCloseToEvolution, centerX, centerY) {
    let effects = '';
    
    const auraColors = {
        'egg': 'none',
        'baby': 'none',
        'juvenile': '#4CAF50',
        'adult': '#FFD700',
        'master': '#9C27B0',
        'legendary': '#FF6B35',
        'mythical': '#00FFFF'
    };
    
    const auraColor = auraColors[evolutionStage] || 'none';
    
    if (auraColor !== 'none') {
        const auraSize = {
            'juvenile': 35,
            'adult': 45,
            'master': 55,
            'legendary': 65,
            'mythical': 80
        }[evolutionStage] || 40;
        
        effects += `
            <defs>
                <radialGradient id="evolutionAura-${evolutionStage}">
                    <stop offset="0%" stop-color="${auraColor}" stop-opacity="0.6"/>
                    <stop offset="70%" stop-color="${auraColor}" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="${auraColor}" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <circle cx="${centerX}" cy="${centerY}" r="${auraSize}" fill="url(#evolutionAura-${evolutionStage})">
                <animate attributeName="r" values="${auraSize};${auraSize + 8};${auraSize}" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
            </circle>
        `;
    }
    
    if (['master', 'legendary', 'mythical'].includes(evolutionStage)) {
        const sparkleCount = evolutionStage === 'mythical' ? 8 : evolutionStage === 'legendary' ? 6 : 4;
        const sparkleColor = evolutionStage === 'mythical' ? '#FFFFFF' : evolutionStage === 'legendary' ? '#FFD700' : '#E0E0E0';
        
        effects += `<g class="evolution-sparkles">`;
        for (let i = 0; i < sparkleCount; i++) {
            const angle = (i / sparkleCount) * Math.PI * 2;
            const radius = 40 + (evolutionStage === 'mythical' ? 20 : 10);
            const sx = centerX + Math.cos(angle) * radius;
            const sy = centerY + Math.sin(angle) * radius;
            const delay = (i * 0.5) % 3;
            
            effects += `
                <circle cx="${sx}" cy="${sy}" r="2" fill="${sparkleColor}">
                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="${delay}s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="1;3;1" dur="1.5s" begin="${delay}s" repeatCount="indefinite"/>
                </circle>
            `;
        }
        effects += `</g>`;
    }
    
    if (isCloseToEvolution) {
        effects += `
            <circle cx="${centerX}" cy="${centerY}" r="50" fill="none" stroke="#FFD700" stroke-width="2" stroke-dasharray="8,4">
                <animate attributeName="r" values="45;55;45" dur="1s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
            </circle>
            <text x="${centerX}" y="${centerY - 60}" fill="#FFD700" font-size="10" text-anchor="middle" font-weight="bold">
                ✨ Evolution Ready! ✨
                <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite"/>
            </text>
        `;
    }
    
    if (evolutionStage === 'mythical') {
        const runes = ['⚡', '★', '◆', '✧', '○', '△'];
        effects += `<g class="mythical-runes">`;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const rx = centerX + Math.cos(angle) * 60;
            const ry = centerY + Math.sin(angle) * 60;
            const delay = i * 0.3;
            
            effects += `
                <text x="${rx}" y="${ry}" fill="#00FFFF" font-size="8" text-anchor="middle" opacity="0.8">
                    ${runes[i]}
                    <animateTransform attributeName="transform" type="rotate"
                        values="0 ${rx} ${ry}; 360 ${rx} ${ry}" dur="10s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
                </text>
            `;
        }
        effects += `</g>`;
    }
    
    return effects;
}

// Generate Evolution Demo
(() => {
    console.log('Generating evolution demos...');
    
    const evolutionStages = [
        { stage: 'egg', icon: '🥚', name: 'Egg', level: 3, scale: 0.7, color: '#ccc' },
        { stage: 'baby', icon: '🐣', name: 'Baby', level: 10, scale: 0.85, color: '#98c379' },
        { stage: 'juvenile', icon: '🌱', name: 'Juvenile', level: 25, scale: 0.95, color: '#4CAF50' },
        { stage: 'adult', icon: '⭐', name: 'Adult', level: 45, scale: 1.0, color: '#FFD700' },
        { stage: 'master', icon: '💫', name: 'Master', level: 65, scale: 1.05, color: '#9C27B0' },
        { stage: 'legendary', icon: '👑', name: 'Legendary', level: 85, scale: 1.1, color: '#FF6B35' },
        { stage: 'mythical', icon: '🌟', name: 'Mythical', level: 100, scale: 1.15, color: '#00FFFF' }
    ];
    
    evolutionStages.forEach(evo => {
        const spriteSet = SPRITES['cat'];
        const spriteGrid = spriteSet['normal'];
        const baseColor = evo.color;
        
        const pixelSize = 16;
        const rows = spriteGrid.length;
        const cols = spriteGrid[0].length;
        const width = cols * pixelSize;
        const height = rows * pixelSize;
        const svgWidth = width + 60;
        const svgHeight = height + 80;
        
        const centerX = svgWidth / 2;
        const centerY = height / 2 + 20;
        
        const pixelArt = renderPixelGrid(spriteGrid, baseColor, pixelSize);
        const themeBackground = getThemeBackground('minimal', svgWidth, svgHeight);
        const evolutionEffects = getEvolutionEffects(evo.stage, false, centerX, centerY);
        
        const scaleOffset = ((1 - evo.scale) * width) / 2;
        const petTransform = evo.scale !== 1 
            ? `translate(${30 + scaleOffset}, ${20 + scaleOffset}) scale(${evo.scale})`
            : 'translate(30, 20)';
        
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g class="evolution-layer" style="pointer-events: none;">
        ${evolutionEffects}
      </g>
      <g transform="${petTransform}">
        <g class="pet">${pixelArt}</g>
      </g>
      <text x="50%" y="${height + 40}" text-anchor="middle" font-family="monospace" font-size="12" fill="#333">
        ${evo.icon} Lv.${evo.level} ${evo.name}
      </text>
      <text x="50%" y="${height + 55}" text-anchor="middle" font-family="monospace" font-size="10" fill="#666">
        Scale: ${(evo.scale * 100).toFixed(0)}%
      </text>
    </svg>`;
        
        fs.writeFileSync(`dist/evolution_${evo.stage}.svg`, svg);
        console.log(`Generated evolution_${evo.stage}.svg`);
    });
    
    // Generate "About to Evolve" demo
    const spriteSet = SPRITES['cat'];
    const spriteGrid = spriteSet['normal'];
    const pixelSize = 16;
    const rows = spriteGrid.length;
    const cols = spriteGrid[0].length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    const svgWidth = width + 60;
    const svgHeight = height + 100;
    
    const centerX = svgWidth / 2;
    const centerY = height / 2 + 20;
    
    const pixelArt = renderPixelGrid(spriteGrid, '#FFD700', pixelSize);
    const themeBackground = getThemeBackground('minimal', svgWidth, svgHeight);
    const evolutionEffects = getEvolutionEffects('adult', true, centerX, centerY);
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>.pet { transform-origin: center; }</style>
      ${themeBackground}
      <g class="evolution-layer" style="pointer-events: none;">
        ${evolutionEffects}
      </g>
      <g transform="translate(30, 20)">
        <g class="pet">${pixelArt}</g>
      </g>
      <text x="50%" y="${height + 50}" text-anchor="middle" font-family="monospace" font-size="12" fill="#333">
        ⭐ Lv.49 Adult
      </text>
      <text x="50%" y="${height + 65}" text-anchor="middle" font-family="monospace" font-size="10" fill="#FF9800">
        Almost Master! (Lv.50)
      </text>
    </svg>`;
    
    fs.writeFileSync(`dist/evolution_ready.svg`, svg);
    console.log(`Generated evolution_ready.svg`);
})();

console.log('Done!');
