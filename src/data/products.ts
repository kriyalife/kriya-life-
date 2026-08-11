import { Product } from '../types';
import { 
  VITAMIN_C_FACEWASH_IMAGE, 
  OLIVE_SOUFFLE_CREAM_IMAGE, 
  COMBO_DUO_IMAGE,
  PRODUCT_2_IMAGE
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
      PRODUCT_2_IMAGE,
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800'
    ],
    media: [
      { type: 'image', src: VITAMIN_C_FACEWASH_IMAGE, alt: 'Kriya Vitamin C Face Wash 100ml Tube' },
      { type: 'image', src: PRODUCT_2_IMAGE, alt: 'Kriya Vitamin C Face Wash Detail View' },
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
      PRODUCT_2_IMAGE,
      'https://images.unsplash.com/photo-1567928269937-251d1469e7f7?auto=format&fit=crop&q=80&w=800'
    ],
    media: [
      { type: 'image', src: OLIVE_SOUFFLE_CREAM_IMAGE, alt: 'Kriya Olive Night Cream 30g Jar' },
      { type: 'image', src: PRODUCT_2_IMAGE, alt: 'Kriya Olive Night Cream Detail View' },
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
      PRODUCT_2_IMAGE,
      VITAMIN_C_FACEWASH_IMAGE,
      OLIVE_SOUFFLE_CREAM_IMAGE
    ],
    media: [
      { type: 'image', src: COMBO_DUO_IMAGE, alt: 'Kriya Complete Glow & Renew Combo Duo' },
      { type: 'image', src: PRODUCT_2_IMAGE, alt: 'Kriya Botanical Skincare Collection' },
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
    id: 'kriya-trial-sample-1rs',
    name: 'Kriya Express Trial Pack',
    tagline: '1 Rupee Special Trial Pack — Pure Botanical Sample',
    category: 'Special Offers',
    price: 1,
    originalPrice: 99,
    rating: 5.0,
    reviewsCount: 38,
    isBestseller: false,
    isOrganic: true,
    isNew: true,
    volume: '10ml Sample',
    inStock: true,
    skinTypes: ['All Skin Types'],
    description: 'Special 1 Rupee trial pack! Test and experience the instant glow of Kriya pure botanical formulation with this 10ml mini trial pack.',
    ingredients: [
      'Pure Aloe Vera Juice',
      'Botanical Extract Blend',
      'Vitamin C',
      'Natural Essential Oils'
    ],
    howToUse: 'Apply a small amount to clean skin to test the gentle botanical formula.',
    images: [
      PRODUCT_2_IMAGE,
      VITAMIN_C_FACEWASH_IMAGE,
      OLIVE_SOUFFLE_CREAM_IMAGE
    ],
    media: [
      { type: 'image', src: PRODUCT_2_IMAGE, alt: 'Kriya 1 Rupee Express Trial Pack' },
      { type: 'image', src: VITAMIN_C_FACEWASH_IMAGE, alt: 'Vitamin C Cleanser Sample' },
      { type: 'image', src: OLIVE_SOUFFLE_CREAM_IMAGE, alt: 'Olive Souffle Sample' }
    ],
    reviews: [
      {
        id: 'r5',
        userName: 'Vikram Dave',
        rating: 5,
        date: '2026-08-10',
        title: 'Great trial offer!',
        comment: 'Got this for 1 rupee to test the formula. Absolutely loved the gentle texture and fragrance.',
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


