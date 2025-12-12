const fs = require('fs');
const path = require('path');

// Mock GitHub Actions Core
const core = {
    getInput: (name) => {
        if (name === 'github_token') return 'mock_token';
        if (name === 'username') return 'ThanhNguyxn';
        return '';
    },
    setFailed: (msg) => console.error('FAILED:', msg),
};

// Mock GitHub API
const github = {
    getOctokit: (token) => ({
        rest: {
            activity: {
                listPublicEventsForRepoNetwork: async () => ({
                    data: [{ created_at: new Date().toISOString() }] // Happy state
                })
            },
            repos: {
                listForUser: async () => ({
                    data: [] // We will mock the language logic inside the loop if needed, 
                    // but actually index.js logic is hardcoded to call the API.
                    // We need to intercept the logic or just copy the render function here.
                })
            }
        }
    })
};

// To test all sprites without mocking the entire API for each call, 
// let's just extract the render logic or mock the `getPetType` result.
// Since we can't easily export/import from index.js (it runs on load), 
// we will just copy the sprite data and render logic here for verification.
// This ensures the ASSETS are correct.

// --- COPY OF ASSETS FROM INDEX.JS ---
const PALETTE = {
    0: null,
    1: '#24292e', 2: '#ffffff', 3: '#e06c75', 4: '#98c379',
    5: '#e5c07b', 6: '#61afef', 7: '#c678dd', 8: '#56b6c2',
    9: '#d19a66', 10: '#abb2bf', 11: '#8b4513'
};

// (Paste the same SPRITES object here - I will read it from index.js to be sure)
// Actually, let's just read index.js and eval the SPRITES object to ensure we test the ACTUAL code.
const indexContent = fs.readFileSync('index.js', 'utf8');
const spritesMatch = indexContent.match(/const SPRITES = ({[\s\S]*?});/);
const paletteMatch = indexContent.match(/const PALETTE = ({[\s\S]*?});/);

if (!spritesMatch || !paletteMatch) {
    console.error("Could not parse SPRITES or PALETTE from index.js");
    process.exit(1);
}

const SPRITES = eval('(' + spritesMatch[1] + ')');
const PALETTE_DATA = eval('(' + paletteMatch[1] + ')'); // Rename to avoid conflict if I declared it

function renderPixelGrid(grid, pixelSize = 10) {
    let rects = '';
    grid.forEach((row, y) => {
        row.forEach((colorId, x) => {
            if (colorId !== 0 && PALETTE_DATA[colorId]) {
                const color = PALETTE_DATA[colorId];
                rects += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
            }
        });
    });
    return rects;
}

function generateSVG(petType, mood) {
    const sprite = SPRITES[petType] || SPRITES['cat'];
    let renderSprite = JSON.parse(JSON.stringify(sprite));

    if (mood === 'sleeping') {
        renderSprite = renderSprite.map(row => row.map(cell => cell === 2 ? 1 : cell));
    }

    if (mood === 'ghost') {
        renderSprite = renderSprite.map(row => row.map(cell => {
            if (cell === 1) return 1;
            if (cell === 0) return 0;
            return 10;
        }));
    }

    const pixelSize = 16;
    const width = 12 * pixelSize;
    const height = 12 * pixelSize;
    const pixelArt = renderPixelGrid(renderSprite, pixelSize);

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="transparent" />
      <g>${pixelArt}</g>
    </svg>`;
}

// Generate all
if (!fs.existsSync('dist')) fs.mkdirSync('dist');

const pets = Object.keys(SPRITES);
let htmlContent = '<html><body style="background:#333; display:flex; flex-wrap:wrap; gap:20px;">';

pets.forEach(pet => {
    const svg = generateSVG(pet, 'happy');
    fs.writeFileSync(`dist/${pet}.svg`, svg);
    htmlContent += `<div style="text-align:center; color:white;">
        <img src="${pet}.svg" width="100" height="100" style="image-rendering: pixelated; border:1px solid #555; padding:10px;">
        <br>${pet}
    </div>`;
    console.log(`Generated dist/${pet}.svg`);
});

// Add mood variants for one pet
['sleeping', 'ghost'].forEach(mood => {
    const svg = generateSVG('crab', mood);
    fs.writeFileSync(`dist/crab_${mood}.svg`, svg);
    htmlContent += `<div style="text-align:center; color:white;">
        <img src="crab_${mood}.svg" width="100" height="100" style="image-rendering: pixelated; border:1px solid #555; padding:10px;">
        <br>crab (${mood})
    </div>`;
});

htmlContent += '</body></html>';
fs.writeFileSync('dist/gallery.html', htmlContent);
console.log('Generated dist/gallery.html');
