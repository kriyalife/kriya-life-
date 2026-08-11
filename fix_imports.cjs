const fs = require('fs');

let fileContent = fs.readFileSync('src/data/products.ts', 'utf8');

// Remove the bad imports
fileContent = fileContent.replace(/import VITAMIN_C_FACEWASH_IMAGE from '\.\.\/assets\/images\/regenerated_image_1784912952322\.jpg';\n/, '');
fileContent = fileContent.replace(/import OLIVE_SOUFFLE_CREAM_IMAGE from '\.\.\/assets\/images\/regenerated_image_1784914035289\.jpg';\n/, '');

fs.writeFileSync('src/data/products.ts', fileContent);
console.log('Fixed imports');
