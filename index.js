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

// Legendary Sprites (12x12 Pixel Art)
// Legend: X=Base, K=Black, W=White, R=Red, O=Orange, Y=Yellow, B=Blue, G=Green, P=Purple
const LEGENDARY_SPRITES = {
  // 🦖 MECHA-REX: Cybernetic T-Rex (Horizontal posture, distinct from Robot)
  mecha_rex: {
    normal: [
      "      KKKK  ",
      "     KXXXXK ",
      "    KXRXXKXK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      "K KXXXXXXXXK",
      "KKXXXXXXXXXK",
      " KXXX KXXXK ",
      "  KXK  KXK  ",
      "  KXK  KXK  ",
      "   K    K   ",
      "            "
    ],
    sleep: [
      "      KKKK  ",
      "     KXXXXK ",
      "    KXKKXKXK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      "K KXXXXXXXXK",
      "KKXXXXXXXXXK",
      " KXXX KXXXK ",
      "  KXK  KXK  ",
      "  KK   KK   ",
      "            ",
      "            "
    ],
    ghost: [
      "      KKKK  ",
      "     KXXXXK ",
      "    KXKKXKXK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      "K KXXXXXXXXK",
      "KKXXXXXXXXXK",
      " KXXX KXXXK ",
      "  K K  K K  ",
      "            ",
      "            ",
      "            "
    ],
    hyper: [
      "      KKKK  ",
      "     KXXXXK ",
      "    KXRXXKXK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      "K KXXXXXXXXK",
      "KKXXXXXXXXXK",
      " KXXX KXXXK ",
      "  KXK  KXK  ",
      "  KXK  KXK  ",
      "   K    K   ",
      "     RR     "
    ],
    nightowl: [
      "      KKKK  ",
      "     KXXXXK ",
      "    KXOXXKXK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      "K KXXXXXXXXK",
      "KKXXXXXXXXXK",
      " KXXX KXXXK ",
      "  KXK  KXK  ",
      "  KXK  KXK  ",
      "   K    K   ",
      "            "
    ],
    weekend: [
      "      KKKK  ",
      "     KXXXXK ",
      "    KXKKXKXK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      "K KXXXXXXXXK",
      "KKXXXXXXXXXK",
      " KXXX KXXXK ",
      "  KXK  KXK  ",
      "  KXK  KXK  ",
      "   K    K   ",
      "            "
    ]
  },

  // 🐉 HYDRA: 3-Headed Serpent (Distinct from single-headed Snake)
  hydra: {
    normal: [
      " K   K   K  ",
      "KXK KXK KXK ",
      "KWK KWK KWK ",
      " KXK K KXK  ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "   KXXXK    ",
      "  KXXXXXK   ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "    KXK     ",
      "     K      "
    ],
    sleep: [
      "            ",
      " KK  KK  KK ",
      "KXXKKXXKKXXK",
      " KKKKKKKKK  ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "   KXXXK    ",
      "  KXXXXXK   ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "    KXK     ",
      "     K      "
    ],
    ghost: [
      " K   K   K  ",
      "KXK KXK KXK ",
      "KKK KKK KKK ",
      " KXK K KXK  ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "   KXXXK    ",
      "  KXXXXXK   ",
      "   K K K    ",
      "    K K     ",
      "            ",
      "            "
    ],
    hyper: [
      " K   K   K  ",
      "KXK KXK KXK ",
      "KRK KRK KRK ",
      " KXK K KXK  ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "   KXXXK    ",
      "  KXXXXXK   ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "    KXK     ",
      "     K      "
    ],
    nightowl: [
      " K   K   K  ",
      "KXK KXK KXK ",
      "KOK KOK KOK ",
      " KXK K KXK  ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "   KXXXK    ",
      "  KXXXXXK   ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "    KXK     ",
      "     K      "
    ],
    weekend: [
      " K   K   K  ",
      "KXK KXK KXK ",
      "KKK KKK KKK ",
      " KXK K KXK  ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "   KXXXK    ",
      "  KXXXXXK   ",
      "  KXXXXXK   ",
      "   KXXXK    ",
      "    KXK     ",
      "     K      "
    ]
  },

  // 👻 VOID SPIRIT: Floating Spectre (Hooded, no legs - supernatural, not bird-like)
  void_spirit: {
    normal: [
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXXYYYYXXK ",
      " KXXXXXXXXK ",
      " KXXXXXXXXK ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KXXXXK   ",
      "  K K  K K  ",
      " K K    K K ",
      "            "
    ],
    sleep: [
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXXKKKKXXK ",
      " KXXXXXXXXK ",
      " KXXXXXXXXK ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KXXXXK   ",
      "  K K  K K  ",
      " K K    K K ",
      "            "
    ],
    ghost: [
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXXYYYYXXK ",
      " KXXXXXXXXK ",
      " KXXXXXXXXK ",
      "  KXXXXXXK  ",
      "   K K K    ",
      "    K K     ",
      "            ",
      "            ",
      "            "
    ],
    hyper: [
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXXRRRRXXK ",
      " KXXXXXXXXK ",
      " KXXXXXXXXK ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KXXXXK   ",
      "  K K  K K  ",
      " K K    K K ",
      "            "
    ],
    nightowl: [
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXXOOOOXXK ",
      " KXXXXXXXXK ",
      " KXXXXXXXXK ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KXXXXK   ",
      "  K K  K K  ",
      " K K    K K ",
      "            "
    ],
    weekend: [
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXXKKKKXXK ",
      " KXXXXXXXXK ",
      " KXXXXXXXXK ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KXXXXK   ",
      "  K K  K K  ",
      " K K    K K ",
      "            "
    ]
  },

  // 🗿 CYBER GOLEM: Stone Construct with Circuit Lines (Blocky, distinct from Robot)
  cyber_golem: {
    normal: [
      "  KKKKKKKK  ",
      " KXXBXXXXBK ",
      " KXWKXXKWXK ",
      " KXBKXXKBXK ",
      " KXXBXXBXXK ",
      "  KXXXXXXK  ",
      " KXBXXXXBXK ",
      " KXXXXXXXXK ",
      " KXX    XXK ",
      " KXK    KXK ",
      " KXK    KXK ",
      "  K      K  "
    ],
    sleep: [
      "  KKKKKKKK  ",
      " KXXBXXXXBK ",
      " KXKKXXKKXK ",
      " KXBKXXKBXK ",
      " KXXBXXBXXK ",
      "  KXXXXXXK  ",
      " KXBXXXXBXK ",
      " KXXXXXXXXK ",
      " KXX    XXK ",
      " KXK    KXK ",
      " KK      KK ",
      "            "
    ],
    ghost: [
      "  KKKKKKKK  ",
      " KXXBXXXXBK ",
      " KXKKXXKKXK ",
      " KXBKXXKBXK ",
      " KXXBXXBXXK ",
      "  KXXXXXXK  ",
      " KXBXXXXBXK ",
      " KXXXXXXXXK ",
      "  K K  K K  ",
      "            ",
      "            ",
      "            "
    ],
    hyper: [
      "  KKKKKKKK  ",
      " KXXBXXXXBK ",
      " KXRKXXKRXK ",
      " KXBKXXKBXK ",
      " KXXBXXBXXK ",
      "  KXXXXXXK  ",
      " KXBXXXXBXK ",
      " KXXXXXXXXK ",
      " KXX    XXK ",
      " KXK    KXK ",
      " KXK    KXK ",
      "  K      K  "
    ],
    nightowl: [
      "  KKKKKKKK  ",
      " KXXBXXXXBK ",
      " KXOKXXKOXK ",
      " KXBKXXKBXK ",
      " KXXBXXBXXK ",
      "  KXXXXXXK  ",
      " KXBXXXXBXK ",
      " KXXXXXXXXK ",
      " KXX    XXK ",
      " KXK    KXK ",
      " KXK    KXK ",
      "  K      K  "
    ],
    weekend: [
      "  KKKKKKKK  ",
      " KXXBXXXXBK ",
      " KXKKXXKKXK ",
      " KXBKXXKBXK ",
      " KXXBXXBXXK ",
      "  KXXXXXXK  ",
      " KXBXXXXBXK ",
      " KXXXXXXXXK ",
      " KXX    XXK ",
      " KXK    KXK ",
      " KXK    KXK ",
      "  K      K  "
    ]
  }
};

const SPRITES = {
  crab: {
    normal: [
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
    sleep: [
      "            ",
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXKKKKXXK ",
      " KXXXXXXXXK ",
      "KXXK KXXK K ",
      "KXXXXXXXXXK ",
      "KXXXXXXXXXK ",
      " KX KXXX K  ",
      "  K KKKK K  ",
      "            "
    ],
    ghost: [
      "            ",
      "   K    K   ",
      "  K K  K K  ",
      "  K K  K K  ",
      "  K      K  ",
      " KXXXXXXXXK ",
      "KXXK KXXK K ",
      "KXXK KXXK K ",
      "KXXXXXXXXXK ",
      " KX KXXX K  ",
      "  K K  K K  ",
      "            "
    ],
    hyper: [
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXK  KXXK ",
      "  KXXKKXXK  ",
      " KXXXXXXXXK ",
      "KXXR KXXR K ",
      "KXXK KXXK K ",
      "KXXXXXXXXXK ",
      " KX KXXX K  ",
      "  K KKKK K  ",
      "            "
    ],
    nightowl: [
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXK  KXXK ",
      "  KXXKKXXK  ",
      " KXXXXXXXXK ",
      "KXXO KXXO K ",
      "KXXO KXXO K ",
      "KXXXXXXXXXK ",
      " KX KXXX K  ",
      "  K KKKK K  ",
      "            "
    ],
    weekend: [
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXK  KXXK ",
      "  KXXKKXXK  ",
      " KXXXXXXXXK ",
      "KXKK KXKK K ",
      "KXXK KXXK K ",
      "KXXXXXXXXXK ",
      " KX KXXX K  ",
      "  K KKKK K  ",
      "            "
    ]
  },
  elephant: {
    normal: [
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
    sleep: [
      "            ",
      "    KKKKK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      " KXXXKKXKKXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KXXKXXKXXK ",
      " KXXK  KXXK ",
      "  KK    KK  ",
      "            "
    ],
    ghost: [
      "            ",
      "    KKKKK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      " KXXXKKXKKXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KXXKXXKXXK ",
      " K  K  K  K ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "    KKKKK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      " KXXXRKXRKXK",
      "KXXXXKKXKKXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KXXKXXKXXK ",
      " KXXK  KXXK ",
      "  KK    KK  ",
      "            "
    ],
    nightowl: [
      "            ",
      "    KKKKK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      " KXXXOKXOKXK",
      "KXXXXOKXOKXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KXXKXXKXXK ",
      " KXXK  KXXK ",
      "  KK    KK  ",
      "            "
    ],
    weekend: [
      "            ",
      "    KKKKK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      " KXXXKKXKKXK",
      "KXXXXKKXKKXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KXXKXXKXXK ",
      " KXXK  KXXK ",
      "  KK    KK  ",
      "            "
    ]
  },
  coffee: {
    normal: [
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
    sleep: [
      "            ",
      "            ",
      "            ",
      "  KKKKKKK   ",
      " KXXXXXXXK  ",
      " KXXXXXXXKK ",
      " KXXKKXXXK K",
      " KXXXXXXXKK ",
      "  KXXXXXXXK ",
      "   KKKKKKK  ",
      "  KKKKKKKKK ",
      "            "
    ],
    ghost: [
      "    K  K    ",
      "    K  K    ",
      "            ",
      "  KKKKKKK   ",
      " KXXXXXXXK  ",
      " KXXK KXXKK ",
      " KXXK KXXK K",
      " KXXXXXXXKK ",
      "  KXXXXXXXK ",
      "   KKKKKKK  ",
      "   K K K K  ",
      "            "
    ],
    hyper: [
      "    K  K    ",
      "    W  W    ",
      "            ",
      "  KKKKKKK   ",
      " KXXXXXXXK  ",
      " KXXXXXXXKK ",
      " KXXRRXXXK K",
      " KXXXXXXXKK ",
      "  KXXXXXXXK ",
      "   KKKKKKK  ",
      "  KKKKKKKKK ",
      "            "
    ],
    nightowl: [
      "    K  K    ",
      "    W  W    ",
      "            ",
      "  KKKKKKK   ",
      " KXXXXXXXK  ",
      " KXXXXXXXKK ",
      " KXXOOXXXK K",
      " KXXOOXXXKK ",
      "  KXXXXXXXK ",
      "   KKKKKKK  ",
      "  KKKKKKKKK ",
      "            "
    ],
    weekend: [
      "    K  K    ",
      "    W  W    ",
      "            ",
      "  KKKKKKK   ",
      " KXXXXXXXK  ",
      " KXXXXXXXKK ",
      " KXKKKKKXK K",
      " KXXXXXXXKK ",
      "  KXXXXXXXK ",
      "   KKKKKKK  ",
      "  KKKKKKKKK ",
      "            "
    ]
  },
  bird: {
    normal: [
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
    sleep: [
      "            ",
      "      KKKK  ",
      "     KXXXXK ",
      "  K KXXXXXK ",
      " KXKXKXXKXK ",
      "KXXXXXXXXXK ",
      "KXXXXXXXXK  ",
      " KXXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXK     ",
      "    KK      ",
      "            "
    ],
    ghost: [
      "            ",
      "      KKKK  ",
      "     KXXXXK ",
      "  K KXXXXXK ",
      " KXKXKXXKXK ",
      "KXXXXXXXXXK ",
      "KXXXXXXXXK  ",
      " KXXXXXXXK  ",
      "  KXXXXXK   ",
      "   K  K     ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "      KKKK  ",
      "     KXXXXK ",
      "  K KXXXXXK ",
      " KXKXRXXKXK ",
      "KXXXXXXXXXK ",
      "KXXXXXXXXK  ",
      " KXXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXK     ",
      "    KK      ",
      "            "
    ],
    nightowl: [
      "            ",
      "      KKKK  ",
      "     KXXXXK ",
      "  K KXXXXXK ",
      " KXKXOXXKXK ",
      "KXXXOXXXXK  ",
      "KXXXXXXXXK  ",
      " KXXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXK     ",
      "    KK      ",
      "            "
    ],
    weekend: [
      "            ",
      "      KKKK  ",
      "     KXXXXK ",
      "  K KXXXXXK ",
      " KXKXKKKXKK ",
      "KXXXXXXXXXK ",
      "KXXXXXXXXK  ",
      " KXXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXK     ",
      "    KK      ",
      "            "
    ]
  },
  robot: {
    normal: [
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
    sleep: [
      "     KK     ",
      "     KK     ",
      "  KKKKKKKK  ",
      " KXXXXXXXXK ",
      "KXKKXXXXKKXK",
      "KXKKXXXXKKXK",
      "KXXXXXXXXXXK",
      "KXKKKKKKKKXK",
      "KXK      KXK",
      " KXXXXXXXXK ",
      "  KKKKKKKK  ",
      "            "
    ],
    ghost: [
      "     KK     ",
      "     KK     ",
      "  KKKKKKKK  ",
      " KXXXXXXXXK ",
      "KXKXXXXXXKXK",
      "KXKXXXXXXKXK",
      "KXXXXXXXXXXK",
      "KXKKKKKKKKXK",
      "KXKRRRRRRKXK",
      " KXXXXXXXXK ",
      "  K K  K K  ",
      "            "
    ],
    hyper: [
      "     KK     ",
      "     KK     ",
      "  KKKKKKKK  ",
      " KXXXXXXXXK ",
      "KXRRXXXXRRXK",
      "KXRRXXXXRRXK",
      "KXXXXXXXXXXK",
      "KXKKKKKKKKXK",
      "KXKRRRRRRKXK",
      " KXXXXXXXXK ",
      "  KKKKKKKK  ",
      "            "
    ],
    nightowl: [
      "     KK     ",
      "     KK     ",
      "  KKKKKKKK  ",
      " KXXXXXXXXK ",
      "KXOOXXXXOOXK",
      "KXOOXXXXOOXK",
      "KXXXXXXXXXXK",
      "KXKKKKKKKKXK",
      "KXKRRRRRRKXK",
      " KXXXXXXXXK ",
      "  KKKKKKKK  ",
      "            "
    ],
    weekend: [
      "     KK     ",
      "     KK     ",
      "  KKKKKKKK  ",
      " KXXXXXXXXK ",
      "KXKKXXXXKKXK",
      "KXKKXXXXKKXK",
      "KXXXXXXXXXXK",
      "KXKKKKKKKKXK",
      "KXKRRRRRRKXK",
      " KXXXXXXXXK ",
      "  KKKKKKKK  ",
      "            "
    ]
  },
  whale: {
    normal: [
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
    sleep: [
      "            ",
      "            ",
      "            ",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      " KKXXKKXXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KKXXXXXKK  ",
      "   KKKKK    ",
      "            "
    ],
    ghost: [
      "       K K  ",
      "      K K K ",
      "     K     K",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      " KKXXK KXXXK",
      "KXXXXK KXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KKXXXXXKK  ",
      "   K K K    ",
      "            "
    ],
    hyper: [
      "       B B  ",
      "      KBKBK ",
      "     KBBBBBK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      " KKXXRKXXXXK",
      "KXXXXKKXXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KKXXXXXKK  ",
      "   KKKKK    ",
      "            "
    ],
    nightowl: [
      "       B B  ",
      "      KBKBK ",
      "     KBBBBBK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      " KKXXOKXXXXK",
      "KXXXXOKXXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KKXXXXXKK  ",
      "   KKKKK    ",
      "            "
    ],
    weekend: [
      "       B B  ",
      "      KBKBK ",
      "     KBBBBBK",
      "    KXXXXXXK",
      "   KXXXXXXXK",
      " KKXXKKXXXXK",
      "KXXXXKKXXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXK ",
      " KKXXXXXKK  ",
      "   KKKKK    ",
      "            "
    ]
  },
  gem: {
    normal: [
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
    sleep: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXXXXXXXXK ",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  KXXXXXK   ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ],
    ghost: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXXXXXXXXK ",
      "KXXKXXXXKXXK",
      "KXXKXXXXKXXK",
      " KXXXXXXXXK ",
      "  KXXXXXK   ",
      "   KXXXXK   ",
      "    K  K    ",
      "            "
    ],
    hyper: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXRXXXXK  ",
      " KXXXXXXXXK ",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  KXXXXXK   ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ],
    nightowl: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXOXXXXK  ",
      " KXXOXXXXXXK",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  KXXXXXK   ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ],
    weekend: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXKXXXXK  ",
      " KXXXXXXXXK ",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  KXXXXXK   ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ]
  },
  chameleon: {
    normal: [
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
    sleep: [
      "            ",
      "     KKKK   ",
      "    KXXXXK  ",
      "   KXXXXXK  ",
      "  KXXXXKXXK ",
      " KXXXXXXXXK ",
      "KXXXRRXXXXK ",
      "KXXXRRXXXK  ",
      " KXXXXXXXK  ",
      "  KKKKKKK   ",
      "            ",
      "            "
    ],
    ghost: [
      "            ",
      "     KKKK   ",
      "    KXXXXK  ",
      "   KXXXXXK  ",
      "  KXXXXKXXK ",
      " KXXXXXXXXK ",
      "KXXXRRXXXXK ",
      "KXXXRRXXXK  ",
      " KXXXXXXXK  ",
      "  K K K K   ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "     KKKK   ",
      "    KXXXXK  ",
      "   KXXXXXK  ",
      "  KXXXXRXXK ",
      " KXXXXXXXXK ",
      "KXXXRRXXXXK ",
      "KXXXRRXXXK  ",
      " KXXXXXXXK  ",
      "  KKKKKKK   ",
      "            ",
      "            "
    ],
    nightowl: [
      "            ",
      "     KKKK   ",
      "    KXXXXK  ",
      "   KXXXXXK  ",
      "  KXXXXOXXK ",
      " KXXXXOXXXK ",
      "KXXXRRXXXXK ",
      "KXXXRRXXXK  ",
      " KXXXXXXXK  ",
      "  KKKKKKK   ",
      "            ",
      "            "
    ],
    weekend: [
      "            ",
      "     KKKK   ",
      "    KXXXXK  ",
      "   KXXXXXK  ",
      "  KXXXXKXXK ",
      " KXXXXKXXXK ",
      "KXXXRRXXXXK ",
      "KXXXRRXXXK  ",
      " KXXXXXXXK  ",
      "  KKKKKKK   ",
      "            ",
      "            "
    ]
  },
  spider: {
    normal: [
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
    sleep: [
      "            ",
      "            ",
      "K   KKK   K ",
      " K KKKKK K  ",
      "  KKXXXKK   ",
      " KXXKKKXXK  ",
      "KXXXXXXXXXK ",
      "  KKXXXKK   ",
      " K  KKK  K  ",
      "K  K   K  K ",
      "  K     K   ",
      "            "
    ],
    ghost: [
      "     K      ",
      "     K      ",
      "K   KKK   K ",
      " K KKKKK K  ",
      "  KKXXXKK   ",
      " KXXK KXXK  ",
      "KXXXXXXXXXK ",
      "  KKXXXKK   ",
      " K  KKK  K  ",
      "K  K   K  K ",
      "  K     K   ",
      "            "
    ],
    hyper: [
      "     K      ",
      "     K      ",
      "K   KKK   K ",
      " K KKKKK K  ",
      "  KKXXXKK   ",
      " KXXRKRXXK  ",
      "KXXXXXXXXXK ",
      "  KKXXXKK   ",
      " K  KKK  K  ",
      "K  K   K  K ",
      "  K     K   ",
      "            "
    ],
    nightowl: [
      "     K      ",
      "     K      ",
      "K   KKK   K ",
      " K KKKKK K  ",
      "  KKXXXKK   ",
      " KXXOKOXXK  ",
      "KXXXOKOXXK  ",
      "  KKXXXKK   ",
      " K  KKK  K  ",
      "K  K   K  K ",
      "  K     K   ",
      "            "
    ],
    weekend: [
      "     K      ",
      "     K      ",
      "K   KKK   K ",
      " K KKKKK K  ",
      "  KKXXXKK   ",
      " KXKKKKXXK  ",
      "KXXXXXXXXXK ",
      "  KKXXXKK   ",
      " K  KKK  K  ",
      "K  K   K  K ",
      "  K     K   ",
      "            "
    ]
  },
  snake: {
    normal: [
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
    sleep: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXKKXXK  ",
      "   KXXXXXK  ",
      "    KKKXXK  ",
      "   KXXKXXK  ",
      "  KXXXXXK   ",
      " KXXXXXK    ",
      " KXXKKXK    ",
      "  KK  KK    ",
      "            "
    ],
    ghost: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXK KXXK ",
      "   KXXXXXK  ",
      "    KKKXXK  ",
      "   KXXKXXK  ",
      "  KXXXXXK   ",
      " KXXXXXK    ",
      " KXXKKXK    ",
      "  K    K    ",
      "            "
    ],
    hyper: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXRKXXK  ",
      "   KXXXXXK  ",
      "    KKKXXK  ",
      "   KXXKXXK  ",
      "  KXXXXXK   ",
      " KXXXXXK    ",
      " KXXKKXK    ",
      "  KK  KK    ",
      "            "
    ],
    nightowl: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXOKXXK  ",
      "   KXOXXXK  ",
      "    KKKXXK  ",
      "   KXXKXXK  ",
      "  KXXXXXK   ",
      " KXXXXXK    ",
      " KXXKKXK    ",
      "  KK  KK    ",
      "            "
    ],
    weekend: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXKKXXK  ",
      "   KXXXXXK  ",
      "    KKKXXK  ",
      "   KXXKXXK  ",
      "  KXXXXXK   ",
      " KXXXXXK    ",
      " KXXKKXK    ",
      "  KK  KK    ",
      "            "
    ]
  },
  gopher: {
    normal: [
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
    sleep: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXKKXKXXK ",
      "  KXXXXXXK  ",
      "  KXXWWXXK  ",
      " KXXXWWXXXK ",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  KKKKKKKK  ",
      "            "
    ],
    ghost: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXK K X K ",
      "  KXXXXXXK  ",
      "  KXXWWXXK  ",
      " KXXXWWXXXK ",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  K K K K   ",
      "            "
    ],
    hyper: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXRKXRXXK ",
      "  KXXXXXXK  ",
      "  KXXWWXXK  ",
      " KXXXWWXXXK ",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  KKKKKKKK  ",
      "            "
    ],
    nightowl: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXOKXOXXK ",
      "  KXOKXOXXK ",
      "  KXXWWXXK  ",
      " KXXXWWXXXK ",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  KKKKKKKK  ",
      "            "
    ],
    weekend: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXKKXKXXK ",
      "  KXXXXXXK  ",
      "  KXXWWXXK  ",
      " KXXXWWXXXK ",
      "KXXXXXXXXXXK",
      "KXXXXXXXXXXK",
      " KXXXXXXXXK ",
      "  KKKKKKKK  ",
      "            "
    ]
  },
  cat: {
    normal: [
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
    sleep: [
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXKKKKXXK ",
      " KXXXXXXXXK ",
      " KXKKXXKKXK ",
      " KXXXXXXXXK ",
      " KXXXOOXXXK ",
      "  KXXXXXXK  ",
      "  KXXXXXXK  ",
      "   KK  KK   ",
      "            "
    ],
    ghost: [
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXKKKKXXK ",
      " KXXXXXXXXK ",
      " KXK K  K K ",
      " KXXXXXXXXK ",
      " KXXXOOXXXK ",
      "  KXXXXXXK  ",
      "  KXXXXXXK  ",
      "   K    K   ",
      "            "
    ],
    hyper: [
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXKKKKXXK ",
      " KXXXXXXXXK ",
      " KXRKXXRKXK ",
      " KXXXXXXXXK ",
      " KXXXOOXXXK ",
      "  KXXXXXXK  ",
      "  KXXXXXXK  ",
      "   KK  KK   ",
      "            "
    ],
    nightowl: [
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXKKKKXXK ",
      " KXXXXXXXXK ",
      " KXOKXXOKXK ",
      " KXOKXXOKXK ",
      " KXXXOOXXXK ",
      "  KXXXXXXK  ",
      "  KXXXXXXK  ",
      "   KK  KK   ",
      "            "
    ],
    weekend: [
      "            ",
      "  K      K  ",
      " KXK    KXK ",
      " KXXKKKKXXK ",
      " KXXXXXXXXK ",
      " KXKKXXKKXK ",
      " KXXXXXXXXK ",
      " KXXXOOXXXK ",
      "  KXXXXXXK  ",
      "  KXXXXXXK  ",
      "   KK  KK   ",
      "            "
    ]
  },
  tux: {
    normal: [
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
    sleep: [
      "            ",
      "    KKKKK   ",
      "   KKKKKKK  ",
      "  KKKKKKKKK ",
      "  KKKKKKKKK ",
      " KKKKKKKKKK ",
      " KWWWWWWWWK ",
      "KWWWWWWWWWWK",
      "KWWWWWWWWWWK",
      " KWWWWWWWWK ",
      " KK OOO KK  ",
      "    O O     "
    ],
    ghost: [
      "            ",
      "    KKKKK   ",
      "   KKKKKKK  ",
      "  KKK K K K ",
      "  KKKKKKKKK ",
      " KKKKKKKKKK ",
      " KWWWWWWWWK ",
      "KWWWWWWWWWWK",
      "KWWWWWWWWWWK",
      " KWWWWWWWWK ",
      " K  OOO  K  ",
      "            "
    ],
    hyper: [
      "            ",
      "    KKKKK   ",
      "   KKKKKKK  ",
      "  KKRKKKRKK ",
      "  KKKKKKKKK ",
      " KKKKKKKKKK ",
      " KWWWWWWWWK ",
      "KWWWWWWWWWWK",
      "KWWWWWWWWWWK",
      " KWWWWWWWWK ",
      " KK OOO KK  ",
      "    O O     "
    ],
    nightowl: [
      "            ",
      "    KKKKK   ",
      "   KKKKKKK  ",
      "  KKOKKKOKK ",
      "  KKOKKKOKK ",
      " KKKKKKKKKK ",
      " KWWWWWWWWK ",
      "KWWWWWWWWWWK",
      "KWWWWWWWWWWK",
      " KWWWWWWWWK ",
      " KK OOO KK  ",
      "    O O     "
    ],
    weekend: [
      "            ",
      "    KKKKK   ",
      "   KKKKKKK  ",
      "  KKKKKKKKK ",
      "  KKKKKKKKK ",
      " KKKKKKKKKK ",
      " KWWWWWWWWK ",
      "KWWWWWWWWWWK",
      "KWWWWWWWWWWK",
      " KWWWWWWWWK ",
      " KK OOO KK  ",
      "    O O     "
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
  fox: {
    normal: [
      "            ",
      "   K    K   ",
      "  KXK  KXK  ",
      " KXXXKKXXXK ",
      " KXXXXXXXXK ",
      "KXXW KXXW KK",
      "KXXK KXXK KK",
      " KXWWWWWWK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ],
    sleep: [
      "            ",
      "   K    K   ",
      "  KXK  KXK  ",
      " KXXXKKXXXK ",
      " KXXXXXXXXK ",
      "KXXK KXXK KK",
      "KXXK KXXK KK",
      " KXWWWWWWK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ],
    ghost: [
      "            ",
      "   K    K   ",
      "  K K  K K  ",
      " KXXXKKXXXK ",
      " KXXXXXXXXK ",
      "KXXK KXXK KK",
      "KXXK KXXK KK",
      " KXXXXXXK   ",
      "  KXXXXXXK  ",
      "   K K K K  ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "   K    K   ",
      "  KXK  KXK  ",
      " KXXXKKXXXK ",
      " KXXXXXXXXK ",
      "KXXR KXXR KK",
      "KXXK KXXK KK",
      " KXWWWWWWK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ],
    nightowl: [
      "            ",
      "   K    K   ",
      "  KXK  KXK  ",
      " KXXXKKXXXK ",
      " KXXXXXXXXK ",
      "KXXO KXXO KK",
      "KXXO KXXO KK",
      " KXWWWWWWK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ],
    weekend: [
      "            ",
      "   K    K   ",
      "  KXK  KXK  ",
      " KXXXKKXXXK ",
      " KXXXXXXXXK ",
      "KXKK KXKK KK",
      "KXXK KXXK KK",
      " KXWWWWWWK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "    KKKK    ",
      "            "
    ]
  },
  hummingbird: {
    normal: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXW KXWK  ",
      "  KXK KXKK  ",
      "KKKXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXXK K  ",
      "    KXK KK  ",
      "     K      ",
      "            "
    ],
    sleep: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXK KXKK  ",
      "  KXK KXKK  ",
      "KKKXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXXK K  ",
      "    KXK KK  ",
      "     K      ",
      "            "
    ],
    ghost: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXK KXKK  ",
      "  KXK KXKK  ",
      "KKKXXXXXXK  ",
      "  KXXXXXK   ",
      "   K K K K  ",
      "    K K K   ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXR KXRK  ",
      "  KXK KXKK  ",
      "KKKXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXXK K  ",
      "    KXK KK  ",
      "     K      ",
      "            "
    ],
    nightowl: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXO KXOK  ",
      "  KXO KXOK  ",
      "KKKXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXXK K  ",
      "    KXK KK  ",
      "     K      ",
      "            "
    ],
    weekend: [
      "            ",
      "     KKK    ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXK KXKK  ",
      "  KXK KXKK  ",
      "KKKXXXXXXK  ",
      "  KXXXXXK   ",
      "   KXXXK K  ",
      "    KXK KK  ",
      "     K      ",
      "            "
    ]
  },
  gear: {
    normal: [
      "            ",
      "    K  K    ",
      "   KKKKKK   ",
      "  KXXXXXXK  ",
      " KXKXXXXKXK ",
      "KKXXW KW XXK",
      "KKXXK KK XXK",
      " KXKXXXXKXK ",
      "  KXXXXXXK  ",
      "   KKKKKK   ",
      "    K  K    ",
      "            "
    ],
    sleep: [
      "            ",
      "    K  K    ",
      "   KKKKKK   ",
      "  KXXXXXXK  ",
      " KXKXXXXKXK ",
      "KKXXK KK XXK",
      "KKXXK KK XXK",
      " KXKXXXXKXK ",
      "  KXXXXXXK  ",
      "   KKKKKK   ",
      "    K  K    ",
      "            "
    ],
    ghost: [
      "            ",
      "    K  K    ",
      "   KKKKKK   ",
      "  KXXXXXXK  ",
      " K KXXXXK K ",
      "KKXXK KK XXK",
      "KKXXK KK XXK",
      " K KXXXXK K ",
      "  KXXXXXXK  ",
      "   K K K K  ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "    K  K    ",
      "   KKKKKK   ",
      "  KXXXXXXK  ",
      " KXKXXXXKXK ",
      "KKXXR KR XXK",
      "KKXXK KK XXK",
      " KXKXXXXKXK ",
      "  KXXXXXXK  ",
      "   KKKKKK   ",
      "    K  K    ",
      "            "
    ],
    nightowl: [
      "            ",
      "    K  K    ",
      "   KKKKKK   ",
      "  KXXXXXXK  ",
      " KXKXXXXKXK ",
      "KKXXO KO XXK",
      "KKXXO KO XXK",
      " KXKXXXXKXK ",
      "  KXXXXXXK  ",
      "   KKKKKK   ",
      "    K  K    ",
      "            "
    ],
    weekend: [
      "            ",
      "    K  K    ",
      "   KKKKKK   ",
      "  KXXXXXXK  ",
      " KXKXXXXKXK ",
      "KKXXK KK XXK",
      "KKXXK KK XXK",
      " KXKXXXXKXK ",
      "  KXXXXXXK  ",
      "   KKKKKK   ",
      "    K  K    ",
      "            "
    ]
  },
  ladder: {
    normal: [
      "            ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K  WW  K  ",
      "  KXXKKXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  K      K  ",
      "            "
    ],
    sleep: [
      "            ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K  KK  K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  K      K  ",
      "            "
    ],
    ghost: [
      "            ",
      "  K      K  ",
      "  K X  X K  ",
      "  K      K  ",
      "  K XXXX K  ",
      "  K  KK  K  ",
      "  K XXXX K  ",
      "  K      K  ",
      "  K X  X K  ",
      "  K      K  ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K  RR  K  ",
      "  KXXKKXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  K      K  ",
      "            "
    ],
    nightowl: [
      "            ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K  OO  K  ",
      "  K  OO  K  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  K      K  ",
      "            "
    ],
    weekend: [
      "            ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K  KK  K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  KXXXXXXK  ",
      "  K      K  ",
      "  K      K  ",
      "            "
    ]
  },
  owl: {
    normal: [
      "            ",
      "   K    K   ",
      "  KKK  KKK  ",
      " KXXXXXXXXXK",
      " KXWK  KWXK ",
      " KXKK  KKXK ",
      "  KXXXXXXK  ",
      "  KX KK XK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KK  KK   ",
      "            "
    ],
    sleep: [
      "            ",
      "   K    K   ",
      "  KKK  KKK  ",
      " KXXXXXXXXXK",
      " KXKK  KKXK ",
      " KXKK  KKXK ",
      "  KXXXXXXK  ",
      "  KX KK XK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KK  KK   ",
      "            "
    ],
    ghost: [
      "            ",
      "   K    K   ",
      "  K K  K K  ",
      " KXXXXXXXXXK",
      " KXK    KXK ",
      " KXK    KXK ",
      "  KXXXXXXK  ",
      "  K  KK  K  ",
      "  KXXXXXXK  ",
      "   K K K K  ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "   K    K   ",
      "  KKK  KKK  ",
      " KXXXXXXXXXK",
      " KXRK  KRXK ",
      " KXKK  KKXK ",
      "  KXXXXXXK  ",
      "  KX KK XK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KK  KK   ",
      "            "
    ],
    nightowl: [
      "            ",
      "   K    K   ",
      "  KKK  KKK  ",
      " KXXXXXXXXXK",
      " KXOK  KOXK ",
      " KXOK  KOXK ",
      "  KXXXXXXK  ",
      "  KX KK XK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KK  KK   ",
      "            "
    ],
    weekend: [
      "            ",
      "   K    K   ",
      "  KKK  KKK  ",
      " KXXXXXXXXXK",
      " KXKK  KKXK ",
      " KXKK  KKXK ",
      "  KXXXXXXK  ",
      "  KX KK XK  ",
      "  KXXXXXXK  ",
      "   KXXXXK   ",
      "   KK  KK   ",
      "            "
    ]
  },
  camel: {
    normal: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXW KXXXXXK",
      " KXK KXXXXXK",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ],
    sleep: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXK KXXXXXK",
      " KXK KXXXXXK",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ],
    ghost: [
      "            ",
      "     KK     ",
      "    K  K    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXK KXXXXXK",
      " KXK KXXXXXK",
      "  KXXXXXXXK ",
      "  K  X X  K ",
      "  K K  K K  ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXR KXXXXXK",
      " KXK KXXXXXK",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ],
    nightowl: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXO KXXXXXK",
      " KXO KXXXXXK",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ],
    weekend: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXK KXXXXXK",
      " KXK KXXXXXK",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ]
  },
  // --- WAVE 2 ---
  capybara: {
    normal: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXW KXWXXK ",
      " KXK KXKXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ],
    sleep: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXK KXKXXK ",
      " KXK KXKXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ],
    ghost: [
      "            ",
      "    KKKK    ",
      "   K    K   ",
      "  KXXXXXXK  ",
      " KXK KXKXXK ",
      " KXK KXKXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  K  X X  K ",
      "  K K  K K  ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXR KXRXXK ",
      " KXK KXKXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ],
    nightowl: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXO KXOXXK ",
      " KXO KXOXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ],
    weekend: [
      "            ",
      "    KKKK    ",
      "   KXXXXK   ",
      "  KXXXXXXK  ",
      " KXK KXKXXK ",
      " KXK KXKXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXXXXXXXK ",
      "  KXK  KXKK ",
      "  KK    KK  ",
      "            "
    ]
  },
  alpaca: {
    normal: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "   KXW KWK  ",
      "   KXK KKK  ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      "  KXKKKKXK  ",
      "  KK    KK  ",
      "            "
    ],
    sleep: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "   KXK KKK  ",
      "   KXK KKK  ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      "  KXKKKKXK  ",
      "  KK    KK  ",
      "            "
    ],
    ghost: [
      "            ",
      "     KK     ",
      "    K  K    ",
      "   KXXXXK   ",
      "   KXK KKK  ",
      "   KXK KKK  ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  K  X X  K ",
      "  K K  K K  ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "   KXR KRK  ",
      "   KXK KKK  ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      "  KXKKKKXK  ",
      "  KK    KK  ",
      "            "
    ],
    nightowl: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "   KXO KOK  ",
      "   KXO KOK  ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      "  KXKKKKXK  ",
      "  KK    KK  ",
      "            "
    ],
    weekend: [
      "            ",
      "     KK     ",
      "    KXXK    ",
      "   KXXXXK   ",
      "   KXK KKK  ",
      "   KXK KKK  ",
      "    KXXXK   ",
      "   KXXXXXK  ",
      "  KXXXXXXXK ",
      "  KXKKKKXK  ",
      "  KK    KK  ",
      "            "
    ]
  },
  phoenix: {
    normal: [
      "            ",
      "   RR  YY   ",
      "  RXXR YXY  ",
      "   KXXXXK   ",
      "  KXXXXXXXK ",
      " KXXW KXWXXK",
      " KXXK KXKXXK",
      "  KXXXXXXXK ",
      "   KXXXXXK  ",
      "  RR KXK YY ",
      "  R   K   Y ",
      "            "
    ],
    sleep: [
      "            ",
      "   RR  YY   ",
      "  RXXR YXY  ",
      "   KXXXXK   ",
      "  KXXXXXXXK ",
      " KXXK KXKXXK",
      " KXXK KXKXXK",
      "  KXXXXXXXK ",
      "   KXXXXXK  ",
      "  RR KXK YY ",
      "  R   K   Y ",
      "            "
    ],
    ghost: [
      "            ",
      "            ",
      "   K    K   ",
      "   KXXXXK   ",
      "  KXXXXXXXK ",
      " KXXK KXKXXK",
      " KXXK KXKXXK",
      "  KXXXXXXXK ",
      "   K X X K  ",
      "   K K K K  ",
      "            ",
      "            "
    ],
    hyper: [
      "            ",
      "   RR  YY   ",
      "  RXXR YXY  ",
      "   KXXXXK   ",
      "  KXXXXXXXK ",
      " KXXR KXRXXK",
      " KXXK KXKXXK",
      "  KXXXXXXXK ",
      "   KXXXXXK  ",
      "  RR KXK YY ",
      "  R   K   Y ",
      "            "
    ],
    nightowl: [
      "            ",
      "   RR  YY   ",
      "  RXXR YXY  ",
      "   KXXXXK   ",
      "  KXXXXXXXK ",
      " KXXO KXOXXK",
      " KXXO KXOXXK",
      "  KXXXXXXXK ",
      "   KXXXXXK  ",
      "  RR KXK YY ",
      "  R   K   Y ",
      "            "
    ],
    weekend: [
      "            ",
      "   RR  YY   ",
      "  RXXR YXY  ",
      "   KXXXXK   ",
      "  KXXXXXXXK ",
      " KXXK KXKXXK",
      " KXXK KXKXXK",
      "  KXXXXXXXK ",
      "   KXXXXXK  ",
      "  RR KXK YY ",
      "  R   K   Y ",
      "            "
    ]
  }
};

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
      return 'TET';
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
const SEASONAL_ACCESSORIES = {
  // 🎉 NEW_YEAR: Party Hat (Striped Cone)
  NEW_YEAR: `
    <g transform="translate(85, 5)">
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

  // 💕 VALENTINE: Floating Pixel Heart
  VALENTINE: `
    <g transform="translate(150, 30)">
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
    </g>
  `,

  // 🌹 WOMENS_DAY: Red Rose Hairpin
  WOMENS_DAY: `
    <g transform="translate(130, 15)">
      <!-- Rose Petals -->
      <ellipse cx="15" cy="12" rx="8" ry="6" fill="#E63946"/>
      <ellipse cx="10" cy="15" rx="6" ry="5" fill="#D62839"/>
      <ellipse cx="20" cy="15" rx="6" ry="5" fill="#D62839"/>
      <ellipse cx="15" cy="18" rx="7" ry="5" fill="#C1121F"/>
      <circle cx="15" cy="14" r="4" fill="#780000"/>
      <!-- Stem -->
      <rect x="14" y="22" width="2" height="12" fill="#2D6A4F"/>
      <!-- Leaf -->
      <ellipse cx="18" cy="28" rx="5" ry="3" fill="#40916C" transform="rotate(30, 18, 28)"/>
    </g>
  `,

  // ☕ PROGRAMMER_DAY: Steaming Coffee Mug
  PROGRAMMER_DAY: `
    <g transform="translate(155, 60)">
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

  // 🎃 HALLOWEEN: Cute Jack-o'-lantern Pumpkin
  HALLOWEEN: `
    <g transform="translate(150, 110)">
      <!-- Pumpkin Stem -->
      <rect x="18" y="0" width="6" height="8" rx="2" fill="#2D6A4F"/>
      <!-- Pumpkin Body -->
      <ellipse cx="21" cy="25" rx="20" ry="18" fill="#FF6D00"/>
      <ellipse cx="21" cy="25" rx="16" ry="15" fill="#FF8500"/>
      <!-- Left Eye -->
      <polygon points="10,20 15,15 18,22" fill="#2D333B"/>
      <!-- Right Eye -->
      <polygon points="24,22 27,15 32,20" fill="#2D333B"/>
      <!-- Smile -->
      <path d="M12,30 Q21,38 30,30" stroke="#2D333B" stroke-width="3" fill="none"/>
      <!-- Teeth -->
      <rect x="16" y="30" width="4" height="4" fill="#FF8500"/>
      <rect x="22" y="30" width="4" height="4" fill="#FF8500"/>
    </g>
  `,

  // 🎩 MENS_DAY: Blue Bowtie
  MENS_DAY: `
    <g transform="translate(75, 140)">
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

  // 🎅 CHRISTMAS: Santa Hat
  CHRISTMAS: `
    <g transform="translate(70, 0)">
      <!-- Hat Body -->
      <path d="M0,45 Q-5,25 20,10 Q45,0 60,30 L55,50 Z" fill="#D32F2F"/>
      <path d="M5,42 Q0,25 22,13 Q42,5 55,30 L52,47 Z" fill="#E53935"/>
      <!-- White Trim -->
      <ellipse cx="28" cy="48" rx="32" ry="8" fill="#FAFAFA"/>
      <ellipse cx="28" cy="48" rx="28" ry="5" fill="#EEEEEE"/>
      <!-- Pom-pom -->
      <circle cx="60" cy="28" r="10" fill="#FAFAFA"/>
      <circle cx="62" cy="26" r="4" fill="#EEEEEE"/>
    </g>
  `,

  // 🧧 TET: Red Envelope (Lì Xì)
  TET: `
    <g transform="translate(150, 70)">
      <!-- Envelope Body -->
      <rect x="0" y="0" width="35" height="50" rx="3" fill="#D32F2F"/>
      <rect x="2" y="2" width="31" height="46" rx="2" fill="#E53935"/>
      <!-- Gold Decorative Border -->
      <rect x="5" y="5" width="25" height="40" rx="1" stroke="#FFD700" stroke-width="2" fill="none"/>
      <!-- Coin Symbol -->
      <circle cx="17.5" cy="25" r="10" fill="#FFD700"/>
      <circle cx="17.5" cy="25" r="7" fill="#FFC107"/>
      <!-- Chinese Character 福 (Fortune) stylized -->
      <rect x="14" y="20" width="7" height="2" fill="#D32F2F"/>
      <rect x="16" y="22" width="3" height="6" fill="#D32F2F"/>
      <rect x="14" y="25" width="7" height="2" fill="#D32F2F"/>
      <!-- Sparkle -->
      <circle cx="10" cy="10" r="2" fill="#FFD700" opacity="0.8"/>
      <circle cx="28" cy="40" r="1.5" fill="#FFD700" opacity="0.8"/>
    </g>
  `,

  // ═══════════════════════════════════════════════════════════════════════════
  // EASTER EGG ACCESSORIES
  // ═══════════════════════════════════════════════════════════════════════════

  // 👻 FRIDAY_13: Jason Voorhees Hockey Mask
  FRIDAY_13: `
    <g transform="translate(65, 35)">
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
  APRIL_FOOLS: `
    <g transform="translate(60, 0)">
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
 * @returns {string} SVG string or empty string
 */
function getSeasonalAccessory(timezone = 'UTC') {
  const event = getSeasonalEvent(timezone);
  if (event && SEASONAL_ACCESSORIES[event]) {
    return `<!-- Seasonal: ${event} -->\n${SEASONAL_ACCESSORIES[event]}`;
  }
  return '';
}

// --- GAMIFICATION SYSTEM ---

/**
 * Calculate XP and Level from total commits (RPG Mechanics)
 * @param {number} totalCommits - Total commit count
 * @returns {Object} { level, xp, nextLevelXp }
 */
function calculateStats(totalCommits) {
  const xp = totalCommits * 10;
  const level = Math.floor(Math.sqrt(xp) / 5) + 1;
  const nextLevelXp = Math.pow(level * 5, 2);
  return { level, xp, nextLevelXp };
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

    // 3. Calculate Stats (Level & XP)
    const totalCommits = events.data.filter(e => e.type === 'PushEvent').length;
    const stats = calculateStats(totalCommits);
    console.log(`Level: ${stats.level}, XP: ${stats.xp}/${stats.nextLevelXp}`);

    // Calculate Streak (keep for logging)
    const streak = calculateStreak(events.data);
    console.log(`Current Streak: ${streak} days`);

    // 4. Determine Pet Type (Species)
    let petType = 'cat';
    let isLegendary = false;

    // Check if user starred/forked THIS repo (for Unicorn entry-level legendary)
    const starForkResult = await checkUserStarredOrForked(octokit, username);
    const isStargazer = starForkResult; // checkUserStarredOrForked returns true if starred
    const isForker = starForkResult;    // or forked (combined check)

    // Fetch extended stats for Legendary Pet detection
    const legendaryStats = await fetchLegendaryStats(octokit, username, events.data, timezone, isStargazer, isForker);

    // Check for Legendary Pet (waterfall priority)
    const legendaryPet = getLegendaryPet(legendaryStats);

    if (legendaryPet) {
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
      timezone: timezone
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

function generateSVG(petType, mood, options = {}) {
  const { theme = 'minimal', showLevel = true, stats = null, moodInfo = null, timezone = 'UTC' } = options;

  // 1. Select the Sprite Set (check Legendary first, then Standard)
  const spriteSet = LEGENDARY_SPRITES[petType] || SPRITES[petType] || SPRITES['cat'];

  // 2. Select the specific Mood Grid
  const moodKey = moodInfo?.moodKey || ((mood === 'happy') ? 'normal' : mood);
  const spriteGrid = spriteSet[moodKey] || spriteSet['normal'];

  // 3. Get base color (check Legendary first, then Standard)
  const baseColor = LEGENDARY_COLORS[petType] || PET_COLORS[petType] || '#e5c07b';

  const pixelSize = 16;
  const rows = spriteGrid.length;
  const cols = spriteGrid[0].length;
  const width = cols * pixelSize;
  const height = rows * pixelSize;

  // Calculate SVG dimensions (extra space for stats if needed)
  const svgWidth = width + 40;
  const svgHeight = height + (showLevel && stats ? 55 : 40);

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
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0 0; 0 -4; 0 0" 
            dur="0.5s" 
            repeatCount="indefinite" 
        />`;
  } else if (moodKey === 'sleeping') {
    animation = `
        <animateTransform 
            attributeName="transform" 
            type="scale" 
            values="1 1; 1.02 0.98; 1 1" 
            dur="2s" 
            repeatCount="indefinite" 
        />`;
  }

  // Build stats display
  let statsDisplay = '';
  if (showLevel && stats && moodInfo) {
    statsDisplay = `
      <text x="50%" y="${height + 50}" text-anchor="middle" font-family="monospace" font-size="11" fill="${textColor}">
        Lvl ${stats.level} • ${moodInfo.icon} ${moodInfo.mood.toUpperCase()}
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
  const seasonalAccessory = getSeasonalAccessory(timezone);

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
