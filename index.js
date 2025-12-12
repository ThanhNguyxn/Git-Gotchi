const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const token = core.getInput('github_token');
    const username = core.getInput('username');
    const octokit = github.getOctokit(token);

    // 1. Fetch Data
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          topRepositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    `;

    const response = await octokit.graphql(query, { username });
    const user = response.user;

    if (!user) {
      throw new Error(`User ${username} not found`);
    }

    // 2. Process Data for Game Logic
    const calendar = user.contributionsCollection.contributionCalendar.weeks
      .flatMap(week => week.contributionDays)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

    const today = calendar[0];
    const last7Days = calendar.slice(0, 7);
    const totalContributionsLast7Days = last7Days.reduce((acc, day) => acc + day.contributionCount, 0);

    // Determine State
    let state = 'sleeping'; // Default
    if (today.contributionCount > 0) {
      state = 'happy';
    } else if (totalContributionsLast7Days === 0) {
      state = 'ghost';
    }

    // Determine Evolution (Pet Type)
    const languages = {};
    user.topRepositories.nodes.forEach(repo => {
      if (repo.languages.nodes.length > 0) {
        const lang = repo.languages.nodes[0].name;
        languages[lang] = (languages[lang] || 0) + 1;
      }
    });

    let topLang = 'JavaScript'; // Default
    let maxCount = 0;
    for (const [lang, count] of Object.entries(languages)) {
      if (count > maxCount) {
        maxCount = count;
        topLang = lang;
      }
    }

    let petType = 'cat';
    if (['JavaScript', 'TypeScript'].includes(topLang)) petType = 'spider';
    else if (topLang === 'Python') petType = 'snake';
    else if (topLang === 'Go') petType = 'gopher';

    console.log(`User: ${username}, State: ${state}, Type: ${petType}, Top Lang: ${topLang}`);

    // 3. Generate SVG
    const svgContent = generateSVG(petType, state);

    // 4. Save File
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir);
    }
    fs.writeFileSync(path.join(distDir, 'pet.svg'), svgContent);
    console.log('Generated dist/pet.svg');

  } catch (error) {
    core.setFailed(error.message);
  }
}

function generateSVG(type, state) {
  // Simple pixel art maps (5x5 or similar small grid scaled up)
  // We'll use a simple grid system for the "pixels"
  
  const colors = {
    spider: '#e06c75', // Red/Pinkish
    snake: '#98c379',  // Green
    gopher: '#61afef', // Blue
    cat: '#e5c07b',    // Yellow/Gold
    ghost: '#abb2bf',  // Grey
  };

  const color = state === 'ghost' ? colors.ghost : (colors[type] || colors.cat);
  
  // 8x8 Pixel Grids
  const pixels = {
    spider: [
      '  X  X  ',
      '   XX   ',
      ' XXXXXX ',
      ' XXXXXX ',
      ' X XX X ',
      'X      X',
      'X      X',
      '        '
    ],
    snake: [
      '   XX   ',
      '  X  X  ',
      '      X ',
      '     X  ',
      '   XX   ',
      '  X     ',
      ' X      ',
      'XXXXX   '
    ],
    gopher: [
      '  XXXX  ',
      ' X    X ',
      'X  XX  X',
      'X      X',
      'X XXXX X',
      ' X    X ',
      '  XXXX  ',
      '        '
    ],
    cat: [
      'X      X',
      'X      X',
      ' XXXXXX ',
      'X  XX  X',
      'X      X',
      ' XXXXXX ',
      '  X  X  ',
      '  X  X  '
    ],
    ghost: [
      '  XXXX  ',
      ' XXXXXX ',
      'X  XX  X',
      'X      X',
      'X      X',
      'X      X',
      'X X  X X',
      ' X    X '
    ]
  };

  const art = state === 'ghost' ? pixels.ghost : (pixels[type] || pixels.cat);
  
  // Modifiers for state
  let eyeColor = 'black';
  let mouth = '';

  if (state === 'sleeping') {
    eyeColor = 'transparent'; // Closed eyes effect (or just lines)
    // We might modify the art for sleeping, but for simplicity let's just change eyes/mouth in a more complex version.
    // For this simple version, let's just use the base art.
  }

  // Convert grid to SVG rects
  let rects = '';
  const scale = 20;
  
  art.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'X') {
        rects += `<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${color}" />`;
      }
    }
  });

  // Add some "face" details on top if needed, or just rely on the silhouette.
  // Let's add a simple animation for "Happy" state (bouncing)
  let animate = '';
  if (state === 'happy') {
    animate = `
      <animateTransform 
        attributeName="transform" 
        type="translate" 
        values="0 0; 0 -5; 0 0" 
        dur="1s" 
        repeatCount="indefinite" 
      />
    `;
  } else if (state === 'sleeping') {
     animate = `
      <animateTransform 
        attributeName="transform" 
        type="scale" 
        values="1 1; 1.05 1.05; 1 1" 
        dur="3s" 
        repeatCount="indefinite" 
        additive="sum"
        origin="80 80"
      />
    `;
  }

  // Zzz for sleeping
  let extras = '';
  if (state === 'sleeping') {
    extras = `
      <text x="140" y="40" font-family="monospace" font-size="20" fill="#61afef">Z</text>
      <text x="155" y="30" font-family="monospace" font-size="15" fill="#61afef">z</text>
      <animate 
        xlink:href="#zzz"
        attributeName="opacity"
        values="0;1;0"
        dur="2s"
        repeatCount="indefinite"
      />
    `;
  }

  return `
<svg width="200" height="200" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="transparent"/>
  <g>
    ${animate}
    ${rects}
  </g>
  ${extras}
  <text x="10" y="150" font-family="monospace" font-size="12" fill="#333">Status: ${state}</text>
</svg>
  `;
}

run();
