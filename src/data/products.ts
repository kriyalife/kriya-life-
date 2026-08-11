import { Product } from '../types';
import { 
  VITAMIN_C_FACEWASH_IMAGE, 
  OLIVE_SOUFFLE_CREAM_IMAGE, 
  COMBO_DUO_IMAGE,
  KUMKUMADI_SERUM_IMAGE,
  DAMASK_ROSE_TONER_IMAGE 
} from './productImages';

export const PRODUCTS: Product[] = [
  {
    id: 'kriya-vit-c-facewash',
    name: 'Kriya Vitamin C Face Wash',
    tagline: 'Gently Cleanses, Brightens & Revitalizes Dull Skin',
    category: 'Face Cleansers',
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 128,
    isBestseller: true,
    isOrganic: true,
    isNew: false,
    volume: '100ml',
    inStock: true,
    skinTypes: ['All Skin Types', 'Dull Skin', 'Oily Skin', 'Combination Skin'],
    description: 'Enriched with natural Vitamin C, orange peel extract, and gentle botanical cleansers. This sulphate-free face wash lifts impurities, balances sebum, and restores healthy radiance without drying out your skin.',
    ingredients: [
      'DM Water',
      'Vitamin C (Ascorbic Acid)',
      'Orange Peel Extract',
      'Aloe Vera Juice',
      'Vegetable Glycerin',
      'Cocamidopropyl Betaine',
      'Saffron Extract',
      'Natural Essential Oils'
    ],
    howToUse: 'Dampen your face with lukewarm water. Squeeze a pea-sized amount onto wet palms, gently massage in upward circular motions for 60 seconds, and rinse thoroughly with clean water.',
    images: [
      VITAMIN_C_FACEWASH_IMAGE,
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800'
    ],
    media: [
      { type: 'image', src: VITAMIN_C_FACEWASH_IMAGE, alt: 'Kriya Vitamin C Face Wash 100ml Tube' },
      { type: 'video', src: '/video-1.mp4', alt: 'Vitamin C Cleansing Routine' },
      { type: 'video', src: '/video-2.mp4', alt: 'Morning Fresh Cleanse Demo' }
    ],
    reviews: [
      {
        id: 'r1',
        userName: 'Priya Sharma',
        rating: 5,
        date: '2026-07-28',
        title: 'Instant Fresh Glow!',
        comment: 'This Vitamin C face wash smells like fresh oranges! Leaves my face feeling super clean and glowing without any tight sensation.',
        verified: true
      },
      {
        id: 'r2',
        userName: 'Ananya Mehta',
        rating: 5,
        date: '2026-08-02',
        title: 'Best daily cleanser',
        comment: 'Gentle on sensitive skin. My dark spots look lighter after 3 weeks of consistent morning and night usage.',
        verified: true
      }
    ]
  },
  {
    id: 'kriya-night-cream',
    name: 'Olive Night Cream',
    tagline: 'Deep Moisture Soufflé for Overnight Barrier Repair',
    category: 'Moisturizers & Creams',
    price: 799,
    originalPrice: 999,
    rating: 5.0,
    reviewsCount: 96,
    isBestseller: true,
    isOrganic: true,
    isNew: false,
    volume: '30g',
    inStock: true,
    skinTypes: ['Dry Skin', 'Mature Skin', 'Normal Skin', 'Sensitive Skin'],
    description: 'An ultra-rich, non-greasy night soufflé formulated with Olive Olivate, Phytosqualane, Niacinamide, and Botanical Hyaluronic Acid. Works overnight to lock in essential moisture and smooth fine lines.',
    ingredients: [
      'DM Water',
      'Olive Olivate',
      'Extra Virgin Olive Oil',
      'Phytosqualane',
      'Niacinamide 2%',
      'Shea Butter',
      'Rosehip Seed Oil',
      'Tocopherol (Vitamin E)'
    ],
    howToUse: 'Scoop a pearl-sized amount with clean fingertips. Warm between palms and press gently into cleansed face and neck every evening before sleep.',
    images: [
      OLIVE_SOUFFLE_CREAM_IMAGE,
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1567928269937-251d1469e7f7?auto=format&fit=crop&q=80&w=800'
    ],
    media: [
      { type: 'image', src: OLIVE_SOUFFLE_CREAM_IMAGE, alt: 'Kriya Olive Night Cream 30g Jar' },
      { type: 'video', src: '/video-3.mp4', alt: 'Overnight Night Cream Ritual' },
      { type: 'video', src: '/video-5.mp4', alt: 'Night Care Application Guide' }
    ],
    reviews: [
      {
        id: 'r3',
        userName: 'Meera Rajput',
        rating: 5,
        date: '2026-07-15',
        title: 'Wake up with baby soft skin!',
        comment: 'So buttery and rich, yet absorbs quickly. My skin barrier is visibly healthier and dry patches are completely gone.',
        verified: true
      }
    ]
  },
  {
    id: 'kriya-glow-renew-combo',
    name: 'Complete Glow & Renew Combo Duo',
    tagline: 'Vitamin C Face Wash (100ml) + Olive Night Cream (30g)',
    category: 'Combos & Kits',
    price: 899,
    originalPrice: 1498,
    rating: 5.0,
    reviewsCount: 210,
    isBestseller: true,
    isOrganic: true,
    isNew: true,
    volume: 'Set of 2 Products',
    inStock: true,
    skinTypes: ['All Skin Types'],
    description: 'The ultimate 2-step bioactive ritual. Start your morning with the revitalizing Vitamin C Face Wash, and restore your skin moisture barrier overnight with the Olive Night Soufflé Cream.',
    ingredients: [
      'Vitamin C Face Wash: Ascorbic Acid, Orange Peel Extract, Saffron',
      'Olive Night Cream: Olive Olivate, Niacinamide, Shea Butter'
    ],
    howToUse: 'Use Vitamin C Face Wash every morning & evening. Apply Olive Night Cream every night after washing.',
    images: [
      COMBO_DUO_IMAGE,
      VITAMIN_C_FACEWASH_IMAGE,
      OLIVE_SOUFFLE_CREAM_IMAGE,
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800'
    ],
    media: [
      { type: 'image', src: COMBO_DUO_IMAGE, alt: 'Kriya Complete Glow & Renew Combo Duo' },
      { type: 'image', src: VITAMIN_C_FACEWASH_IMAGE, alt: 'Vitamin C Face Wash 100ml' },
      { type: 'image', src: OLIVE_SOUFFLE_CREAM_IMAGE, alt: 'Olive Souffle Cream 30g' },
      { type: 'video', src: '/video-6.mp4', alt: 'Vitamin C Radiance Boost' },
      { type: 'video', src: '/video-7.mp4', alt: 'Deep Moisture Restore' }
    ],
    reviews: [
      {
        id: 'r4',
        userName: 'Dr. Sneha Patel',
        rating: 5,
        date: '2026-08-01',
        title: 'Unbeatable Value & Quality',
        comment: 'Buying this combo saves over 40%! Both products complement each other seamlessly for round-the-clock skincare.',
        verified: true
      }
    ]
  },
  {
    id: 'kriya-kumkumadi-serum',
    name: 'Kumkumadi Radiance Facial Oil',
    tagline: 'Pure Kashmiri Saffron & 26 Ayurvedic Elixirs',
    category: 'Moisturizers & Creams',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 84,
    isBestseller: false,
    isOrganic: true,
    isNew: true,
    volume: '30ml',
    inStock: true,
    skinTypes: ['All Skin Types', 'Pigmentation', 'Uneven Skin Tone'],
    description: 'Infused with authentic Kashmiri Mongra Saffron, Lotus stamens, Sandalwood, and Licorice. This traditional Ayurvedic beauty oil enhances golden glow, diminishes pigmentation, and improves elasticity.',
    ingredients: [
      'Kashmiri Saffron',
      'Sandalwood Oil',
      'Blue Lotus Extract',
      'Licorice Root',
      'Sesame Seed Oil',
      'Vetiver Extract',
      'Goat Milk Elixir'
    ],
    howToUse: 'Dispense 3-4 drops onto palms, warm slightly, and gently press into clean skin using gentle upward strokes before bedtime.',
    images: [
      KUMKUMADI_SERUM_IMAGE,
      'https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
    ],
    media: [
      { type: 'image', src: KUMKUMADI_SERUM_IMAGE, alt: 'Kumkumadi Radiance Facial Oil Bottle' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800', alt: 'Golden Ayurvedic Serum Dropper' },
      { type: 'video', src: '/video-4.mp4', alt: 'Kashmiri Saffron Oil Application' },
      { type: 'video', src: '/video-1.mp4', alt: 'Ayurvedic Golden Glow Massage' }
    ],
    reviews: [
      {
        id: 'r5',
        userName: 'Kavita Nair',
        rating: 5,
        date: '2026-07-20',
        title: 'Golden Glow in a Bottle',
        comment: 'My skin tone looks noticeably brighter and dark spots are fading. Smells like pure saffron and luxury!',
        verified: true
      }
    ]
  },
  {
    id: 'kriya-damask-rose-toner',
    name: 'Damask Rose Water Facial Mist',
    tagline: '100% Steam-Distilled Pure Rose Petal Hydrator',
    category: 'Face Cleansers',
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviewsCount: 142,
    isBestseller: false,
    isOrganic: true,
    isNew: false,
    volume: '120ml',
    inStock: true,
    skinTypes: ['All Skin Types', 'Sensitive Skin', 'Dehydrated Skin'],
    description: 'Created through traditional slow steam distillation of handpicked organic Damask Roses from Kannauj. Refreshes pores, balances pH levels, and delivers instant dewy hydration.',
    ingredients: [
      '100% Pure Steam Distilled Damask Rose Flower Water (Rosa Damascena)'
    ],
    howToUse: 'Spritz generously across face and neck after cleansing or anytime throughout the day for an instant refreshing boost.',
    images: [
      DAMASK_ROSE_TONER_IMAGE,
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?auto=format&fit=crop&q=80&w=800'
    ],
    media: [
      { type: 'image', src: DAMASK_ROSE_TONER_IMAGE, alt: 'Damask Rose Water Facial Mist Spray Bottle' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800', alt: 'Fresh Rose Mist Dew Drops' },
      { type: 'video', src: '/video-2.mp4', alt: 'Rose Mist Hydration Demo' },
      { type: 'video', src: '/video-5.mp4', alt: 'Daily Refresh Spray Guide' }
    ],
    reviews: [
      {
        id: 'r6',
        userName: 'Ritu Deshmukh',
        rating: 5,
        date: '2026-07-10',
        title: 'Smells amazing & calms redness!',
        comment: 'I keep this on my office desk. A quick spray instantly revitalizes my tired skin in air-conditioned environments.',
        verified: true
      }
    ]
  }
];

export const PROMO_CODES: Record<string, number> = {
  'KRIYA10': 0.10,
  'WELCOME15': 0.15,
  'GLOW20': 0.20
};


