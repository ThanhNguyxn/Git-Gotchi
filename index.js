const core = require('@actions/core');
const github = require('@actions/github');

// --- PIXEL ART ASSETS (MULTI-COLOR) ---

// Legend:
// ' ': Transparent
// 'X': Base Color (Dynamic)
// 'W': White (#FFFFFF)
// 'K': Black (#2d333b) - Outline
// 'O': Orange (#FF9F00)
// 'R': Red (#FF0000)
// 'Y': Yellow (#FFD700)
// 'B': Blue (#00ADD8)
// 'P': Purple (#C678DD)

const PET_COLORS = {
  spider: '#e5c07b', // Yellow
  snake: '#98c379',  // Green
  gopher: '#61afef', // Blue
  crab: '#e06c75',   // Red
  elephant: '#61afef', // Blue
  coffee: '#8b4513', // Brown
  bird: '#d19a66',   // Orange
  robot: '#abb2bf',  // Grey
  whale: '#61afef',  // Blue
  gem: '#e06c75',    // Red
  chameleon: '#98c379', // Green
  cat: '#e5c07b',    // Yellow/Orange
  tux: '#2d333b',    // Black (Base for Tux is technically black, but we use K for black, so X can be ignored or used for shading)
  unicorn: '#ffffff' // White
};

const SPRITES = {
  crab: [
    "            ",
    "  K      K  ",
    " KXK    KXK ",
    " KXXK  KXXK ",
    "  KXXKKXXK  ",
    " KXXXXXXXXK ",
    "KXXW KXXW K ",
    "KXXK KXXK K ",
    "KXXXXXXXXXK ",
    " KX KXXX K  ",
    "  K KKKK K  ",
    "            "
  ],
  elephant: [
    "            ",
    "    KKKKK   ",
    "   KXXXXXK  ",
    "  KXXXXXXXK ",
    " KXXXWKXWKXK",
    "KXXXXKKXKKXK",
    "KXXXXXXXXXXK",
    "KXXXXXXXXXK ",
    " KXXKXXKXXK ",
    " KXXK  KXXK ",
    "  KK    KK  ",
    "            "
  ],
  coffee: [
    "    K  K    ",
    "    W  W    ",
    "            ",
    "  KKKKKKK   ",
    " KXXXXXXXK  ",
    " KXXXXXXXKK ",
    " KXXWWXXXK K",
    " KXXXXXXXKK ",
    "  KXXXXXXXK ",
    "   KKKKKKK  ",
    "  KKKKKKKKK ",
    "            "
  ],
  bird: [
    "            ",
    "      KKKK  ",
    "     KXXXXK ",
    "  K KXXXXXK ",
    " KXKXWXXKXK ",
    "KXXXXXXXXXK ",
    "KXXXXXXXXK  ",
    " KXXXXXXXK  ",
    "  KXXXXXK   ",
    "   KXXK     ",
    "    KK      ",
    "            "
  ],
  robot: [
    "     KK     ",
    "     KK     ",
    "  KKKKKKKK  ",
    " KXXXXXXXXK ",
    "KXWWXXXXWWXK",
    "KXWWXXXXWWXK",
    "KXXXXXXXXXXK",
    "KXKKKKKKKKXK",
    "KXKRRRRRRKXK",
    " KXXXXXXXXK ",
    "  KKKKKKKK  ",
    "            "
  ],
  whale: [
    "       B B  ",
    "      KBKBK ",
    "     KBBBBBK",
    "    KXXXXXXK",
    "   KXXXXXXXK",
    " KKXXWKXXXXK",
    "KXXXXKKXXXXK",
    "KXXXXXXXXXXK",
    "KXXXXXXXXXK ",
    " KKXXXXXKK  ",
    "   KKKKK    ",
    "            "
  ],
  gem: [
    "            ",
    "    KKKK    ",
    "   KXXXXK   ",
    "  KXWXXXXK  ",
    " KXXXXXXXXK ",
    "KXXXXXXXXXXK",
    "KXXXXXXXXXXK",
    " KXXXXXXXXK ",
    "  KXXXXXK   ",
    "   KXXXXK   ",
    "    KKKK    ",
    "            "
  ],
  chameleon: [
    "            ",
    "     KKKK   ",
    "    KXXXXK  ",
    "   KXXXXXK  ",
    "  KXXXXWXXK ",
    " KXXXXXXXXK ",
    "KXXXRRXXXXK ",
    "KXXXRRXXXK  ",
    " KXXXXXXXK  ",
    "  KKKKKKK   ",
    "            ",
    "            "
  ],
  spider: [
    "     K      ",
    "     K      ",
    "K   KKK   K ",
    " K KKKKK K  ",
    "  KKXXXKK   ",
    " KXXWKWXXK  ",
    "KXXXXXXXXXK ",
    "  KKXXXKK   ",
    " K  KKK  K  ",
    "K  K   K  K ",
    "  K     K   ",
    "            "
  ],
  snake: [
    "            ",
    "     KKK    ",
    "    KXXXK   ",
    "   KXWKXXK  ",
    "   KXXXXXK  ",
    "    KKKXXK  ",
    "   KXXKXXK  ",
    "  KXXXXXK   ",
    " KXXXXXK    ",
    " KXXKKXK    ",
    "  KK  KK    ",
    "            "
  ],
  gopher: [
    "            ",
    "    KKKK    ",
    "   KXXXXK   ",
    "  KXWKXWXXK ",
    "  KXXXXXXK  ",
    "  KXXWWXXK  ",
    " KXXXWWXXXK ",
    "KXXXXXXXXXXK",
    "KXXXXXXXXXXK",
    " KXXXXXXXXK ",
    "  KKKKKKKK  ",
    "            "
  ],
  cat: [
    "            ",
    "  K      K  ",
    " KXK    KXK ",
    " KXXKKKKXXK ",
    " KXXXXXXXXK ",
    " KXWKXXWKXK ",
    " KXXXXXXXXK ",
    " KXXXOOXXXK ",
    "  KXXXXXXK  ",
    "  KXXXXXXK  ",
    "   KK  KK   ",
    "            "
  ],
  tux: [
    "            ",
    "    KKKKK   ",
    "   KKKKKKK  ",
    "  KKWKKKWKK ",
    "  KKKKKKKKK ",
    " KKKKKKKKKK ",
    " KWWWWWWWWK ",
    "KWWWWWWWWWWK",
    "KWWWWWWWWWWK",
    " KWWWWWWWWK ",
    " KK OOO KK  ",
    "    O O     "
  ],
  unicorn: [
    "      K K   ",
    "      K K   ",
    "   KKKKKKK  ",
    "  KXXXXXXXK ",
    "  KXXXXXXXK ",
    " KXXXWKXXXK ",
    " KXXXXXXXXK ",
    " KXXXXXXXXK ",
    " KXXXXXXXXK ",
    " KXXXXXXXXK ",
    "  KKKKKKKK  ",
    "            "
  ]
};

// Override Unicorn with Rainbow Mane logic in rendering or just hardcode it here?
// The user said: "mix of 'X' (White body) and 'R', 'Y', 'B', 'P' for the rainbow mane/tail."
// Let's update the Unicorn sprite to actually use those chars.
SPRITES.unicorn = [
  "      Y     ",
  "     K K    ",
  "   KKXKXK   ",
  "  KXXXXXXK  ",
  " RXXXXWXXK  ",
  " YXXXXXXXK  ",
  " BXXXXXXXK  ",
  " PXXXXXXXK  ",
  " RXXXXXXXK  ",
  " YXXXXXXXK  ",
  "  KKKKKKK   ",
  "            "
];


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

    // 2. Determine State (Mood) & Streak
    const now = new Date();
    const lastEvent = events.data[0];
    const lastEventDate = lastEvent ? new Date(lastEvent.created_at) : new Date(0);
    const hoursSinceLastEvent = (now - lastEventDate) / (1000 * 60 * 60);

    let mood = 'sleeping';
    if (hoursSinceLastEvent < 24) mood = 'happy';
    if (hoursSinceLastEvent > 168) mood = 'ghost';

    // Calculate Streak
    const streak = calculateStreak(events.data);
    console.log(`Current Streak: ${streak} days`);

    // 3. Determine Pet Type (Species)
    let petType = 'cat';

    if (streak >= 14) {
      petType = 'unicorn';
      console.log('Legendary Status Unlocked! 🦄');
    } else {
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
      petType = getPetType(topLanguage);
      console.log(`Top Language: ${topLanguage}`);
    }

    console.log(`User: ${username}, Mood: ${mood}, Type: ${petType}`);

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

function calculateStreak(events) {
  if (!events || events.length === 0) return 0;

  // Extract unique dates (YYYY-MM-DD)
  const dates = new Set(events.map(e => e.created_at.split('T')[0]));
  const sortedDates = Array.from(dates).sort().reverse(); // Newest first

  let streak = 0;
  let currentDate = new Date();

  // Check if there's an event today or yesterday to start the streak
  const todayStr = currentDate.toISOString().split('T')[0];
  currentDate.setDate(currentDate.getDate() - 1);
  const yesterdayStr = currentDate.toISOString().split('T')[0];

  if (!dates.has(todayStr) && !dates.has(yesterdayStr)) {
    return 0;
  }

  // Iterate backwards
  // Simple logic: Check consecutive days from today/yesterday
  // Reset current date to today for iteration
  currentDate = new Date();

  // If no event today, start check from yesterday
  if (!dates.has(todayStr)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (dates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
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
    'Shell': 'tux',
    'Dockerfile': 'whale',
    'Ruby': 'gem',
    'HTML': 'chameleon',
    'CSS': 'chameleon',
  };
  return map[language] || 'cat';
}

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

  let renderSprite = [...sprite]; // Copy array

  if (mood === 'sleeping') {
    // Replace 'W' (eyes) with 'K' (closed) or 'X' (eyelids)
    renderSprite = renderSprite.map(row => row.replace(/W/g, 'K'));
  }

  if (mood === 'ghost') {
    // Ghost logic: Turn Base Color to Grey, keep Outline
    // We can hack this by changing the baseColor passed to render
    // But we also need to handle other colors.
    // Simpler: Just render normally but apply a CSS filter or override baseColor to grey
    // and maybe replace other colors with grey too.
    // Let's just override baseColor for now.
  }

  const pixelSize = 16;
  const width = 12 * pixelSize;
  const height = 12 * pixelSize;

  // If ghost, override baseColor
  const finalBaseColor = mood === 'ghost' ? '#abb2bf' : baseColor;

  const pixelArt = renderPixelGrid(renderSprite, finalBaseColor, pixelSize);

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

  // Ghost opacity effect
  const groupOpacity = mood === 'ghost' ? '0.7' : '1';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width + 40}" height="${height + 40}" viewBox="0 0 ${width + 40} ${height + 40}">
      <style>
        .pet { transform-origin: center; }
      </style>
      <rect width="100%" height="100%" fill="transparent" />
      <g transform="translate(20, 20)" opacity="${groupOpacity}">
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
