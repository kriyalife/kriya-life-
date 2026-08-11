const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /#FFF8F6/gi, replace: '#FAFCFA' }, // Light off-white green
  { regex: /#FDEAE6/gi, replace: '#E8F3E9' }, // Light sage
  { regex: /#2C1A1D/gi, replace: '#153323' }, // Dark green text
  { regex: /#C85A32/gi, replace: '#2C523B' }, // Primary button / accent (was orange)
  { regex: /#D4A373/gi, replace: '#8BAA91' }, // Muted sage (was tan/beige)
  { regex: /#EBCFB3/gi, replace: '#D1E0D4' }, // Light tint on dark bg (was beige)
  { regex: /#1F3D2B/gi, replace: '#153323' }, // Unify dark greens
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      for (const { regex, replace } of replacements) {
        newContent = newContent.replace(regex, replace);
      }
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('src');
