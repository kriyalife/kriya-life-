const fs = require('fs');

let content = fs.readFileSync('src/components/CinematicGallery.tsx', 'utf8');

const correctMedia = `const MEDIA: VideoMedia[] = [
  { 
    type: 'video', 
    src: "/video-1.mp4", 
    title: "Real Results & Experience", 
    reviewer: "Verified User", 
    tag: "Customer Video", 
    rating: 5,
    productId: "kriya-glow-renew-combo"
  },
  { 
    type: 'video', 
    src: "/video-2.mp4", 
    title: "Morning Routine Essentials", 
    reviewer: "Verified User", 
    tag: "Morning Glow", 
    rating: 5,
    productId: "kriya-vit-c-facewash"
  },
  { 
    type: 'video', 
    src: "/video-3.mp4", 
    title: "Skin Hydration Testimonial", 
    reviewer: "Verified User", 
    tag: "Deep Hydration", 
    rating: 5,
    productId: "kriya-night-cream"
  },
  { 
    type: 'video', 
    src: "/video-4.mp4", 
    title: "Organic Ingredients Unboxing", 
    reviewer: "Verified User", 
    tag: "Unboxing", 
    rating: 5,
    productId: "kriya-glow-renew-combo"
  },
  { 
    type: 'video', 
    src: "/video-5.mp4", 
    title: "Night Care Ritual Guide", 
    reviewer: "Verified User", 
    tag: "Night Routine", 
    rating: 5,
    productId: "kriya-night-cream"
  },
  { 
    type: 'video', 
    src: "/video-6.mp4", 
    title: "KRIYA Skincare Results", 
    reviewer: "Verified User", 
    tag: "Customer Review", 
    rating: 5,
    productId: "kriya-glow-renew-combo"
  },
  { 
    type: 'video', 
    src: "/video-7.mp4", 
    title: "Application & Glow", 
    reviewer: "Verified User", 
    tag: "Application", 
    rating: 5,
    productId: "kriya-vit-c-facewash"
  },
  { 
    type: 'video', 
    src: "/vlog-skincare-routine.mp4", 
    title: "Daily Skincare Routine & Application", 
    reviewer: "Kavita Roy", 
    tag: "Routine Vlog", 
    rating: 5,
    productId: "kriya-glow-renew-combo"
  }
];`;

content = content.replace(/const MEDIA: VideoMedia\[\] = \[\s*\{[\s\S]*?\}\s*\];/, correctMedia);

fs.writeFileSync('src/components/CinematicGallery.tsx', content);
