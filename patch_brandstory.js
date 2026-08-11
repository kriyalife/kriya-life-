const fs = require('fs');
let content = fs.readFileSync('src/components/BrandStory.tsx', 'utf8');

// Replace everything before the return statement with cleaned up imports
content = content.replace(
  /import React[\s\S]*?return \(/m,
  `import React from 'react';\nimport { Leaf, Award, ShieldCheck } from 'lucide-react';\n\nexport const BrandStory: React.FC = () => {\n  return (`
);

fs.writeFileSync('src/components/BrandStory.tsx', content);
