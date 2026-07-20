const keep = [
  'src',
  'server',
  'public',
  'docs',
  'package.json',
  'package-lock.json',
  'README.md',
  'REQUIREMENTS.md',
  'SHARE_INSTRUCTIONS.md',
  'run-project.bat',
  'components.json',
  'index.html',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.js',
  'jsconfig.json',
  '.gitignore',
];

const exclude = [
  'node_modules',
  'dist',
  '.vite',
  '.env',
  '.env.local',
  'server/data/*.db',
  'server/data/*.db-*',
];

console.log('Share these files/folders:');
for (const item of keep) console.log(`  - ${item}`);

console.log('\nDo not share these generated/private files:');
for (const item of exclude) console.log(`  - ${item}`);

console.log('\nReceiver commands:');
console.log('  npm install');
console.log('  npm run dev');
