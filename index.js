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

    // Legendary Status: Unicorn (Star or Fork the repo!)
    const hasStarredOrForked = await checkUserStarredOrForked(octokit, username);
    if (hasStarredOrForked) {
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

    console.log(`User: ${username}, Mood: ${moodInfo.mood}, Type: ${petType}, Theme: ${backgroundTheme}`);

    // 5. Generate SVG with new options
    const svgContent = generateSVG(petType, moodInfo.moodKey, {
      theme: backgroundTheme,
      showLevel: showLevel,
      stats: stats,
      moodInfo: moodInfo
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
  const { theme = 'minimal', showLevel = true, stats = null, moodInfo = null } = options;

  // 1. Select the Sprite Set
  const spriteSet = SPRITES[petType] || SPRITES['cat'];

  // 2. Select the specific Mood Grid
  const moodKey = moodInfo?.moodKey || ((mood === 'happy') ? 'normal' : mood);
  const spriteGrid = spriteSet[moodKey] || spriteSet['normal'];

  const baseColor = PET_COLORS[petType] || '#e5c07b';

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
      </g>
      ${statsDisplay}
      ${moodDisplay}
    </svg>`;
}

run();
