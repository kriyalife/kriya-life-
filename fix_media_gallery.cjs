const fs = require('fs');
let content = fs.readFileSync('src/components/CinematicGallery.tsx', 'utf8');

const newMedia = `const MEDIA: VideoMedia[] = [
  { 
    type: 'video', 
    src: "/video-1.mp4", 
    title: "Overnight Repair Results", 
    reviewer: "Priya S.", 
    tag: "Customer Video", 
    rating: 5,
    productId: "kriya-night-cream"
  },
  { 
    type: 'video', 
    src: "/video-2.mp4", 
    title: "Morning Fresh Glow", 
    reviewer: "Ananya M.", 
    tag: "Morning Routine", 
    rating: 5,
    productId: "kriya-vit-c-facewash"
  },
  { 
    type: 'video', 
    src: "/video-3.mp4", 
    title: "Skin Hydration Testimonial", 
    reviewer: "Meera R.", 
    tag: "Deep Hydration", 
    rating: 5,
    productId: "kriya-night-cream"
  },
  { 
    type: 'video', 
    src: "/video-4.mp4", 
    title: "Refreshing Cleanse", 
    reviewer: "Sara K.", 
    tag: "Unboxing", 
    rating: 5,
    productId: "kriya-vit-c-facewash"
  },
  { 
    type: 'video', 
    src: "/video-5.mp4", 
    title: "Night Care Ritual Guide", 
    reviewer: "Ritu D.", 
    tag: "Night Routine", 
    rating: 5,
    productId: "kriya-night-cream"
  },
  { 
    type: 'video', 
    src: "/video-6.mp4", 
    title: "Vitamin C Radiance", 
    reviewer: "Sneha P.", 
    tag: "Customer Review", 
    rating: 5,
    productId: "kriya-vit-c-facewash"
  },
  { 
    type: 'video', 
    src: "/video-7.mp4", 
    title: "Wake Up Glowing", 
    reviewer: "Tanya B.", 
    tag: "Application", 
    rating: 5,
    productId: "kriya-night-cream"
  },
  { 
    type: 'video', 
    src: "/vlog-skincare-routine.mp4", 
    title: "Daily Skincare Routine", 
    reviewer: "Kavita Roy", 
    tag: "Routine Vlog", 
    rating: 5,
    productId: "kriya-vit-c-facewash"
  }
];`;

content = content.replace(/const MEDIA: VideoMedia\[\] = \[\s*\{[\s\S]*?\}\s*\];/, newMedia);

fs.writeFileSync('src/components/CinematicGallery.tsx', content);
console.log('Replaced MEDIA array');
