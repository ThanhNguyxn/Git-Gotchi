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
  phoenix: '#ff4500'   // Orange-Red (Elixir)
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
  dragon: {
    normal: [
      "                ",
      "    KKK    KKK  ",
      "   KXXXK  KXXXK ",
      "    KXXKKKKXXK  ",
      "     KXXXXXXK   ",
      "    KXXWXXWXXK  ",
      "    KXXKXXKXXK  ",
      "   KXXXXXXXXXXK ",
      "  KXXXXRRRXXXXK ",
      " KXXXXXXXRXXXXK ",
      "KXKXXXXXXXXXXKXK",
      "K KXXXXXXXXXXK K",
      "   KXXXXXXXXK   ",
      "    KXK  KXK    ",
      "   KK      KK   ",
      "                "
    ],
    sleeping: [
      "                ",
      "                ",
      "    KKK    KKK  ",
      "   KXXXK  KXXXK ",
      "    KXXKKKKXXK  ",
      "     KXXXXXXK   ",
      "    KXXKKKKXXK  ",
      "    KXXXXXXXXK  ",
      "   KXXXXXXXXXXK ",
      "  KXXXXRRRXXXXK ",
      " KXXXXXXXXXXXXXK",
      "KXKXXXXXXXXXXKXK",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KKKKKK     ",
      "                "
    ],
    ghost: [
      "                ",
      "    K K    K K  ",
      "   K   K  K   K ",
      "    K  KKKK  K  ",
      "     K X X K    ",
      "    K  K  K  K  ",
      "    K  K  K  K  ",
      "   K    X    K  ",
      "  K   R R R   K ",
      " K        R    K",
      "K K          K K",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "   RRR    RRR   ",
      "    KKK    KKK  ",
      "   KXXXK  KXXXK ",
      "    KXXKKKKXXK  ",
      "     KXXXXXXK   ",
      "    KXXRXXRXXK  ",
      "    KXXKXXKXXK  ",
      "   KXXXXXXXXXXK ",
      "  KXXXXRRRXXXXK ",
      " KXXXXXXXRXXXXK ",
      "KXKXXXXXXXXXXKXK",
      "K KXXXXXXXXXXK K",
      "   KXXXXXXXXK   ",
      "    KXK  KXK R  ",
      "   KK      KK   ",
      "                "
    ],
    nightowl: [
      "                ",
      "    KKK    KKK  ",
      "   KXXXK  KXXXK ",
      "    KXXKKKKXXK  ",
      "     KXXXXXXK   ",
      "    KXXOXXOXXK  ",
      "    KXXKXXKXXK  ",
      "   KXXXXXXXXXXK ",
      "  KXXXXRRRXXXXK ",
      " KXXXXXXXRXXXXK ",
      "KXKXXXXXXXXXXKXK",
      "K KXXXXXXXXXXK K",
      "   KXXXXXXXXK   ",
      "    KXK  KXK    ",
      "   KK      KK   ",
      "                "
    ],
    weekend: [
      "                ",
      "    KKK    KKK  ",
      "   KXXXK  KXXXK ",
      "    KXXKKKKXXK  ",
      "     KXXXXXXK   ",
      "    KXXKKKKXXK  ",
      "    KXXXXXXXXK  ",
      "   KXXXXXXXXXXK ",
      "  KXXXXRRRXXXXK ",
      " KXXXXXXXXXXXXXK",
      "KXKXXXXXXXXXXKXK",
      "K KXXXXXXXXXXK K",
      "   KXXXXXXXXK   ",
      "    KXK  KXK    ",
      "   KK      KK   ",
      "                "
    ]
  },

  // ⚡ THUNDERBIRD: Electric Storm Bird (16x16) - 100+ PR merges
  thunderbird: {
    normal: [
      "                ",
      "       YY       ",
      "      YYYY      ",
      "     KYYYYK     ",
      "    KXXYYXXK    ",
      "   KXXWXXWXXK   ",
      "   KXXKXXKXXK   ",
      "    KXXXXXXK    ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXYXXXXXK  ",
      "KXXXXXYYXXXXXK  ",
      " KXXXXYXXXXXXK  ",
      "  KXXXYXXXXXK   ",
      "   KKXKKXKKK    ",
      "    KK  KK      ",
      "                "
    ],
    sleeping: [
      "                ",
      "                ",
      "       YY       ",
      "      YYYY      ",
      "     KYYYYK     ",
      "    KXXYYXXK    ",
      "   KXXKKKKXXK   ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXYXXXXXK  ",
      "KXXXXXYYXXXXXK  ",
      " KXXXXYXXXXXXK  ",
      "  KXXXYXXXXXK   ",
      "   KKKKKKKKKK   ",
      "                "
    ],
    ghost: [
      "                ",
      "       Y        ",
      "      Y Y       ",
      "     K   K      ",
      "    K  Y  K     ",
      "   K  K  K  K   ",
      "   K  K  K  K   ",
      "    K      K    ",
      "  K          K  ",
      " K    Y      K  ",
      "K    YY      K  ",
      " K   Y       K  ",
      "  K  Y      K   ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "    YY    YY    ",
      "       YY       ",
      "      YYYY      ",
      "     KYYYYK     ",
      "    KXXYYXXK    ",
      "   KXXRXXRXXK   ",
      "   KXXKXXKXXK   ",
      "    KXXXXXXK    ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXYXXXXXK  ",
      "KXXXXXYYXXXXXK  ",
      " KXXXXYXXXXXXK  ",
      "  KXXXYXXXXXK Y ",
      "   KKXKKXKKK    ",
      "    KK  KK      ",
      "                "
    ],
    nightowl: [
      "                ",
      "       YY       ",
      "      YYYY      ",
      "     KYYYYK     ",
      "    KXXYYXXK    ",
      "   KXXOXXOXXK   ",
      "   KXXKXXKXXK   ",
      "    KXXXXXXK    ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXYXXXXXK  ",
      "KXXXXXYYXXXXXK  ",
      " KXXXXYXXXXXXK  ",
      "  KXXXYXXXXXK   ",
      "   KKXKKXKKK    ",
      "    KK  KK      ",
      "                "
    ],
    weekend: [
      "                ",
      "       YY       ",
      "      YYYY      ",
      "     KYYYYK     ",
      "    KXXYYXXK    ",
      "   KXXKKKKXXK   ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "  KXXXXXXXXXXK  ",
      " KXXXXXYXXXXXK  ",
      "KXXXXXYYXXXXXK  ",
      " KXXXXYXXXXXXK  ",
      "  KXXXYXXXXXK   ",
      "   KKXKKXKKK    ",
      "    KK  KK      ",
      "                "
    ]
  },

  // 🦊 KITSUNE: 9-Tailed Fox Spirit (16x16) - 10+ active repos
  kitsune: {
    normal: [
      " KK KK KK KK KK ",
      "KXXKXXKXXKXXKXXK",
      " KXKXKXKXKXKXK  ",
      "  KXKXKXKXKXK   ",
      "   KXXXXXK      ",
      "   KXXXXXXK     ",
      "  KXXWXXWXXK    ",
      "  KXXKXXKXXK    ",
      "  KXXXXXXXXXXK  ",
      "  KXXKXXXXKXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KXK    KXK   ",
      "  KXK      KXK  ",
      "  KK        KK  ",
      "                "
    ],
    sleeping: [
      " KK KK KK KK KK ",
      "KXXKXXKXXKXXKXXK",
      " KXKXKXKXKXKXK  ",
      "  KXKXKXKXKXK   ",
      "   KXXXXXK      ",
      "   KXXXXXXK     ",
      "  KXXKKKKXXK    ",
      "  KXXXXXXXXK    ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "     KKKKKK     ",
      "                ",
      "                ",
      "                "
    ],
    ghost: [
      " K  K  K  K  K  ",
      "K XK XK XK XK X ",
      " K K K K K K K  ",
      "  K K K K K K   ",
      "   K     K      ",
      "   K      K     ",
      "  K  K  K  K    ",
      "  K  K  K  K    ",
      "  K          K  ",
      "  K  K    K  K  ",
      "   K        K   ",
      "    K      K    ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      " KK KK KK KK KK ",
      "KXXKXXKXXKXXKXXK",
      " KRKRKRKRKRKRK  ",
      "  KXKXKXKXKXK   ",
      "   KXXXXXK      ",
      "   KXXXXXXK     ",
      "  KXXRXXRXXK    ",
      "  KXXKXXKXXK    ",
      "  KXXXXXXXXXXK  ",
      "  KXXKXXXXKXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK  R ",
      "   KXK    KXK   ",
      "  KXK      KXK  ",
      "  KK        KK  ",
      "                "
    ],
    nightowl: [
      " KK KK KK KK KK ",
      "KXXKXXKXXKXXKXXK",
      " KXKXKXKXKXKXK  ",
      "  KXKXKXKXKXK   ",
      "   KXXXXXK      ",
      "   KXXXXXXK     ",
      "  KXXOXXOXXK    ",
      "  KXXKXXKXXK    ",
      "  KXXXXXXXXXXK  ",
      "  KXXKXXXXKXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KXK    KXK   ",
      "  KXK      KXK  ",
      "  KK        KK  ",
      "                "
    ],
    weekend: [
      " KK KK KK KK KK ",
      "KXXKXXKXXKXXKXXK",
      " KXKXKXKXKXKXK  ",
      "  KXKXKXKXKXK   ",
      "   KXXXXXK      ",
      "   KXXXXXXK     ",
      "  KXXKKKKXXK    ",
      "  KXXXXXXXXK    ",
      "  KXXXXXXXXXXK  ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KXXXXXXK    ",
      "   KXK    KXK   ",
      "  KXK      KXK  ",
      "  KK        KK  ",
      "                "
    ]
  },

  // 🌊 LEVIATHAN: Deep Sea Monster (16x16) - 50,000+ lines of code
  leviathan: {
    normal: [
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXXXXXXXXXK  ",
      " KXXWXXXXXXWXXK ",
      " KXXKXXXXXXKXXK ",
      "KXXXXXXXXXXXXXXK",
      "KXXXXXKKKXXXXXK ",
      " KXXXK   KXXXK  ",
      "  KXXK   KXXK   ",
      " KXXXK   KXXXK  ",
      "KXXXXK   KXXXXK ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "                "
    ],
    sleeping: [
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXXXXXXXXXK  ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXX K",
      "KXXXXXXXXXXXXXXK",
      "KXXXXXKKKXXXXXK ",
      " KXXXK   KXXXK  ",
      "  KXXK   KXXK   ",
      " KXXXK   KXXXK  ",
      "KXXXXK   KXXXXK ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "                "
    ],
    ghost: [
      "     K K K      ",
      "   K       K    ",
      "  K          K  ",
      " K  K      K  K ",
      " K  K      K  K ",
      "K              K",
      "K     K K     K ",
      " K   K   K   K  ",
      "  K  K   K  K   ",
      " K   K   K   K  ",
      "K    K   K    K ",
      " K           K  ",
      "  K         K   ",
      "   K       K    ",
      "    K K K K     ",
      "                "
    ],
    hyper: [
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXXXXXXXXXK  ",
      " KXXRXXXXXXRXXK ",
      " KXXKXXXXXXKXXK ",
      "KXXXXXXXXXXXXXXK",
      "KXXXXXKKKXXXXXK ",
      " KXXXK R KXXXK  ",
      "  KXXK   KXXK   ",
      " KXXXK   KXXXK  ",
      "KXXXXK   KXXXXK ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK R ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "                "
    ],
    nightowl: [
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXXXXXXXXXK  ",
      " KXXOXXXXXXOXXK ",
      " KXXKXXXXXXKXXK ",
      "KXXXXXXXXXXXXXXK",
      "KXXXXXKKKXXXXXK ",
      " KXXXK   KXXXK  ",
      "  KXXK   KXXK   ",
      " KXXXK   KXXXK  ",
      "KXXXXK   KXXXXK ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "                "
    ],
    weekend: [
      "     KKKKKK     ",
      "   KKXXXXXXKK   ",
      "  KXXXXXXXXXXK  ",
      " KXXKKXXXXKKXXK ",
      " KXXXXXXXXXXXX K",
      "KXXXXXXXXXXXXXXK",
      "KXXXXXKKKXXXXXK ",
      " KXXXK   KXXXK  ",
      "  KXXK   KXXK   ",
      " KXXXK   KXXXK  ",
      "KXXXXK   KXXXXK ",
      " KXXXXXXXXXXXK  ",
      "  KXXXXXXXXXK   ",
      "   KXXXXXXXK    ",
      "    KKKKKKK     ",
      "                "
    ]
  },

  // ⭐ CELESTIAL: Star Deer (16x16) - 50+ GitHub stars received
  celestial: {
    normal: [
      "    Y      Y    ",
      "   YXY    YXY   ",
      "    Y  KK  Y    ",
      "      KXXK      ",
      "     KXXXXK     ",
      "    KXXWWXXK    ",
      "    KXXKKXXK    ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KYXXXXXXXXXXYK ",
      "  KXXXXXXXXXXK  ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "    K      K    ",
      "                "
    ],
    sleeping: [
      "    Y      Y    ",
      "   YXY    YXY   ",
      "    Y  KK  Y    ",
      "      KXXK      ",
      "     KXXXXK     ",
      "    KXXKKXXK    ",
      "    KXXXXXXXXK  ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KYXXXXXXXXXXYK ",
      "  KXXXXXXXXXXK  ",
      "   KXXXXXXXXK   ",
      "    KKKKKKKK    ",
      "                ",
      "                "
    ],
    ghost: [
      "    Y      Y    ",
      "   Y Y    Y Y   ",
      "    Y  K   Y    ",
      "      K  K      ",
      "     K    K     ",
      "    K  K  K K   ",
      "    K  K  K K   ",
      "    K      K    ",
      "   K        K   ",
      "  K          K  ",
      " KY          YK ",
      "  K          K  ",
      "                ",
      "                ",
      "                ",
      "                "
    ],
    hyper: [
      "   RY      YR   ",
      "   YXY    YXY   ",
      "    Y  KK  Y    ",
      "      KXXK      ",
      "     KXXXXK     ",
      "    KXXRRXXK    ",
      "    KXXKKXXK    ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KYXXXXXXXXXXYK ",
      "  KXXXXXXXXXXK  ",
      "   KXK    KXK R ",
      "   KXK    KXK   ",
      "    K      K    ",
      "                "
    ],
    nightowl: [
      "    Y      Y    ",
      "   YXY    YXY   ",
      "    Y  KK  Y    ",
      "      KXXK      ",
      "     KXXXXK     ",
      "    KXXOOXXK    ",
      "    KXXKKXXK    ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KYXXXXXXXXXXYK ",
      "  KXXXXXXXXXXK  ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "    K      K    ",
      "                "
    ],
    weekend: [
      "    Y      Y    ",
      "   YXY    YXY   ",
      "    Y  KK  Y    ",
      "      KXXK      ",
      "     KXXXXK     ",
      "    KXXKKXXK    ",
      "    KXXXXXXXXK  ",
      "    KXXXXXXK    ",
      "   KXXXXXXXXK   ",
      "  KXXXXXXXXXXK  ",
      " KYXXXXXXXXXXYK ",
      "  KXXXXXXXXXXK  ",
      "   KXK    KXK   ",
      "   KXK    KXK   ",
      "    K      K    ",
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
  }
};

// ====================================
// LEGENDARY PETS (Special/Elite)

// --- SEASONAL EVENT SYSTEM ---

/**
 * Lunar New Year (Tet) - Pre-calculated dates 2025-2100
 * Normalized to cover BOTH Vietnamese (GMT+7) and Chinese (GMT+8) Lunar New Years
 * Format: { start: [month, day], end: [month, day] }
 */
const tetRanges = {
  // --- 2025 to 2030 ---
  2025: { start: [1, 27], end: [2, 3] },
  2026: { start: [2, 15], end: [2, 22] },
  2027: { start: [2, 4], end: [2, 11] },
  2028: { start: [1, 24], end: [1, 31] },
  2029: { start: [2, 11], end: [2, 18] },
  2030: { start: [1, 31], end: [2, 8] },   // Expanded for global coverage

  // --- 2031 to 2040 ---
  2031: { start: [1, 21], end: [1, 28] },
  2032: { start: [2, 9], end: [2, 16] },
  2033: { start: [1, 29], end: [2, 5] },
  2034: { start: [2, 17], end: [2, 24] },
  2035: { start: [2, 6], end: [2, 13] },
  2036: { start: [1, 26], end: [2, 2] },
  2037: { start: [2, 13], end: [2, 20] },
  2038: { start: [2, 2], end: [2, 9] },
  2039: { start: [1, 22], end: [1, 29] },
  2040: { start: [2, 10], end: [2, 17] },

  // --- 2041 to 2050 ---
  2041: { start: [1, 30], end: [2, 6] },
  2042: { start: [1, 20], end: [1, 27] },
  2043: { start: [2, 8], end: [2, 15] },
  2044: { start: [1, 28], end: [2, 4] },
  2045: { start: [2, 15], end: [2, 22] },
  2046: { start: [2, 4], end: [2, 11] },
  2047: { start: [1, 24], end: [1, 31] },
  2048: { start: [2, 12], end: [2, 19] },
  2049: { start: [1, 31], end: [2, 7] },
  2050: { start: [1, 21], end: [1, 28] },

  // --- 2051 to 2060 ---
  2051: { start: [2, 9], end: [2, 16] },
  2052: { start: [1, 30], end: [2, 6] },
  2053: { start: [2, 16], end: [2, 24] },  // Expanded for global coverage
  2054: { start: [2, 6], end: [2, 13] },
  2055: { start: [1, 26], end: [2, 2] },
  2056: { start: [2, 13], end: [2, 20] },
  2057: { start: [2, 2], end: [2, 9] },
  2058: { start: [1, 22], end: [1, 29] },
  2059: { start: [2, 10], end: [2, 17] },
  2060: { start: [1, 31], end: [2, 7] },

  // --- 2061 to 2070 ---
  2061: { start: [1, 19], end: [1, 26] },
  2062: { start: [2, 7], end: [2, 14] },
  2063: { start: [1, 27], end: [2, 3] },
  2064: { start: [2, 15], end: [2, 22] },
  2065: { start: [2, 3], end: [2, 10] },
  2066: { start: [1, 24], end: [1, 31] },
  2067: { start: [2, 12], end: [2, 19] },
  2068: { start: [2, 1], end: [2, 8] },
  2069: { start: [1, 21], end: [1, 28] },
  2070: { start: [2, 9], end: [2, 16] },

  // --- 2071 to 2080 ---
  2071: { start: [1, 29], end: [2, 5] },
  2072: { start: [2, 17], end: [2, 24] },
  2073: { start: [2, 5], end: [2, 12] },
  2074: { start: [1, 25], end: [2, 1] },
  2075: { start: [2, 13], end: [2, 20] },
  2076: { start: [2, 3], end: [2, 10] },
  2077: { start: [1, 22], end: [1, 29] },
  2078: { start: [2, 10], end: [2, 17] },
  2079: { start: [1, 31], end: [2, 7] },
  2080: { start: [1, 20], end: [1, 27] },

  // --- 2081 to 2090 ---
  2081: { start: [2, 7], end: [2, 14] },
  2082: { start: [1, 27], end: [2, 3] },
  2083: { start: [2, 15], end: [2, 22] },
  2084: { start: [2, 4], end: [2, 11] },
  2085: { start: [1, 19], end: [1, 27] },  // Expanded for global coverage
  2086: { start: [2, 6], end: [2, 13] },
  2087: { start: [1, 27], end: [2, 3] },
  2088: { start: [2, 14], end: [2, 21] },
  2089: { start: [2, 2], end: [2, 9] },
  2090: { start: [1, 21], end: [1, 28] },

  // --- 2091 to 2100 ---
  2091: { start: [2, 8], end: [2, 15] },
  2092: { start: [1, 30], end: [2, 6] },
  2093: { start: [1, 19], end: [1, 26] },
  2094: { start: [2, 8], end: [2, 15] },
  2095: { start: [1, 28], end: [2, 4] },
  2096: { start: [2, 15], end: [2, 22] },
  2097: { start: [2, 4], end: [2, 11] },
  2098: { start: [1, 24], end: [1, 31] },
  2099: { start: [2, 11], end: [2, 18] },
  2100: { start: [2, 12], end: [2, 19] }
};

/**
 * Get current seasonal event based on date and timezone
 * PRIORITY ORDER:
 * 1. Major Holidays (Solar + Lunar New Year)
 * 2. Easter Eggs (Friday 13th, April Fools)
 * 3. Weekend Mode
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
  const tetRange = tetRanges[year];
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
  // PRIORITY 2: Easter Eggs (The "Surprises")
  // ═══════════════════════════════════════════════════════════════════════════

  // Friday the 13th 👻
  if (day === 13 && dayOfWeek === 5) return 'FRIDAY_13';

  // April Fools' Day 🤡
  if (month === 4 && day === 1) return 'APRIL_FOOLS';

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORITY 3: Default (No accessory - let mood sprite handle weekend/etc)
  // ═══════════════════════════════════════════════════════════════════════════

  return null;
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
  APRIL_FOOLS: { x: -30, y: -45 }
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

  // Evolution stages based on level
  let evolutionStage, evolutionIcon;
  if (level <= 5) {
    evolutionStage = 'egg';
    evolutionIcon = '🥒';
  } else if (level <= 15) {
    evolutionStage = 'baby';
    evolutionIcon = '🐣';
  } else if (level <= 30) {
    evolutionStage = 'child';
    evolutionIcon = '🧒';
  } else if (level <= 50) {
    evolutionStage = 'teen';
    evolutionIcon = '🧑';
  } else if (level <= 75) {
    evolutionStage = 'adult';
    evolutionIcon = '👨';
  } else {
    evolutionStage = 'elder';
    evolutionIcon = '👴';
  }

  return {
    level,
    xp,
    currentLevelXp,
    nextLevelXp,
    xpProgress,
    maxLevel: 100,
    evolutionStage,
    evolutionIcon
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

  // Priority 3: Hyper/On Fire (> 10 commits in 24h)
  if (last24hEvents.length > 10) {
    return { mood: 'Hyper', icon: '🔥', moodKey: 'hyper' };
  }

  // Priority 4: Night Owl (commit between 00:00-04:00 local time)
  if (isNightOwl && todayEvents.length > 0) {
    return { mood: 'Night Owl', icon: '🦉', moodKey: 'nightowl' };
  }

  // Priority 5: Weekend Chill (Sat/Sun AND < 3 commits today)
  if (isWeekend && todayEvents.length < 3 && todayEvents.length > 0) {
    return { mood: 'Weekend Chill', icon: '🏖️', moodKey: 'weekend' };
  }

  // Priority 6: Happy (default active state)
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
 * Generate Theme Background SVG elements
 * @param {string} theme - 'minimal', 'cyberpunk', 'nature'
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

  // 2. Select the specific Mood Grid
  const moodKey = moodInfo?.moodKey || ((mood === 'happy') ? 'normal' : mood);
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

  // Text color based on theme
  const textColor = theme === 'cyberpunk' ? '#00ffff' : (theme === 'nature' ? '#388e3c' : '#666');

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
    
    // Evolution icon
    const evolutionDisplay = stats.evolutionIcon || '';
    
    statsDisplay = `
      <!-- Level & Mood Text -->
      <text x="20" y="${height + 43}" font-family="monospace" font-size="11" fill="${textColor}">
        ${evolutionDisplay} Lv.${stats.level}
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

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <style>
        .pet { transform-origin: center; }
      </style>
      <!-- Theme Background -->
      ${themeBackground}
      <g transform="translate(20, 20)" opacity="${groupOpacity}">
        <g class="pet">
            ${pixelArt}
            ${animation}
        </g>
        <!-- Seasonal Accessory (z-index: above pet) -->
        ${seasonalAccessory}
      </g>
      ${statsDisplay}
      ${moodDisplay}
    </svg>`;
}

run();
