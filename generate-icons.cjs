const sharp = require('sharp');
const fs = require('fs');

async function run() {
  try {
    const svgBuffer = fs.readFileSync('public/favicon.svg');
    
    // Generate 180x180 for Apple Touch Icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile('public/apple-touch-icon.png');
      
    // Generate 192x192 for Android Chrome
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile('public/favicon-192.png');
      
    // Generate 512x512 for PWA Logo
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile('public/logo-512.png');
      
    // Overwrite the corrupted favicon.png
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile('public/favicon.png');

    console.log('Icons generated successfully.');
  } catch (err) {
    console.error(err);
  }
}
run();
