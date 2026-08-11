const fs = require('fs');
let fileContent = fs.readFileSync('src/data/products.ts', 'utf8');

// Replace old videos with new ones
// The old names were:
// kriya-night-cream.mp4
// kriya-vitamin-c.mp4
// kriya-night-care-testimonial.mp4
// kriya-face-wash-review.mp4
// kriya-glow-result.mp4
// kriya-organic-unboxing.mp4
// kriya-whatsapp-1.mp4
// kriya-whatsapp-2.mp4
// kriya-whatsapp-3.mp4
// kriya-whatsapp-4.mp4
// kriya-whatsapp-5.mp4

fileContent = fileContent.replace(/kriya-night-cream\.mp4/g, 'video-3.mp4');
fileContent = fileContent.replace(/kriya-vitamin-c\.mp4/g, 'video-2.mp4');
fileContent = fileContent.replace(/kriya-night-care-testimonial\.mp4/g, 'video-5.mp4');
fileContent = fileContent.replace(/kriya-face-wash-review\.mp4/g, 'video-7.mp4');
fileContent = fileContent.replace(/kriya-glow-result\.mp4/g, 'video-6.mp4');
fileContent = fileContent.replace(/kriya-organic-unboxing\.mp4/g, 'video-4.mp4');
fileContent = fileContent.replace(/kriya-whatsapp-1\.mp4/g, 'video-1.mp4');
fileContent = fileContent.replace(/kriya-whatsapp-2\.mp4/g, 'video-2.mp4'); // reused video-2 for another
fileContent = fileContent.replace(/kriya-whatsapp-3\.mp4/g, 'video-3.mp4'); // reused video-3 for another
fileContent = fileContent.replace(/kriya-whatsapp-4\.mp4/g, 'video-4.mp4'); // reused video-4 for another
fileContent = fileContent.replace(/kriya-whatsapp-5\.mp4/g, 'video-5.mp4'); // reused video-5 for another

fs.writeFileSync('src/data/products.ts', fileContent);
console.log('Products updated');
