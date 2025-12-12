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
  camel: '#d2691e'   // Chocolate (Perl)
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
    ]
  }
};

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
    const octokit = github.getOctokit(token);

    // 1. Fetch User Activity
    const events = await octokit.rest.activity.listPublicEventsForUser({
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

function generateSVG(petType, mood) {
  // 1. Select the Sprite Set
  const spriteSet = SPRITES[petType] || SPRITES['cat'];

  // 2. Select the specific Mood Grid
  // Map 'happy' to 'normal' if needed, or use 'normal' as default
  const moodKey = (mood === 'happy') ? 'normal' : mood;
  const spriteGrid = spriteSet[moodKey] || spriteSet['normal'];

  const baseColor = PET_COLORS[petType] || '#e5c07b';

  const pixelSize = 16;
  const rows = spriteGrid.length;
  const cols = spriteGrid[0].length;
  const width = cols * pixelSize;
  const height = rows * pixelSize;

  // Ghost Logic: Override Base Color
  const finalBaseColor = mood === 'ghost' ? '#abb2bf' : baseColor;
  const groupOpacity = mood === 'ghost' ? '0.7' : '1';

  const pixelArt = renderPixelGrid(spriteGrid, finalBaseColor, pixelSize);

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
