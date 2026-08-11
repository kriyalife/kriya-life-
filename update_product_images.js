const fs = require('fs');

let fileContent = fs.readFileSync('src/data/products.ts', 'utf8');

// Add import
const importStatement = `import { VITAMIN_C_FACEWASH_IMAGE, OLIVE_SOUFFLE_CREAM_IMAGE } from './productImages';\n`;
fileContent = fileContent.replace("import { Product } from '../types';", "import { Product } from '../types';\n" + importStatement);

// Replace image3 with VITAMIN_C_FACEWASH_IMAGE
fileContent = fileContent.replace(/image3/g, 'VITAMIN_C_FACEWASH_IMAGE');

// Replace nightCreamImage with OLIVE_SOUFFLE_CREAM_IMAGE
fileContent = fileContent.replace(/nightCreamImage/g, 'OLIVE_SOUFFLE_CREAM_IMAGE');

fs.writeFileSync('src/data/products.ts', fileContent);
console.log('Done replacing product images');
