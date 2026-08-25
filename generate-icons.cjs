const sharp = require('sharp');
const fs = require('fs');

async function run() {
  try {
    const inputBuffer = fs.readFileSync('public/images/fevicone.png');
    
    // Generate 180x180 for Apple Touch Icon
    await sharp(inputBuffer)
      .resize(180, 180)
      .png()
      .toFile('public/apple-touch-icon.png');
      
    // Generate 192x192 for Android Chrome
    await sharp(inputBuffer)
      .resize(192, 192)
      .png()
      .toFile('public/favicon-192.png');
      
    // Generate 512x512 for PWA Logo
    await sharp(inputBuffer)
      .resize(512, 512)
      .png()
      .toFile('public/logo-512.png');
      
    // Generate 32x32 for standard favicon
    await sharp(inputBuffer)
      .resize(32, 32)
      .png()
      .toFile('public/favicon.png');

    console.log('Icons generated successfully.');
  } catch (err) {
    console.error(err);
  }
}
run();
