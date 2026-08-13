export type Category = 
  | 'All' 
  | 'Face Cleansers' 
  | 'Moisturizers & Creams'
  | 'Hair Care'
  | 'Combos & Kits';

export interface Shade {
  name: string;
  colorHex: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface ProductBenefit {
  title: string;
  description: string;
}

export interface DetailedIngredient {
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isOrganic?: boolean;
  introParagraph?: string;
  highlights?: string[];
  benefits?: ProductBenefit[];
  detailedIngredients?: DetailedIngredient[];
  description: string;
  ingredients: string[];
  howToUse: string;
  volume: string;
  shades?: Shade[];
  images: string[];
  media?: { type: 'image' | 'video', src: string, alt?: string }[];
  inStock: boolean;
  skinTypes: string[];
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShade?: Shade;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentDetails {
  method: 'card' | 'upi' | 'paypal' | 'netbanking';
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvc?: string;
  upiId?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Formulating' | 'Shipped' | 'Delivered';
  trackingNumber: string;
  payLink: string;
}

export type ViewMode = 
  | 'home' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-confirmation' 
  | 'order-tracking' 
  | 'wishlist'
  | 'admin'
  | 'book-order'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'refund'
  | 'faq';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface VideoMedia {
  id?: string;
  type: string;
  src: string;
  title: string;
  reviewer: string;
  tag: string;
  rating: number;
  productId: string;
  quote?: string;
}
