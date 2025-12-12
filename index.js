const core = require('@actions/core');
const github = require('@actions/github');

// --- PIXEL ART ASSETS ---

// 12x12 Grid System
// 0: Transparent
// 1: Outline (Dark)
// 2: White (Eyes/Highlights)
// 3: Primary
// 4: Secondary
// 5: Accent

const PALETTE = {
  0: null,
  1: '#24292e', // Dark Grey (Outline)
  2: '#ffffff', // White
  3: '#e06c75', // Red
  4: '#98c379', // Green
  5: '#e5c07b', // Yellow
  6: '#61afef', // Blue
  7: '#c678dd', // Purple
  8: '#56b6c2', // Cyan
  9: '#d19a66', // Orange
  10: '#abb2bf', // Grey
  11: '#8b4513', // Brown
};

const SPRITES = {
  // Rust: Crab (Red)
  crab: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 3, 1, 0, 0, 0, 0, 1, 3, 1, 0],
    [0, 1, 3, 3, 1, 0, 0, 1, 3, 3, 1, 0],
    [0, 0, 1, 3, 3, 1, 1, 3, 3, 1, 0, 0],
    [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
    [1, 3, 3, 2, 1, 3, 3, 2, 1, 3, 3, 1],
    [1, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1],
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    [0, 1, 3, 1, 3, 3, 3, 3, 1, 3, 1, 0],
    [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // PHP: Elephant (Blue)
  elephant: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 6, 6, 6, 6, 6, 1, 0, 0],
    [0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 1, 0],
    [0, 1, 6, 6, 6, 2, 1, 6, 2, 1, 6, 1],
    [1, 6, 6, 6, 6, 1, 1, 6, 1, 1, 6, 1],
    [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1],
    [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0],
    [0, 1, 6, 6, 1, 6, 6, 1, 6, 6, 1, 0],
    [0, 1, 6, 6, 1, 0, 0, 1, 6, 6, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Java: Coffee (Brown)
  coffee: [
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 11, 11, 11, 11, 11, 11, 1, 0, 0],
    [0, 1, 11, 11, 11, 11, 11, 11, 1, 1, 0],
    [0, 1, 11, 2, 2, 11, 11, 11, 1, 0, 1],
    [0, 1, 11, 11, 11, 11, 11, 11, 1, 1, 0],
    [0, 0, 1, 11, 11, 11, 11, 11, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Swift: Bird (Orange)
  bird: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 9, 9, 9, 9, 1, 0],
    [0, 0, 1, 0, 1, 9, 2, 1, 9, 9, 1, 0],
    [0, 1, 9, 1, 9, 9, 1, 1, 9, 9, 1, 0],
    [1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 0],
    [1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 0, 0],
    [0, 1, 9, 9, 9, 9, 9, 9, 1, 0, 0, 0],
    [0, 0, 1, 9, 9, 9, 9, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 9, 9, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // C++/C#: Robot (Grey)
  robot: [
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 10, 10, 10, 10, 10, 10, 10, 1, 0],
    [1, 10, 2, 2, 10, 10, 2, 2, 10, 1],
    [1, 10, 2, 1, 10, 10, 2, 1, 10, 1],
    [1, 10, 10, 10, 10, 10, 10, 10, 10, 1],
    [1, 10, 1, 1, 1, 1, 1, 1, 10, 1],
    [1, 10, 1, 3, 3, 3, 3, 1, 10, 1],
    [0, 1, 10, 1, 1, 1, 1, 10, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Shell/Docker: Whale (Blue)
  whale: [
    [0, 0, 0, 0, 0, 0, 0, 8, 0, 8, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 8, 1, 8, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 6, 6, 6, 6, 6, 6, 1],
    [0, 0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 1],
    [0, 1, 1, 6, 6, 2, 1, 6, 6, 6, 6, 1],
    [1, 6, 6, 6, 6, 1, 1, 6, 6, 6, 6, 1],
    [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1],
    [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0],
    [0, 1, 1, 6, 6, 6, 6, 6, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Ruby: Gem (Red)
  gem: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0],
    [0, 0, 1, 3, 2, 3, 3, 3, 3, 1, 0, 0],
    [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
    [0, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 0],
    [0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // HTML/CSS: Chameleon (Green)
  chameleon: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 4, 4, 4, 4, 1, 0, 0],
    [0, 0, 0, 1, 4, 4, 2, 1, 4, 4, 1, 0],
    [0, 0, 1, 4, 4, 4, 1, 1, 4, 4, 1, 0],
    [0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0],
    [1, 4, 4, 4, 3, 3, 4, 4, 4, 4, 1, 0],
    [1, 4, 4, 4, 3, 3, 4, 4, 4, 1, 0, 0],
    [0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // JS/TS: Spider (Yellow/Black)
  spider: [
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 5, 5, 5, 1, 1, 0, 0, 0],
    [0, 1, 1, 5, 2, 1, 2, 5, 1, 1, 0, 0],
    [1, 0, 1, 5, 5, 5, 5, 5, 1, 0, 1, 0],
    [0, 0, 1, 1, 5, 5, 5, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Python: Snake (Green/Yellow)
  snake: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 6, 6, 6, 1, 0, 0, 0],
    [0, 0, 0, 1, 6, 2, 1, 6, 6, 1, 0, 0],
    [0, 0, 0, 1, 6, 6, 6, 6, 6, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 6, 6, 1, 0, 0, 0],
    [0, 0, 0, 1, 5, 5, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 5, 5, 5, 5, 1, 0, 0, 0, 0],
    [0, 1, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0],
    [0, 1, 5, 5, 1, 1, 5, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Go: Gopher (Blue/Cyan)
  gopher: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 8, 8, 8, 8, 1, 0, 0, 0],
    [0, 0, 1, 8, 2, 1, 2, 8, 8, 1, 0, 0],
    [0, 0, 1, 8, 1, 1, 1, 8, 8, 1, 0, 0],
    [0, 0, 1, 8, 8, 2, 2, 8, 8, 1, 0, 0],
    [0, 1, 8, 8, 8, 2, 2, 8, 8, 8, 1, 0],
    [1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
    [1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
    [0, 1, 8, 8, 8, 8, 8, 8, 8, 8, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Default: Cat (Orange/Tabby)
  cat: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 5, 1, 0, 0, 0, 0, 1, 5, 1, 0],
    [0, 1, 5, 5, 1, 1, 1, 1, 5, 5, 1, 0],
    [0, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0],
    [0, 1, 5, 2, 1, 5, 5, 2, 1, 5, 1, 0],
    [0, 1, 5, 1, 1, 5, 5, 1, 1, 5, 1, 0],
    [0, 1, 5, 5, 5, 3, 3, 5, 5, 5, 1, 0],
    [0, 0, 1, 5, 5, 5, 5, 5, 5, 1, 0, 0],
    [0, 0, 1, 5, 1, 1, 1, 1, 5, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
};

// --- CORE LOGIC ---

async function run() {
  try {
    const token = core.getInput('github_token');
    const username = core.getInput('username');
    const octokit = github.getOctokit(token);

    // 1. Fetch User Activity
    const events = await octokit.rest.activity.listPublicEventsForRepoNetwork({
      username: username,
      per_page: 100,
    });

    // 2. Determine State (Mood)
    const lastEvent = events.data[0];
    const lastEventDate = lastEvent ? new Date(lastEvent.created_at) : new Date(0);
    const now = new Date();
    const hoursSinceLastEvent = (now - lastEventDate) / (1000 * 60 * 60);

    let mood = 'sleeping';
    if (hoursSinceLastEvent < 24) mood = 'happy';
    if (hoursSinceLastEvent > 168) mood = 'ghost'; // 7 days

    // 3. Determine Pet Type (Species)
    const repos = await octokit.rest.repos.listForUser({
      username: username,
      sort: 'updated',
      per_page: 10,
    });

    const languages = {};
    repos.data.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguage = Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b, 'Unknown');
    const petType = getPetType(topLanguage);

    console.log(`User: ${username}, Mood: ${mood}, Type: ${petType} (${topLanguage})`);

    // 4. Generate SVG
    const svgContent = generateSVG(petType, mood);

    // 5. Write to File
    const fs = require('fs');
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    fs.writeFileSync('dist/pet.svg', svgContent);
    console.log('Generated dist/pet.svg');

  } catch (error) {
    core.setFailed(error.message);
  }
}

function getPetType(language) {
  const map = {
    'JavaScript': 'spider',
    'TypeScript': 'spider',
    'Python': 'snake',
    'Go': 'gopher',
    'Rust': 'crab',
    'PHP': 'elephant',
    'Java': 'coffee',
    'Swift': 'bird',
    'C++': 'robot',
    'C#': 'robot',
    'Shell': 'whale',
    'Dockerfile': 'whale',
    'Ruby': 'gem',
    'HTML': 'chameleon',
    'CSS': 'chameleon',
  };
  return map[language] || 'cat';
}

function renderPixelGrid(grid, pixelSize = 10) {
  let rects = '';
  grid.forEach((row, y) => {
    row.forEach((colorId, x) => {
      if (colorId !== 0 && PALETTE[colorId]) {
        const color = PALETTE[colorId];
        rects += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
      }
    });
  });
  return rects;
}

function generateSVG(petType, mood) {
  const sprite = SPRITES[petType] || SPRITES['cat'];

  // Modify sprite for mood if needed (e.g., close eyes for sleeping)
  let renderSprite = JSON.parse(JSON.stringify(sprite)); // Deep copy

  if (mood === 'sleeping') {
    // Simple logic: replace eye pixels (color 2) with eyelids (color 1 or 3)
    // Or just hardcode some changes. For now, let's just turn white eyes (2) to closed (1)
    renderSprite = renderSprite.map(row => row.map(cell => cell === 2 ? 1 : cell));
  }

  if (mood === 'ghost') {
    // Turn everything into a ghost style? Or just make it transparent/grey?
    // Let's just use the robot palette (grey) for everything except outline
    renderSprite = renderSprite.map(row => row.map(cell => {
      if (cell === 1) return 1; // Keep outline
      if (cell === 0) return 0;
      return 10; // Turn everything else grey
    }));
  }

  const pixelSize = 16; // Bigger pixels for better visibility
  const width = 12 * pixelSize;
  const height = 12 * pixelSize;

  const pixelArt = renderPixelGrid(renderSprite, pixelSize);

  // Add some animation or background
  let animation = '';
  if (mood === 'happy') {
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0 0; 0 -4; 0 0" 
            dur="0.5s" 
            repeatCount="indefinite" 
        />`;
  } else if (mood === 'sleeping') {
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="scale" 
            values="1 1; 1.02 0.98; 1 1" 
            dur="2s" 
            repeatCount="indefinite" 
        />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width + 40}" height="${height + 40}" viewBox="0 0 ${width + 40} ${height + 40}">
      <style>
        .pet { transform-origin: center; }
      </style>
      <rect width="100%" height="100%" fill="transparent" />
      <g transform="translate(20, 20)">
        <g class="pet">
            ${pixelArt}
            ${animation}
        </g>
      </g>
      
      <!-- Mood Status Text -->
      <text x="50%" y="${height + 35}" text-anchor="middle" font-family="monospace" font-size="12" fill="#666">
        ${mood.toUpperCase()}
      </text>
    </svg>`;
}

run();
