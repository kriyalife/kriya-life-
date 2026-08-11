const fs = require('fs');
let content = fs.readFileSync('src/components/CinematicGallery.tsx', 'utf8');
content = content.replace(/productId: "kriya-glow-renew-combo"/g, 'productId: "kriya-vit-c-facewash"');
content = content.replace(/productId: "kriya-night-cream"/g, 'productId: "kriya-vit-c-facewash"');
fs.writeFileSync('src/components/CinematicGallery.tsx', content);
