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

// Extract LEGENDARY_SPRITES
const legendarySpritesMatch = indexContent.match(/const LEGENDARY_SPRITES = ({[\s\S]*?});\s*\nconst SPRITES/);
const LEGENDARY_SPRITES = legendarySpritesMatch ? eval('(' + legendarySpritesMatch[1] + ')') : {};

// Extract LEGENDARY_COLORS
const legendaryColorsMatch = indexContent.match(/const LEGENDARY_COLORS = ({[\s\S]*?});/);
const LEGENDARY_COLORS = legendaryColorsMatch ? eval('(' + legendaryColorsMatch[1] + ')') : {};

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
    // Theme demos use generateSVG which checks LEGENDARY_SPRITES first, so this is fine.
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
    APRIL_FOOLS: { x: -30, y: -45 }
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
    { name: 'aprilfools', label: '🤡 APRIL FOOLS', event: 'APRIL_FOOLS' }
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

console.log('Done!');
