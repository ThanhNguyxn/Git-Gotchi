const core = require('@actions/core');
const github = require('@actions/github');

// --- PIXEL ART ASSETS (MULTI-COLOR & MULTI-STATE) ---

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
  tux: '#2d333b',    // Black
  unicorn: '#ffffff', // White
  // New Pets
  fox: '#ff7f50',    // Coral/Orange (Kotlin)
  hummingbird: '#00bcd4', // Cyan (Dart/Flutter)
  gear: '#78909c',   // Blue Grey (C)
  ladder: '#dc143c', // Crimson (Scala)
  owl: '#9c27b0',    // Purple (R)
  camel: '#d2691e',  // Chocolate (Perl)
  // Wave 2
  capybara: '#8b7355', // Tan/Brown (Lua)
  alpaca: '#f5f5dc',   // Beige/Cream (Julia)
  phoenix: '#ff4500',  // Orange-Red (Elixir)
  // Wave 3 - More Languages
  salamander: '#f7a41d', // Orange-Gold (Zig)
  hedgehog: '#5e5086',   // Purple-Grey (Haskell)
  octopus: '#5881d8',    // Blue (Clojure)
  ant: '#4d4d4d',        // Dark Grey (Assembly)
  dino: '#4b6c8c',       // Slate Blue (COBOL)
  lion: '#ffe953'        // Golden Yellow (Nim)
};

// ═══════════════════════════════════════════════════════════════════════════
// LEGENDARY PET SYSTEM - High-level stats unlock special creatures
// Priority: Mecha-Rex > Hydra > Cyber Golem > Void Spirit > Unicorn
// ═══════════════════════════════════════════════════════════════════════════

const LEGENDARY_COLORS = {
  mecha_rex: '#2e7d32',    // Green metal (T-Rex)
  hydra: '#6a1b9a',        // Dark purple (3-headed serpent)
  void_spirit: '#311b92',  // Deep indigo (Spectre)
  cyber_golem: '#37474f'   // Blue-grey stone (Construct)
};

// ═══════════════════════════════════════════════════════════════════════════
// MYTHICAL PET SYSTEM - Ultra rare pets with extreme achievements
// Priority: Dragon > Leviathan > Thunderbird > Kitsune > Celestial
// ═══════════════════════════════════════════════════════════════════════════

const MYTHICAL_COLORS = {
  dragon: '#b71c1c',       // Deep Red (Ancient Fire Dragon)
  thunderbird: '#1565c0',  // Electric Blue (Storm Bird)
  kitsune: '#ff6f00',      // Orange (9-tailed Fox Spirit)
  leviathan: '#004d40',    // Deep Teal (Sea Monster)
  celestial: '#7c4dff'     // Violet (Star Deer)
};

// ═══════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT SYSTEM - Badges for milestones
// ═══════════════════════════════════════════════════════════════════════════

const ACHIEVEMENTS = {
  // Commit milestones
  FIRST_COMMIT: { icon: '🌱', name: 'First Sprout', desc: 'First commit ever', check: (stats) => stats.totalCommits >= 1 },
  COMMIT_10: { icon: '📝', name: 'Note Taker', desc: '10 commits', check: (stats) => stats.totalCommits >= 10 },
  COMMIT_50: { icon: '📚', name: 'Bookworm', desc: '50 commits', check: (stats) => stats.totalCommits >= 50 },
  COMMIT_100: { icon: '💯', name: 'Centurion', desc: '100 commits', check: (stats) => stats.totalCommits >= 100 },
  COMMIT_500: { icon: '🔥', name: 'On Fire', desc: '500 commits', check: (stats) => stats.totalCommits >= 500 },
  COMMIT_1000: { icon: '🏆', name: 'Git Master', desc: '1,000 commits', check: (stats) => stats.totalCommits >= 1000 },
  COMMIT_5000: { icon: '👑', name: 'Commit King', desc: '5,000 commits', check: (stats) => stats.totalCommits >= 5000 },
  COMMIT_10000: { icon: '⭐', name: 'Legend', desc: '10,000 commits', check: (stats) => stats.totalCommits >= 10000 },
  
  // Streak milestones
  STREAK_3: { icon: '⚡', name: 'Spark', desc: '3 day streak', check: (stats) => stats.streak >= 3 },
  STREAK_7: { icon: '🔥', name: 'Weekly Warrior', desc: '7 day streak', check: (stats) => stats.streak >= 7 },
  STREAK_14: { icon: '💪', name: 'Fortnight Fighter', desc: '14 day streak', check: (stats) => stats.streak >= 14 },
  STREAK_30: { icon: '🌙', name: 'Month Master', desc: '30 day streak', check: (stats) => stats.streak >= 30 },
  STREAK_100: { icon: '💎', name: 'Diamond Hands', desc: '100 day streak', check: (stats) => stats.streak >= 100 },
  STREAK_365: { icon: '🎖️', name: 'Year Champion', desc: '365 day streak', check: (stats) => stats.streak >= 365 },
  
  // Level milestones
  LEVEL_5: { icon: '🌟', name: 'Rising Star', desc: 'Level 5', check: (stats) => stats.level >= 5 },
  LEVEL_10: { icon: '✨', name: 'Shining', desc: 'Level 10', check: (stats) => stats.level >= 10 },
  LEVEL_25: { icon: '🌈', name: 'Rainbow', desc: 'Level 25', check: (stats) => stats.level >= 25 },
  LEVEL_50: { icon: '🚀', name: 'Rocket', desc: 'Level 50', check: (stats) => stats.level >= 50 },
  LEVEL_100: { icon: '🏅', name: 'Olympian', desc: 'Level 100', check: (stats) => stats.level >= 100 },
  
  // Special achievements
  NIGHT_OWL: { icon: '🦉', name: 'Night Owl', desc: 'Late night commit', check: (stats) => stats.hasNightCommit },
  EARLY_BIRD: { icon: '🐦', name: 'Early Bird', desc: 'Early morning commit', check: (stats) => stats.hasEarlyCommit },
  WEEKEND_WARRIOR: { icon: '🏖️', name: 'Weekend Warrior', desc: 'Weekend commit', check: (stats) => stats.hasWeekendCommit },
  REVIEWER: { icon: '👀', name: 'Code Reviewer', desc: 'Reviewed 10 PRs', check: (stats) => stats.prsReviewed >= 10 },
  MERGER: { icon: '🔀', name: 'Merge Master', desc: 'Merged 50 PRs', check: (stats) => stats.prsMerged >= 50 },
  STARGAZER: { icon: '⭐', name: 'Stargazer', desc: 'Received 100 stars', check: (stats) => stats.starsReceived >= 100 },
  FORKER: { icon: '🍴', name: 'Open Source', desc: 'Forked 10 repos', check: (stats) => stats.reposForked >= 10 },
  POLYGLOT: { icon: '🌐', name: 'Polyglot', desc: 'Used 5+ languages', check: (stats) => stats.languagesUsed >= 5 },
  
  // Rare achievements
  PERFECT_WEEK: { icon: '💯', name: 'Perfect Week', desc: '7 days, 7+ commits each', check: (stats) => stats.perfectWeeks >= 1 },
  BUG_SLAYER: { icon: '🐛', name: 'Bug Slayer', desc: '50 bug fix commits', check: (stats) => stats.bugFixes >= 50 },
  DOCUMENTOR: { icon: '📖', name: 'Documentor', desc: '20 doc commits', check: (stats) => stats.docCommits >= 20 }
};

/**
 * Get earned achievements for a user based on their stats
 * @param {Object} stats - User statistics
 * @returns {Array} Array of earned achievement objects
 */
function getEarnedAchievements(stats) {
  const earned = [];
  for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
    try {
      if (achievement.check(stats)) {
        earned.push({ key, ...achievement });
      }
    } catch (e) {
      // Skip if check fails (missing stat)
    }
  }
  return earned;
}

/**
 * Generate achievement badges SVG
 * @param {Array} achievements - Array of earned achievements
 * @param {number} maxShow - Maximum badges to show
 * @returns {string} SVG string with badges
 */
function generateAchievementBadges(achievements, maxShow = 6) {
  if (!achievements || achievements.length === 0) return '';
  
  const toShow = achievements.slice(-maxShow); // Show most recent
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
  
  return `
    <g class="achievements">
      ${badges}
      ${moreText}
    </g>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// PET PHRASES SYSTEM - Speech bubbles with personality
// ═══════════════════════════════════════════════════════════════════════════

const MOOD_PHRASES = {
  normal: [
    "Ship it! 🚀",
    "LGTM!",
    "Compiling...",
    "*happy beeps*",
    "Ready to code!",
    "Let's gooo!",
    "Merge time!"
  ],
  sleeping: [
    "zzZ...",
    "💤 BRB napping...",
    "404: Energy not found",
    "*snore*",
    "Do not disturb...",
    "Recharging..."
  ],
  ghost: [
    "👻 Boo! Commit something!",
    "I'm fading away...",
    "Remember me?",
    "Hello? Anyone there?",
    "So lonely...",
    "*fading sounds*"
  ],
  hyper: [
    "LET'S GOOO!!!",
    "MAXIMUM OVERDRIVE!",
    "Can't stop won't stop!",
    "Another one! 🔥",
    "ON FIRE!!!",
    "UNSTOPPABLE!"
  ],
  nightowl: [
    "Who needs sleep?",
    "Midnight oil burning...",
    "🦉 Hoot hoot!",
    "The night is young!",
    "Best ideas at 3AM",
    "Coffee? More coffee!"
  ],
  weekend: [
    "Chill vibes only~",
    "No rush today",
    "Weekend mode: ON",
    "Taking it easy",
    "🏖️ Relaxing...",
    "Side project time!"
  ],
  caffeinated: [
    "COFFEE COFFEE COFFEE",
    "I CAN SEE SOUNDS!",
    "Sleep is for the weak!",
    "☕☕☕ MORE!!!",
    "Typing at 9000 WPM!",
    "MAXIMUM CAFFEINE!"
  ],
  debugging: [
    "Why... why?!",
    "console.log('here')",
    "It works on MY machine!",
    "undefined is not a function 😭",
    "One more fix...",
    "🔍 Found it! ...maybe",
    "Stack Overflow time"
  ],
  zen: [
    "Peaceful coding~",
    "Om... compile... om...",
    "🧘 Inner peace",
    "No bugs, only features",
    "Mindful commits",
    "Balance in code"
  ]
};

const PET_PHRASES = {
  spider: ["Spinning up webpack...", "Caught in my web!", "npm install *"],
  snake: ["Ssssliding in~", "No dependencies 🐍", "import this"],
  gopher: ["Go fast or go home!", "Concurrency is fun!", "go run ."],
  crab: ["Memory safe! 🦀", "Fearless refactoring!", "cargo build"],
  coffee: ["☕ Brewing code...", "public static void main", "Exception in thread"],
  elephant: ["<?php echo 'hi'; ?>", "Composer update!", "Laravel magic~"],
  robot: ["Beep boop!", "Compiling C++...", "Segfault? Never!"],
  whale: ["🐳 Container ready!", "docker compose up", "Pods are healthy"],
  gem: ["Ruby is beautiful!", "rails new magic", "💎 Polished code"],
  bird: ["Swift and elegant!", "let code = awesome", "🐦 Flying high"],
  tux: ["chmod +x life", "sudo make me happy", "🐧 Open source!"],
  cat: ["*pushes code off table*", "Meow~", "😺 Purrfect code"],
  fox: ["Kotlin is fun!", "val life = awesome", "🦊 Clever solution"],
  phoenix: ["Rising from ashes!", "|> Elixir magic", "🔥 Functional!"],
  dragon: ["🔥 LEGACY ELIMINATED!", "Ancient wisdom...", "I AM FIRE!"],
  octopus: ["(((lisp intensifies)))", "Functional FTW!", "🐙 8 parallel tasks"],
  hedgehog: ["λ Haskell beauty", "Purely functional!", "🦔 Type safe!"],
  salamander: ["⚡ Zig zag!", "No hidden control flow", "Comptime magic"],
  ant: ["mov eax, awesome", "Close to the metal!", "🐜 Tiny but mighty"],
  dino: ["COBOL lives!", "🦕 Still running!", "Legacy but reliable"],
  lion: ["👑 Nim is king!", "Efficient & elegant", "Roar of power!"]
};

const HOLIDAY_PHRASES = {
  CHRISTMAS: ["Ho ho ho! 🎄", "Merry Commits!", "'Tis the season!"],
  HALLOWEEN: ["Trick or treat? 🎃", "Spoooky bugs! 👻", "Boo!"],
  LUNAR_NEW_YEAR: ["Chúc Mừng Năm Mới! 🧧", "恭喜发财!", "Lucky commits!"],
  VALENTINE: ["❤️ Love your code!", "Merge with love~", "💕 Paired!"],
  PROGRAMMER_DAY: ["Day 256! 🎉", "We're #1 (base 256)", "0xFF vibes!"],
  PI_DAY: ["3.14159... 🥧", "π day!", "Infinite digits!"],
  STAR_WARS: ["May the Force... ⚔️", "Use the Source, Luke!", "This is the way."],
  PIRATE_DAY: ["Arrr! 🏴‍☠️", "Ahoy, matey!", "Shiver me repos!"],
  SYSADMIN_DAY: ["sudo give raise 💻", "Have you tried...?", "Ticket closed!"],
  SINGLES_DAY: ["11.11 deals! 🛒", "Solo coder!", "Independent dev!"]
};

/**
 * Get a random phrase for the pet based on mood, type, and holiday
 * @param {string} moodKey - Current mood key
 * @param {string} petType - Type of pet
 * @param {string} holiday - Current holiday (optional)
 * @returns {string} A random phrase
 */
function getPetPhrase(moodKey, petType, holiday = null) {
  const phrases = [];
  
  // Add mood phrases
  if (MOOD_PHRASES[moodKey]) {
    phrases.push(...MOOD_PHRASES[moodKey]);
  }
  
  // Add pet-specific phrases
  if (PET_PHRASES[petType]) {
    phrases.push(...PET_PHRASES[petType]);
  }
  
  // Add holiday phrases (higher priority)
  if (holiday && HOLIDAY_PHRASES[holiday]) {
    // Holiday phrases get extra weight
    phrases.push(...HOLIDAY_PHRASES[holiday]);
    phrases.push(...HOLIDAY_PHRASES[holiday]); // Double weight
  }
  
  // Pick a random phrase
  if (phrases.length === 0) return '';
  
  // Use date-based seed for consistency during the same hour
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate() + now.getHours();
  const index = seed % phrases.length;
  
  return phrases[index];
}

/**
 * Generate speech bubble SVG
 * @param {string} text - Text to display
 * @param {number} x - X position
 * @param {number} y - Y position
 * @returns {string} SVG string for speech bubble
 */
function generateSpeechBubble(text, x, y) {
  if (!text) return '';
  
  const bubbleWidth = Math.max(text.length * 7 + 20, 60);
  const bubbleHeight = 24;
  
  return `
    <g transform="translate(${x}, ${y})">
      <!-- Speech bubble -->
      <rect x="0" y="0" width="${bubbleWidth}" height="${bubbleHeight}" rx="10" ry="10" 
            fill="#FFFFFF" stroke="#2d333b" stroke-width="1.5"/>
      <!-- Bubble tail -->
      <polygon points="15,${bubbleHeight} 20,${bubbleHeight + 8} 25,${bubbleHeight}" 
               fill="#FFFFFF" stroke="#2d333b" stroke-width="1.5"/>
      <line x1="16" y1="${bubbleHeight}" x2="24" y2="${bubbleHeight}" stroke="#FFFFFF" stroke-width="2"/>
      <!-- Text -->
      <text x="${bubbleWidth / 2}" y="${bubbleHeight / 2 + 4}" 
            font-family="'Segoe UI', Arial, sans-serif" font-size="10" 
            fill="#2d333b" text-anchor="middle">${text}</text>
    </g>
  `;
}

// Legendary Sprites (16x16 Pixel Art - Upgraded!)
// Legend: X=Base, K=Black, W=White, R=Red, O=Orange, Y=Yellow, B=Blue, G=Green, P=Purple, M=Magenta
const LEGENDARY_SPRITES = {
  // 🦖 REX: T-Rex (16x16) - Renamed from Mecha-Rex
  // 🦖 MECHA-REX: Cybernetic T-Rex (16x16) - Classic dino silhouette
  mecha_rex: {
    normal: [
      "                ",
      "                ",
      "           XXXK ",
      "          KXKXXX",
      "          KXXXXX",
      "          KGXXXK",
      "X      KXXXGG   ",
      "XXKKKKXXXXXGG   ",
      " KGXXXXXXXGGG   ",
      "   KGGXXKGGK K  ",
      "     KXXKGGK    ",
      "      XXK XK    ",
      "      XK KX     ",
      "      XX KK     ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "                ",
      "           XXXK ",
      "          KXKXXX",
      "          KXXXXX",
      "          KKXXXK",
      "X      KXXXGG   ",
      "XXKKKKXXXXXGG   ",
      " KGXXXXXXXGGG   ",
      "   KGGXXKGGK K  ",
      "     KXXKGGK    ",
      "      XXK XK    ",
      "      XK KX     ",
      "      XX KK     ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "                ",
      "           X XK ",
      "          K K XX",
      "          K XXXX",
      "          K XXXK",
      "       K X GG   ",
      "X K K X X XGG   ",
      " K X X X XGGG   ",
      "   K  X K GK K  ",
      "     K XK GK    ",
      "      X K XK    ",
      "      XK KX     ",
      "       X KK     ",
      "                ",
      "                "
    ],
    hyper: [
      "          RRR   ",
      "                ",
      "           XXXK ",
      "          KXKXXX",
      "          KXXXXX",
      "          KGXXXK",
      "X      KXXXGGR  ",
      "XXKKKKXXXXXGG   ",
      " KGXXXXXXXGGG   ",
      "   KGGXXKGGK K  ",
      "     KXXKGGK    ",
      "      XXK XK    ",
      "      XK KX     ",
      "      XX KK     ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "                ",
      "           XOXK ",
      "          KXKXXX",
      "          KXXXXX",
      "          KGXXXK",
      "X      KXXXGG   ",
      "XXKKKKXXXXXGG   ",
      " KGXXXXXXXGGG   ",
      "   KGGXXKGGK K  ",
      "     KXXKGGK    ",
      "      XXK XK    ",
      "      XK KX     ",
      "      XX KK     ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "                ",
      "           XXXK ",
      "          KXKXXX",
      "          KXXXXX",
      "          KKXXXK",
      "X      KXXXGG   ",
      "XXKKKKXXXXXGG   ",
      " KGXXXXXXXGGG   ",
      "   KGGXXKGGK K  ",
      "     KXXKGGK    ",
      "      XXK XK    ",
      "      XK KX     ",
      "      XX KK     ",
      "                ",
      "                "
    ]
  },

  // 🐉 HYDRA: 3-Headed Dragon (16x16) - Three distinct heads, serpent body
  hydra: {
    normal: [
      "                ",
      "     XX         ",
      "      XX        ",
      "    KXKX  XK    ",
      "    XK     XX   ",
      "    XX  KXXXX   ",
      "    KK KXK  K   ",
      " KKKKXXXX       ",
      "XXXXXXXXXXX KXK ",
      "X XXXXKKXKXXKXXK",
      "XK XK KXK  KXKKK",
      " X K   XX    K K",
      " KXKK  XX       ",
      "  KKX  KXK      ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "     XX         ",
      "      XX        ",
      "    KXKX  XK    ",
      "    XK     XX   ",
      "    XX  KXXXX   ",
      "    KK KXK  K   ",
      " KKKKXXXX       ",
      "XXXXXXXXXXX KXK ",
      "X XXXXKKXKXXKXXK",
      "XK XK KXK  KXKKK",
      " X K   XX    K K",
      " KXKK  XX       ",
      "  KKX  KXK      ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "     X          ",
      "       X        ",
      "    K K   K     ",
      "    XK     X    ",
      "    X   K X X   ",
      "    K  K K  K   ",
      " K K X X        ",
      "X X X X X X K K ",
      "X  X X K K X K K",
      "XK XK K K  K K K",
      " X K   X     K K",
      " K K   X        ",
      "  K X  K K      ",
      "                ",
      "                "
    ],
    hyper: [
      "     R     R    ",
      "     XX         ",
      "      XX        ",
      "    KRXR  RK    ",
      "    XK     XX   ",
      "    XX  KXXXX   ",
      "    KK KXK  K   ",
      " KKKKXXXX       ",
      "XXXXXXXXXXX KXK ",
      "X XXXXKKXKXXKXXK",
      "XK XK KXK  KXKKK",
      " X K   XX    K K",
      " KXKK  XX   R   ",
      "  KKX  KXK      ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "     XX         ",
      "      XX        ",
      "    KOXO  OK    ",
      "    XK     XX   ",
      "    XX  KXXXX   ",
      "    KK KXK  K   ",
      " KKKKXXXX       ",
      "XXXXXXXXXXX KXK ",
      "X XXXXKKXKXXKXXK",
      "XK XK KXK  KXKKK",
      " X K   XX    K K",
      " KXKK  XX       ",
      "  KKX  KXK      ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "     XX         ",
      "      XX        ",
      "    KXKX  XK    ",
      "    XK     XX   ",
      "    XX  KXXXX   ",
      "    KK KXK  K   ",
      " KKKKXXXX       ",
      "XXXXXXXXXXX KXK ",
      "X XXXXKKXKXXKXXK",
      "XK XK KXK  KXKKK",
      " X K   XX    K K",
      " KXKK  XX       ",
      "  KKX  KXK      ",
      "                ",
      "                "
    ]
  },

  // 👻 VOID SPIRIT: Floating Spectre (16x16) - Hooded, glowing eyes, wispy
  void_spirit: {
    normal: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXYYYXXXK   ",
      "  KXXXYYYXXXK   ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  K  K    K  K  ",
      " K  K      K  K ",
      "                ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXKKKXXXK   ",
      "  KXXXKKKXXXK   ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  K  K    K  K  ",
      " K  K      K  K ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXYYYXXXK   ",
      "  KXXXYYYXXXK   ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    K  K  K     ",
      "     K K K      ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXRRRXXXK   ",
      "  KXXXRRRXXXK   ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  K  K RR K  K  ",
      " K  K      K  K ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXOOOXXXK   ",
      "  KXXXOOOXXXK   ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  K  K    K  K  ",
      " K  K      K  K ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXKKKXXXK   ",
      "  KXXXKKKXXXK   ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  K  K    K  K  ",
      " K  K      K  K ",
      "                ",
      "                ",
      "                "
    ]
  },

  // 🗿 CYBER GOLEM: Stone Construct (16x16) - Blocky, circuit lines
  cyber_golem: {
    normal: [
      "                ",
      "    KKKKKKKK    ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "  KXWXKXXKXWXK  ",
      "  KXXBXXXXBXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "    K      K    ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "    KKKKKKKK    ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "  KXKXKXXKXKXK  ",
      "  KXXBXXXXBXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "    K      K    ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "    KKKKKKKK    ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "  KXKXKXXKXKXK  ",
      "  KXXBXXXXBXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "    K  K  K     ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "                ",
      "    KKKKKKKK    ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "  KXRXKXXKXRXK  ",
      "  KXXBXXXXBXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "   KXK RR KXK   ",
      "    K      K    ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "    KKKKKKKK    ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "  KXOXKXXKXOXK  ",
      "  KXXBXXXXBXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "    K      K    ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "    KKKKKKKK    ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "  KXKXKXXKXKXK  ",
      "  KXXBXXXXBXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXBXXXXBXK   ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "    K      K    ",
      "                ",
      "                "
    ]
  },

  // 🦄 UNICORN: Magical Rainbow Horse (16x16) - Final Pixel Perfect
  unicorn: {
    normal: [
      "                ",
      "                ",
      "              W ",
      "             G  ",
      "          WWG   ",
      "         WWWW   ",
      "         WWKWW  ",
      "         WPWWW  ",
      "  PP  WWWWWWW   ",
      " POOPWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      "POGGWWWWWWWW    ",
      "POGBWWWWWWW     ",
      "OGGBWWW WWW     ",
      "    WW  WW      "
    ],
    sleeping: [
      "                ",
      "                ",
      "                ",
      "                ",
      "              W ",
      "             G  ",
      "          WWG   ",
      "         WWWW   ",
      "         WWKWW  ",
      "         WPWWW  ",
      "  PP  WWWWWWW   ",
      " POOPWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      "POGGWWWWWWWW    ",
      "POGBWWWWWWW     "
    ],
    ghost: [
      "                ",
      "                ",
      "              W ",
      "             G  ",
      "          WWG   ",
      "         WWWW   ",
      "         WWKWW  ",
      "         WPWWW  ",
      "  PP  WWWWWWW   ",
      " POOPWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      "POGGWWWWWWWW    ",
      "POGBWWWWWWW     ",
      "OGGBWWW WWW     ",
      "    WW  WW      "
    ],
    hyper: [
      "                ",
      "                ",
      "              W ",
      "             G  ",
      "          WWG   ",
      "         WWWW   ",
      "         WWKWW  ",
      "         WPWWW  ",
      "  PP  WWWWWWW   ",
      " POOPWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      "POGGWWWWWWWW    ",
      "POGBWWWWWWW     ",
      "OGGBWWW WWW     ",
      "    WW  WW      "
    ],
    nightowl: [
      "                ",
      "                ",
      "              W ",
      "             G  ",
      "          WWG   ",
      "         WWWW   ",
      "         WWKWW  ",
      "         WPWWW  ",
      "  PP  WWWWWWW   ",
      " POOPWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      "POGGWWWWWWWW    ",
      "POGBWWWWWWW     ",
      "OGGBWWW WWW     ",
      "    WW  WW      "
    ],
    weekend: [
      "                ",
      "                ",
      "              W ",
      "             G  ",
      "          WWG   ",
      "         WWWW   ",
      "         WWKWW  ",
      "         WPWWW  ",
      "  PP  WWWWWWW   ",
      " POOPWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      " POGWWWWWWWWW   ",
      "POGGWWWWWWWW    ",
      "POGBWWWWWWW     ",
      "OGGBWWW WWW     ",
      "    WW  WW      "
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MYTHICAL PET SPRITES - Ultra rare tier above Legendary
// ═══════════════════════════════════════════════════════════════════════════

const MYTHICAL_SPRITES = {
  // 🐉 DRAGON: Ancient Fire Dragon (16x16) - 2000+ commits
  // Design: Western dragon with wings spread, fire breath, detailed scales
  // Colors: R=body, O=belly/highlight, Y=fire, K=outline
  dragon: {
    normal: [
      "    KK    KK    ",
      "   KRRK  KRRK   ",
      "  KRRRKKKKRRRK  ",
      "  KRRRRRRRRRRK  ",
      " KRORWKKWRORK   ",
      " KRORKKKKORRRK  ",
      " KRORRRRRORRK   ",
      "  KROOOOORRK    ",
      " KKRRRRRRRRKK   ",
      "KRRRRRRRRRRRRK  ",
      "KRRKRRRRRRKRRK  ",
      " KK KRORORK KK  ",
      "    KRRRRRKYO   ",
      "   KRKK KKRKYOY ",
      "   KK     KKYO  ",
      "            Y   "
    ],
    sleeping: [
      "                ",
      "                ",
      "   KKKKKKKKKK   ",
      "  KRRRRRRRRRRK  ",
      " KRRKKKKKKKRRK  ",
      " KRROOOOOOORRKK ",
      " KRRRRRRRRRRRKRK",
      "KRRRRRRRRRRRRRRK",
      "KRRRRRRRRRRRRRRK",
      " KRRRRRRRRRRRK  ",
      "  KKRRRRRRRKK   ",
      "   KKKKKKKK     ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "    K     K     ",
      "   K R   K R    ",
      "  K R R K R R K ",
      "  K R R R R R K ",
      " K R O K K R O  ",
      " K R O K K O R K",
      " K R O R R O R  ",
      "  K O O O O R   ",
      " K K R R R R K  ",
      "K R R R R R R K ",
      "K R K R R R K R ",
      " K   K R R K    ",
      "    K R R R     ",
      "   K K   K K    ",
      "                ",
      "                "
    ],
    hyper: [
      " Y  KK    KK  Y ",
      "   KRRK  KRRK   ",
      "  KRYRKKKKRYRKOY",
      "  KRRRRRRRRRRK O",
      " KRORYKYKYRORKY ",
      " KRORKKKKORRRK  ",
      " KYORRRRRORYKY  ",
      "  KROOOOORRK    ",
      " KKYRRRRRRRYKK  ",
      "KRRRRRRRRRRRRK  ",
      "KRRKRYRYRYKRRKY ",
      " KK KRORORK KK  ",
      "    KRRRRRKYO   ",
      "   KRKK KKRKYOY ",
      "   KK     KKYO  ",
      "  Y          Y  "
    ],
    nightowl: [
      "    KK    KK    ",
      "   KRRK  KRRK   ",
      "  KRRRKKKKRRRK  ",
      "  KRRRRRRRRRRK  ",
      " KROROKORORORK  ",
      " KRORKKKKORRRK  ",
      " KRORRRRRORRK   ",
      "  KROOOOORRK    ",
      " KKRRRRRRRRKK   ",
      "KRRRRRRRRRRRRK  ",
      "KRRKRRRRRRKRRK  ",
      " KK KRORORK KK  ",
      "    KRRRRRK     ",
      "   KRKK KKRK    ",
      "   KK     KK    ",
      "                "
    ],
    weekend: [
      "    KK    KK    ",
      "   KRRK  KRRK   ",
      "  KRRRKKKKRRRK  ",
      "  KRRKKKKKRRRK  ",
      " KRORRRRRRRORK  ",
      " KRORRRRRORRRK  ",
      " KRORRRRRORRK   ",
      "  KROOOOORRK    ",
      " KKRRRRRRRRKK   ",
      "KRRRRRRRRRRRRK  ",
      "KRRKRRRRRRKRRK  ",
      " KK KRORORK KK  ",
      "    KRRRRRK     ",
      "   KRKK KKRK    ",
      "   KK     KK    ",
      "                "
    ]
  },

  // ⚡ THUNDERBIRD: Electric Storm Bird (16x16) - 100+ PR merges
  // Design: Majestic eagle with spread wings, lightning bolts
  // Colors: B=body, Y=lightning/glow, W=eyes, K=outline
  thunderbird: {
    normal: [
      "  Y         Y   ",
      "   Y  KKK  Y    ",
      "     KBBBK      ",
      "    KBWKWBK     ",
      "    KBKKKBK     ",
      "  KKBBBYBBKKK   ",
      " KYBBBBBBBBBYK  ",
      "KBBBBBBBBBBBBYK ",
      "KYBBBBBBBBBBBYK ",
      " KYBBBYBBBYBYK  ",
      "  KKBBBBBBBKK   ",
      "    KBBBBBK     ",
      "    KBKKKBK     ",
      "   KYBK KBK     ",
      "   KKK  KYK     ",
      "         K      "
    ],
    sleeping: [
      "                ",
      "      KKKK      ",
      "    KBBBBBBK    ",
      "   KBBKKKKBBK   ",
      "   KBBBBBBBBK   ",
      "  KBBBBBBBBBBK  ",
      " KBBBBBBBBBBBBK ",
      "KBBBBBBBBBBBBBBK",
      " KBBBBBBBBBBBBK ",
      "  KBBBBBBBBBBK  ",
      "   KKKKKKKKKKK  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "  Y         Y   ",
      "   Y   K   Y    ",
      "      K B K     ",
      "     K B B K    ",
      "     K K K K    ",
      "  K K B B B K K ",
      " K Y B B B B Y  ",
      "K B B B B B B Y ",
      "K Y B B B B B Y ",
      " K Y B B B B Y  ",
      "  K K B B B K   ",
      "     K B B K    ",
      "     K   K K    ",
      "    K     K     ",
      "                ",
      "                "
    ],
    hyper: [
      " YY    Y    YY  ",
      "  YY  KKK  YY   ",
      "  Y  KBBBK  Y   ",
      "    KBYKYBYKY   ",
      "    KBKKKBK     ",
      "  KKYBYYYBYKKY  ",
      " KYBBBBBBBBBYK  ",
      "KYBBBYBBBYBBBYKY",
      "KYBBBBBBBBBBBYK ",
      " KYBBBYYBYYBBYK ",
      "  KKYBBBBBBYKKKY",
      "    KBBBBBK   Y ",
      "    KBKKKBK     ",
      "   KYBK KBK     ",
      "   KKK  KYK     ",
      "         K      "
    ],
    nightowl: [
      "  Y         Y   ",
      "   Y  KKK  Y    ",
      "     KBBBK      ",
      "    KBOOBK      ",
      "    KBKKKBK     ",
      "  KKBBBYBBKKK   ",
      " KYBBBBBBBBBYK  ",
      "KBBBBBBBBBBBBYK ",
      "KYBBBBBBBBBBBYK ",
      " KYBBBYBBBYBYK  ",
      "  KKBBBBBBBKK   ",
      "    KBBBBBK     ",
      "    KBKKKBK     ",
      "   KYBK KBK     ",
      "   KKK  KYK     ",
      "         K      "
    ],
    weekend: [
      "                ",
      "      KKKK      ",
      "    KBBBBBBK    ",
      "   KBBKKKKBBK   ",
      "   KBBBBBBBBK   ",
      "  KBBBBBBBBBBK  ",
      " KBBBBBBBBBBBBK ",
      "KBBBBBBBBBBBBBBK",
      " KBBBBBBBBBBBBK ",
      "  KBBBBBBBBBBK  ",
      "   KKKKKKKKKK   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },

  // 🦊 KITSUNE: 9-Tailed Fox Spirit (16x16) - 10+ active repos
  // Design: Elegant fox with big ears, multiple tails, spirit flames
  // Colors: O=fur, R=darker fur, Y=spirit fire, W=face, K=outline
  kitsune: {
    normal: [
      "KK          KK  ",
      "KOKK      KKOKK ",
      " KOKK    KKOK   ",
      "  KKKKKKKKKKK   ",
      "  KOOWKKWOOKK   ",
      "  KOKKKKKKOKK   ",
      "   KOOOOOOOK KKK",
      "   KOOOOOOK KOKK",
      "  KOOOOOOOOKKOKK",
      " KOOOOOOOOOKKOK ",
      " KOOKOOOOKOOK K ",
      " KOOKKKKKKOOK   ",
      "  KOKK  KKOKK   ",
      "  KRKK   KKRK   ",
      "  KKK     KKK   ",
      "                "
    ],
    sleeping: [
      "KK          KK  ",
      "KOKK      KKOKK ",
      " KOKK    KKOK   ",
      "  KKKKKKKKKKK   ",
      "  KOKKKKKKOKK   ",
      "  KOOOOOOOOKK   ",
      "   KOOOOOOOK    ",
      "  KOOOOOOOOOK KK",
      " KOOOOOOOOOOOKOK",
      "KOOOOOOOOOOOOOOK",
      " KOOOOOOOOOOOK  ",
      "  KKKKKKKKKKKK  ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "K           K   ",
      "K O K     K O K ",
      " K O K   K O    ",
      "  K K K K K K   ",
      "  K O K K O K   ",
      "  K O K K K O K ",
      "   K O O O O    ",
      "   K O O O O K K",
      "  K O O O O O K ",
      " K O O O O O O K",
      " K O K O O K O  ",
      " K O K K K K O  ",
      "  K O     K O   ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "KKY        YKK  ",
      "KOYKK    KKYOKKY",
      " KOKK    KKOK Y ",
      "  KKKKKKKKKKK   ",
      "  KOOYKKYKOOKKY ",
      "  KOKKKKKKOKK   ",
      "   KOYOYOYOK KKK",
      "   KOOOOOOK KOKK",
      "  KYOOOOOOYKKOKK",
      " KOOOOOOOOOKKOK ",
      " KOYKOOOOKOYKY Y",
      " KOOKKKKKKOOK   ",
      "  KOKK  KKOKK   ",
      "  KRKK   KKRK   ",
      "  KKK     KKK Y ",
      "                "
    ],
    nightowl: [
      "KK          KK  ",
      "KOKK      KKOKK ",
      " KOKK    KKOK   ",
      "  KKKKKKKKKKK   ",
      "  KOOOKOOKOOKK  ",
      "  KOKKKKKKOKK   ",
      "   KOOOOOOOK KKK",
      "   KOOOOOOK KOKK",
      "  KOOOOOOOOKKOKK",
      " KOOOOOOOOOKKOK ",
      " KOOKOOOOKOOK K ",
      " KOOKKKKKKOOK   ",
      "  KOKK  KKOKK   ",
      "  KRKK   KKRK   ",
      "  KKK     KKK   ",
      "                "
    ],
    weekend: [
      "KK          KK  ",
      "KOKK      KKOKK ",
      " KOKK    KKOK   ",
      "  KKKKKKKKKKK   ",
      "  KOKKKKKKOKK   ",
      "  KOOOOOOOOKK   ",
      "   KOOOOOOOK    ",
      "  KOOOOOOOOOK KK",
      " KOOOOOOOOOOOKOK",
      "KOOOOOOOOOOOOOOK",
      " KOOOOOOOOOOOK  ",
      "  KKKKKKKKKKKK  ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },

  // 🌊 LEVIATHAN: Deep Sea Monster (16x16) - 50,000+ lines of code
  // Design: Serpentine sea dragon, coiled body, fins and spines
  // Colors: B=body, C=belly highlight, Y=bioluminescent, K=outline
  leviathan: {
    normal: [
      "     KKKKK      ",
      "   KKBBBBBKK    ",
      "  KBBBBBBBBK    ",
      " KBBWKKWBBBK    ",
      " KBBKKKKBBBK K  ",
      "KBBBBBBBBBK KBK ",
      "KBBBBKBBBBKKBBK ",
      " KBBBKBBBBKBBBK ",
      "  KBBKBBBKBBBBK ",
      "  KBKBBBBKBBBBK ",
      " KBKBBBBBKBBBK  ",
      "KBKBBBBBBKBBK   ",
      " KKBBBBBBBKK    ",
      "  KKKKKKKKKK    ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "    KKKKKKKK    ",
      "  KKBBBBBBBBKK  ",
      " KBBKKKKKKBBBBK ",
      " KBBBBBBBBBBBK  ",
      "KBBBBBBBBBBBBBK ",
      "KBBBBKBBBBBBBBK ",
      " KBBBKBBBBBBK   ",
      "  KBBKBBBBBK    ",
      "  KBKBBBBBBK    ",
      "   KKBBBBBK     ",
      "    KKKKKK      ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "     K K K      ",
      "   K B B B B K  ",
      "  K B B B B B   ",
      " K B K K B B K  ",
      " K B K K B B K  ",
      "K B B B B B K K ",
      "K B B B K B B K ",
      " K B B K B B B K",
      "  K B K B B B K ",
      "  K B K B B B K ",
      " K B K B B B K  ",
      "K B K B B B K   ",
      " K K B B B K    ",
      "  K K K K K     ",
      "                ",
      "                "
    ],
    hyper: [
      "     KKKKK   Y  ",
      "   KKBYBYBKK    ",
      "  KBBBBBBBYBKY  ",
      " KBBYKKYBBBK    ",
      " KBBKKKKYBBK K  ",
      "KYBBBBYBBBK KBK ",
      "KBBYBKBBYBKKBBKY",
      " KBYBKBYBYKBBBK ",
      "  KBBKBBBKBYBYK ",
      "  KBKBYBYKBBBBK ",
      " KBKBBBBBKBYYK  ",
      "KBKBBBYBBKBBK Y ",
      " KKBBBBBBBKK    ",
      "  KKKKKKKKKKK   ",
      "                ",
      "                "
    ],
    nightowl: [
      "     KKKKK      ",
      "   KKBBBBBKK    ",
      "  KBBBBBBBBK    ",
      " KBBOKKOBBK     ",
      " KBBKKKKBBBK K  ",
      "KBBBBBBBBBK KBK ",
      "KBBBBKBBBBKKBBK ",
      " KBBBKBBBBKBBBK ",
      "  KBBKBBBKBBBBK ",
      "  KBKBBBBKBBBBK ",
      " KBKBBBBBKBBBK  ",
      "KBKBBBBBBKBBK   ",
      " KKBBBBBBBKK    ",
      "  KKKKKKKKKK    ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "    KKKKKKKK    ",
      "  KKBBBBBBBBKK  ",
      " KBBKKKKKKBBBBK ",
      " KBBBBBBBBBBBK  ",
      "KBBBBBBBBBBBBBK ",
      "KBBBBKBBBBBBBBK ",
      " KBBBKBBBBBBK   ",
      "  KBBKBBBBBK    ",
      "  KBKBBBBBBK    ",
      "   KKBBBBBK     ",
      "    KKKKKK      ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },

  // ⭐ CELESTIAL: Star Deer (16x16) - 50+ GitHub stars received
  // Design: Elegant deer with crystal antlers and starry glow
  // Colors: P=purple body, p=light purple, Y=stars, K=outline, W=eyes
  celestial: {
    normal: [
      "  Y       Y     ",
      " YKY     YKY    ",
      "  KYK   KYK     ",
      "   KKKKKKK      ",
      "  KPPPPPPPK     ",
      " KPPPWKWPPPK    ",
      " KPPPKKPPPPK    ",
      "  KPPPPPPPK     ",
      "   KPPPPPPK     ",
      "  KPPPPPPPPK    ",
      " KPPPPPPPPPPK   ",
      " KPPKPPPPKPPK   ",
      "  KPK    KPK    ",
      "  KPK    KPK    ",
      "   KK    KK     ",
      "                "
    ],
    sleeping: [
      "  Y       Y     ",
      " YKY     YKY    ",
      "  KYK   KYK     ",
      "   KKKKKKK      ",
      "  KPPPPPPPK     ",
      " KPPKKKKPPPK    ",
      " KPPPPPPPPPK    ",
      "  KPPPPPPPK     ",
      " KPPPPPPPPPPK   ",
      "KPPPPPPPPPPPPK  ",
      "KPPPPPPPPPPPPK  ",
      " KKKKKKKKKKKK   ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "  Y       Y     ",
      " Y Y     Y Y    ",
      "  K K   K K     ",
      "   K K K K      ",
      "  K P P P P     ",
      " K P K K P P    ",
      " K P K K P P    ",
      "  K P P P P     ",
      "   K P P P P    ",
      "  K P P P P P   ",
      " K P P P P P    ",
      " K P     K P    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      " YY   Y   YY  Y ",
      " YKY     YKY    ",
      "  KYK   KYK  Y  ",
      "   KKKKKKK      ",
      "  KPYPYPYPK     ",
      " KPPPRYRPPPK    ",
      " KPPPKKPPPPK    ",
      "  KYPPPPPYK     ",
      "   KPPYPPPK     ",
      "  KYPPPPPYPK    ",
      " KPPPPPPPPPPK Y ",
      " KPPKPPPPKPPK   ",
      "  KPK    KPK    ",
      "  KYK    KYK    ",
      "   KK    KK     ",
      "                "
    ],
    nightowl: [
      "  Y       Y     ",
      " YKY     YKY    ",
      "  KYK   KYK     ",
      "   KKKKKKK      ",
      "  KPPPPPPPK     ",
      " KPPOKOPPPPK    ",
      " KPPPKKPPPPK    ",
      "  KPPPPPPPK     ",
      "   KPPPPPPK     ",
      "  KPPPPPPPPK    ",
      " KPPPPPPPPPPK   ",
      " KPPKPPPPKPPK   ",
      "  KPK    KPK    ",
      "  KPK    KPK    ",
      "   KK    KK     ",
      "                "
    ],
    weekend: [
      "  Y       Y     ",
      " YKY     YKY    ",
      "  KYK   KYK     ",
      "   KKKKKKK      ",
      "  KPPPPPPPK     ",
      " KPPKKKKPPPK    ",
      " KPPPPPPPPPK    ",
      "  KPPPPPPPK     ",
      " KPPPPPPPPPPK   ",
      "KPPPPPPPPPPPPK  ",
      "KPPPPPPPPPPPPK  ",
      " KKKKKKKKKKKK   ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  }
};

const SPRITES = {
  // 🦀 CRAB: Rust mascot - Improved pixel art with better claws & shading
  crab: {
    normal: [
      "                ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      "KXXXXK    KXXXXK",
      " KXXK      KXXK ",
      "  KK KKKKKK KK  ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXWKXXKWXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXKKKXXXK   ",
      "    KXXXXXXK    ",
      "   KK  KK  KK   ",
      "  K   K  K   K  ",
      "                "
    ],
    sleep: [
      "                ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      "KXXXXK    KXXXXK",
      " KXXK      KXXK ",
      "  KK KKKKKK KK  ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KK  KK  KK   ",
      "  K   K  K   K  ",
      "                "
    ],
    ghost: [
      "                ",
      "  K          K  ",
      " K K        K K ",
      "K   K      K   K",
      " K K        K K ",
      "  K  KKKKKK  K  ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   K  K  K  K   ",
      "    K      K    ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      RRR       ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      "KXXXXK    KXXXXK",
      " KXXK      KXXK ",
      "  KK KKKKKK KK  ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXRKXXKRXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXRRRXXXK   ",
      "    KXXXXXXK    ",
      "   KK  KK  KK   ",
      "  K   K  K   K  ",
      "                "
    ],
    nightowl: [
      "                ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      "KXXXXK    KXXXXK",
      " KXXK      KXXK ",
      "  KK KKKKKK KK  ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXOKXXKOXXK  ",
      "  KXXOKXXKOXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KK  KK  KK   ",
      "  K   K  K   K  ",
      "                "
    ],
    weekend: [
      "                ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      "KXXXXK    KXXXXK",
      " KXXK      KXXK ",
      "  KK KKKKKK KK  ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KK  KK  KK   ",
      "  K   K  K   K  ",
      "                "
    ]
  },
  // 🐘 ELEPHANT: PHP mascot - Improved with trunk & big ears
  elephant: {
    normal: [
      "                ",
      "  KKKKK  KKKKK  ",
      " KXXXXXKKXXXXXK ",
      " KXXXXXXKXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXWKXXKWXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXK    KXXXK ",
      " KXXK      KXXK ",
      " KXK        KXK ",
      " KXK        KXK ",
      "  K          K  ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "  KKKKK  KKKKK  ",
      " KXXXXXKKXXXXXK ",
      " KXXXXXXKXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXK    KXXXK ",
      " KXXK      KXXK ",
      " KXK        KXK ",
      " KXK        KXK ",
      "  K          K  ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "  K K K  K K K  ",
      " K     KK     K ",
      " K      K     K ",
      "  K          K  ",
      "   KXXXXXXXXK   ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      " K  K      K  K ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "     RRR        ",
      "  KKKKK  KKKKK  ",
      " KXXXXXKKXXXXXK ",
      " KXXXXXXKXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXRKXXKRXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXK    KXXXK ",
      " KXXK      KXXK ",
      " KXK        KXK ",
      " KXK   RR   KXK ",
      "  K          K  ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "  KKKKK  KKKKK  ",
      " KXXXXXKKXXXXXK ",
      " KXXXXXXKXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXOKXXKOXXK  ",
      "  KXXOKXXKOXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXK    KXXXK ",
      " KXXK      KXXK ",
      " KXK        KXK ",
      " KXK        KXK ",
      "  K          K  ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "  KKKKK  KKKKK  ",
      " KXXXXXKKXXXXXK ",
      " KXXXXXXKXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXK    KXXXK ",
      " KXXK      KXXK ",
      " KXK        KXK ",
      " KXK        KXK ",
      "  K          K  ",
      "                ",
      "                "
    ]
  },
  // ☕ COFFEE: Java mascot - Improved steaming mug with face
  coffee: {
    normal: [
      "     KK  KK     ",
      "      WW WW     ",
      "       W W      ",
      "    KKKKKKKKK   ",
      "   KXXXXXXXXXK  ",
      "   KXXXXXXXXXK K",
      "  KXXWKXXKWXXXKK",
      "  KXXKKXXKKXXK K",
      "  KXXXXXXXXXK K ",
      "  KXXK    KXXK  ",
      "   KXXXXXXXXK   ",
      "    KKKKKKKK    ",
      "   KKKKKKKKKKK  ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "                ",
      "                ",
      "    KKKKKKKKK   ",
      "   KXXXXXXXXXK  ",
      "   KXXXXXXXXXK K",
      "  KXXKKXXKKXXXKK",
      "  KXXXXXXXXXXK K",
      "  KXXXXXXXXXK K ",
      "  KXXK    KXXK  ",
      "   KXXXXXXXXK   ",
      "    KKKKKKKK    ",
      "   KKKKKKKKKKK  ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "     K    K     ",
      "      K  K      ",
      "                ",
      "    KKKKKKKKK   ",
      "   KXXXXXXXXXK  ",
      "   KXXXXXXXXXK K",
      "  KXXKKXXKKXXXKK",
      "  KXXXXXXXXXXK K",
      "  KXXXXXXXXXK K ",
      "  K K      K K  ",
      "   K        K   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "     KK  KK     ",
      "      WW WW     ",
      "       W W      ",
      "    KKKKKKKKK   ",
      "   KXXXXXXXXXK  ",
      "   KXXXXXXXXXK K",
      "  KXXRKXXKRXXXKK",
      "  KXXKKXXKKXXK K",
      "  KXXRRRRRXXXK  ",
      "  KXXK    KXXK  ",
      "   KXXXXXXXXK   ",
      "    KKKKKKKK    ",
      "   KKKKKKKKKKK  ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "     KK  KK     ",
      "      WW WW     ",
      "       W W      ",
      "    KKKKKKKKK   ",
      "   KXXXXXXXXXK  ",
      "   KXXXXXXXXXK K",
      "  KXXOKXXKOXXXKK",
      "  KXXOKXXKOXXK K",
      "  KXXXXXXXXXK K ",
      "  KXXK    KXXK  ",
      "   KXXXXXXXXK   ",
      "    KKKKKKKK    ",
      "   KKKKKKKKKKK  ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "     KK  KK     ",
      "      WW WW     ",
      "       W W      ",
      "    KKKKKKKKK   ",
      "   KXXXXXXXXXK  ",
      "   KXXXXXXXXXK K",
      "  KXXKKXXKKXXXKK",
      "  KXXXXXXXXXXK K",
      "  KXXXXXXXXXK K ",
      "  KXXK    KXXK  ",
      "   KXXXXXXXXK   ",
      "    KKKKKKKK    ",
      "   KKKKKKKKKKK  ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🐦 BIRD: Swift mascot - Improved with wing detail & better shape
  bird: {
    normal: [
      "                ",
      "       KKKKKK   ",
      "      KXXXXXXK  ",
      "     KXXXXXXXXK ",
      "   KKXXXXXXXXXK ",
      "  KOKKXWKXXXXXK ",
      " KOOOKXXKXXXXXK ",
      " KOOOKXXXXXXXXXK",
      "  KKXXXXXXXXXXK ",
      "   KXXXXXXXXXXK ",
      "    KXXXXXXXXK  ",
      "     KXXXXXXK   ",
      "      KKOOKK    ",
      "       KO OK    ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "       KKKKKK   ",
      "      KXXXXXXK  ",
      "     KXXXXXXXXK ",
      "   KKXXXXXXXXXK ",
      "  KOKKXKKXXXXXK ",
      " KOOOKXXXXXXXXXK",
      " KOOOKXXXXXXXXXK",
      "  KKXXXXXXXXXXK ",
      "   KXXXXXXXXXXK ",
      "    KXXXXXXXXK  ",
      "     KXXXXXXK   ",
      "      KKOOKK    ",
      "       KO OK    ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "       KKKKKK   ",
      "      KXXXXXXK  ",
      "     KXXXXXXXXK ",
      "   KKXXXXXXXXXK ",
      "  K KKX KXXXXXK ",
      " K   KXXXXXXXXXK",
      " K   KXXXXXXXXXK",
      "  KKXXXXXXXXXXK ",
      "   KXXXXXXXXXXK ",
      "    KXXXXXXXXK  ",
      "     K  K  K    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "        RRR     ",
      "       KKKKKK   ",
      "      KXXXXXXK  ",
      "     KXXXXXXXXK ",
      "   KKXXXXXXXXXK ",
      "  KOKKXRKXXXXXK ",
      " KOOOKXXKXXXXXK ",
      " KOOOKXXXXXXXXXK",
      "  KKXXXXXXXXXXK ",
      "   KXXXXXXXXXXK ",
      "    KXXXXXXXXK  ",
      "     KXXXXXXK   ",
      "      KKOOKK    ",
      "       KO OK    ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "       KKKKKK   ",
      "      KXXXXXXK  ",
      "     KXXXXXXXXK ",
      "   KKXXXXXXXXXK ",
      "  KOKKXOKXXXXXK ",
      " KOOOKXOKXXXXXK ",
      " KOOOKXXXXXXXXXK",
      "  KKXXXXXXXXXXK ",
      "   KXXXXXXXXXXK ",
      "    KXXXXXXXXK  ",
      "     KXXXXXXK   ",
      "      KKOOKK    ",
      "       KO OK    ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "       KKKKKK   ",
      "      KXXXXXXK  ",
      "     KXXXXXXXXK ",
      "   KKXXXXXXXXXK ",
      "  KOKKXKKXXXXXK ",
      " KOOOKXXXXXXXXXK",
      " KOOOKXXXXXXXXXK",
      "  KKXXXXXXXXXXK ",
      "   KXXXXXXXXXXK ",
      "    KXXXXXXXXK  ",
      "     KXXXXXXK   ",
      "      KKOOKK    ",
      "       KO OK    ",
      "                ",
      "                "
    ]
  },
  // 🤖 ROBOT: C++/C# mascot - Improved with antenna & LED details
  robot: {
    normal: [
      "       RR       ",
      "       KK       ",
      "    KKKKKKKK    ",
      "   KXXBBXXBBXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXWWXXWWXXXK ",
      " KXXXKKXXKKXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKKKKKKKXXXK ",
      " KXXKGGGGGKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXKXXKXXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "       KK       ",
      "    KKKKKKKK    ",
      "   KXXBBXXBBXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXKKXXKKXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKKKKKKKXXXK ",
      " KXXK     KXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXKXXKXXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                "
    ],
    ghost: [
      "       KK       ",
      "       KK       ",
      "    KKKKKKKK    ",
      "   KXX  XX  XK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXKKXXKKXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKKKKKKKXXXK ",
      " KXXKGGGGGKXXK  ",
      "  K  K    K  K  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "   RRR RR RRR   ",
      "       KK       ",
      "    KKKKKKKK    ",
      "   KXXRRXXRRXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXRRXXRRXXXK ",
      " KXXXKKXXKKXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKKKKKKKXXXK ",
      " KXXKRRRRRKKXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXKXXKXXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                "
    ],
    nightowl: [
      "       OO       ",
      "       KK       ",
      "    KKKKKKKK    ",
      "   KXXOOXXOOXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXOOXXOOXXXK ",
      " KXXXOOXXOOXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKKKKKKKXXXK ",
      " KXXKGGGGGKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXKXXKXXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "       KK       ",
      "    KKKKKKKK    ",
      "   KXXBBXXBBXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXKKXXKKXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKKKKKKKXXXK ",
      " KXXKGGGGGKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXKXXKXXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                "
    ]
  },
  // 🐳 WHALE: Docker mascot - Improved with water spout & container boxes
  whale: {
    normal: [
      "         BBB    ",
      "        KBKBK   ",
      "       KB B BK  ",
      "    KKKKKKKKKKK ",
      "   KXXXXXWWWWWK ",
      "  KXXXXXWWWWWWK ",
      " KXXWKXWWWWWWWK ",
      " KXXKKXWWWWWWWK ",
      " KXXXXXXXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KKXXXXXXKK   ",
      "     KKKKKK     ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "                ",
      "                ",
      "    KKKKKKKKKKK ",
      "   KXXXXXWWWWWK ",
      "  KXXXXXWWWWWWK ",
      " KXXKKXWWWWWWWK ",
      " KXXXXWWWWWWWWK ",
      " KXXXXXXXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KKXXXXXXKK   ",
      "     KKKKKK     ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "         K K    ",
      "        K K K   ",
      "       K     K  ",
      "    KKKKKKKKKKK ",
      "   KXXXXXWWWWWK ",
      "  KXXXXXWWWWWWK ",
      " KXXK XWWWWWWWK ",
      " KXX  XWWWWWWWK ",
      " KXXXXXXXXXXXXK ",
      "  K  K    K  K  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "    R    BBB    ",
      "   R R  KBKBK   ",
      "    R  KB B BK  ",
      "    KKKKKKKKKKK ",
      "   KXXXXXWWWWWK ",
      "  KXXXXXWWWWWWK ",
      " KXXRKXWWWWWWWK ",
      " KXXKKXWWWWWWWK ",
      " KXXXXXXXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KKXXXXXXKK   ",
      "     KKKKKK     ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "         BBB    ",
      "        KBKBK   ",
      "       KB B BK  ",
      "    KKKKKKKKKKK ",
      "   KXXXXXWWWWWK ",
      "  KXXXXXWWWWWWK ",
      " KXXOKXWWWWWWWK ",
      " KXXOKXWWWWWWWK ",
      " KXXXXXXXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KKXXXXXXKK   ",
      "     KKKKKK     ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "         BBB    ",
      "        KBKBK   ",
      "       KB B BK  ",
      "    KKKKKKKKKKK ",
      "   KXXXXXWWWWWK ",
      "  KXXXXXWWWWWWK ",
      " KXXKKXWWWWWWWK ",
      " KXXXXWWWWWWWWK ",
      " KXXXXXXXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      "   KKXXXXXXKK   ",
      "     KKKKKK     ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 💎 GEM: Ruby mascot - Improved faceted gem with sparkle
  gem: {
    normal: [
      "                ",
      "       WW       ",
      "      KWWK      ",
      "     KXXXXK     ",
      "    KXWXXXXK    ",
      "   KXXWXXXXXK   ",
      "  KXXXWXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "      KXXK      ",
      "       KK       ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "                ",
      "      KKKK      ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "      KXXK      ",
      "       KK       ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "       WW       ",
      "      KWWK      ",
      "     KXXXXK     ",
      "    KX  XXXK    ",
      "   KXX  XXXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     K    K     ",
      "      K  K      ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "    R      R    ",
      "       WW       ",
      "      KWWK      ",
      "     KXXXXK     ",
      "    KXRXXXXK    ",
      "   KXXRXXXXXK   ",
      "  KXXXRXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "      KXXK      ",
      "       RR       ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "       OO       ",
      "      KOOK      ",
      "     KXXXXK     ",
      "    KXOXXXXK    ",
      "   KXXOXXXOXK   ",
      "  KXXXOXXXXOXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "      KXXK      ",
      "       KK       ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "       WW       ",
      "      KWWK      ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "      KXXK      ",
      "       KK       ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🦎 CHAMELEON: HTML mascot - Improved with curly tail & color detail
  chameleon: {
    normal: [
      "                ",
      "      KKKKKK    ",
      "     KXXXXXXK   ",
      "    KXXXXXXXXK  ",
      "   KXXWKXXXXXXK ",
      "   KXXKKXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXXXXXXK   ",
      " KXXXXXXXXXK    ",
      "  KXXXXXXXK K   ",
      "   KXXXXXK  K   ",
      "    KKKKK KK    ",
      "         KXK    ",
      "          K     ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "      KKKKKK    ",
      "     KXXXXXXK   ",
      "    KXXXXXXXXK  ",
      "   KXXKKXXXXXXK ",
      "   KXXXXXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXXXXXXK   ",
      " KXXXXXXXXXK    ",
      "  KXXXXXXXK K   ",
      "   KXXXXXK  K   ",
      "    KKKKK KK    ",
      "         KXK    ",
      "          K     ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "      KKKKKK    ",
      "     KXXXXXXK   ",
      "    KXXXXXXXXK  ",
      "   KXX KXXXXXXK ",
      "   KXX  XXXXXXK ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXXXXXXK   ",
      " KXXXXXXXXXK    ",
      "  K  K  K K     ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "       RRR      ",
      "      KKKKKK    ",
      "     KXXXXXXK   ",
      "    KXXXXXXXXK  ",
      "   KXXRKXXXXXXK ",
      "   KXXKKXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXXXXXXK   ",
      " KXXXXXXXXXK    ",
      "  KXXXXXXXK K   ",
      "   KXXXXXK  K   ",
      "    KKKKK KK    ",
      "         KRK    ",
      "          K     ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "      KKKKKK    ",
      "     KXXXXXXK   ",
      "    KXXXXXXXXK  ",
      "   KXXOKXXXXXXK ",
      "   KXXOKXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXXXXXXK   ",
      " KXXXXXXXXXK    ",
      "  KXXXXXXXK K   ",
      "   KXXXXXK  K   ",
      "    KKKKK KK    ",
      "         KXK    ",
      "          K     ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "      KKKKKK    ",
      "     KXXXXXXK   ",
      "    KXXXXXXXXK  ",
      "   KXXKKXXXXXXK ",
      "   KXXXXXXXXXXK ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXXXXXXK   ",
      " KXXXXXXXXXK    ",
      "  KXXXXXXXK K   ",
      "   KXXXXXK  K   ",
      "    KKKKK KK    ",
      "         KXK    ",
      "          K     ",
      "                ",
      "                "
    ]
  },
  // 🕷️ SPIDER: JS/TS mascot - Improved with 8 legs & web detail
  spider: {
    normal: [
      "      KYK       ",
      "     KYXYK      ",
      "      KYK       ",
      "    KKKKKK      ",
      " K KXXXXXXK K   ",
      " KKXXXXXXXXKK   ",
      "  KXXWKKWXXK    ",
      " KXXXXKKXXXXK   ",
      " KXXXXXXXXXXK   ",
      "  KKXXXXXXKK    ",
      " K  KKKKKK  K   ",
      " K K      K K   ",
      "K K        K K  ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "     KYXYK      ",
      "      KYK       ",
      "    KKKKKK      ",
      " K KXXXXXXK K   ",
      " KKXXXXXXXXKK   ",
      "  KXXKKKKXXK    ",
      " KXXXXKKXXXXK   ",
      " KXXXXXXXXXXK   ",
      "  KKXXXXXXKK    ",
      " K  KKKKKK  K   ",
      " K K      K K   ",
      "K K        K K  ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "      K K       ",
      "     K   K      ",
      "      K K       ",
      "    KKKKKK      ",
      "   KXXXXXXK     ",
      "  KXXXXXXXXK    ",
      "  KXXK KK XK    ",
      " KXXXXKKXXXXK   ",
      " KXXXXXXXXXXK   ",
      "  K K    K K    ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "  R   KYK   R   ",
      "     KYRYK      ",
      "      KYK       ",
      "    KKKKKK      ",
      " K KXXXXXXK K   ",
      " KKXXXXXXXXKK   ",
      "  KXXRKKRXXK    ",
      " KXXXXKKXXXXK   ",
      " KXXXXXXXXXXK   ",
      "  KKXXXXXXKK    ",
      " K  KRRRRK  K   ",
      " K K      K K   ",
      "K K        K K  ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "      KYK       ",
      "     KYOYK      ",
      "      KYK       ",
      "    KKKKKK      ",
      " K KXXXXXXK K   ",
      " KKXXXXXXXXKK   ",
      "  KXXOKKOXK     ",
      " KXXXOKKOXK     ",
      " KXXXXXXXXXXK   ",
      "  KKXXXXXXKK    ",
      " K  KKKKKK  K   ",
      " K K      K K   ",
      "K K        K K  ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "      KYK       ",
      "     KYXYK      ",
      "      KYK       ",
      "    KKKKKK      ",
      " K KXXXXXXK K   ",
      " KKXXXXXXXXKK   ",
      "  KXXKKKKXXK    ",
      " KXXXXKKXXXXK   ",
      " KXXXXXXXXXXK   ",
      "  KKXXXXXXKK    ",
      " K  KKKKKK  K   ",
      " K K      K K   ",
      "K K        K K  ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🐍 SNAKE: Python mascot - Improved coiled snake with pattern
  snake: {
    normal: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXWKXXXXXK   ",
      "   KXKKXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KKKKXXXK    ",
      "   KXXXKXXXK    ",
      "  KXXXXXXXK     ",
      " KXXXXXXXK      ",
      " KXXXXXXXK      ",
      "  KXXXXXK       ",
      "   KKKKK        ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXKKXXXXXK   ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KKKKXXXK    ",
      "   KXXXKXXXK    ",
      "  KXXXXXXXK     ",
      " KXXXXXXXK      ",
      " KXXXXXXXK      ",
      "  KXXXXXK       ",
      "   KKKKK        ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KX KXXXXXK   ",
      "   KX  XXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KKKKXXXK    ",
      "   KXXXKXXXK    ",
      "  KXXXXXXXK     ",
      " K   K  K       ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      RR        ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXRKXXXXXK   ",
      "   KXKKXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KKKKXXXK    ",
      "   KXXXKXXXK    ",
      "  KXXXXXXXK     ",
      " KXXXXXXXK      ",
      " KXXXXXXXK      ",
      "  KXXXXXK       ",
      "   KKRRK        ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXOKXXXXXK   ",
      "   KXOKXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KKKKXXXK    ",
      "   KXXXKXXXK    ",
      "  KXXXXXXXK     ",
      " KXXXXXXXK      ",
      " KXXXXXXXK      ",
      "  KXXXXXK       ",
      "   KKKKK        ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "     KKKKKK     ",
      "    KXXXXXXK    ",
      "   KXKKXXXXXK   ",
      "   KXXXXXXXXK   ",
      "   KXXXXXXXXK   ",
      "    KKKKXXXK    ",
      "   KXXXKXXXK    ",
      "  KXXXXXXXK     ",
      " KXXXXXXXK      ",
      " KXXXXXXXK      ",
      "  KXXXXXK       ",
      "   KKKKK        ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🐹 GOPHER: Go mascot - Improved cute gopher with teeth
  gopher: {
    normal: [
      "                ",
      "   KKK    KKK   ",
      "  KXXXK  KXXXK  ",
      "   KXXXXXXXXXK  ",
      "  KXXWKXXKWXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXWWWWWXXXK  ",
      " KXXXKWWWKXXXK  ",
      " KXXXXKKKXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXK  KXXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "   KKK    KKK   ",
      "  KXXXK  KXXXK  ",
      "   KXXXXXXXXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXWWWWWXXXK  ",
      " KXXXKWWWKXXXK  ",
      " KXXXXKKKXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXK  KXXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "   K K    K K   ",
      "  K   K  K   K  ",
      "   KXXXXXXXXXK  ",
      "  KXX KXXK XXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXWWWWWXXXK  ",
      " KXXXKWWWKXXXK  ",
      " K  K      K  K ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      RRR       ",
      "   KKK    KKK   ",
      "  KXXXK  KXXXK  ",
      "   KXXXXXXXXXK  ",
      "  KXXRKXXKRXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXWWWWWXXXK  ",
      " KXXXKWWWKXXXK  ",
      " KXXXXKKKXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXK  KXXK   ",
      "    KK RR KK    ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "   KKK    KKK   ",
      "  KXXXK  KXXXK  ",
      "   KXXXXXXXXXK  ",
      "  KXXOKXXKOXXK  ",
      "  KXXOKXXKOXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXWWWWWXXXK  ",
      " KXXXKWWWKXXXK  ",
      " KXXXXKKKXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXK  KXXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "   KKK    KKK   ",
      "  KXXXK  KXXXK  ",
      "   KXXXXXXXXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      " KXXXWWWWWXXXK  ",
      " KXXXKWWWKXXXK  ",
      " KXXXXKKKXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXK  KXXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🐱 CAT: Default mascot - Improved cute cat with whiskers
  cat: {
    normal: [
      "                ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXWKXXXXKWXXK ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKXX  XXKXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKXXXXXXKXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "  K          K  ",
      " K K        K K ",
      " K  K      K  K ",
      "  K  KKKKKK  K  ",
      " KXXXXXXXXXXXXK ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKXXXXXXKXXK ",
      "  K  K    K  K  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "       RRR      ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXRKXXXXKRXXK ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKXXRRXXKXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXOKXXXXKOXXK ",
      " KXXOKXXXXKOXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKXX  XXKXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "  KK        KK  ",
      " KXXK      KXXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKXXXXXXKXXK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                "
    ]
  },
  // 🐧 TUX: Shell/Linux mascot - Improved penguin with belly detail
  tux: {
    normal: [
      "                ",
      "      KKKKK     ",
      "     KKKKKKKK   ",
      "    KKKKKKKKK   ",
      "   KKWKKKKKWKK  ",
      "   KKKKKKKKKKK  ",
      "  KKKKKKKKKKKKK ",
      "  KWWWWWWWWWWWK ",
      " KWWWWWWWWWWWWWK",
      " KWWWWWWWWWWWWWK",
      "  KWWWWWWWWWWWK ",
      "  KKK  O  KKKK  ",
      "      OOO       ",
      "      O O       ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "      KKKKK     ",
      "     KKKKKKKK   ",
      "    KKKKKKKKK   ",
      "   KKKKKKKKKK   ",
      "   KKKKKKKKKKK  ",
      "  KKKKKKKKKKKKK ",
      "  KWWWWWWWWWWWK ",
      " KWWWWWWWWWWWWWK",
      " KWWWWWWWWWWWWWK",
      "  KWWWWWWWWWWWK ",
      "  KKK  O  KKKK  ",
      "      OOO       ",
      "      O O       ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "      KKKKK     ",
      "     KKKKKKKK   ",
      "    KKKKKKKKK   ",
      "   KK KKKKK KK  ",
      "   KKKKKKKKKKK  ",
      "  KKKKKKKKKKKKK ",
      "  KWWWWWWWWWWWK ",
      " KWWWWWWWWWWWWWK",
      " KWWWWWWWWWWWWWK",
      "  K  K  O  K  K ",
      "      OOO       ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "       RRR      ",
      "      KKKKK     ",
      "     KKKKKKKK   ",
      "    KKKKKKKKK   ",
      "   KKRKKKKKRKK  ",
      "   KKKKKKKKKKK  ",
      "  KKKKKKKKKKKKK ",
      "  KWWWWWWWWWWWK ",
      " KWWWWWWWWWWWWWK",
      " KWWWWWWWWWWWWWK",
      "  KWWWWWWWWWWWK ",
      "  KKK  R  KKKK  ",
      "      ORO       ",
      "      O O       ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "      KKKKK     ",
      "     KKKKKKKK   ",
      "    KKKKKKKKK   ",
      "   KKOKKKKKOKK  ",
      "   KKOKKKKKOKK  ",
      "  KKKKKKKKKKKKK ",
      "  KWWWWWWWWWWWK ",
      " KWWWWWWWWWWWWWK",
      " KWWWWWWWWWWWWWK",
      "  KWWWWWWWWWWWK ",
      "  KKK  O  KKKK  ",
      "      OOO       ",
      "      O O       ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "      KKKKK     ",
      "     KKKKKKKK   ",
      "    KKKKKKKKK   ",
      "   KKKKKKKKKK   ",
      "   KKKKKKKKKKK  ",
      "  KKKKKKKKKKKKK ",
      "  KWWWWWWWWWWWK ",
      " KWWWWWWWWWWWWWK",
      " KWWWWWWWWWWWWWK",
      "  KWWWWWWWWWWWK ",
      "  KKK  O  KKKK  ",
      "      OOO       ",
      "      O O       ",
      "                ",
      "                "
    ]
  },
  unicorn: {
    normal: [
      '                ',
      '      Y         ',
      '    WWYWW       ',
      '   WKWWWWR      ',
      '   WWWWWRO      ',
      '    WWWWROY     ',
      '     WWROYG     ',
      '    WWROYGB     ',
      '   WWROYGBP     ',
      '  WWWWWGBP      ',
      '  WWWWWW        ',
      ' WW  WW         ',
      ' WW  WW         ',
      '                ',
      '                ',
      '                '
    ],
    happy: [
      '                ',
      '      Y         ',
      '    WWYWW       ',
      '   WBWWWWR      ', // B = Blue Eye (Sparkling/Happy)
      '   WWWWWRO      ',
      '    WWWWROY     ',
      '     WWROYG     ',
      '    WWROYGB     ',
      '   WWROYGBP     ',
      '  WWWWWGBP      ',
      '  WWWWWW        ',
      ' WW  WW         ',
      ' WW  WW         ',
      '                ',
      '                ',
      '                '
    ],
    sleep: [
      '                ',
      '      Y         ',
      '    WWYWW       ',
      '   WWWWWWR      ', // Eye removed from here
      '   WKWWWRO      ', // Eye moved down (Closed/Sleeping)
      '    WWWWROY     ',
      '     WWROYG     ',
      '    WWROYGB     ',
      '   WWROYGBP     ',
      '  WWWWWGBP      ',
      '  WWWWWW        ',
      ' WW  WW         ',
      ' WW  WW         ',
      '                ',
      '                ',
      '                '
    ],
    ghost: [
      '                ',
      '      K         ',
      '    KKKKK       ',
      '   KXXXXXK      ',
      '   KKKKKKK      ',
      '    KKKKKKK     ',
      '     KKKKKK     ',
      '    KKKKKKK     ',
      '   KKKKKKKK     ',
      '  KKKKKKKK      ',
      '  KKKKKK        ',
      ' KK  KK         ',
      ' KK  KK         ',
      '                ',
      '                ',
      '                '
    ],
    // --- NEW MOOD STATES ---
    hyper: [
      '                ',
      '    R Y         ', // Fire spark above
      '    WWYWW       ',
      '   WRWWWWR      ', // R = Red Fire Eyes
      '   WWWWWRO      ',
      '    WWWWROY     ',
      '     WWROYG     ',
      '    WWROYGB     ',
      '   WWROYGBP     ',
      '  WWWWWGBP      ',
      '  WWWWWW        ',
      ' WW  WW         ',
      ' WW  WW         ',
      '                ',
      '                ',
      '                '
    ],
    nightowl: [
      '                ',
      '      Y         ',
      '    WWYWW       ',
      '   WOWWWWR      ', // O = Big Orange Eyes (Wide Open)
      '   WOWWWRO      ', // Double row eyes (Very Awake)
      '    WWWWROY     ',
      '     WWROYG     ',
      '    WWROYGB     ',
      '   WWROYGBP     ',
      '  WWWWWGBP      ',
      '  WWWWWW        ',
      ' WW  WW         ',
      ' WW  WW         ',
      '                ',
      '                ',
      '                '
    ],
    weekend: [
      '                ',
      '      Y         ',
      '    WWYWW       ',
      '   WKKKWWR      ', // KKK = Sunglasses
      '   WWWWWRO      ',
      '    WWWWROY     ',
      '     WWROYG     ',
      '    WWROYGB     ',
      '   WWROYGBP     ',
      '  WWWWWGBP      ',
      '  WWWWWW        ',
      ' WW  WW         ',
      ' WW  WW         ',
      '                ',
      '                ',
      '                '
    ]
  },
  // --- NEW PETS ---
  // 🦊 FOX: Kotlin mascot - Improved with fluffy tail & snout
  fox: {
    normal: [
      "                ",
      "  KK        KK  ",
      " KWXK      KWXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXWKXXXXKWXXK ",
      " KXXKKXXXXKKXXK ",
      "  KXXWWWWWWXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK KKK",
      "     KKKKKKKKWWK",
      "           KWWWK",
      "            KKK ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "  KK        KK  ",
      " KWXK      KWXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXXK ",
      "  KXXWWWWWWXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK KKK",
      "     KKKKKKKKWWK",
      "           KWWWK",
      "            KKK ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "  K          K  ",
      " K K        K K ",
      " K  K      K  K ",
      "  K  KKKKKK  K  ",
      " KXXXXXXXXXXXXK ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXXK ",
      "  KXXWWWWWWXXK  ",
      "   K  K  K  K   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      RRR       ",
      "  KK        KK  ",
      " KWXK      KWXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXRKXXXXKRXXK ",
      " KXXKKXXXXKKXXK ",
      "  KXXWWRRWWXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK KKK",
      "     KKKKKKKKWRK",
      "           KRRRK",
      "            KKK ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "  KK        KK  ",
      " KWXK      KWXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXOKXXXXKOXXK ",
      " KXXOKXXXXKOXXK ",
      "  KXXWWWWWWXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK KKK",
      "     KKKKKKKKWWK",
      "           KWWWK",
      "            KKK ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "  KK        KK  ",
      " KWXK      KWXK ",
      " KXXXK    KXXXK ",
      "  KXXXKKKKKXXK  ",
      " KXXXXXXXXXXXXK ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXXK ",
      "  KXXWWWWWWXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK KKK",
      "     KKKKKKKKWWK",
      "           KWWWK",
      "            KKK ",
      "                ",
      "                "
    ]
  },
  // 🐦 HUMMINGBIRD: Dart/Flutter mascot - Improved with long beak & colorful feathers
  hummingbird: {
    normal: [
      "                ",
      "      KKKKK     ",
      "     KXXXXXK    ",
      "    KXXXXXXXK   ",
      "   KXXWKXXXXK   ",
      "   KXXKKXXXXK   ",
      "  KXXXXXXXXXK   ",
      " KXXXXXXXXXXXK  ",
      "KKKKXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KKOOKK     ",
      "      KO OK     ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "      KKKKK     ",
      "     KXXXXXK    ",
      "    KXXXXXXXK   ",
      "   KXXKKXXXXK   ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXK   ",
      " KXXXXXXXXXXXK  ",
      "KKKKXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KKOOKK     ",
      "      KO OK     ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "      KKKKK     ",
      "     KXXXXXK    ",
      "    KXXXXXXXK   ",
      "   KXX KXXXXK   ",
      "   KXX  XXXXK   ",
      "  KXXXXXXXXXK   ",
      " KXXXXXXXXXXXK  ",
      "K K KXXXXXXXXK  ",
      "   K  K  K  K   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "       RRR      ",
      "      KKKKK     ",
      "     KXXXXXK    ",
      "    KXXXXXXXK   ",
      "   KXXRKXXXXK   ",
      "   KXXKKXXXXK   ",
      "  KXXXXXXXXXK   ",
      " KXXXXXXXXXXXK  ",
      "KKKKXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KKOOKK     ",
      "      KO OK     ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "      KKKKK     ",
      "     KXXXXXK    ",
      "    KXXXXXXXK   ",
      "   KXXOKXXXXK   ",
      "   KXXOKXXXXK   ",
      "  KXXXXXXXXXK   ",
      " KXXXXXXXXXXXK  ",
      "KKKKXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KKOOKK     ",
      "      KO OK     ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "      KKKKK     ",
      "     KXXXXXK    ",
      "    KXXXXXXXK   ",
      "   KXXKKXXXXK   ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXK   ",
      " KXXXXXXXXXXXK  ",
      "KKKKXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KKOOKK     ",
      "      KO OK     ",
      "                ",
      "                ",
      "                "
    ]
  },
  // ⚙️ GEAR: C mascot - Improved mechanical gear with cogs
  gear: {
    normal: [
      "                ",
      "     K K K      ",
      "    KKKKKKK     ",
      "   KXXXXXXXK    ",
      "  KXXXXXXXXXK   ",
      " KKXXKXXXKXXKK  ",
      " KXXXKWWWKXXXK  ",
      " KXXXKKKKXXXXK  ",
      " KKXXKXXXKXXKK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "     K K K      ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "     K K K      ",
      "    KKKKKKK     ",
      "   KXXXXXXXK    ",
      "  KXXXXXXXXXK   ",
      " KKXXKXXXKXXKK  ",
      " KXXXKKKKKXXXK  ",
      " KXXXKKKKXXXXK  ",
      " KKXXKXXXKXXKK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "     K K K      ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "     K   K      ",
      "    K K K K     ",
      "   KXXXXXXXK    ",
      "  K XXXXXXX K   ",
      " K XXKXXXKXX K  ",
      " KXXXK   KXXXK  ",
      " KXXXK   KXXXK  ",
      " K XXKXXXKXX K  ",
      "  K       K     ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "    R     R     ",
      "     K K K      ",
      "    KKKKKKK     ",
      "   KXXXXXXXK    ",
      "  KXXXXXXXXXK   ",
      " KKXXKXXXKXXKK  ",
      " KXXXKRRRXXXK   ",
      " KXXXKKKKXXXXK  ",
      " KKXXKXXXKXXKK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "     K R K      ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "     K K K      ",
      "    KKKKKKK     ",
      "   KXXXXXXXK    ",
      "  KXXXXXXXXXK   ",
      " KKXXKXXXKXXKK  ",
      " KXXXKOOOKXXXK  ",
      " KXXXKKKKXXXXK  ",
      " KKXXKXXXKXXKK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "     K K K      ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "     K K K      ",
      "    KKKKKKK     ",
      "   KXXXXXXXK    ",
      "  KXXXXXXXXXK   ",
      " KKXXKXXXKXXKK  ",
      " KXXXKKKKKXXXK  ",
      " KXXXKKKKXXXXK  ",
      " KKXXKXXXKXXKK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "     K K K      ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🪜 LADDER: Scala mascot - Improved with 3D perspective
  ladder: {
    normal: [
      "                ",
      "   KK      KK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXKWWWWKXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "   KK      KK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXKKKKKXK    ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "   K        K   ",
      "   K K  K K K   ",
      "   K K    K K   ",
      "   K K  K K K   ",
      "   K K    K K   ",
      "   K K  K K K   ",
      "   K K    K K   ",
      "   K K  K K K   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      RRR       ",
      "   KK      KK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXKRRRRXK    ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KK  RR  KK   ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "   KK      KK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXKOOOOKXK   ",
      "   KXKOOOOKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "   KK      KK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXKKKKKXK    ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KXKKKKKKXK   ",
      "   KXK    KXK   ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🦉 OWL: R mascot - Wise owl with big eyes and ear tufts
  owl: {
    normal: [
      "                ",
      "                ",
      "   KK      KK   ",
      "  KXXK    KXXK  ",
      "  KXXKKKKKKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKWWKKWWKXXK ",
      " KXXKKKKKKKXXK  ",
      "  KXXXX  XXXXK  ",
      "  KXXXYYYYYXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "                ",
      "   KK      KK   ",
      "  KXXK    KXXK  ",
      "  KXXKKKKKKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKKKKKKKKKXK ",
      " KXXKKKKKKKXXK  ",
      "  KXXXX  XXXXK  ",
      "  KXXXYYYYYXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "                ",
      "   K        K   ",
      "  K  K    K  K  ",
      "  KXXKKKKKKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXX KK  KK XXK ",
      " KXXKKKKKKKXXK  ",
      "  KXXXX  XXXXK  ",
      "  K  XY  YX  K  ",
      "   K K    K K   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      RRR       ",
      "                ",
      "   KK      KK   ",
      "  KXXK    KXXK  ",
      "  KXXKKKKKKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKRRKKRRKXXK ",
      " KXXKKKKKKKXXK  ",
      "  KXXXX  XXXXK  ",
      "  KXXXRRRRXXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KR    RK    ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "                ",
      "   KK      KK   ",
      "  KXXK    KXXK  ",
      "  KXXKKKKKKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKOOKKOKKXXK ",
      " KXXKOOKKOKKXK  ",
      "  KXXXX  XXXXK  ",
      "  KXXXYYYYYXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "                ",
      "   KK      KK   ",
      "  KXXK    KXXK  ",
      "  KXXKKKKKKKXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXKKKKKKKKKXK ",
      " KXXKKKKKKKXXK  ",
      "  KXXXX  XXXXK  ",
      "  KXXXYYYYYXXK  ",
      "   KXXXXXXXXK   ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🐫 CAMEL: Perl mascot - Desert camel with distinctive hump
  camel: {
    normal: [
      "                ",
      "     KK         ",
      "    KXXK        ",
      "    KXXK   KKK  ",
      "   KXXXXK KXXXK ",
      "  KXXXXXXKXXXXK ",
      " KXXWKXXXXXXXXK ",
      " KXXKKXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      "  KXKK    KKXK  ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "     KK         ",
      "    KXXK        ",
      "    KXXK   KKK  ",
      "   KXXXXK KXXXK ",
      "  KXXXXXXKXXXXK ",
      " KXXKKXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      "  KXKK    KKXK  ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "     K K        ",
      "    K   K       ",
      "    KXXK   KKK  ",
      "   KXXXXK KXXXK ",
      "  KXXXXXXKXXXXK ",
      " KXXKKXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " K  X      X  K ",
      "  K K      K K  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      RRR       ",
      "     KXXK       ",
      "    KXXXK       ",
      "    KXXK   KKK  ",
      "   KXXXXK KXXXK ",
      "  KXXXXXXKXXXXK ",
      " KXXRKXXXXXXXXK ",
      " KXXKKXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      "  KXKR    RKXK  ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "     KK         ",
      "    KXXK        ",
      "    KXXK   KKK  ",
      "   KXXXXK KXXXK ",
      "  KXXXXXXKXXXXK ",
      " KXXOKXXXXXXXXK ",
      " KXXOKXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      "  KXKK    KKXK  ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "     KK         ",
      "    KXXK        ",
      "    KXXK   KKK  ",
      "   KXXXXK KXXXK ",
      "  KXXXXXXKXXXXK ",
      " KXXKKXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      " KXXXXXXXXXXXXK ",
      "  KXKK    KKXK  ",
      "   KK      KK   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },
  // --- WAVE 2 ---
  // 🦫 CAPYBARA: Lua mascot - Chill rounded rodent relaxing
  capybara: {
    normal: [
      "                ",
      "                ",
      "    KK    KK    ",
      "   KXXK  KXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXWKKKWKXXK  ",
      "  KXXKK  KKXXK  ",
      "   KXXWWWWXXK   ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXKK  KKXXK  ",
      "   KKK    KKK   ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "                ",
      "    KK    KK    ",
      "   KXXK  KXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXKKKKKXXK   ",
      "  KXXKK  KKXXK  ",
      "   KXXWWWWXXK   ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXKK  KKXXK  ",
      "   KKK    KKK   ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "                ",
      "    K      K    ",
      "   K  K  K  K   ",
      "  KXXXXXXXXXXK  ",
      "  KXX KK K XXK  ",
      "  KXXKK  KKXXK  ",
      "   KXXWWWWXXK   ",
      "   K  X  X  K   ",
      "  K K      K K  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      RRR       ",
      "                ",
      "    KK    KK    ",
      "   KXXK  KXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXRKKRKXXK   ",
      "  KXXKK  KKXXK  ",
      "   KXXRRRRXXK   ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXKR  RKXXK  ",
      "   KKK    KKK   ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "                ",
      "    KK    KK    ",
      "   KXXK  KXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXOKKOKOXXK  ",
      "  KXXOK  KOXXK  ",
      "   KXXWWWWXXK   ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXKK  KKXXK  ",
      "   KKK    KKK   ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "                ",
      "    KK    KK    ",
      "   KXXK  KXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXKKKKKXXK   ",
      "  KXXKK  KKXXK  ",
      "   KXXWWWWXXK   ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      "  KXXKK  KKXXK  ",
      "   KKK    KKK   ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🦙 ALPACA: Fluffy mascot - Long neck with fluffy wool
  alpaca: {
    normal: [
      "                ",
      "      KKKK      ",
      "     KWWWWK     ",
      "    KWWWWWWK    ",
      "    KWWWWWWK    ",
      "     KXXXXK     ",
      "    KXWKKWXK    ",
      "    KXKKKKXK    ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "      KKKK      ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "    KXKKKKXK    ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "      K  K      ",
      "     K    K     ",
      "    KXXXXXXK    ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "    KX KK XK    ",
      "    KXXXXXXK    ",
      "     K X  K     ",
      "    K K  K K    ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "       RRR      ",
      "      KWWWWK    ",
      "     KWWWWWK    ",
      "    KWWWWWWK    ",
      "    KWWWWWWK    ",
      "     KXXXXK     ",
      "    KXRKKRXK    ",
      "    KXKKKKXK    ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "   KXKR  RKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "      KKKK      ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "    KXOKKOXK    ",
      "    KXOKKOXK    ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "      KKKK      ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "    KXKKKKXK    ",
      "    KXXXXXXK    ",
      "     KXXXXK     ",
      "    KXXXXXXK    ",
      "   KXKK  KKXK   ",
      "    KK    KK    ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },
  // 🔥 PHOENIX: Legendary fire bird rising from flames
  phoenix: {
    normal: [
      "                ",
      "      RRRR      ",
      "     RROOORR    ",
      "    KOOOOOOOK   ",
      "   KOOWKKWOOOK  ",
      "   KOOKKKKOOK   ",
      "    KOOOOOOOK   ",
      "   KOOYYYYOOOK  ",
      "    KOOOOOOOK   ",
      "   RRKOOOOOKRR  ",
      "  RRR KKKKKK RR ",
      "   RRR    RRR   ",
      "     RRRRRR     ",
      "                ",
      "                ",
      "                "
    ],
    sleep: [
      "                ",
      "       RRR      ",
      "      ROOOR     ",
      "    KOOOOOOOK   ",
      "   KOOKKKKOOK   ",
      "   KOOOOOOOOK   ",
      "    KOOOOOOOK   ",
      "   KOOYYYYOOOK  ",
      "    KOOOOOOOK   ",
      "     KOOOOK     ",
      "      KKKKK     ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "      R  R      ",
      "     R    R     ",
      "    KOOOOOOOK   ",
      "   KOO KK OOK   ",
      "   KOOOOOOOOK   ",
      "    KOOOOOOOK   ",
      "   KOO Y  OOOK  ",
      "    K  OO  K    ",
      "   K K    K K   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "     RRRRR      ",
      "    RRRRRRRR    ",
      "   RRROOOOORRR  ",
      "    KOOOOOOOK   ",
      "   KOORKRKOOK   ",
      "   KOOKKKKOOK   ",
      "    KOOOOOOOK   ",
      "   KOORRRROOK   ",
      "    KOOOOOOOK   ",
      "  RRRKOOOOOKRRR ",
      " RRRR KKKKKK RRR",
      "  RRRR    RRRR  ",
      "   RRRRRRRRRR   ",
      "     RRRRRR     ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "      RRRR      ",
      "     RROOORR    ",
      "    KOOOOOOOK   ",
      "   KOOOKKOOOK   ",
      "   KOOOKKOOOK   ",
      "    KOOOOOOOK   ",
      "   KOOYYYYOOOK  ",
      "    KOOOOOOOK   ",
      "   RRKOOOOOKRR  ",
      "  RRR KKKKKK RR ",
      "   RRR    RRR   ",
      "     RRRRRR     ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "      RRRR      ",
      "     RROOORR    ",
      "    KOOOOOOOK   ",
      "   KOOKKKKOOK   ",
      "   KOOOOOOOOK   ",
      "    KOOOOOOOK   ",
      "   KOOYYYYOOOK  ",
      "    KOOOOOOOK   ",
      "   RRKOOOOOKRR  ",
      "  RRR KKKKKK RR ",
      "   RRR    RRR   ",
      "     RRRRRR     ",
      "                ",
      "                ",
      "                "
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WAVE 3: NEW LANGUAGE PETS
  // ═══════════════════════════════════════════════════════════════════════════

  // 🦎 SALAMANDER: Zig language mascot (16x16)
  // Design: Lizard with zig-zag pattern, vibrant orange-gold
  salamander: {
    normal: [
      "                ",
      "     KKKK       ",
      "    KXXXXK      ",
      "   KXWKXWXK     ",
      "   KXKKXXKK     ",
      "    KXXXXK      ",
      "     KXXK       ",
      " KKKKKXXKKKKK   ",
      "KXXXXXXXXXXXXXK ",
      " KKXKXKXKXKXKK  ",
      "   KXXXXXXXK    ",
      "   KXK   KXK    ",
      "   KK     KK    ",
      "                ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "                ",
      "     KKKK       ",
      "    KXXXXK      ",
      "   KXKKXXKK     ",
      "    KXXXXK      ",
      "KKKKKXXXXXXXXKKK",
      "KXXXXXXXXXXXXXXXK",
      " KKXKXKXKXKXKXKK",
      "   KXXXXXXXXXK  ",
      "    KKKKKKKKK   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "     K  K       ",
      "    K X X K     ",
      "   K X K X K    ",
      "   K X K X K    ",
      "    K X X K     ",
      "     K X K      ",
      " K K K X K K K  ",
      "K X X X X X X K ",
      " K K X K X K K  ",
      "   K X X X K    ",
      "   K K   K K    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "       Y  Y     ",
      "     KKKK       ",
      "    KXYXYK      ",
      "   KXRKKRXK     ",
      "   KXKKXXKK     ",
      "    KXYXYK      ",
      "     KXXK   Y   ",
      " KKKKKXXKKKKK   ",
      "KXYXYXYXYXYXYK  ",
      " KKXKXKXKXKXKK  ",
      "   KXXXXXXXK    ",
      "   KXK   KXK    ",
      "   KK     KK    ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "     KKKK       ",
      "    KXXXXK      ",
      "   KXOKKOXK     ",
      "   KXKKXXKK     ",
      "    KXXXXK      ",
      "     KXXK       ",
      " KKKKKXXKKKKK   ",
      "KXXXXXXXXXXXXXK ",
      " KKXKXKXKXKXKK  ",
      "   KXXXXXXXK    ",
      "   KXK   KXK    ",
      "   KK     KK    ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "                ",
      "     KKKK       ",
      "    KXXXXK      ",
      "   KXKKXXKK     ",
      "    KXXXXK      ",
      "KKKKKXXXXXXXXKKK",
      "KXXXXXXXXXXXXXXXK",
      " KKXKXKXKXKXKXKK",
      "   KXXXXXXXXXK  ",
      "    KKKKKKKKK   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },

  // 🦔 HEDGEHOG: Haskell language mascot (16x16)
  // Design: Cute hedgehog with spiky back, purple-grey
  hedgehog: {
    normal: [
      "                ",
      "    KKKKKKK     ",
      "   KKKKKKKKK    ",
      "  KKXKXKXKXKK   ",
      " KKXXXXXXXXXKK  ",
      " KXXXWKWXXXXK   ",
      " KXXXXKXXXXXK   ",
      " KXXXKKKXXXK    ",
      "  KXXXXXXXK     ",
      "   KXXXXXK      ",
      "   KXK KXK      ",
      "   KK   KK      ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "                ",
      "    KKKKKKK     ",
      "   KKKKKKKKK    ",
      "  KKXKXKXKXKK   ",
      " KKXXXXXXXXXKK  ",
      " KXXXKKXXXXXXK  ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KKKKKKKKK    ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "    K K K K     ",
      "   K K K K K    ",
      "  K X X X X K   ",
      " K X X X X X K  ",
      " K X K K X X    ",
      " K X X X X X    ",
      " K X K K X X    ",
      "  K X X X X     ",
      "   K X X X      ",
      "   K K K K      ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      Y   Y     ",
      "    KKKKKKK     ",
      "   KKYKYKYKKK   ",
      "  KKXKXKXKXKK   ",
      " KKXXXXXXXXXKK  ",
      " KXXRWKWRXXXK   ",
      " KXXXXKXXXXXK   ",
      " KXXXKKKXXXK    ",
      "  KXXXXXXXK   Y ",
      "   KXXXXXK      ",
      "   KXK KXK      ",
      "   KK   KK      ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "    KKKKKKK     ",
      "   KKKKKKKKK    ",
      "  KKXKXKXKXKK   ",
      " KKXXXXXXXXXKK  ",
      " KXXXOKOXXXXK   ",
      " KXXXXKXXXXXK   ",
      " KXXXKKKXXXK    ",
      "  KXXXXXXXK     ",
      "   KXXXXXK      ",
      "   KXK KXK      ",
      "   KK   KK      ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "                ",
      "    KKKKKKK     ",
      "   KKKKKKKKK    ",
      "  KKXKXKXKXKK   ",
      " KKXXXXXXXXXKK  ",
      " KXXXKKXXXXXXK  ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KKKKKKKKK    ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },

  // 🐙 OCTOPUS: Clojure language mascot (16x16)
  // Design: Cute octopus with 8 tentacles, blue
  octopus: {
    normal: [
      "                ",
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXWKXXKWXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KXKXKXXXXKXKXK ",
      " XKXK KXXK KXKX ",
      "  KK   KK   KK  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "                ",
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXXXXXXKXK ",
      "  KKKKKKKKKKKK  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "     K K K K    ",
      "   K X X X X K  ",
      "  K X K X K X K ",
      "  K X K X K X K ",
      "  K X X X X X K ",
      "   K X X X X K  ",
      "  K X X X X X K ",
      " K X K X X K X K",
      " X K K K K K K X",
      "  K     K   K   ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "   Y        Y   ",
      "     KKKKKK     ",
      "   KKXYXYXYKK   ",
      "  KXXRKXXKRXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXYYXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KXKXKXXXXKXKXK ",
      " XKXK KXXK KXKX ",
      "  KK   KK   KK  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXOKXXKOXXK  ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KXKXKXXXXKXKXK ",
      " XKXK KXXK KXKX ",
      "  KK   KK   KK  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "                ",
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXKKXXKKXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXXXXXXKXK ",
      "  KKKKKKKKKKKK  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },

  // 🐜 ANT: Assembly language mascot (16x16)
  // Design: Strong ant carrying a bit, dark grey
  ant: {
    normal: [
      "  K         K   ",
      "   K       K    ",
      "    KK   KK     ",
      "     KKKKK      ",
      "    KWKXKWK     ",
      "    KKKXKKK     ",
      "     KXXXK      ",
      "      KXK       ",
      "    KKXXXKK     ",
      "   KXXXXXXXK    ",
      "  KX  KXK  XK   ",
      " KX    X    XK  ",
      "       K        ",
      "      K K       ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "    K       K   ",
      "     KK   KK    ",
      "      KKKKK     ",
      "     KKXXXKK    ",
      "     KKKXKKK    ",
      "      KXXXK     ",
      "       KXK      ",
      "   KKXXXXXXXKK  ",
      "  KXXXXXXXXXXXK ",
      "   KKKKKKKKKKK  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "  K         K   ",
      "   K       K    ",
      "    K   K K     ",
      "     K K K      ",
      "    K K X K     ",
      "    K K X K     ",
      "     K X X      ",
      "      K X       ",
      "    K X X X K   ",
      "   K X X X X K  ",
      "  K   K X K  K  ",
      " K    X     K   ",
      "       K        ",
      "      K K       ",
      "                ",
      "                "
    ],
    hyper: [
      "  K    Y    K   ",
      "   K       K    ",
      "    KK   KK     ",
      "     KKKKK      ",
      "    KRKKRKK     ",
      "    KKKXKKK     ",
      "     KYXYK      ",
      "      KXK       ",
      "    KKXXXKK     ",
      "   KXXXXXXXK    ",
      "  KX  KXK  XK   ",
      " KX    X    XK  ",
      "       K     Y  ",
      "      K K       ",
      "                ",
      "                "
    ],
    nightowl: [
      "  K         K   ",
      "   K       K    ",
      "    KK   KK     ",
      "     KKKKK      ",
      "    KOKXKOK     ",
      "    KKKXKKK     ",
      "     KXXXK      ",
      "      KXK       ",
      "    KKXXXKK     ",
      "   KXXXXXXXK    ",
      "  KX  KXK  XK   ",
      " KX    X    XK  ",
      "       K        ",
      "      K K       ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "    K       K   ",
      "     KK   KK    ",
      "      KKKKK     ",
      "     KKXXXKK    ",
      "     KKKXKKK    ",
      "      KXXXK     ",
      "       KXK      ",
      "   KKXXXXXXXKK  ",
      "  KXXXXXXXXXXXK ",
      "   KKKKKKKKKKK  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },

  // 🦕 DINO: COBOL language mascot (16x16)
  // Design: Friendly brontosaurus, ancient but alive!
  dino: {
    normal: [
      "                ",
      "        KKKK    ",
      "       KXXXXK   ",
      "      KXWKWXK   ",
      "      KXKKXK    ",
      "       KXXK     ",
      "        KXK     ",
      "  KK    KXKK    ",
      " KXXK   KXXK    ",
      " KXXXKKKXXXK    ",
      " KXXXXXXXXXK    ",
      "  KXXXXXXXK     ",
      "  KXK   KXK     ",
      "  KK     KK     ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "                ",
      "        KKKK    ",
      "       KXXXXK   ",
      "      KKKKXXK   ",
      "       KXXK     ",
      "        KXK     ",
      "  KK    KXKKKKK ",
      " KXXKKKKXXXXXK  ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KKKKKKKKK    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "        K K K   ",
      "       K X X K  ",
      "      K X K X K ",
      "      K X K X   ",
      "       K X K    ",
      "        K X     ",
      "  K     K X K   ",
      " K X K  K X X   ",
      " K X X K X X K  ",
      " K X X X X X K  ",
      "  K X X X X K   ",
      "  K X   K X     ",
      "  K     K       ",
      "                ",
      "                "
    ],
    hyper: [
      "                ",
      "        KKKK  Y ",
      "       KXYYXK   ",
      "      KXRKRXK   ",
      "      KXKKXK    ",
      "       KXXK     ",
      "        KXK     ",
      "  KK    KXKK    ",
      " KXXK   KXXK    ",
      " KXXXKKKXXXK    ",
      " KXXXXXXXXXK    ",
      "  KXXXXXXXK     ",
      "  KXK   KXK     ",
      "  KK     KK   Y ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "        KKKK    ",
      "       KXXXXK   ",
      "      KXOKOXK   ",
      "      KXKKXK    ",
      "       KXXK     ",
      "        KXK     ",
      "  KK    KXKK    ",
      " KXXK   KXXK    ",
      " KXXXKKKXXXK    ",
      " KXXXXXXXXXK    ",
      "  KXXXXXXXK     ",
      "  KXK   KXK     ",
      "  KK     KK     ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "                ",
      "        KKKK    ",
      "       KXXXXK   ",
      "      KKKKXXK   ",
      "       KXXK     ",
      "        KXK     ",
      "  KK    KXKKKKK ",
      " KXXKKKKXXXXXK  ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KKKKKKKKK    ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  },

  // 🦁 LION: Nim language mascot (16x16)
  // Design: Majestic lion with golden mane
  lion: {
    normal: [
      "                ",
      "   KKKKKKKKK    ",
      "  KXXXXXXXXXK   ",
      " KXXKXXXXXXKXK  ",
      " KXXXWKXKWXXK   ",
      " KXXXKKXKKXXK   ",
      " KXXXKXXXKXXK   ",
      "  KXKKXKKXKK    ",
      "   KXXXXXXXK    ",
      "    KXXXXXK     ",
      "    KXKXKXK     ",
      "    KKXKXKK     ",
      "     K K K      ",
      "                ",
      "                ",
      "                "
    ],
    sleeping: [
      "                ",
      "                ",
      "   KKKKKKKKK    ",
      "  KXXXXXXXXXK   ",
      " KXXKKXXXKKXK   ",
      " KXXXXXXXXXXXK  ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KXXXXXK     ",
      "     KKKKK      ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      "                ",
      "   K K K K K    ",
      "  K X X X X K   ",
      " K X K X X K K  ",
      " K X X K K X K  ",
      " K X X K K X K  ",
      " K X X K X X K  ",
      "  K X K X K K   ",
      "   K X X X X    ",
      "    K X X X     ",
      "    K X K X     ",
      "    K K K K     ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "      Y   Y     ",
      "   KKKKKKKKK    ",
      "  KXYXYXYXYK    ",
      " KXXKXXXXXXKXK  ",
      " KXXRWKXKWRXK   ",
      " KXXXKKXKKXXK   ",
      " KXXXKXXXKXXK   ",
      "  KXKKXKKXKK    ",
      "   KXXXXXXXK    ",
      "    KXXXXXK   Y ",
      "    KXKXKXK     ",
      "    KKXKXKK     ",
      "     K K K      ",
      "                ",
      "                ",
      "                "
    ],
    nightowl: [
      "                ",
      "   KKKKKKKKK    ",
      "  KXXXXXXXXXK   ",
      " KXXKXXXXXXKXK  ",
      " KXXXOKXKOXK    ",
      " KXXXKKXKKXXK   ",
      " KXXXKXXXKXXK   ",
      "  KXKKXKKXKK    ",
      "   KXXXXXXXK    ",
      "    KXXXXXK     ",
      "    KXKXKXK     ",
      "    KKXKXKK     ",
      "     K K K      ",
      "                ",
      "                ",
      "                "
    ],
    weekend: [
      "                ",
      "                ",
      "   KKKKKKKKK    ",
      "  KXXXXXXXXXK   ",
      " KXXKKXXXKKXK   ",
      " KXXXXXXXXXXXK  ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KXXXXXK     ",
      "     KKKKK      ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ]
  }
};

// --- SEASONAL EVENT SYSTEM ---

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VIETNAMESE/CHINESE LUNAR CALENDAR - Complete Algorithm
 * Based on Hồ Ngọc Đức's algorithm (https://www.informatik.uni-leipzig.de/~duc/amlich/)
 * Handles leap months correctly - Works for ANY year!
 * Accuracy: ~99% for years 2000-2100 (1-day error possible due to astronomical precision)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const PI = Math.PI;

/**
 * Convert Gregorian date to Julian Day Number
 * @param {number} dd - Day
 * @param {number} mm - Month (1-12)
 * @param {number} yy - Year
 * @returns {number} Julian Day Number
 */
function jdFromDate(dd, mm, yy) {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

/**
 * Convert Julian Day Number to Gregorian date
 * @param {number} jd - Julian Day Number
 * @returns {[number, number, number]} [day, month, year]
 */
function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

/**
 * Calculate the Julian Day of a New Moon (Sóc)
 * Using Hồ Ngọc Đức's algorithm (1900 reference)
 * @param {number} k - Lunation number
 * @returns {number} Julian Day of New Moon
 */
function NewMoon(k) {
  const T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  
  // Mean new moon
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  
  // Sun's mean anomaly
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  // Moon's mean anomaly
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  // Moon's argument of latitude
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  
  // Corrections
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 += 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  
  // Delta T correction
  let deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  
  return Jd1 + C1 - deltat;
}

/**
 * Calculate Sun's longitude at a given Julian Day
 * @param {number} jdn - Julian Day Number
 * @returns {number} Sun longitude in radians (0-2π)
 */
function SunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525; // Time from J2000.0
  const T2 = T * T;
  const dr = PI / 180;
  
  // Mean anomaly
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  // Mean longitude
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  // Equation of center
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  // True longitude
  let L = L0 + DL;
  L = L * dr;
  // Normalize to 0-2π
  L = L - PI * 2 * Math.floor(L / (PI * 2));
  return L;
}

/**
 * Get Sun longitude sector (0-11, each sector = 30° = π/6)
 * @param {number} dayNumber - Julian Day Number
 * @param {number} timeZone - Timezone offset
 * @returns {number} Sector 0-11
 */
function getSunLongitude(dayNumber, timeZone) {
  return Math.floor(SunLongitude(dayNumber - 0.5 - timeZone / 24.0) / PI * 6);
}

/**
 * Get the Julian Day of a New Moon adjusted for timezone
 * @param {number} k - Lunation number
 * @param {number} timeZone - Timezone offset
 * @returns {number} Julian Day Number (integer, local date)
 */
function getNewMoonDay(k, timeZone) {
  return Math.floor(NewMoon(k) + 0.5 + timeZone / 24.0);
}

/**
 * Find the lunar month 11 (tháng 11 âm) of a given year
 * Month 11 is the month containing Winter Solstice
 * @param {number} yy - Gregorian year
 * @param {number} timeZone - Timezone offset
 * @returns {number} Julian Day of the start of lunar month 11
 */
function getLunarMonth11(yy, timeZone) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  // Month 11 must contain Winter Solstice (sun longitude sector 9)
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Determine the offset of leap month (if any) in a lunar year
 * @param {number} a11 - Julian Day of month 11 of previous year
 * @param {number} timeZone - Timezone offset
 * @returns {number} Leap month offset
 */
function getLeapMonthOffset(a11, timeZone) {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  
  return i - 1;
}

/**
 * Convert Lunar date to Solar (Gregorian) date
 * @param {number} lunarDay - Lunar day (1-30)
 * @param {number} lunarMonth - Lunar month (1-12)
 * @param {number} lunarYear - Lunar year
 * @param {number} lunarLeap - Is this a leap month? (0 or 1)
 * @param {number} timeZone - Timezone offset
 * @returns {[number, number, number]} [day, month, year] in Gregorian
 */
function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;
  
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (lunarLeap !== 0 && lunarMonth !== leapMonth) {
      return [0, 0, 0]; // Invalid leap month
    } else if (lunarLeap !== 0 || off >= leapOff) {
      off += 1;
    }
  }
  
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Calculate Lunar New Year (Tết) for a given Gregorian year
 * Returns the date range for celebration (2 days before to 6 days after)
 * 
 * @param {number} year - Gregorian year
 * @returns {{ start: [number, number], end: [number, number] }}
 */
function calculateLunarNewYear(year) {
  const timeZone = 7; // Vietnam timezone (use 8 for China)
  
  // Tết is lunar day 1, month 1 of the lunar year
  const [day, month, solarYear] = convertLunar2Solar(1, 1, year, 0, timeZone);
  
  // Calculate celebration range
  // Start: 2 days before (New Year's Eve preparations)
  const startDate = new Date(solarYear, month - 1, day);
  startDate.setDate(startDate.getDate() - 2);
  
  // End: 6 days after (week of celebration)
  const endDate = new Date(solarYear, month - 1, day);
  endDate.setDate(endDate.getDate() + 6);
  
  return {
    start: [startDate.getMonth() + 1, startDate.getDate()],
    end: [endDate.getMonth() + 1, endDate.getDate()]
  };
}

/**
 * Calculate Mid-Autumn Festival (Tết Trung Thu) for a given year
 * Mid-Autumn is the 15th day of the 8th lunar month
 * 
 * @param {number} year - Gregorian year
 * @returns {[number, number]} [month, day]
 */
function calculateMidAutumn(year) {
  const timeZone = 7; // Vietnam timezone
  const [day, month] = convertLunar2Solar(15, 8, year, 0, timeZone);
  return [month, day];
}

/**
 * Calculate Diwali date using lunar calendar
 * Diwali falls on the new moon (Amavasya) of Hindu month Kartik
 * This is typically the new moon between mid-October and mid-November
 * 
 * @param {number} year - Gregorian year
 * @returns {[number, number]} [month, day]
 */
function calculateDiwali(year) {
  const timeZone = 5.5; // India timezone (IST = UTC+5:30)
  
  // Find new moons around October-November
  const oct15JD = jdFromDate(15, 10, year);
  const k = Math.floor((oct15JD - 2415021.076998695) / 29.530588853 + 0.5);
  
  // Check new moons around this period
  const candidates = [];
  for (let i = -1; i <= 1; i++) {
    const nmJD = getNewMoonDay(k + i, timeZone);
    const [d, m, y] = jdToDate(nmJD);
    candidates.push({ jd: nmJD, day: d, month: m, year: y });
  }
  
  // Diwali is the new moon between Oct 15 and Nov 15
  for (const c of candidates) {
    if ((c.month === 10 && c.day >= 15) || (c.month === 11 && c.day <= 15)) {
      return [c.month, c.day];
    }
  }
  
  // Fallback: closest to Nov 1
  const nov1JD = jdFromDate(1, 11, year);
  let closest = candidates[0];
  let minDiff = Math.abs(candidates[0].jd - nov1JD);
  for (const c of candidates) {
    const diff = Math.abs(c.jd - nov1JD);
    if (diff < minDiff) {
      minDiff = diff;
      closest = c;
    }
  }
  
  return [closest.month, closest.day];
}

/**
 * Calculate Easter Sunday (Western/Gregorian) using the Anonymous Gregorian Algorithm
 * This algorithm works for any year from 1583 onwards (after Gregorian calendar adoption)
 * Reference: https://en.wikipedia.org/wiki/Date_of_Easter#Anonymous_Gregorian_algorithm
 * 
 * @param {number} year - The year to calculate Easter for
 * @returns {[number, number]} [month, day] where month is 3 (March) or 4 (April)
 */
function calculateEaster(year) {
  // Anonymous Gregorian Algorithm (Meeus/Jones/Butcher)
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return [month, day];
}

/**
 * Calculate US Thanksgiving (4th Thursday of November)
 * @param {number} year
 * @returns {number} Day of month
 */
function getThanksgivingDay(year) {
  // November 1st of the given year
  const nov1 = new Date(year, 10, 1); // Month is 0-indexed
  const dayOfWeek = nov1.getDay(); // 0 = Sunday, 4 = Thursday
  // Calculate first Thursday
  const firstThursday = dayOfWeek <= 4 ? (4 - dayOfWeek + 1) : (11 - dayOfWeek + 4 + 1);
  // 4th Thursday
  return firstThursday + 21;
}

/**
 * Calculate Holi (Festival of Colors) - Hindu lunar calendar
 * Holi falls on the full moon day (Purnima) in the Hindu month of Phalguna
 * This is typically in late February or March
 * Uses lunar calculation: Full moon closest to spring equinox
 * 
 * @param {number} year - Gregorian year
 * @returns {[number, number]|null} [month, day] or null if cannot calculate
 */
function calculateHoli(year) {
  // Holi is on the full moon (Purnima) of Phalguna month
  // This is approximately 15 days after the new moon in Feb/Mar
  // We can calculate by finding new moon, then adding ~15 days for full moon
  
  // Find new moon in February or March using our lunar algorithm
  const timeZone = 5.5; // India Standard Time (+5:30)
  
  // Get lunar month 11 of previous year to establish reference
  const jd = jdFromDate(1, 1, year);
  
  // Find new moons from January to March
  const candidates = [];
  for (let month = 1; month <= 3; month++) {
    const off = jdFromDate(15, month, year) - 2415021;
    const k = Math.floor(off / 29.530588853);
    
    // Check this new moon and nearby ones
    for (let dk = -1; dk <= 1; dk++) {
      const newMoonJd = getNewMoonDay(k + dk);
      const fullMoonJd = newMoonJd + 15; // Full moon is ~15 days after new moon
      const [d, m, y] = jdToDate(fullMoonJd);
      
      // Holi typically falls in February-March, around day 15-30 of lunar month Phalguna
      if (y === year && m >= 2 && m <= 3) {
        candidates.push({ month: m, day: d, jd: fullMoonJd });
      }
    }
  }
  
  // Holi is typically the last full moon before spring equinox (Mar 21) or closest to it
  // Filter for unique dates and find the one closest to but before late March
  const unique = [...new Map(candidates.map(c => [`${c.month}-${c.day}`, c])).values()];
  
  // Find full moon in March (preferably) or late February
  const marchFullMoon = unique.find(c => c.month === 3 && c.day <= 20);
  if (marchFullMoon) {
    return [marchFullMoon.month, marchFullMoon.day];
  }
  
  // Fall back to any March full moon or late Feb
  const anyFullMoon = unique.find(c => c.month === 3 || (c.month === 2 && c.day >= 20));
  if (anyFullMoon) {
    return [anyFullMoon.month, anyFullMoon.day];
  }
  
  // Last resort: return first candidate in Feb/Mar
  if (unique.length > 0) {
    return [unique[0].month, unique[0].day];
  }
  
  return null;
}

/**
 * Calculate Hanukkah start date (Jewish Festival of Lights)
 * Hanukkah starts on 25 Kislev in the Hebrew calendar
 * Falls between late November and late December
 * 
 * Uses approximation based on lunar cycles from Rosh Hashanah
 * 
 * @param {number} year - Gregorian year
 * @returns {[number, number]|null} [month, day] start date
 */
function calculateHanukkah(year) {
  // Hanukkah starts 25 Kislev, which is approximately 85 days after Rosh Hashanah
  // Rosh Hashanah (1 Tishrei) typically falls in September/October
  
  // Jewish calendar approximation using molad (new moon) calculations
  // The Jewish year starting in fall of Gregorian year Y is Hebrew year Y+3761
  const hebrewYear = year + 3761;
  
  // Calculate the molad of Tishrei (approximately)
  // Reference: Molad of year 1 was Oct 7, 3761 BCE (Julian) = JD 347997.5
  // Each Hebrew year is approximately 12.368 lunar months
  
  // Simplified calculation: Find new moon in September/October
  const off = jdFromDate(1, 9, year) - 2415021;
  const k = Math.floor(off / 29.530588853);
  
  // Find the new moon closest to early September
  let roshHashanahJd = null;
  for (let dk = 0; dk <= 2; dk++) {
    const nmJd = getNewMoonDay(k + dk);
    const [d, m, y] = jdToDate(nmJd);
    if (y === year && m >= 9 && m <= 10 && d >= 5) {
      roshHashanahJd = nmJd;
      break;
    }
  }
  
  if (!roshHashanahJd) {
    // Fallback: approximate to mid-September
    roshHashanahJd = jdFromDate(15, 9, year);
  }
  
  // Kislev is the 3rd month after Tishrei, 25 Kislev is approximately:
  // 30 (rest of Tishrei) + 29 (Cheshvan) + 25 (Kislev) = ~84 days after 1 Tishrei
  // But we need to account for variable month lengths
  
  // Approximate: 2 lunar months (59 days) + 25 days = 84 days
  const hanukkahJd = roshHashanahJd + 84;
  const [d, m, y] = jdToDate(hanukkahJd);
  
  // Adjust if year is wrong
  if (y !== year) {
    return [12, 15]; // Default fallback
  }
  
  return [m, d];
}

/**
 * Calculate Eid al-Fitr (End of Ramadan) - Islamic lunar calendar
 * Eid al-Fitr is on 1 Shawwal, the 10th month of the Islamic calendar
 * The Islamic calendar is purely lunar (no leap months)
 * 
 * @param {number} year - Gregorian year
 * @returns {[number, number]|null} [month, day]
 */
function calculateEidAlFitr(year) {
  // Islamic calendar is purely lunar: 12 months × 29.53 days = ~354.36 days/year
  // The calendar shifts ~10-11 days earlier each Gregorian year
  
  // Reference: Eid al-Fitr 2024 was approximately April 10
  // We can calculate by finding the appropriate new moon
  
  // Islamic month starts at new moon sighting
  // Ramadan is the 9th month, Shawwal (Eid) is the 10th
  
  // Approximate: Count lunations from a known reference
  // Reference: 1 Muharram 1445 AH = July 19, 2023 (new moon)
  const refJd = jdFromDate(19, 7, 2023); // Reference Islamic new year
  const refLunation = Math.floor((refJd - 2415021) / 29.530588853);
  
  // Calculate which Islamic year falls in this Gregorian year
  // Islamic year 1445 started July 2023
  // Each Islamic year is ~354 days, so advances ~11 days per Gregorian year
  
  // Find Shawwal (month 10) new moon for the Islamic year containing most of this Gregorian year
  const targetJd = jdFromDate(1, 4, year); // Eid typically falls around March-May
  const off = targetJd - 2415021;
  const approxK = Math.floor(off / 29.530588853);
  
  // Search for new moons in the March-May period
  const candidates = [];
  for (let dk = -2; dk <= 3; dk++) {
    const nmJd = getNewMoonDay(approxK + dk);
    const [d, m, y] = jdToDate(nmJd);
    if (y === year && m >= 3 && m <= 5) {
      candidates.push({ month: m, day: d, jd: nmJd });
    }
  }
  
  // Eid al-Fitr is typically around April in 2024-2030
  // The new moon marking start of Shawwal
  if (candidates.length > 0) {
    // Return the most likely candidate (first in April, or closest to early April)
    const april = candidates.find(c => c.month === 4);
    if (april) {
      return [april.month, april.day];
    }
    return [candidates[0].month, candidates[0].day];
  }
  
  return null;
}

/**
 * Get current seasonal event based on date and timezone
 * PRIORITY ORDER:
 * 1. Major Holidays (Solar + Lunar + Religious)
 * 2. Cultural Celebrations
 * 3. Easter Eggs (Friday 13th, April Fools)
 * 4. Default (null)
 * 
 * @param {string} timezone - IANA timezone string
 * @returns {string|null} Event key or null if no event
 */
function getSeasonalEvent(timezone = 'UTC') {
  const now = new Date();

  // Get local date parts in specified timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  });
  const parts = formatter.formatToParts(now);
  const month = parseInt(parts.find(p => p.type === 'month').value, 10);
  const day = parseInt(parts.find(p => p.type === 'day').value, 10);
  const year = parseInt(parts.find(p => p.type === 'year').value, 10);
  const weekday = parts.find(p => p.type === 'weekday').value;

  // Map weekday to day number (0 = Sunday, 6 = Saturday)
  const weekdayMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
  const dayOfWeek = weekdayMap[weekday];

  // Helper to check date range (month/day only)
  const inRange = (m1, d1, m2, d2) => {
    const startDate = m1 * 100 + d1;
    const endDate = m2 * 100 + d2;
    const current = month * 100 + day;

    if (startDate <= endDate) {
      return current >= startDate && current <= endDate;
    } else {
      // Wraps around year (e.g., Dec 31 - Jan 2)
      return current >= startDate || current <= endDate;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORITY 1: Major Holidays (The "Must-Haves")
  // ═══════════════════════════════════════════════════════════════════════════

  // Check Lunar New Year (Tet) - requires year lookup
  const tetRange = calculateLunarNewYear(year);
  if (tetRange) {
    const [startMonth, startDay] = tetRange.start;
    const [endMonth, endDay] = tetRange.end;
    if (inRange(startMonth, startDay, endMonth, endDay)) {
      return 'LUNAR_NEW_YEAR';
    }
  }

  // Fixed Solar Holidays
  if (inRange(12, 31, 1, 2)) return 'NEW_YEAR';       // Dec 31 - Jan 2
  if (inRange(2, 13, 2, 15)) return 'VALENTINE';      // Feb 13 - Feb 15
  if (inRange(3, 7, 3, 9)) return 'WOMENS_DAY';       // Mar 7 - Mar 9
  if (inRange(9, 12, 9, 14)) return 'PROGRAMMER_DAY'; // Sep 12 - Sep 14 (Day 256)
  if (inRange(10, 25, 10, 31)) return 'HALLOWEEN';    // Oct 25 - Oct 31
  if (month === 11 && day === 19) return 'MENS_DAY';  // Nov 19 (one day)
  if (inRange(12, 20, 12, 25)) return 'CHRISTMAS';    // Dec 20 - Dec 25

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORITY 2: Cultural & Religious Celebrations
  // ═══════════════════════════════════════════════════════════════════════════

  // Holi 🎨 (Festival of Colors - Hindu, Feb-Mar)
  const holiDate = calculateHoli(year);
  if (holiDate) {
    const [hMonth, hDay] = holiDate;
    // Holi is celebrated for 2 days
    if (inRange(hMonth, hDay - 1, hMonth, hDay)) {
      return 'HOLI';
    }
  }

  // St. Patrick's Day ☘️ (Mar 16-18)
  if (inRange(3, 16, 3, 18)) return 'ST_PATRICKS';

  // Nowruz / Persian New Year 🌸 (Mar 20-22)
  if (inRange(3, 20, 3, 22)) return 'NOWRUZ';

  // Eid al-Fitr 🌙 (End of Ramadan - Islamic, calculated)
  const eidDate = calculateEidAlFitr(year);
  if (eidDate) {
    const [eMonth, eDay] = eidDate;
    // Eid is celebrated for 3 days
    if (inRange(eMonth, eDay, eMonth, eDay + 2)) {
      return 'EID';
    }
  }

  // Earth Day 🌍 (Apr 21-23)
  if (inRange(4, 21, 4, 23)) return 'EARTH_DAY';

  // Labor Day / May Day 👷 (May 1st - International Workers' Day)
  if (month === 5 && day === 1) return 'LABOR_DAY';

  // Pride Month 🏳️‍🌈 (June - First week emphasis)
  if (month === 6 && day <= 7) return 'PRIDE';

  // Easter 🐰 (Western - calculated using Anonymous Gregorian Algorithm)
  const easterDate = calculateEaster(year);
  if (easterDate) {
    const [easterMonth, easterDay] = easterDate;
    // Easter weekend: Friday before to Sunday
    if (inRange(easterMonth, easterDay - 2, easterMonth, easterDay)) {
      return 'EASTER';
    }
  }

  // Mid-Autumn Festival 🥮 (Sep-Oct, varies)
  const midAutumnDate = calculateMidAutumn(year);
  if (midAutumnDate) {
    const [maMonth, maDay] = midAutumnDate;
    if (inRange(maMonth, maDay - 1, maMonth, maDay + 1)) {
      return 'MID_AUTUMN';
    }
  }

  // Diwali 🪔 (Festival of Lights, Oct-Nov)
  const diwaliDate = calculateDiwali(year);
  if (diwaliDate) {
    const [dMonth, dDay] = diwaliDate;
    // Diwali is celebrated for 5 days, main day ±2
    if (inRange(dMonth, dDay - 2, dMonth, dDay + 2)) {
      return 'DIWALI';
    }
  }

  // Hanukkah 🕎 (Jewish Festival of Lights, Nov-Dec)
  const hanukkahDate = calculateHanukkah(year);
  if (hanukkahDate) {
    const [hkMonth, hkDay] = hanukkahDate;
    // Hanukkah is 8 days
    if (inRange(hkMonth, hkDay, hkMonth, hkDay + 7) || 
        (hkMonth === 12 && hkDay + 7 > 31 && month === 1 && day <= (hkDay + 7 - 31))) {
      return 'HANUKKAH';
    }
  }

  // Thanksgiving 🦃 (US - 4th Thursday of November)
  const thanksgivingDay = getThanksgivingDay(year);
  if (month === 11 && day >= thanksgivingDay && day <= thanksgivingDay + 1) {
    return 'THANKSGIVING';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORITY 3: Easter Eggs (The "Surprises")
  // ═══════════════════════════════════════════════════════════════════════════

  // Pi Day 🥧 (Mar 14 = 3.14)
  if (month === 3 && day === 14) return 'PI_DAY';

  // Star Wars Day ⚔️ (May 4 = "May the Fourth")
  if (month === 5 && day === 4) return 'STAR_WARS';

  // Talk Like a Pirate Day 🏴‍☠️ (Sep 19)
  if (month === 9 && day === 19) return 'PIRATE_DAY';

  // Singles' Day 🛒 (Nov 11 = 11.11)
  if (month === 11 && day === 11) return 'SINGLES_DAY';

  // System Administrator Day 🖥️ (Last Friday of July)
  const lastFriJuly = getLastFridayOfMonth(year, 7);
  if (month === 7 && day === lastFriJuly) return 'SYSADMIN_DAY';

  // Friday the 13th 👻
  if (day === 13 && dayOfWeek === 5) return 'FRIDAY_13';

  // April Fools' Day 🤡
  if (month === 4 && day === 1) return 'APRIL_FOOLS';

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORITY 4: Default (No accessory - let mood sprite handle weekend/etc)
  // ═══════════════════════════════════════════════════════════════════════════

  return null;
}

/**
 * Get the last Friday of a given month
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {number} Day of the last Friday
 */
function getLastFridayOfMonth(year, month) {
  // Get the last day of the month
  const lastDay = new Date(year, month, 0).getDate();
  const lastDayDate = new Date(year, month - 1, lastDay);
  const dayOfWeek = lastDayDate.getDay(); // 0=Sun, 5=Fri
  
  // Calculate days to subtract to get Friday
  const daysToFriday = (dayOfWeek >= 5) ? (dayOfWeek - 5) : (dayOfWeek + 2);
  return lastDay - daysToFriday;
}

/**
 * Seasonal Accessories SVG Library
 * High-fidelity flat vector SVGs for each holiday
 * Designed for 200x200 viewBox, positioned relative to pet center
 */
/**
 * Calculate the head position (top-center) of a sprite
 * @param {Array<string>} spriteGrid - The 16x16 sprite grid
 * @param {string} petType - Type of pet (for applying head offsets)
 * @returns {Object} { x, y } coordinates of the head top-center
 */
function calculateHeadPosition(spriteGrid, petType = '') {
  const pixelSize = 16; // Match the rendering pixel size

  // Default center if grid is missing
  if (!spriteGrid || !Array.isArray(spriteGrid)) {
    return { x: 100, y: 20 };
  }

  const headOffset = HEAD_POSITION_OFFSETS[petType] || { x: 0, y: 0 };

  for (let row = 0; row < spriteGrid.length; row++) {
    const line = spriteGrid[row];
    // Find first non-space char
    const firstPixel = line.search(/\S/);

    if (firstPixel !== -1) {
      // Found the top row of the sprite
      // Find the last pixel in this row
      const lastPixel = line.length - 1 - line.split('').reverse().join('').search(/\S/);

      // Calculate center of the top row in SVG coordinates
      // (first + last) / 2 gives the center index
      // Multiply by pixelSize to get position, add half pixelSize to center in the pixel
      const centerX = ((firstPixel + lastPixel) / 2) * pixelSize + (pixelSize / 2) + (headOffset.x || 0);
      // Apply Y offset for pets with protruding features (e.g., Unicorn horn)
      const topY = row * pixelSize + (headOffset.y || 0);

      return { x: centerX, y: topY };
    }
  }

  // Fallback
  return { x: 100, y: 20 };
}

/**
 * Relative Accessory Offsets
 * Offsets relative to the detected head position (x: 0, y: 0 is top-center of head)
 */
/**
 * Relative Accessory Offsets
 * Offsets relative to the detected head position (x: 0, y: 0 is top-center of head)
 */
const RELATIVE_ACCESSORY_OFFSETS = {
  // 🎉 NEW_YEAR: Party Hat (sits on top)
  NEW_YEAR: { x: -15, y: -45 },

  // 💕 VALENTINE: Floating Heart (floats above)
  VALENTINE: { x: 0, y: -35 },

  // 🌹 WOMENS_DAY: Hairpin (sits on side of head)
  WOMENS_DAY: { x: -10, y: -5 },

  // ☕ PROGRAMMER_DAY: Mug (floats to side)
  PROGRAMMER_DAY: { x: 25, y: 0 },

  // 🎃 HALLOWEEN: Pumpkin (sits on head/face)
  HALLOWEEN: { x: 0, y: -10 },

  // 🎩 MENS_DAY: Bowtie (sits below head/neck)
  MENS_DAY: { x: -25, y: 80 }, // Needs to be lower

  // 🎅 CHRISTMAS: Santa Hat (sits on top)
  CHRISTMAS: { x: -30, y: -45 },

  // 🧧 LUNAR_NEW_YEAR: Red Envelope (floats to side)
  LUNAR_NEW_YEAR: { x: 20, y: 0 },

  // 👻 FRIDAY_13: Mask (sits on face)
  FRIDAY_13: { x: -35, y: -5 },

  // 🤡 APRIL_FOOLS: Jester Hat (sits on top)
  APRIL_FOOLS: { x: -30, y: -45 },

  // ☘️ ST_PATRICKS: Shamrock (sits on top)
  ST_PATRICKS: { x: -15, y: -40 },

  // 🌸 NOWRUZ: Spring Flower (sits on side)
  NOWRUZ: { x: -5, y: -15 },

  // 🐰 EASTER: Bunny Ears (sits on top)
  EASTER: { x: -25, y: -50 },

  // 🥮 MID_AUTUMN: Lantern (floats to side)
  MID_AUTUMN: { x: 25, y: -10 },

  // 🪔 DIWALI: Diya Lamp (floats to side)
  DIWALI: { x: 25, y: 0 },

  // 🦃 THANKSGIVING: Pilgrim Hat (sits on top)
  THANKSGIVING: { x: -20, y: -45 },

  // 🎨 HOLI: Color Splashes (around head)
  HOLI: { x: -20, y: -20 },

  // 🌙 EID: Crescent Moon (floats above)
  EID: { x: -15, y: -45 },

  // 🌍 EARTH_DAY: Earth Globe (floats to side)
  EARTH_DAY: { x: 25, y: -10 },

  // 👷 LABOR_DAY: Hard Hat (sits on top)
  LABOR_DAY: { x: -25, y: -40 },

  // 🏳️‍🌈 PRIDE: Rainbow Crown (sits on top)
  PRIDE: { x: -25, y: -50 },

  // 🕎 HANUKKAH: Menorah (floats to side)
  HANUKKAH: { x: 25, y: -15 }
};

/**
 * Head Position Offsets
 * X/Y-axis offsets for pets with protruding features (horns, antennae, etc.)
 * that cause the "highest pixel" detection to be inaccurate.
 * Positive Y = move detection point DOWN (skip protruding features)
 * Negative X = move detection point LEFT
 */
const HEAD_POSITION_OFFSETS = {
  // 🦄 Unicorn: Horn tip is at row 2 (column 14), actual head is at row 5 (column 9-12)
  // Y: 48px down (3 rows × 16px to skip horn)
  // X: -48px left (shift from horn column 14 to head center ~column 11)
  unicorn: { x: -48, y: 48 }
};

/**
 * Seasonal Accessories SVG Library
 * High-fidelity flat vector SVGs for each holiday
 * Designed for 200x200 viewBox, positioned relative to pet center
 */
const SEASONAL_ACCESSORIES = {
  // 🎉 NEW_YEAR: Party Hat (Striped Cone)
  NEW_YEAR: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Party Hat Cone -->
      <polygon points="15,50 30,5 0,5" fill="#FF6B6B"/>
      <polygon points="15,50 30,5 22,5 15,35 8,5 0,5" fill="#4ECDC4"/>
      <polygon points="15,50 22,5 15,35" fill="#FFE66D"/>
      <!-- Pom-pom -->
      <circle cx="15" cy="3" r="5" fill="#FFE66D"/>
      <!-- Hat Band -->
      <rect x="0" y="45" width="30" height="5" rx="2" fill="#2D333B"/>
    </g>
  `,

  // 💕 VALENTINE: Floating Pixel Heart with pulse animation
  VALENTINE: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <g>
        <!-- Pixel Heart -->
        <rect x="4" y="0" width="8" height="4" fill="#FF6B9D"/>
        <rect x="16" y="0" width="8" height="4" fill="#FF6B9D"/>
        <rect x="0" y="4" width="28" height="4" fill="#FF6B9D"/>
        <rect x="0" y="8" width="28" height="4" fill="#FF8FAB"/>
        <rect x="4" y="12" width="20" height="4" fill="#FF8FAB"/>
        <rect x="8" y="16" width="12" height="4" fill="#FFB3C6"/>
        <rect x="12" y="20" width="4" height="4" fill="#FFB3C6"/>
        <!-- Sparkle -->
        <circle cx="8" cy="6" r="2" fill="#FFFFFF" opacity="0.7"/>
        <!-- Pulse animation -->
        <animateTransform 
          attributeName="transform" 
          type="scale" 
          values="1;1.1;1" 
          dur="1s" 
          repeatCount="indefinite"
          additive="sum"
        />
      </g>
    </g>
  `,

  // 🌹 WOMENS_DAY: Red Rose Hairpin with sway animation
  WOMENS_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <g>
        <!-- Rose Petals -->
        <ellipse cx="15" cy="12" rx="8" ry="6" fill="#E63946"/>
        <ellipse cx="10" cy="15" rx="6" ry="5" fill="#D62839"/>
        <ellipse cx="20" cy="15" rx="6" ry="5" fill="#D62839"/>
        <ellipse cx="15" cy="18" rx="7" ry="5" fill="#C1121F"/>
        <circle cx="15" cy="14" r="4" fill="#780000"/>
        <!-- Sparkle on rose -->
        <circle cx="11" cy="11" r="1.5" fill="#FFFFFF" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <!-- Stem -->
        <rect x="14" y="22" width="2" height="12" fill="#2D6A4F"/>
        <!-- Leaf -->
        <ellipse cx="18" cy="28" rx="5" ry="3" fill="#40916C" transform="rotate(30, 18, 28)"/>
        <!-- Gentle sway -->
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 15 20;3 15 20;0 15 20;-3 15 20;0 15 20" 
          dur="4s" 
          repeatCount="indefinite"
        />
      </g>
    </g>
  `,

  // ☕ PROGRAMMER_DAY: Steaming Coffee Mug
  PROGRAMMER_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Mug Body -->
      <rect x="0" y="10" width="25" height="28" rx="3" fill="#8B4513"/>
      <rect x="3" y="13" width="19" height="22" rx="2" fill="#5C4033"/>
      <!-- Coffee -->
      <rect x="4" y="14" width="17" height="12" fill="#3C2415"/>
      <!-- Handle -->
      <path d="M25,15 Q35,15 35,24 Q35,33 25,33" stroke="#8B4513" stroke-width="4" fill="none"/>
      <!-- Steam -->
      <path d="M7,5 Q9,0 7,-5" stroke="#EEEEEE" stroke-width="2" fill="none" opacity="0.6">
        <animate attributeName="d" values="M7,5 Q9,0 7,-5;M7,5 Q5,0 7,-5;M7,5 Q9,0 7,-5" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M14,3 Q16,-2 14,-7" stroke="#EEEEEE" stroke-width="2" fill="none" opacity="0.6">
        <animate attributeName="d" values="M14,3 Q16,-2 14,-7;M14,3 Q12,-2 14,-7;M14,3 Q16,-2 14,-7" dur="2.5s" repeatCount="indefinite"/>
      </path>
    </g>
  `,

  // 🎃 HALLOWEEN: Cute Jack-o'-lantern Pumpkin with glow animation
  HALLOWEEN: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Glow effect -->
      <ellipse cx="21" cy="25" rx="24" ry="22" fill="#FF6D00" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <!-- Pumpkin Stem -->
      <rect x="18" y="0" width="6" height="8" rx="2" fill="#2D6A4F"/>
      <!-- Pumpkin Body -->
      <ellipse cx="21" cy="25" rx="20" ry="18" fill="#FF6D00"/>
      <ellipse cx="21" cy="25" rx="16" ry="15" fill="#FF8500"/>
      <!-- Left Eye with flicker -->
      <polygon points="10,20 15,15 18,22" fill="#FFEB3B">
        <animate attributeName="fill" values="#FFEB3B;#FFC107;#FFEB3B" dur="0.8s" repeatCount="indefinite"/>
      </polygon>
      <!-- Right Eye with flicker -->
      <polygon points="24,22 27,15 32,20" fill="#FFEB3B">
        <animate attributeName="fill" values="#FFEB3B;#FFC107;#FFEB3B" dur="0.8s" repeatCount="indefinite"/>
      </polygon>
      <!-- Smile with glow -->
      <path d="M12,30 Q21,38 30,30" stroke="#FFEB3B" stroke-width="3" fill="none">
        <animate attributeName="stroke" values="#FFEB3B;#FFC107;#FFEB3B" dur="0.8s" repeatCount="indefinite"/>
      </path>
      <!-- Teeth -->
      <rect x="16" y="30" width="4" height="4" fill="#FF8500"/>
      <rect x="22" y="30" width="4" height="4" fill="#FF8500"/>
    </g>
  `,

  // 🎩 MENS_DAY: Blue Bowtie
  MENS_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Left Wing -->
      <path d="M0,10 Q0,0 15,5 L15,15 Q0,20 0,10" fill="#1E88E5"/>
      <path d="M2,10 Q2,3 13,6 L13,14 Q2,17 2,10" fill="#42A5F5"/>
      <!-- Right Wing -->
      <path d="M35,5 Q50,0 50,10 Q50,20 35,15 L35,5" fill="#1E88E5"/>
      <path d="M37,6 Q48,3 48,10 Q48,17 37,14 L37,6" fill="#42A5F5"/>
      <!-- Center Knot -->
      <rect x="15" y="5" width="20" height="10" rx="2" fill="#0D47A1"/>
      <rect x="20" y="5" width="10" height="10" rx="1" fill="#1565C0"/>
    </g>
  `,

  // 🎅 CHRISTMAS: Santa Hat with bouncing pom-pom
  CHRISTMAS: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Hat Body -->
      <path d="M0,45 Q-5,25 20,10 Q45,0 60,30 L55,50 Z" fill="#D32F2F"/>
      <path d="M5,42 Q0,25 22,13 Q42,5 55,30 L52,47 Z" fill="#E53935"/>
      <!-- White Trim -->
      <ellipse cx="28" cy="48" rx="32" ry="8" fill="#FAFAFA"/>
      <ellipse cx="28" cy="48" rx="28" ry="5" fill="#EEEEEE"/>
      <!-- Pom-pom with bounce -->
      <g>
        <circle cx="60" cy="28" r="10" fill="#FAFAFA"/>
        <circle cx="62" cy="26" r="4" fill="#EEEEEE"/>
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0;2 -3;0 0;-2 -3;0 0" 
          dur="1.5s" 
          repeatCount="indefinite"
        />
      </g>
    </g>
  `,

  // 🧧 LUNAR_NEW_YEAR: Red Envelope (Lì Xì) with sparkle animation
  LUNAR_NEW_YEAR: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Envelope Body -->
      <rect x="0" y="0" width="35" height="50" rx="3" fill="#D32F2F"/>
      <rect x="2" y="2" width="31" height="46" rx="2" fill="#E53935"/>
      <!-- Gold Decorative Border -->
      <rect x="5" y="5" width="25" height="40" rx="1" stroke="#FFD700" stroke-width="2" fill="none"/>
      <!-- Coin Symbol with shine -->
      <circle cx="17.5" cy="25" r="10" fill="#FFD700"/>
      <circle cx="17.5" cy="25" r="7" fill="#FFC107"/>
      <!-- Chinese Character 福 (Fortune) stylized -->
      <rect x="14" y="20" width="7" height="2" fill="#D32F2F"/>
      <rect x="16" y="22" width="3" height="6" fill="#D32F2F"/>
      <rect x="14" y="25" width="7" height="2" fill="#D32F2F"/>
      <!-- Animated Sparkles -->
      <circle cx="10" cy="10" r="2" fill="#FFD700">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.5;2.5;1.5" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="28" cy="8" r="1.5" fill="#FFFFFF">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="28" cy="40" r="1.5" fill="#FFD700">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1;2;1" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    </g>
  `,

  // ═══════════════════════════════════════════════════════════════════════════
  // EASTER EGG ACCESSORIES
  // ═══════════════════════════════════════════════════════════════════════════

  // 👻 FRIDAY_13: Jason Voorhees Hockey Mask
  FRIDAY_13: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Mask Base -->
      <ellipse cx="35" cy="40" rx="32" ry="38" fill="#F5F5F5"/>
      <ellipse cx="35" cy="40" rx="28" ry="34" fill="#EEEEEE"/>
      <!-- Eye Holes -->
      <ellipse cx="22" cy="32" rx="8" ry="10" fill="#1A1A1A"/>
      <ellipse cx="48" cy="32" rx="8" ry="10" fill="#1A1A1A"/>
      <!-- Nose Holes -->
      <circle cx="32" cy="48" r="3" fill="#1A1A1A"/>
      <circle cx="38" cy="48" r="3" fill="#1A1A1A"/>
      <!-- Red Triangles (Classic Jason design) -->
      <polygon points="35,15 25,35 45,35" fill="#B71C1C"/>
      <polygon points="10,55 20,70 0,70" fill="#B71C1C"/>
      <polygon points="60,55 70,70 50,70" fill="#B71C1C"/>
      <!-- Ventilation Lines -->
      <line x1="28" y1="58" x2="28" y2="72" stroke="#BDBDBD" stroke-width="2"/>
      <line x1="35" y1="58" x2="35" y2="72" stroke="#BDBDBD" stroke-width="2"/>
      <line x1="42" y1="58" x2="42" y2="72" stroke="#BDBDBD" stroke-width="2"/>
    </g>
  `,

  // 🤡 APRIL_FOOLS: Colorful Jester Cap
  APRIL_FOOLS: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Left Horn -->
      <path d="M20,50 Q5,30 15,5 Q20,0 25,5 L30,50 Z" fill="#9C27B0"/>
      <circle cx="15" cy="5" r="6" fill="#FFD700"/>
      <!-- Center Horn -->
      <path d="M35,50 Q35,25 40,0 Q45,0 50,25 L55,50 Z" fill="#4CAF50"/>
      <circle cx="42" cy="0" r="6" fill="#FFD700"/>
      <!-- Right Horn -->
      <path d="M60,50 Q70,30 65,5 Q70,0 75,5 L70,50 Z" fill="#2196F3"/>
      <circle cx="70" cy="5" r="6" fill="#FFD700"/>
      <!-- Hat Band -->
      <rect x="15" y="45" width="60" height="8" rx="3" fill="#E91E63"/>
      <!-- Polka Dots -->
      <circle cx="25" cy="30" r="4" fill="#FFEB3B"/>
      <circle cx="45" cy="20" r="4" fill="#FFEB3B"/>
      <circle cx="65" cy="30" r="4" fill="#FFEB3B"/>
    </g>
  `,

  // ☘️ ST_PATRICKS: Four-Leaf Clover/Shamrock
  ST_PATRICKS: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Stem -->
      <path d="M20,50 Q18,35 20,25" stroke="#228B22" stroke-width="3" fill="none"/>
      <!-- Shamrock Leaves -->
      <ellipse cx="12" cy="18" rx="10" ry="12" fill="#2E8B57" transform="rotate(-30 12 18)"/>
      <ellipse cx="28" cy="18" rx="10" ry="12" fill="#2E8B57" transform="rotate(30 28 18)"/>
      <ellipse cx="20" cy="8" rx="10" ry="12" fill="#2E8B57"/>
      <!-- Center -->
      <circle cx="20" cy="18" r="4" fill="#1B5E20"/>
      <!-- Sparkle -->
      <circle cx="8" cy="5" r="2" fill="#FFD700">
        <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </g>
  `,

  // 🌸 NOWRUZ: Spring Flower (Haft-Seen inspired)
  NOWRUZ: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Flower Petals -->
      <ellipse cx="20" cy="10" rx="8" ry="15" fill="#FF69B4"/>
      <ellipse cx="10" cy="20" rx="8" ry="15" fill="#FF69B4" transform="rotate(-72 20 20)"/>
      <ellipse cx="6" cy="35" rx="8" ry="15" fill="#FF69B4" transform="rotate(-144 20 20)"/>
      <ellipse cx="34" cy="35" rx="8" ry="15" fill="#FF69B4" transform="rotate(144 20 20)"/>
      <ellipse cx="30" cy="20" rx="8" ry="15" fill="#FF69B4" transform="rotate(72 20 20)"/>
      <!-- Center -->
      <circle cx="20" cy="23" r="8" fill="#FFD700"/>
      <circle cx="20" cy="23" r="4" fill="#FF8C00"/>
      <!-- Leaves -->
      <ellipse cx="8" cy="45" rx="6" ry="10" fill="#228B22" transform="rotate(-20 8 45)"/>
      <ellipse cx="32" cy="45" rx="6" ry="10" fill="#228B22" transform="rotate(20 32 45)"/>
    </g>
  `,

  // 🐰 EASTER: Bunny Ears with Bow
  EASTER: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Left Ear -->
      <ellipse cx="15" cy="25" rx="12" ry="30" fill="#FFF5EE"/>
      <ellipse cx="15" cy="25" rx="6" ry="20" fill="#FFB6C1"/>
      <!-- Right Ear -->
      <ellipse cx="45" cy="25" rx="12" ry="30" fill="#FFF5EE"/>
      <ellipse cx="45" cy="25" rx="6" ry="20" fill="#FFB6C1"/>
      <!-- Headband -->
      <rect x="5" y="50" width="50" height="8" rx="4" fill="#DDA0DD"/>
      <!-- Bow -->
      <path d="M25,58 Q20,50 15,55 Q20,60 25,58" fill="#FF69B4"/>
      <path d="M35,58 Q40,50 45,55 Q40,60 35,58" fill="#FF69B4"/>
      <circle cx="30" cy="55" r="5" fill="#FF1493"/>
      <!-- Easter Egg decorations on ears -->
      <circle cx="15" cy="35" r="3" fill="#87CEEB"/>
      <circle cx="45" cy="35" r="3" fill="#98FB98"/>
    </g>
  `,

  // 🥮 MID_AUTUMN: Chinese Lantern
  MID_AUTUMN: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- String -->
      <line x1="20" y1="0" x2="20" y2="15" stroke="#8B4513" stroke-width="2"/>
      <!-- Top Cap -->
      <rect x="12" y="12" width="16" height="5" rx="2" fill="#FFD700"/>
      <!-- Lantern Body -->
      <ellipse cx="20" cy="35" rx="18" ry="22" fill="#FF4500"/>
      <ellipse cx="20" cy="35" rx="14" ry="18" fill="#FF6347"/>
      <!-- Decorative Lines -->
      <path d="M8,25 Q20,35 32,25" stroke="#FFD700" stroke-width="2" fill="none"/>
      <path d="M8,45 Q20,35 32,45" stroke="#FFD700" stroke-width="2" fill="none"/>
      <!-- Bottom Tassel -->
      <rect x="15" y="55" width="10" height="4" rx="1" fill="#FFD700"/>
      <line x1="17" y1="59" x2="17" y2="70" stroke="#FF4500" stroke-width="2"/>
      <line x1="20" y1="59" x2="20" y2="72" stroke="#FF4500" stroke-width="2"/>
      <line x1="23" y1="59" x2="23" y2="70" stroke="#FF4500" stroke-width="2"/>
      <!-- Glow effect -->
      <ellipse cx="20" cy="35" rx="12" ry="15" fill="#FFFF00" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite"/>
      </ellipse>
    </g>
  `,

  // 🪔 DIWALI: Diya Oil Lamp with Flame
  DIWALI: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Diya Base -->
      <ellipse cx="25" cy="45" rx="22" ry="8" fill="#CD853F"/>
      <ellipse cx="25" cy="42" rx="20" ry="7" fill="#DEB887"/>
      <!-- Oil -->
      <ellipse cx="25" cy="40" rx="15" ry="5" fill="#FFD700"/>
      <!-- Wick -->
      <rect x="23" y="32" width="4" height="10" fill="#4A4A4A"/>
      <!-- Flame -->
      <ellipse cx="25" cy="22" rx="8" ry="14" fill="#FF4500">
        <animate attributeName="ry" values="14;16;14" dur="0.5s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="25" cy="20" rx="5" ry="10" fill="#FFD700">
        <animate attributeName="ry" values="10;12;10" dur="0.5s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="25" cy="18" rx="3" ry="6" fill="#FFFACD"/>
      <!-- Decorative dots on diya -->
      <circle cx="12" cy="45" r="2" fill="#FF6347"/>
      <circle cx="38" cy="45" r="2" fill="#FF6347"/>
      <circle cx="25" cy="50" r="2" fill="#FF6347"/>
      <!-- Sparkles -->
      <circle cx="35" cy="15" r="2" fill="#FFD700">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="15" cy="12" r="1.5" fill="#FFD700">
        <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
    </g>
  `,

  // 🦃 THANKSGIVING: Pilgrim Hat
  THANKSGIVING: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Hat Brim -->
      <ellipse cx="25" cy="48" rx="28" ry="6" fill="#1A1A1A"/>
      <ellipse cx="25" cy="46" rx="26" ry="5" fill="#2F2F2F"/>
      <!-- Hat Crown -->
      <rect x="8" y="15" width="34" height="33" rx="3" fill="#1A1A1A"/>
      <rect x="10" y="17" width="30" height="29" rx="2" fill="#2F2F2F"/>
      <!-- Hat Band -->
      <rect x="8" y="38" width="34" height="8" fill="#8B4513"/>
      <!-- Buckle -->
      <rect x="18" y="36" width="14" height="12" rx="2" fill="#FFD700"/>
      <rect x="21" y="39" width="8" height="6" rx="1" fill="#2F2F2F"/>
      <!-- Subtle highlights -->
      <line x1="12" y1="20" x2="12" y2="35" stroke="#4A4A4A" stroke-width="2"/>
    </g>
  `,

  // 🎨 HOLI: Color Splash / Gulal Powder
  HOLI: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Color powder splashes around head -->
      <circle cx="5" cy="15" r="8" fill="#FF1493" opacity="0.8">
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="35" cy="10" r="10" fill="#00BFFF" opacity="0.8">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="40" cy="35" r="7" fill="#FFD700" opacity="0.8">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="40" r="6" fill="#32CD32" opacity="0.7">
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="20" cy="5" r="5" fill="#FF6347" opacity="0.9"/>
      <!-- Powder particles -->
      <circle cx="25" cy="25" r="3" fill="#9400D3" opacity="0.6"/>
      <circle cx="10" cy="30" r="2" fill="#FF69B4" opacity="0.7"/>
      <circle cx="30" cy="45" r="2" fill="#00CED1" opacity="0.6"/>
    </g>
  `,

  // 🌙 EID: Crescent Moon and Star
  EID: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Crescent Moon -->
      <path d="M25,5 A20,20 0 1,1 25,45 A15,15 0 1,0 25,5" fill="#FFD700"/>
      <!-- Inner glow -->
      <path d="M27,10 A15,15 0 1,1 27,40 A12,12 0 1,0 27,10" fill="#FFC107" opacity="0.5"/>
      <!-- Star -->
      <polygon points="42,18 44,24 50,24 45,28 47,34 42,30 37,34 39,28 34,24 40,24" fill="#FFD700">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite"/>
      </polygon>
      <!-- Sparkles -->
      <circle cx="38" cy="10" r="1.5" fill="#FFFFFF">
        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="48" cy="35" r="1" fill="#FFFFFF">
        <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
    </g>
  `,

  // 🌍 EARTH_DAY: Earth Globe with Leaf
  EARTH_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Earth Globe -->
      <circle cx="22" cy="25" r="20" fill="#4169E1"/>
      <!-- Continents (simplified) -->
      <ellipse cx="18" cy="18" rx="8" ry="5" fill="#228B22" transform="rotate(-20 18 18)"/>
      <ellipse cx="28" cy="28" rx="6" ry="8" fill="#228B22" transform="rotate(30 28 28)"/>
      <ellipse cx="12" cy="32" rx="4" ry="3" fill="#228B22"/>
      <!-- Ocean highlights -->
      <ellipse cx="30" cy="15" rx="3" ry="2" fill="#87CEEB" opacity="0.5"/>
      <!-- Leaf sprouting from top -->
      <ellipse cx="22" cy="2" rx="6" ry="10" fill="#32CD32" transform="rotate(-15 22 2)"/>
      <ellipse cx="28" cy="0" rx="5" ry="8" fill="#228B22" transform="rotate(15 28 0)"/>
      <line x1="22" y1="5" x2="25" y2="-5" stroke="#1B5E20" stroke-width="2"/>
    </g>
  `,

  // 👷 LABOR_DAY: Hard Hat / Construction Helmet
  LABOR_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Hard Hat Dome -->
      <ellipse cx="25" cy="30" rx="25" ry="15" fill="#FFD700"/>
      <ellipse cx="25" cy="25" rx="22" ry="20" fill="#FFD700"/>
      <!-- Top ridge -->
      <rect x="22" y="5" width="6" height="25" rx="3" fill="#FFC107"/>
      <!-- Brim -->
      <ellipse cx="25" cy="40" rx="28" ry="5" fill="#FFA000"/>
      <!-- Shine -->
      <ellipse cx="15" cy="20" rx="6" ry="8" fill="#FFEB3B" opacity="0.4"/>
      <!-- Hard hat band line -->
      <ellipse cx="25" cy="32" rx="22" ry="3" stroke="#E65100" stroke-width="2" fill="none"/>
    </g>
  `,

  // 🏳️‍🌈 PRIDE: Rainbow Flag / Pride Crown
  PRIDE: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Rainbow stripes as a headband/crown -->
      <rect x="0" y="25" width="50" height="5" fill="#E40303"/>
      <rect x="0" y="30" width="50" height="5" fill="#FF8C00"/>
      <rect x="0" y="35" width="50" height="5" fill="#FFED00"/>
      <rect x="0" y="40" width="50" height="5" fill="#008026"/>
      <rect x="0" y="45" width="50" height="5" fill="#004DFF"/>
      <rect x="0" y="50" width="50" height="5" fill="#750787"/>
      <!-- Crown spikes -->
      <polygon points="5,25 10,10 15,25" fill="#FFD700"/>
      <polygon points="20,25 25,5 30,25" fill="#FFD700"/>
      <polygon points="35,25 40,10 45,25" fill="#FFD700"/>
      <!-- Sparkles -->
      <circle cx="10" cy="15" r="2" fill="#FFFFFF">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="40" cy="12" r="1.5" fill="#FFFFFF">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
    </g>
  `,

  // 🕎 HANUKKAH: Menorah
  HANUKKAH: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Menorah base -->
      <rect x="20" y="50" width="20" height="5" rx="2" fill="#FFD700"/>
      <rect x="25" y="40" width="10" height="12" fill="#FFD700"/>
      <!-- Center shamash (taller) -->
      <rect x="28" y="15" width="4" height="25" fill="#FFD700"/>
      <ellipse cx="30" cy="10" rx="4" ry="6" fill="#FF6347">
        <animate attributeName="ry" values="6;7;6" dur="0.5s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="30" cy="8" rx="2" ry="4" fill="#FFEB3B"/>
      <!-- Left candles -->
      <rect x="8" y="25" width="3" height="15" fill="#87CEEB"/>
      <ellipse cx="9.5" cy="22" rx="2" ry="4" fill="#FF6347"/>
      <rect x="15" y="25" width="3" height="15" fill="#87CEEB"/>
      <ellipse cx="16.5" cy="22" rx="2" ry="4" fill="#FF6347"/>
      <!-- Right candles -->
      <rect x="42" y="25" width="3" height="15" fill="#87CEEB"/>
      <ellipse cx="43.5" cy="22" rx="2" ry="4" fill="#FF6347"/>
      <rect x="49" y="25" width="3" height="15" fill="#87CEEB"/>
      <ellipse cx="50.5" cy="22" rx="2" ry="4" fill="#FF6347"/>
      <!-- Menorah arms -->
      <path d="M10,40 Q10,35 20,35 L40,35 Q50,35 50,40" stroke="#FFD700" stroke-width="3" fill="none"/>
    </g>
  `,

  // 🥧 PI_DAY: Pi Symbol with Pie Slice
  PI_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Pie slice background -->
      <path d="M25,30 L45,30 A20,20 0 0,0 25,10 Z" fill="#8B4513"/>
      <path d="M25,30 L43,28 A18,18 0 0,0 25,12 Z" fill="#FFA726"/>
      <!-- Crust edge -->
      <path d="M25,30 L45,30 A20,20 0 0,0 25,10" stroke="#D2691E" stroke-width="3" fill="none"/>
      <!-- Pi symbol -->
      <text x="15" y="25" font-family="serif" font-size="24" font-weight="bold" fill="#1565C0">π</text>
      <!-- Whipped cream dollops -->
      <circle cx="35" cy="22" r="4" fill="#FFFAF0"/>
      <circle cx="30" cy="18" r="3" fill="#FFFAF0"/>
      <!-- Steam -->
      <path d="M38,8 Q40,5 38,2" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity="0.7">
        <animate attributeName="d" values="M38,8 Q40,5 38,2;M38,8 Q36,5 38,2;M38,8 Q40,5 38,2" dur="2s" repeatCount="indefinite"/>
      </path>
    </g>
  `,

  // ⚔️ STAR_WARS: Lightsaber
  STAR_WARS: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Lightsaber hilt -->
      <rect x="22" y="40" width="8" height="20" rx="2" fill="#424242"/>
      <rect x="20" y="55" width="12" height="5" rx="2" fill="#616161"/>
      <rect x="24" y="45" width="4" height="3" fill="#B0BEC5"/>
      <circle cx="26" cy="50" r="2" fill="#F44336"/>
      <!-- Blade -->
      <rect x="23" y="5" width="6" height="35" rx="3" fill="#4FC3F7">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="0.1s" repeatCount="indefinite"/>
      </rect>
      <!-- Blade glow -->
      <rect x="21" y="5" width="10" height="35" rx="5" fill="#4FC3F7" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="0.5s" repeatCount="indefinite"/>
      </rect>
      <!-- Blade core -->
      <rect x="24" y="7" width="4" height="31" rx="2" fill="#FFFFFF"/>
    </g>
  `,

  // 🏴‍☠️ PIRATE_DAY: Pirate Hat with Skull
  PIRATE_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Hat base -->
      <ellipse cx="25" cy="45" rx="30" ry="8" fill="#212121"/>
      <!-- Hat dome -->
      <path d="M5,45 Q5,20 25,15 Q45,20 45,45" fill="#212121"/>
      <!-- Hat brim curve -->
      <path d="M-5,45 Q25,35 55,45" stroke="#212121" stroke-width="10" fill="none"/>
      <!-- Skull -->
      <circle cx="25" cy="32" r="8" fill="#FFFDE7"/>
      <circle cx="22" cy="30" r="2" fill="#212121"/>
      <circle cx="28" cy="30" r="2" fill="#212121"/>
      <ellipse cx="25" cy="36" rx="1" ry="2" fill="#212121"/>
      <!-- Crossbones -->
      <line x1="15" y1="38" x2="35" y2="44" stroke="#FFFDE7" stroke-width="3" stroke-linecap="round"/>
      <line x1="35" y1="38" x2="15" y2="44" stroke="#FFFDE7" stroke-width="3" stroke-linecap="round"/>
      <!-- Gold trim -->
      <path d="M5,45 Q25,38 45,45" stroke="#FFD700" stroke-width="2" fill="none"/>
    </g>
  `,

  // 🛒 SINGLES_DAY: Shopping Bag with 11.11
  SINGLES_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Shopping bag -->
      <rect x="10" y="20" width="35" height="35" rx="3" fill="#FF5722"/>
      <!-- Bag handles -->
      <path d="M18,20 Q18,10 27.5,10 Q37,10 37,20" stroke="#D84315" stroke-width="4" fill="none"/>
      <!-- 11.11 text -->
      <text x="15" y="42" font-family="Arial" font-size="12" font-weight="bold" fill="#FFFFFF">11.11</text>
      <!-- Sale star burst -->
      <polygon points="45,15 47,20 52,20 48,24 50,29 45,26 40,29 42,24 38,20 43,20" fill="#FFD700">
        <animate attributeName="transform" values="rotate(0 45 22);rotate(360 45 22)" dur="4s" repeatCount="indefinite"/>
      </polygon>
      <!-- Sparkles -->
      <circle cx="8" cy="25" r="2" fill="#FFEB3B">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>
      </circle>
    </g>
  `,

  // 🖥️ SYSADMIN_DAY: Server Rack / Terminal
  SYSADMIN_DAY: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <!-- Server tower -->
      <rect x="10" y="10" width="35" height="45" rx="3" fill="#37474F"/>
      <!-- Server units -->
      <rect x="13" y="15" width="29" height="8" fill="#263238"/>
      <rect x="13" y="26" width="29" height="8" fill="#263238"/>
      <rect x="13" y="37" width="29" height="8" fill="#263238"/>
      <!-- LED lights -->
      <circle cx="17" cy="19" r="2" fill="#4CAF50">
        <animate attributeName="fill" values="#4CAF50;#8BC34A;#4CAF50" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="17" cy="30" r="2" fill="#4CAF50">
        <animate attributeName="fill" values="#4CAF50;#8BC34A;#4CAF50" dur="1.2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="17" cy="41" r="2" fill="#FF9800">
        <animate attributeName="fill" values="#FF9800;#FFC107;#FF9800" dur="0.8s" repeatCount="indefinite"/>
      </circle>
      <!-- Vents -->
      <line x1="25" y1="17" x2="38" y2="17" stroke="#455A64" stroke-width="1"/>
      <line x1="25" y1="20" x2="38" y2="20" stroke="#455A64" stroke-width="1"/>
      <line x1="25" y1="28" x2="38" y2="28" stroke="#455A64" stroke-width="1"/>
      <line x1="25" y1="31" x2="38" y2="31" stroke="#455A64" stroke-width="1"/>
      <!-- Coffee mug (essential!) -->
      <rect x="48" y="40" width="10" height="12" rx="2" fill="#795548"/>
      <ellipse cx="53" cy="40" rx="5" ry="2" fill="#5D4037"/>
      <path d="M58,44 Q63,44 63,49 Q63,52 58,52" stroke="#795548" stroke-width="2" fill="none"/>
      <!-- Steam from coffee -->
      <path d="M52,36 Q54,33 52,30" stroke="#FFFFFF" stroke-width="1" fill="none" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
      </path>
    </g>
  `
};

/**
 * Get accessory SVG for current seasonal event
 * @param {string} timezone - IANA timezone string
 * @param {string} petType - Type of pet (unused now, kept for compat)
 * @param {Array<string>} spriteGrid - The sprite grid for head detection
 * @returns {string} SVG string or empty string
 */
function getSeasonalAccessory(timezone = 'UTC', petType = 'cat', spriteGrid = []) {
  const event = getSeasonalEvent(timezone);
  if (event && SEASONAL_ACCESSORIES[event]) {
    // Calculate head position (top-most pixel, with pet-specific offsets)
    const headPos = calculateHeadPosition(spriteGrid, petType);

    // Get relative offset for the accessory
    const offset = RELATIVE_ACCESSORY_OFFSETS[event] || { x: 0, y: 0 };

    // Calculate final position
    const x = headPos.x + offset.x;
    const y = headPos.y + offset.y;

    return `<!-- Seasonal: ${event} -->\n${SEASONAL_ACCESSORIES[event](x, y)}`;
  }
  return '';
}

// --- GAMIFICATION SYSTEM ---

/**
 * RPG-Style Level Curve
 * Uses exponential curve that scales well from 0 to 10000+ commits
 * 
 * Level Thresholds (commits needed):
 * Lv1: 0     | Lv11: 100   | Lv21: 400   | Lv31: 900   | Lv41: 1600
 * Lv2: 1     | Lv12: 121   | Lv22: 441   | Lv32: 961   | Lv42: 1681
 * Lv3: 4     | Lv13: 144   | Lv23: 484   | Lv33: 1024  | Lv43: 1764
 * Lv4: 9     | Lv14: 169   | Lv24: 529   | Lv34: 1089  | Lv44: 1849
 * Lv5: 16    | Lv15: 196   | Lv25: 576   | Lv35: 1156  | Lv45: 1936
 * Lv6: 25    | Lv16: 225   | Lv26: 625   | Lv36: 1225  | Lv46: 2025
 * Lv7: 36    | Lv17: 256   | Lv27: 676   | Lv37: 1296  | Lv47: 2116
 * Lv8: 49    | Lv18: 289   | Lv28: 729   | Lv38: 1369  | Lv48: 2209
 * Lv9: 64    | Lv19: 324   | Lv29: 784   | Lv39: 1444  | Lv49: 2304
 * Lv10: 81   | Lv20: 361   | Lv30: 841   | Lv40: 1521  | Lv50: 2401
 * 
 * Max Level: 100 (at 9801 commits)
 * 
 * @param {number} totalCommits - Total commit count (from GitHub Search API)
 * @param {boolean} isDead - Whether pet is in ghost/dead state
 * @returns {Object} { level, xp, currentLevelXp, nextLevelXp, xpProgress, maxLevel, evolutionStage }
 */
function calculateStats(totalCommits, isDead = false) {
  // If pet is dead, reset all stats
  if (isDead) {
    return {
      level: 0,
      xp: 0,
      currentLevelXp: 0,
      nextLevelXp: 1,
      xpProgress: 0,
      maxLevel: 100,
      evolutionStage: 'dead',
      evolutionIcon: '💀'
    };
  }

  // 1 commit = 10 XP
  const xp = totalCommits * 10;
  
  // Level formula: level = floor(sqrt(totalCommits)) + 1
  // This gives a nice curve where each level needs more commits
  const level = Math.min(100, Math.floor(Math.sqrt(totalCommits)) + 1);
  
  // XP thresholds for current and next level
  const currentLevelXp = Math.pow(level - 1, 2) * 10; // XP needed to reach current level
  const nextLevelXp = Math.pow(level, 2) * 10;        // XP needed to reach next level
  
  // Progress percentage within current level (0-100)
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  const xpProgress = Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100));

  // Evolution stages based on level with pet-appropriate icons
  let evolutionStage, evolutionIcon, evolutionName, evolutionScale;
  if (level <= 5) {
    evolutionStage = 'egg';
    evolutionIcon = '🥚';
    evolutionName = 'Egg';
    evolutionScale = 0.7;  // Smaller size
  } else if (level <= 15) {
    evolutionStage = 'baby';
    evolutionIcon = '🐣';
    evolutionName = 'Baby';
    evolutionScale = 0.85;
  } else if (level <= 30) {
    evolutionStage = 'juvenile';
    evolutionIcon = '🌱';
    evolutionName = 'Juvenile';
    evolutionScale = 0.95;
  } else if (level <= 50) {
    evolutionStage = 'adult';
    evolutionIcon = '⭐';
    evolutionName = 'Adult';
    evolutionScale = 1.0;  // Normal size
  } else if (level <= 75) {
    evolutionStage = 'master';
    evolutionIcon = '💫';
    evolutionName = 'Master';
    evolutionScale = 1.05;
  } else if (level <= 99) {
    evolutionStage = 'legendary';
    evolutionIcon = '👑';
    evolutionName = 'Legendary';
    evolutionScale = 1.1;
  } else {
    evolutionStage = 'mythical';
    evolutionIcon = '🌟';
    evolutionName = 'Mythical';
    evolutionScale = 1.15;  // Largest size
  }

  // Check if close to evolution (within 10% XP of next stage)
  const evolutionThresholds = [5, 15, 30, 50, 75, 99];
  const nextEvolutionLevel = evolutionThresholds.find(t => level < t) || 100;
  const isCloseToEvolution = level >= nextEvolutionLevel - 2 && level < nextEvolutionLevel;

  return {
    level,
    xp,
    currentLevelXp,
    nextLevelXp,
    xpProgress,
    maxLevel: 100,
    evolutionStage,
    evolutionIcon,
    evolutionName,
    evolutionScale,
    isCloseToEvolution,
    nextEvolutionLevel
  };
}

/**
 * Advanced Mood System with Priority
 * @param {Array} events - GitHub events array
 * @param {string} timezone - IANA timezone string
 * @returns {Object} { mood, icon, moodKey }
 */
function getMood(events, timezone = 'UTC') {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Parse events for analysis
  const eventDates = events.map(e => new Date(e.created_at));
  const todayEvents = events.filter(e => e.created_at.startsWith(todayStr));
  const last24hEvents = events.filter(e => {
    const eventTime = new Date(e.created_at);
    return (now - eventTime) < 24 * 60 * 60 * 1000;
  });

  // Calculate days since last commit
  const lastEventDate = eventDates.length > 0 ? eventDates[0] : null;
  const daysSinceLastCommit = lastEventDate
    ? Math.floor((now - lastEventDate) / (24 * 60 * 60 * 1000))
    : 999;

  // Get local time in specified timezone
  const localTime = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false
  }).format(now);
  const localHour = parseInt(localTime, 10);

  // Get local day of week (0 = Sunday, 6 = Saturday)
  const localDayOfWeek = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short'
  }).format(now);
  const isWeekend = ['Sat', 'Sun'].includes(localDayOfWeek);

  // Check for night owl (last commit between 00:00 - 04:00 local time)
  let isNightOwl = false;
  if (lastEventDate) {
    const lastEventHour = parseInt(new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false
    }).format(lastEventDate), 10);
    isNightOwl = lastEventHour >= 0 && lastEventHour < 4;
  }

  // Priority System (1 = highest)
  // Priority 1: Ghost (no commits > 7 days)
  if (daysSinceLastCommit > 7) {
    return { mood: 'Ghost', icon: '👻', moodKey: 'ghost' };
  }

  // Priority 2: Sleeping (no commits today, but active within 7 days)
  if (todayEvents.length === 0 && daysSinceLastCommit <= 7) {
    return { mood: 'Sleeping', icon: '💤', moodKey: 'sleeping' };
  }

  // Priority 3: Caffeinated (5+ commits in the last hour)
  const lastHourEvents = events.filter(e => {
    const eventTime = new Date(e.created_at);
    return (now - eventTime) < 60 * 60 * 1000;
  });
  if (lastHourEvents.length >= 5) {
    return { mood: 'Caffeinated', icon: '☕', moodKey: 'caffeinated' };
  }

  // Priority 4: Debugging (3+ commits with "fix" in message in last 24h)
  const fixCommits = last24hEvents.filter(e => {
    const payload = e.payload || {};
    const commits = payload.commits || [];
    return commits.some(c => 
      c.message && c.message.toLowerCase().includes('fix')
    );
  });
  if (fixCommits.length >= 3) {
    return { mood: 'Debugging', icon: '🔍', moodKey: 'debugging' };
  }

  // Priority 5: Hyper/On Fire (> 10 commits in 24h)
  if (last24hEvents.length > 10) {
    return { mood: 'Hyper', icon: '🔥', moodKey: 'hyper' };
  }

  // Priority 6: Night Owl (commit between 00:00-04:00 local time)
  if (isNightOwl && todayEvents.length > 0) {
    return { mood: 'Night Owl', icon: '🦉', moodKey: 'nightowl' };
  }

  // Priority 7: Zen (active but low activity - 1-2 commits, weekend or chill)
  if (isWeekend && todayEvents.length >= 1 && todayEvents.length <= 2) {
    return { mood: 'Zen', icon: '🧘', moodKey: 'zen' };
  }

  // Priority 8: Weekend Chill (Sat/Sun AND < 3 commits today)
  if (isWeekend && todayEvents.length < 3 && todayEvents.length > 0) {
    return { mood: 'Weekend Chill', icon: '🏖️', moodKey: 'weekend' };
  }

  // Priority 9: Happy (default active state)
  return { mood: 'Happy', icon: '⚡', moodKey: 'normal' };
}

// ═══════════════════════════════════════════════════════════════════════════
// LEGENDARY PET DETECTION - Waterfall Priority System
// Priority: Mecha-Rex (Hardest) > Hydra > Cyber Golem > Void Spirit > Unicorn (Easiest)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine if user qualifies for a Legendary Pet based on stats
 * Priority Order (Hardest achievement first):
 * 1. Mecha-Rex (Grinder) - totalCommits > 1000
 * 2. Hydra (Polyglot) - languageCount >= 5
 * 3. Cyber Golem (Maintainer) - closedIssues > 50
 * 4. Void Spirit (Night Owl) - commit between 00:00-04:00
 * 5. Unicorn (Supporter) - starred/forked THIS repo (easiest/entry level)
 * 
 * @param {Object} stats - User statistics object
 * @returns {string|null} Legendary pet key or null if not qualified
 */
function getLegendaryPet(stats) {
  // Priority 1: Mecha-Rex (The Grinder) - HARDEST
  if (stats.totalCommits > 1000) {
    console.log('🦖 Legendary: MECHA-REX unlocked! (1000+ commits - The Grinder)');
    return 'mecha_rex';
  }

  // Priority 2: Hydra (The Polyglot)
  if (stats.languageCount >= 5) {
    console.log('🐉 Legendary: HYDRA unlocked! (5+ languages - The Polyglot)');
    return 'hydra';
  }

  // Priority 3: Cyber Golem (The Maintainer)
  if (stats.closedIssues > 50) {
    console.log('🗿 Legendary: CYBER GOLEM unlocked! (50+ closed issues - The Maintainer)');
    return 'cyber_golem';
  }

  // Priority 4: Void Spirit (The Night Owl)
  // Recent commit between 00:00-04:00 local time
  if (stats.lastCommitHour !== null && stats.lastCommitHour >= 0 && stats.lastCommitHour < 4) {
    console.log('👻 Legendary: VOID SPIRIT unlocked! (Night coder 00:00-04:00)');
    return 'void_spirit';
  }

  // Priority 5: Unicorn (The Supporter) - EASIEST / Entry Level
  // User starred or forked THIS repository (ThanhNguyxn/Git-Gotchi)
  if (stats.isStargazer || stats.isForker) {
    console.log('🦄 Legendary: UNICORN unlocked! (Star/Fork supporter - Entry Level)');
    return 'unicorn';
  }

  // No legendary status - fallback to standard language pet
  return null;
}

/**
 * Fetch extended stats for Legendary Pet detection
 * @param {Object} octokit - GitHub API client
 * @param {string} username - GitHub username
 * @param {Array} events - User events array
 * @param {string} timezone - IANA timezone
 * @param {boolean} isStargazer - User starred this repo
 * @param {boolean} isForker - User forked this repo
 * @returns {Object} Extended stats object
 */
async function fetchLegendaryStats(octokit, username, events, timezone, isStargazer, isForker) {
  let languageCount = 0;
  let closedIssues = 0;
  let lastCommitHour = null;

  try {
    // Fetch user repos to count unique languages
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: username,
      per_page: 100,
      sort: 'updated'
    });

    const languages = new Set();
    repos.forEach(repo => {
      if (repo.language) languages.add(repo.language);
    });
    languageCount = languages.size;

    // Get last commit hour in user's timezone
    const pushEvents = events.filter(e => e.type === 'PushEvent');
    if (pushEvents.length > 0) {
      const lastPush = new Date(pushEvents[0].created_at);
      const localHour = parseInt(new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false
      }).format(lastPush), 10);
      lastCommitHour = localHour;
    }

    // Fetch closed issues count
    try {
      const { data: issueSearch } = await octokit.rest.search.issuesAndPullRequests({
        q: `author:${username} type:issue is:closed`,
        per_page: 1
      });
      closedIssues = issueSearch.total_count || 0;
    } catch (e) {
      console.log('Could not fetch closed issues count:', e.message);
    }

  } catch (error) {
    console.log('Warning: Could not fetch legendary stats:', error.message);
  }

  // Count total commits using GitHub Search API (accurate count)
  let totalCommits = 0;
  try {
    const { data: commitSearch } = await octokit.rest.search.commits({
      q: `author:${username}`,
      per_page: 1
    });
    totalCommits = commitSearch.total_count || 0;
  } catch (e) {
    // Fallback to event-based counting if search fails
    totalCommits = events.filter(e => e.type === 'PushEvent').length;
    console.log('Using fallback commit count from events:', totalCommits);
  }

  console.log(`Legendary Stats - Commits: ${totalCommits}, Languages: ${languageCount}, Issues: ${closedIssues}, LastHour: ${lastCommitHour}, Stargazer: ${isStargazer}, Forker: ${isForker}`);

  return {
    totalCommits,
    languageCount,
    closedIssues,
    lastCommitHour,
    isStargazer,
    isForker
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MYTHICAL PET DETECTION - Ultra Rare Tier (Higher than Legendary)
// Priority: Dragon > Leviathan > Thunderbird > Kitsune > Celestial
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine if user qualifies for a MYTHICAL Pet (Ultra rare tier)
 * Priority Order (Hardest achievement first):
 * 1. Dragon (Ancient) - totalCommits > 2000
 * 2. Leviathan (Coder) - linesOfCode > 50000
 * 3. Thunderbird (Merger) - prMerges >= 100
 * 4. Kitsune (Multi-repo) - activeRepos >= 10
 * 5. Celestial (Star) - starsReceived >= 50
 * 
 * @param {Object} stats - Extended user statistics object
 * @returns {string|null} Mythical pet key or null if not qualified
 */
function getMythicalPet(stats) {
  // Priority 1: Dragon (The Ancient) - HARDEST
  if (stats.totalCommits > 2000) {
    console.log('🐉 MYTHICAL: DRAGON unlocked! (2000+ commits - The Ancient Power)');
    return 'dragon';
  }

  // Priority 2: Leviathan (The Deep Coder)
  if (stats.linesOfCode >= 50000) {
    console.log('🌊 MYTHICAL: LEVIATHAN unlocked! (50,000+ lines of code - The Deep Coder)');
    return 'leviathan';
  }

  // Priority 3: Thunderbird (The Merger)
  if (stats.prMerges >= 100) {
    console.log('⚡ MYTHICAL: THUNDERBIRD unlocked! (100+ PR merges - The Storm Bringer)');
    return 'thunderbird';
  }

  // Priority 4: Kitsune (The Multi-repo)
  if (stats.activeRepos >= 10) {
    console.log('🦊 MYTHICAL: KITSUNE unlocked! (10+ active repos - The Spirit Fox)');
    return 'kitsune';
  }

  // Priority 5: Celestial (The Star) - Easiest mythical
  if (stats.starsReceived >= 50) {
    console.log('⭐ MYTHICAL: CELESTIAL unlocked! (50+ stars received - The Celestial)');
    return 'celestial';
  }

  // No mythical status
  return null;
}

/**
 * Fetch extended stats for Mythical Pet detection
 * @param {Object} octokit - GitHub API client
 * @param {string} username - GitHub username
 * @param {number} totalCommits - Already fetched total commits
 * @returns {Object} Extended stats for mythical detection
 */
async function fetchMythicalStats(octokit, username, totalCommits) {
  let linesOfCode = 0;
  let prMerges = 0;
  let activeRepos = 0;
  let starsReceived = 0;

  try {
    // Fetch user repos
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: username,
      per_page: 100,
      sort: 'updated',
      type: 'owner'
    });

    // Count active repos (pushed in last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    activeRepos = repos.filter(r => new Date(r.pushed_at) > ninetyDaysAgo).length;

    // Count total stars received
    starsReceived = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    // Estimate lines of code (rough estimate based on repo size)
    // GitHub repo size is in KB, rough estimate: 1KB ≈ 30 lines of code
    linesOfCode = repos.reduce((sum, r) => sum + ((r.size || 0) * 30), 0);

    // Count merged PRs
    try {
      const { data: prSearch } = await octokit.rest.search.issuesAndPullRequests({
        q: `author:${username} type:pr is:merged`,
        per_page: 1
      });
      prMerges = prSearch.total_count || 0;
    } catch (e) {
      console.log('Could not fetch merged PRs:', e.message);
    }

  } catch (error) {
    console.log('Warning: Could not fetch mythical stats:', error.message);
  }

  console.log(`Mythical Stats - Commits: ${totalCommits}, LoC: ${linesOfCode}, PRs: ${prMerges}, ActiveRepos: ${activeRepos}, Stars: ${starsReceived}`);

  return {
    totalCommits,
    linesOfCode,
    prMerges,
    activeRepos,
    starsReceived
  };
}

/**
 * Generate Evolution Visual Effects
 * @param {string} evolutionStage - Current evolution stage
 * @param {boolean} isCloseToEvolution - Whether pet is about to evolve
 * @param {number} centerX - Center X position
 * @param {number} centerY - Center Y position
 * @returns {string} SVG elements for evolution effects
 */
function getEvolutionEffects(evolutionStage, isCloseToEvolution, centerX, centerY) {
  let effects = '';
  
  // Glowing aura based on evolution stage
  const auraColors = {
    'egg': 'none',
    'baby': 'none',
    'juvenile': '#4CAF50',  // Green glow
    'adult': '#FFD700',     // Gold glow
    'master': '#9C27B0',    // Purple glow
    'legendary': '#FF6B35', // Orange glow
    'mythical': '#00FFFF'   // Cyan glow
  };
  
  const auraColor = auraColors[evolutionStage] || 'none';
  
  // Add aura for adult and above
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
        <radialGradient id="evolutionAura">
          <stop offset="0%" stop-color="${auraColor}" stop-opacity="0.6"/>
          <stop offset="70%" stop-color="${auraColor}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${auraColor}" stop-opacity="0"/>
        </radialGradient>
        <filter id="evolutionGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="${centerX}" cy="${centerY}" r="${auraSize}" fill="url(#evolutionAura)">
        <animate attributeName="r" values="${auraSize};${auraSize + 8};${auraSize}" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
    `;
  }
  
  // Sparkle particles for master and above
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
  
  // Evolution ready effect (pulsing ring)
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
  
  // Mythical special effect: floating runes
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

/**
 * Generate Weather Effects SVG elements
 * @param {string} weather - 'rain', 'snow', 'stars', 'fireflies', 'leaves', 'none'
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @returns {string} SVG elements for weather overlay
 */
function getWeatherEffects(weather, width, height) {
  switch (weather) {
    case 'rain':
      // Animated rain drops
      return `
        <g opacity="0.6">
          ${Array.from({ length: 20 }, (_, i) => {
        const x = 10 + (i * (width / 20));
        const delay = (i * 0.1) % 1;
        return `<line x1="${x}" y1="-10" x2="${x - 5}" y2="10" stroke="#4FC3F7" stroke-width="2" stroke-linecap="round">
          <animate attributeName="y1" values="-10;${height + 10}" dur="0.7s" begin="${delay}s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="10;${height + 30}" dur="0.7s" begin="${delay}s" repeatCount="indefinite"/>
        </line>`;
      }).join('')}
        </g>
      `;
    case 'snow':
      // Animated falling snowflakes
      return `
        <g fill="#ffffff">
          ${Array.from({ length: 25 }, (_, i) => {
        const x = 5 + (i * (width / 25));
        const size = 2 + Math.random() * 4;
        const dur = 2 + Math.random() * 3;
        const delay = Math.random() * 2;
        return `<circle cx="${x}" cy="0" r="${size}" opacity="0.8">
          <animate attributeName="cy" values="0;${height}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="${x};${x + 20};${x}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
        </circle>`;
      }).join('')}
        </g>
      `;
    case 'stars':
      // Twinkling stars effect
      return `
        <g fill="#FFD700">
          ${Array.from({ length: 15 }, (_, i) => {
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
      // Floating glowing fireflies
      return `
        <g>
          ${Array.from({ length: 10 }, (_, i) => {
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
      // Falling autumn leaves
      return `
        <g>
          ${Array.from({ length: 12 }, (_, i) => {
        const x = 10 + (i * (width / 12));
        const dur = 4 + Math.random() * 3;
        const delay = Math.random() * 3;
        const colors = ['#FF9800', '#F44336', '#795548', '#FFC107'];
        const color = colors[i % colors.length];
        return `<g transform="translate(${x}, -20)">
          <path d="M0,0 Q5,-5 10,0 Q5,5 0,0" fill="${color}" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" values="0,0;${Math.random() * 30},${height}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="rotate" values="0;360;0" dur="3s" repeatCount="indefinite" additive="sum"/>
          </path>
        </g>`;
      }).join('')}
        </g>
      `;
    case 'none':
    default:
      return '';
  }
}

/**
 * Determine weather based on mood, season, and time
 * @param {string} mood - Current pet mood
 * @param {string} seasonalEvent - Current seasonal event (if any)
 * @param {number} hour - Current hour (0-23)
 * @returns {string} Weather effect to apply
 */
function determineWeather(mood, seasonalEvent, hour) {
  // Night time (10 PM - 5 AM) = stars
  if (hour >= 22 || hour < 5) {
    return 'stars';
  }

  // Seasonal weather
  if (seasonalEvent) {
    switch (seasonalEvent) {
      case 'CHRISTMAS':
      case 'NEW_YEAR':
        return 'snow';
      case 'HALLOWEEN':
        return 'fireflies';
      case 'THANKSGIVING':
        return Math.random() < 0.5 ? 'leaves' : 'none';
      case 'LUNAR_NEW_YEAR':
        return Math.random() < 0.3 ? 'fireflies' : 'none';
      default:
        break;
    }
  }

  // Mood-based weather
  if (mood === 'ghost') {
    return 'fireflies';
  }
  if (mood === 'zen') {
    return 'leaves';
  }

  // Random chance for rain (15%)
  if (Math.random() < 0.15) {
    return 'rain';
  }

  return 'none';
}

/**
 * Generate Theme Background SVG elements
 * @param {string} theme - 'minimal', 'cyberpunk', 'nature', 'synthwave', 'matrix', 'ocean'
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @returns {string} SVG elements for background
 */
function getThemeBackground(theme, width, height) {
  switch (theme) {
    case 'cyberpunk':
      // Dark purple with neon grid lines
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
      // Light green with simple cloud shapes
      return `
        <rect x="0" y="0" width="${width}" height="${height}" fill="#e8f5e9" rx="12" ry="12"/>
        <g fill="#a5d6a7" opacity="0.6">
          <ellipse cx="${width * 0.2}" cy="${height * 0.15}" rx="20" ry="12"/>
          <ellipse cx="${width * 0.25}" cy="${height * 0.12}" rx="15" ry="10"/>
          <ellipse cx="${width * 0.8}" cy="${height * 0.2}" rx="18" ry="10"/>
          <ellipse cx="${width * 0.75}" cy="${height * 0.17}" rx="12" ry="8"/>
        </g>
        <g fill="#81c784" opacity="0.4">
          <ellipse cx="${width * 0.1}" cy="${height * 0.9}" rx="25" ry="8"/>
          <ellipse cx="${width * 0.9}" cy="${height * 0.85}" rx="20" ry="6"/>
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
          ${Array.from({ length: 5 }, (_, i) =>
        `<line x1="0" y1="${height * 0.6 + i * (height * 0.1)}" x2="${width}" y2="${height * 0.6 + i * (height * 0.1)}"/>`
      ).join('')}
        </g>
      `;
    case 'matrix':
      // Digital rain with dark green
      return `
        <rect x="0" y="0" width="${width}" height="${height}" fill="#0d0d0d" rx="12" ry="12"/>
        <g font-family="monospace" font-size="10" fill="#00ff00" opacity="0.3">
          ${Array.from({ length: 15 }, (_, i) => {
        const x = 10 + (i * (width / 15));
        const chars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', '力', '七', '九'];
        return Array.from({ length: 8 }, (_, j) =>
          `<text x="${x}" y="${15 + j * 15}" opacity="${0.1 + Math.random() * 0.5}">${chars[Math.floor(Math.random() * chars.length)]}</text>`
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
        <!-- Waves -->
        <g fill="#00b4d8" opacity="0.2">
          <path d="M0,${height * 0.3} Q${width * 0.25},${height * 0.25} ${width * 0.5},${height * 0.3} T${width},${height * 0.3} V0 H0 Z"/>
        </g>
        <!-- Bubbles -->
        <g fill="#90e0ef" opacity="0.4">
          <circle cx="${width * 0.15}" cy="${height * 0.7}" r="5"/>
          <circle cx="${width * 0.2}" cy="${height * 0.6}" r="3"/>
          <circle cx="${width * 0.8}" cy="${height * 0.75}" r="6"/>
          <circle cx="${width * 0.85}" cy="${height * 0.65}" r="4"/>
          <circle cx="${width * 0.5}" cy="${height * 0.8}" r="4"/>
          <circle cx="${width * 0.45}" cy="${height * 0.85}" r="2"/>
          <circle cx="${width * 0.7}" cy="${height * 0.5}" r="3"/>
        </g>
        <!-- Light rays -->
        <g stroke="#caf0f8" stroke-opacity="0.15" stroke-width="15">
          <line x1="${width * 0.3}" y1="0" x2="${width * 0.35}" y2="${height * 0.6}"/>
          <line x1="${width * 0.6}" y1="0" x2="${width * 0.55}" y2="${height * 0.5}"/>
        </g>
      `;
    case 'minimal':
    default:
      // Current subtle background
      return `
        <rect x="5" y="5" width="${width - 10}" height="${height - 15}" rx="12" ry="12" fill="rgba(45, 51, 59, 0.15)"/>
      `;
  }
}

// --- CORE LOGIC ---

async function checkUserStarredOrForked(octokit, username) {
  try {
    console.log(`Checking if '${username}' starred or forked ThanhNguyxn/Git-Gotchi...`);

    // Check Stars (first 100)
    const { data: stargazers } = await octokit.rest.activity.listStargazersForRepo({
      owner: 'ThanhNguyxn',
      repo: 'Git-Gotchi',
      per_page: 100
    });

    if (stargazers.some(u => u.login.toLowerCase() === username.toLowerCase())) {
      console.log(`User ${username} has STARRED the repo! 🌟`);
      return true;
    }

    // Check Forks (first 100)
    const { data: forks } = await octokit.rest.repos.listForks({
      owner: 'ThanhNguyxn',
      repo: 'Git-Gotchi',
      per_page: 100
    });

    if (forks.some(f => f.owner.login.toLowerCase() === username.toLowerCase())) {
      console.log(`User ${username} has FORKED the repo! 🍴`);
      return true;
    }

    console.log(`User ${username} has NOT starred or forked the repo.`);
    return false;
  } catch (error) {
    console.log('Warning: Could not check star/fork status:', error.message);
    return false;
  }
}

async function run() {
  try {
    const token = core.getInput('github_token');
    const username = core.getInput('username');
    const timezone = core.getInput('timezone') || 'UTC';
    const backgroundTheme = core.getInput('background_theme') || 'minimal';
    const showLevel = core.getInput('show_level') !== 'false';
    const octokit = github.getOctokit(token);

    console.log(`Config - Timezone: ${timezone}, Theme: ${backgroundTheme}, Show Level: ${showLevel}`);

    // 1. Fetch User Activity
    const events = await octokit.rest.activity.listPublicEventsForUser({
      username: username,
      per_page: 100,
    });

    // 2. Determine Mood using new priority system
    const moodInfo = getMood(events.data, timezone);
    console.log(`Mood: ${moodInfo.mood} ${moodInfo.icon}`);

    // Check if pet is dead (ghost state)
    const isDead = moodInfo.moodKey === 'ghost';

    // Calculate Streak (keep for logging)
    const streak = calculateStreak(events.data);
    console.log(`Current Streak: ${streak} days`);

    // 3. Determine Pet Type (Species)
    let petType = 'cat';
    let isLegendary = false;

    // Check if user starred/forked THIS repo (for Unicorn entry-level legendary)
    const starForkResult = await checkUserStarredOrForked(octokit, username);
    const isStargazer = starForkResult; // checkUserStarredOrForked returns true if starred
    const isForker = starForkResult;    // or forked (combined check)

    // Fetch extended stats for Legendary Pet detection (includes accurate total commits)
    const legendaryStats = await fetchLegendaryStats(octokit, username, events.data, timezone, isStargazer, isForker);

    // Fetch extended stats for Mythical Pet detection
    const mythicalStats = await fetchMythicalStats(octokit, username, legendaryStats.totalCommits);

    // 4. Calculate Stats (Level & XP) - Use accurate commit count, apply death penalty
    const stats = calculateStats(legendaryStats.totalCommits, isDead);
    console.log(`Level: ${stats.level}, XP: ${stats.xp}/${stats.nextLevelXp}, Evolution: ${stats.evolutionStage} ${stats.evolutionIcon}`);
    if (isDead) {
      console.log(`⚠️ Pet is DEAD (Ghost state) - Stats reset! Commit to revive.`);
    }

    // Check for Mythical Pet FIRST (higher tier than Legendary)
    const mythicalPet = getMythicalPet(mythicalStats);
    let isMythical = false;

    // Check for Legendary Pet (waterfall priority)
    const legendaryPet = getLegendaryPet(legendaryStats);

    if (mythicalPet) {
      petType = mythicalPet;
      isMythical = true;
      console.log(`🌟 MYTHICAL Pet: ${petType.toUpperCase()}`);
    } else if (legendaryPet) {
      petType = legendaryPet;
      isLegendary = true;
      console.log(`🏆 Legendary Pet: ${petType.toUpperCase()}`);
    } else {
      // Fallback: Language-based standard pet
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

    console.log(`User: ${username}, Mood: ${moodInfo.mood}, Type: ${petType}, Legendary: ${isLegendary}, Theme: ${backgroundTheme}`);

    // 5. Generate SVG with new options
    const svgContent = generateSVG(petType, moodInfo.moodKey, {
      theme: backgroundTheme,
      showLevel: showLevel,
      stats: stats,
      moodInfo: moodInfo,
      timezone: timezone,
      streak: streak
    });

    // 6. Write to File
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

  let streak = 0;
  let currentDate = new Date();

  // Check if there's an event today or yesterday to start the streak
  const todayStr = currentDate.toISOString().split('T')[0];
  currentDate.setDate(currentDate.getDate() - 1);
  const yesterdayStr = currentDate.toISOString().split('T')[0];

  if (!dates.has(todayStr) && !dates.has(yesterdayStr)) {
    return 0;
  }

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
    // New languages
    'Kotlin': 'fox',
    'Dart': 'hummingbird',
    'C': 'gear',
    'Scala': 'ladder',
    'R': 'owl',
    'Perl': 'camel',
    // Wave 2
    'Lua': 'capybara',
    'Julia': 'alpaca',
    'Elixir': 'phoenix',
    // Wave 3
    'Zig': 'salamander',
    'Haskell': 'hedgehog',
    'Clojure': 'octopus',
    'Assembly': 'ant',
    'COBOL': 'dino',
    'Nim': 'lion',
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
    'P': '#C678DD',
    'G': '#98c379',
    'D': '#1b5e20', // Dark Green for Rex
    'M': '#ff80ab' // Pink for Unicorn cheek
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

function generateSVG(petType, mood, options = {}) {
  const { theme = 'minimal', showLevel = true, stats = null, moodInfo = null, timezone = 'UTC', streak = 0 } = options;

  // 1. Select the Sprite Set (check Mythical first, then Legendary, then Standard)
  const spriteSet = MYTHICAL_SPRITES[petType] || LEGENDARY_SPRITES[petType] || SPRITES[petType] || SPRITES['cat'];

  // 2. Select the specific Mood Grid with fallbacks for new moods
  let moodKey = moodInfo?.moodKey || ((mood === 'happy') ? 'normal' : mood);
  
  // Fallback mapping for new moods that might not have dedicated sprites
  const moodFallbacks = {
    caffeinated: 'hyper',    // Caffeinated falls back to hyper
    debugging: 'normal',     // Debugging falls back to normal
    zen: 'weekend'           // Zen falls back to weekend/chill
  };
  
  // If mood sprite doesn't exist, use fallback
  if (!spriteSet[moodKey] && moodFallbacks[moodKey]) {
    moodKey = moodFallbacks[moodKey];
  }
  
  const spriteGrid = spriteSet[moodKey] || spriteSet['normal'];

  // 3. Get base color (check Mythical first, then Legendary, then Standard)
  const baseColor = MYTHICAL_COLORS[petType] || LEGENDARY_COLORS[petType] || PET_COLORS[petType] || '#e5c07b';

  const pixelSize = 16;
  const rows = spriteGrid.length;
  const cols = spriteGrid[0].length;
  const width = cols * pixelSize;
  const height = rows * pixelSize;

  // Calculate SVG dimensions (extra space for stats if needed)
  const svgWidth = width + 40;
  const svgHeight = height + (showLevel && stats ? 85 : 40); // Increased for XP bar

  // Ghost Logic: Override Base Color
  const finalBaseColor = moodKey === 'ghost' ? '#abb2bf' : baseColor;
  const groupOpacity = moodKey === 'ghost' ? '0.7' : '1';

  const pixelArt = renderPixelGrid(spriteGrid, finalBaseColor, pixelSize);

  // Get theme background
  const themeBackground = getThemeBackground(theme, svgWidth, svgHeight);

  // Get weather effects based on mood and time
  const now = timezone ? new Date(new Date().toLocaleString('en-US', { timeZone: timezone })) : new Date();
  const currentHour = now.getHours();
  const seasonalEvent = moodInfo?.seasonalEvent || null;
  const weather = determineWeather(moodKey, seasonalEvent, currentHour);
  const weatherEffects = getWeatherEffects(weather, svgWidth, svgHeight);

  // Text color based on theme
  const getTextColor = (t) => {
    switch(t) {
      case 'cyberpunk': return '#00ffff';
      case 'nature': return '#388e3c';
      case 'synthwave': return '#ff6b9d';
      case 'matrix': return '#00ff00';
      case 'ocean': return '#90e0ef';
      default: return '#666';
    }
  };
  const textColor = getTextColor(theme);

  let animation = '';
  if (moodKey === 'normal') {
    // Happy bounce animation
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0 0; 0 -4; 0 0" 
            dur="0.5s" 
            repeatCount="indefinite" 
        />`;
  } else if (moodKey === 'sleeping') {
    // Breathing/sleeping animation
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="scale" 
            values="1 1; 1.02 0.98; 1 1" 
            dur="2s" 
            repeatCount="indefinite" 
        />`;
  } else if (moodKey === 'hyper') {
    // Fast shake animation for hyper mode
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0 0; -2 -2; 2 -4; -2 -2; 0 0" 
            dur="0.3s" 
            repeatCount="indefinite" 
        />`;
  } else if (moodKey === 'ghost') {
    // Floating/fading ghost animation
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0 0; 0 -8; 0 0" 
            dur="3s" 
            repeatCount="indefinite" 
        />
        <animate
            attributeName="opacity"
            values="0.7; 0.4; 0.7"
            dur="2s"
            repeatCount="indefinite"
        />`;
  } else if (moodKey === 'nightowl') {
    // Subtle glow/pulse for night owl
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="scale" 
            values="1 1; 1.01 1.01; 1 1" 
            dur="1.5s" 
            repeatCount="indefinite" 
        />`;
  } else if (moodKey === 'weekend') {
    // Relaxed sway animation
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="rotate" 
            values="0; 2; 0; -2; 0" 
            dur="2s" 
            repeatCount="indefinite" 
        />`;
  } else if (moodKey === 'caffeinated' || moodInfo?.moodKey === 'caffeinated') {
    // Super fast shake - caffeine jitters!
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0 0; -3 -1; 3 -2; -2 -3; 2 -1; -1 -2; 0 0" 
            dur="0.15s" 
            repeatCount="indefinite" 
        />`;
  } else if (moodKey === 'debugging' || moodInfo?.moodKey === 'debugging') {
    // Head scratch/thinking animation
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="rotate" 
            values="0; -3; 0; 3; 0" 
            dur="0.8s" 
            repeatCount="indefinite" 
        />`;
  } else if (moodKey === 'zen' || moodInfo?.moodKey === 'zen') {
    // Slow peaceful breathing
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="scale" 
            values="1 1; 1.03 1.03; 1 1" 
            dur="4s" 
            repeatCount="indefinite" 
        />`;
  }

  // Build stats display with XP progress bar
  let statsDisplay = '';
  if (showLevel && stats && moodInfo) {
    const barWidth = svgWidth - 40; // Full width minus margins
    const barHeight = 8;
    const barY = height + 50;
    const xpProgress = stats.xpProgress || 0;
    const progressWidth = (xpProgress / 100) * barWidth;
    
    // Progress bar colors based on theme
    const barBgColor = theme === 'cyberpunk' ? '#1a0a2e' : (theme === 'nature' ? '#c8e6c9' : '#e0e0e0');
    const barFillColor = theme === 'cyberpunk' ? '#ff00ff' : (theme === 'nature' ? '#4caf50' : '#4fc3f7');
    const barBorderColor = theme === 'cyberpunk' ? '#00ffff' : (theme === 'nature' ? '#2e7d32' : '#0288d1');
    
    // Death state: Red/grey colors
    const isDead = moodKey === 'ghost';
    const actualBarFill = isDead ? '#e53935' : barFillColor;
    const actualProgress = isDead ? 0 : progressWidth;

    // Streak fire icon (show if streak >= 3)
    const streakDisplay = streak >= 3 ? `🔥${streak}` : (streak > 0 ? `⚡${streak}` : '');
    
    // Evolution icon and name
    const evolutionDisplay = stats.evolutionIcon || '';
    const evolutionName = stats.evolutionName || '';
    
    statsDisplay = `
      <!-- Level & Mood Text -->
      <text x="20" y="${height + 43}" font-family="monospace" font-size="11" fill="${textColor}">
        ${evolutionDisplay} Lv.${stats.level} ${evolutionName}
      </text>
      <text x="${svgWidth - 20}" y="${height + 43}" text-anchor="end" font-family="monospace" font-size="11" fill="${textColor}">
        ${moodInfo.icon} ${moodInfo.mood.toUpperCase()} ${streakDisplay}
      </text>
      
      <!-- XP Progress Bar -->
      <rect x="20" y="${barY}" width="${barWidth}" height="${barHeight}" rx="4" fill="${barBgColor}" stroke="${barBorderColor}" stroke-width="1"/>
      <rect x="20" y="${barY}" width="${actualProgress}" height="${barHeight}" rx="4" fill="${actualBarFill}">
        ${!isDead ? `<animate attributeName="width" from="0" to="${actualProgress}" dur="0.5s" fill="freeze"/>` : ''}
      </rect>
      
      <!-- XP Text -->
      <text x="50%" y="${barY + barHeight + 15}" text-anchor="middle" font-family="monospace" font-size="9" fill="${textColor}">
        ${isDead ? '💀 DEAD - Commit to revive!' : `XP: ${stats.xp} / ${stats.nextLevelXp} (${xpProgress}%)`}
      </text>
    `;
  }

  // Build mood-only display (fallback)
  const moodDisplay = !statsDisplay ? `
      <text x="50%" y="${height + 35}" text-anchor="middle" font-family="monospace" font-size="12" fill="${textColor}">
        ${moodInfo?.icon || ''} ${(moodInfo?.mood || mood).toUpperCase()}
      </text>
  ` : '';

  // Get seasonal accessory (holiday accessories)
  const seasonalAccessory = getSeasonalAccessory(timezone, petType, spriteGrid);
  
  // Get pet phrase and speech bubble
  const currentHoliday = getSeasonalEvent(timezone);
  const actualMoodKey = moodInfo?.moodKey || moodKey;
  const phrase = getPetPhrase(actualMoodKey, petType, currentHoliday);
  const speechBubble = generateSpeechBubble(phrase, width - 30, -25);

  // Get achievement badges
  const achievementStats = {
    totalCommits: stats?.totalCommits || 0,
    streak: streak || 0,
    level: stats?.level || 1,
    hasNightCommit: currentHour >= 22 || currentHour < 5,
    hasWeekendCommit: now.getDay() === 0 || now.getDay() === 6,
    hasEarlyCommit: currentHour >= 5 && currentHour < 7
  };
  const earnedAchievements = getEarnedAchievements(achievementStats);
  const achievementBadges = earnedAchievements.length > 0 ? 
    `<g transform="translate(15, ${svgHeight - 30})">${generateAchievementBadges(earnedAchievements)}</g>` : '';

  // Evolution visual effects
  const evolutionScale = stats?.evolutionScale || 1;
  const petCenterX = width / 2;
  const petCenterY = height / 2;
  const evolutionEffects = stats ? getEvolutionEffects(
    stats.evolutionStage, 
    stats.isCloseToEvolution, 
    petCenterX + 20,  // Adjust for translate offset
    petCenterY + 20
  ) : '';

  // Calculate pet transform with evolution scale
  const scaleOffset = ((1 - evolutionScale) * width) / 2;
  const petTransform = evolutionScale !== 1 
    ? `translate(${20 + scaleOffset}, ${20 + scaleOffset}) scale(${evolutionScale})`
    : 'translate(20, 20)';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>
        .pet { transform-origin: center; }
      </style>
      <!-- Theme Background -->
      ${themeBackground}
      <!-- Weather Effects (behind pet) -->
      <g class="weather-layer" style="pointer-events: none;">
        ${weatherEffects}
      </g>
      <!-- Evolution Effects (behind pet) -->
      <g class="evolution-layer" style="pointer-events: none;">
        ${evolutionEffects}
      </g>
      <g transform="${petTransform}" opacity="${groupOpacity}">
        <g class="pet">
            ${pixelArt}
            ${animation}
        </g>
        <!-- Speech Bubble -->
        ${speechBubble}
        <!-- Seasonal Accessory (z-index: above pet) -->
        ${seasonalAccessory}
      </g>
      ${statsDisplay}
      ${moodDisplay}
      <!-- Achievement Badges -->
      ${achievementBadges}
    </svg>`;
}

run();
