import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product, CartItem, Order, Category, ViewMode, ToastMessage, Shade, ShippingAddress, AdminUser, VideoMedia } from '../types';
import { PRODUCTS, PROMO_CODES } from '../data/products';
import confetti from 'canvas-confetti';
import { saveOrderToSupabase, updateOrderStatusInSupabase, fetchProductsFromSupabase, saveProductToSupabase, deleteProductFromSupabase } from '../lib/db';
import { autoSeedSupabase } from '../lib/autoSeedSupabase';
import { sendOrderToFormspree } from '../lib/formspree';
import { supabase } from '../lib/supabaseClient';


const INITIAL_VIDEOS: VideoMedia[] = [
  { 
    id: 'v1',
    type: 'video', 
    src: "/video-1.mp4", 
    title: "Vitamin C Face Wash Routine", 
    reviewer: "Priya S.", 
    tag: "Face Wash Cleanse", 
    rating: 5,
    productId: "kriya-vit-c-facewash",
    quote: "This Vitamin C Face Wash gently cleanses away dirt and excess oil without stripping moisture. My face feels clean, refreshed, and visibly glowing!"
  },
  { 
    id: 'v2',
    type: 'video', 
    src: "/video-2.mp4", 
    title: "Morning Fresh Glow Cleanse", 
    reviewer: "Ananya M.", 
    tag: "Morning Routine", 
    rating: 5,
    productId: "kriya-vit-c-facewash",
    quote: "I start every morning with Kriya Vitamin C Face Wash. The gentle foam and subtle aroma wake up my skin instantly!"
  },
  { 
    id: 'v3',
    type: 'video', 
    src: "/video-3.mp4", 
    title: "Overnight Repair & Hydration", 
    reviewer: "Meera R.", 
    tag: "Night Routine", 
    rating: 5,
    productId: "kriya-night-cream",
    quote: "The Olive Night Cream deeply restores my skin barrier while I sleep. I wake up with smooth, plump, and deeply hydrated skin every morning."
  },
  { 
    id: 'v4',
    type: 'video', 
    src: "/video-4.mp4", 
    title: "Refreshing Everyday Cleanse", 
    reviewer: "Sara K.", 
    tag: "Unboxing & Demo", 
    rating: 5,
    productId: "kriya-vit-c-facewash",
    quote: "100% natural and gentle on my skin. Doesn't leave any tightness—just soft, bright, and deeply purified skin."
  },
  { 
    id: 'v5',
    type: 'video', 
    src: "/video-5.mp4", 
    title: "Night Care Ritual Guide", 
    reviewer: "Ritu D.", 
    tag: "Night Routine", 
    rating: 5,
    productId: "kriya-night-cream",
    quote: "A rich yet non-greasy night cream loaded with olive olivate & active antioxidants. Dark spots are noticeably lighter!"
  },
  { 
    id: 'v6',
    type: 'video', 
    src: "/video-6.mp4", 
    title: "Vitamin C Radiance Boost", 
    reviewer: "Sneha P.", 
    tag: "Customer Review", 
    rating: 5,
    productId: "kriya-vit-c-facewash",
    quote: "Transformed my dull complexion in just 2 weeks. Vitamin C + Botanical extracts give an instant healthy radiance!"
  },
  { 
    id: 'v7',
    type: 'video', 
    src: "/video-7.mp4", 
    title: "Deep Moisture Restore", 
    reviewer: "Kavita N.", 
    tag: "Night Cream Demo", 
    rating: 5,
    productId: "kriya-night-cream",
    quote: "Subtle soothing aroma, silky texture, and ultimate nourishment. My go-to night moisturizer for glowing skin!"
  }
];

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  currentView: ViewMode;
  selectedProduct: Product | null;
  selectedCategory: Category;
  searchQuery: string;
  sortBy: string;
  priceRange: number;
  filterOnlyBestsellers: boolean;
  filterOnlyOrganic: boolean;
  filterOnlyNew: boolean;
  
  isCartOpen: boolean;
  isSkinQuizOpen: boolean;
  isSearchOpen: boolean;
  isBookOrderOpen: boolean;
  
  activeOrder: Order | null;
  pastOrders: Order[];
  toasts: ToastMessage[];
  
  currentUser: { id?: string; name: string; email: string } | null;
  loginUser: (email: string, name: string) => void;
  logoutUser: () => void;
  
  appliedPromo: string;
  discountPercentage: number;
  
  // Admin State & Actions
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  setAdminUser: (user: AdminUser | null) => void;
  logoutAdmin: () => void;
  addProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'> & { id?: string }) => Product;
  updateProduct: (productId: string, productData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Video Showcase Actions
  mediaList: VideoMedia[];
  addVideoMedia: (media: Omit<VideoMedia, 'id'>) => void;
  deleteVideoMedia: (videoId: string) => void;

  // Setters & Actions
  setCurrentView: (view: ViewMode) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedCategory: (cat: Category) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (sort: string) => void;
  setPriceRange: (val: number) => void;
  setFilterOnlyBestsellers: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterOnlyOrganic: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterOnlyNew: React.Dispatch<React.SetStateAction<boolean>>;
  
  setIsCartOpen: (open: boolean) => void;
  setIsSkinQuizOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsBookOrderOpen: (open: boolean) => void;
  
  addToCart: (product: Product, quantity?: number, shade?: Shade) => void;
  removeFromCart: (productId: string, shadeName?: string) => void;
  updateQuantity: (productId: string, quantity: number, shadeName?: string) => void;
  clearCart: () => void;
  
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  
  placeOrder: (
    address: ShippingAddress, 
    method: 'standard' | 'express', 
    paymentMethod: string,
    customOrderId?: string
  ) => Order;
  
  findOrderById: (orderId: string) => Order | undefined;
  addReviewToProduct: (productId: string, userName: string, rating: number, title: string, comment: string) => void;
  deleteReview: (productId: string, reviewId: string) => void;
  
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  viewProductDetails: (product: Product) => void;
  getCartTotal: () => { subtotal: number; discount: number; shipping: number; tax: number; total: number };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kriya_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return PRODUCTS;
  });
  
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('kriya_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    const loadProductsFromDb = async () => {
      const dbProds = await fetchProductsFromSupabase();
      if (dbProds && dbProds.length > 0) {
        setProducts(dbProds);
      } else if (PRODUCTS && PRODUCTS.length > 0) {
        setProducts(PRODUCTS);
      }
    };

    loadProductsFromDb();

    // Subscribe to realtime changes in products table
    const channel = supabase
      .channel('public:products_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
        const dbProds = await fetchProductsFromSupabase();
        if (dbProds && dbProds.length > 0) {
          setProducts(dbProds);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);



  
  // Storage initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kriya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kriya_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pastOrders, setPastOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('kriya_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const sampleProductFallback: Product = {
      id: 'kriya-sample-item',
      name: 'Olive Night Cream (30g)',
      tagline: 'Nourish. Brighten. Renew Overnight.',
      category: 'Moisturizers & Creams',
      price: 999,
      rating: 5.0,
      reviewsCount: 1,
      description: 'Sample formulation.',
      ingredients: ['DM Water'],
      howToUse: 'Apply before bed.',
      volume: '30g',
      inStock: true,
      skinTypes: ['All Skin Types'],
      images: ['/icon.png'],
      reviews: []
    };

    // Default initial sample orders for Admin Panel & order tracking
    return [
      {
        id: 'KRIYA-2026-892410',
        date: 'July 24, 2026',
        items: [
          {
            product: PRODUCTS[0] || sampleProductFallback,
            quantity: 2
          }
        ],
        shippingAddress: {
          firstName: 'Aarav',
          lastName: 'Sharma',
          email: 'aarav.sharma@example.com',
          phone: '+91 7405500454',
          street: '42 Lotus Garden, Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500033',
          country: 'India'
        },
        shippingMethod: 'express',
        shippingCost: 199,
        subtotal: 798,
        discount: 79.8,
        tax: 129.27,
        total: 1046.47,
        paymentMethod: 'UPI (aarav@upi)',
        status: 'Processing',
        trackingNumber: 'KR89241001IN',
        payLink: 'https://checkout.kriyacosmetics.com/pay/KRIYA-2026-892410'
      },
      {
        id: 'KRIYA-2026-741295',
        date: 'July 23, 2026',
        items: [
          {
            product: PRODUCTS[1] || sampleProductFallback,
            quantity: 1
          }
        ],
        shippingAddress: {
          firstName: 'Meera',
          lastName: 'Patel',
          email: 'meera.patel@example.com',
          phone: '+91 7874867191',
          street: '108 Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400050',
          country: 'India'
        },
        shippingMethod: 'standard',
        shippingCost: 0,
        subtotal: 899,
        discount: 0,
        tax: 161.82,
        total: 1060.82,
        paymentMethod: 'Credit Card (**** 4242)',
        status: 'Formulating',
        trackingNumber: 'KR74129502IN',
        payLink: 'https://checkout.kriyacosmetics.com/pay/KRIYA-2026-741295'
      }
    ];
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('kriya_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('kriya_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginUser = (email: string, name: string) => {
    const user = { email, name };
    setCurrentUser(user);
    try {
      localStorage.setItem('kriya_user', JSON.stringify(user));
    } catch {}
    showToast('Logged In', `Welcome back, ${name}!`);
  };

  const logoutUser = async () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('kriya_user');
    } catch {}
    showToast('Logged Out', 'You have been successfully logged out.', 'info');
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('kriya_admin_user');
    showToast('Signed Out', 'Admin session ended.', 'info');
  };

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('kriya_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('kriya_admin_user');
    }
  }, [adminUser]);

  const addProduct = (
    productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'> & { id?: string }
  ): Product => {
    const newId = productData.id || 'kriya-' + Date.now();
    const newProduct: Product = {
      ...productData,
      id: newId,
      rating: 5.0,
      reviewsCount: 1,
      reviews: [
        {
          id: 'rev_init_' + Date.now(),
          userName: 'KRIYA Admin',
          rating: 5,
          date: new Date().toISOString().split('T')[0],
          title: 'New Formulation',
          comment: 'Handcrafted botanical product added to store catalog.',
          verified: true
        }
      ]
    };

    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
    saveProductToSupabase(newProduct).catch((err) => console.warn('Supabase product save notice:', err));
    showToast('Product Added', `${newProduct.name} has been added to store catalog.`);
    return newProduct;
  };

  const updateProduct = (productId: string, productData: Partial<Product>) => {
    let updatedProductObj: Product | null = null;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          updatedProductObj = { ...p, ...productData };
          return updatedProductObj;
        }
        return p;
      })
    );
    if (updatedProductObj) {
      saveProductToSupabase(updatedProductObj).catch((err) => console.warn('Supabase product update notice:', err));
    }
    setSelectedProduct((prev) => (prev && prev.id === productId ? { ...prev, ...productData } : prev));
    showToast('Product Updated', 'Product details updated successfully.');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromSupabase(productId).catch((err) => console.warn('Supabase product delete notice:', err));
    setSelectedProduct((prev) => (prev && prev.id === productId ? null : prev));
    showToast('Product Deleted', 'Product removed from store catalog.', 'info');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (!orderId) return;
    setPastOrders((prev) =>
      prev.map((o) => {
        if ((o.id || '').toLowerCase() === (orderId || '').toLowerCase()) {
          return { ...o, status };
        }
        return o;
      })
    );
    showToast('Order Updated', `Order #${orderId} status set to ${status}.`);

    // Async status update in Supabase
    updateOrderStatusInSupabase(orderId, status).catch(() => {});
  };

  const [currentView, setCurrentViewInternal] = useState<ViewMode>('home');

  useEffect(() => {
     const path = location.pathname;
     if (path === '/') setCurrentViewInternal('home');
     else if (path === '/cart') setCurrentViewInternal('cart');
     else if (path === '/checkout') setCurrentViewInternal('checkout');
     else if (path === '/orders') setCurrentViewInternal('order-tracking');
     else if (path === '/wishlist') setCurrentViewInternal('wishlist');
     else if (path.startsWith('/admin')) setCurrentViewInternal('admin');
     else if (path === '/about') setCurrentViewInternal('about');
     else if (path === '/contact') setCurrentViewInternal('contact');
     else if (path === '/privacy') setCurrentViewInternal('privacy');
     else if (path === '/refund') setCurrentViewInternal('refund');
     else if (path === '/faq') setCurrentViewInternal('faq');
     else if (path.startsWith('/product/')) setCurrentViewInternal('product-detail');
     else if (path === '/products') setCurrentViewInternal('home');
  }, [location.pathname]);

  const setCurrentView = (view: ViewMode) => {
    setCurrentViewInternal(view);
    const routeMap: Record<string, string> = {
      'home': '/',
      'product-detail': selectedProduct ? `/product/${selectedProduct.id}` : '/products',
      'cart': '/cart',
      'checkout': '/checkout',
      'order-tracking': '/orders',
      'wishlist': '/wishlist',
      'admin': '/admin',
      'book-order': '/contact',
      'about': '/about',
      'contact': '/contact',
      'privacy': '/privacy',
      'refund': '/refund',
      'faq': '/faq'
    };
    if (routeMap[view] && location.pathname !== routeMap[view]) {
      navigate(routeMap[view]);
      window.scrollTo(0, 0);
    }
  };


  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState(10000);
  const [filterOnlyBestsellers, setFilterOnlyBestsellers] = useState(false);
  const [filterOnlyOrganic, setFilterOnlyOrganic] = useState(false);
  const [filterOnlyNew, setFilterOnlyNew] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSkinQuizOpen, setIsSkinQuizOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookOrderOpen, setIsBookOrderOpen] = useState(false);
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' | any = 'success') => {
    const id = Math.random().toString(36).substring(7);
    const newToast: ToastMessage = {
      id,
      title,
      description,
      type
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1, shade?: Shade) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedShade?.name === shade?.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedShade: shade || (product.shades ? product.shades[0] : undefined) }];
      }
    });

    showToast('Added to Botanical Cart', `${product.name} ${shade ? `(${shade.name})` : ''} has been added.`);
  };

  const removeFromCart = (productId: string, shadeName?: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedShade?.name === shadeName)));
    showToast('Item Removed', 'Product removed from cart.', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, shadeName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, shadeName);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedShade?.name === shadeName) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo('');
    setDiscountPercentage(0);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const isFav = wishlist.includes(productId);
    const product = products.find((p) => p.id === productId);
    if (isFav) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from Wishlist', `${product?.name || 'Item'} removed.`, 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Saved to Wishlist', `${product?.name || 'Item'} saved to your ritual collection.`);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Promo code
  const applyPromoCode = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (PROMO_CODES[formatted]) {
      setAppliedPromo(formatted);
      setDiscountPercentage(PROMO_CODES[formatted]);
      showToast('Discount Applied!', `Promo code ${formatted} saved ${(PROMO_CODES[formatted] * 100)}% on your order.`);
      return true;
    } else {
      showToast('Invalid Promo Code', 'Try KRIYA10 or WELCOME15 for special savings.', 'warning');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo('');
    setDiscountPercentage(0);
  };

  // Total calculation
  const getCartTotal = () => {
    const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const subtotal = Number(rawSubtotal.toFixed(2));
    const rawDiscount = subtotal * discountPercentage;
    const discount = Number(Math.min(subtotal, rawDiscount).toFixed(2));
    const subtotalAfterDiscount = Math.max(0, Number((subtotal - discount).toFixed(2)));

    const shipping = 0;
    const tax = 0;
    const total = Number(Math.max(0, subtotalAfterDiscount + shipping).toFixed(2));

    return { subtotal, discount, shipping, tax, total };
  };

  // Place Order
  const placeOrder = (
    address: ShippingAddress, 
    shippingMethod: 'standard' | 'express', 
    paymentMethod: string,
    customOrderId?: string
  ): Order => {
    const { subtotal, discount } = getCartTotal();
    const finalShipping = 0;
    const tax = 0;
    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const finalTotal = Number(Math.max(0, subtotalAfterDiscount + finalShipping).toFixed(2));

    const orderId = customOrderId || ('KRIYA-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000));
    const trackingNo = 'KR' + Math.floor(100000000 + Math.random() * 900000000) + 'IN';
    const payLink = `https://checkout.kriyacosmetics.com/pay/${orderId}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      shippingAddress: address,
      shippingMethod,
      shippingCost: finalShipping,
      subtotal,
      discount,
      tax,
      total: finalTotal,
      paymentMethod,
      status: 'Processing',
      trackingNumber: trackingNo,
      payLink
    };

    setPastOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setCurrentView('order-confirmation');

    // Save order to Supabase / local buffer
    const mainProduct = cart[0]?.product?.name || 'Cosmetic Ritual Order';
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    const itemsSummary = cart.map((ci, idx) => `${idx + 1}. ${ci.product.name} (Qty: ${ci.quantity}, Price: ₹${ci.product.price})`).join(' | ');

    const avgUnitPrice = totalQuantity > 0 ? Number((subtotal / totalQuantity).toFixed(2)) : finalTotal;

    // Fire and forget Supabase insert
    saveOrderToSupabase({
      id: newOrder.id,
      user_id: currentUser?.id || null,
      product_id: cart[0]?.product?.id || 'cart_order',
      customer_name: `${address.firstName} ${address.lastName}`.trim() || 'Valued Patron',
      customer_email: address.email.trim() || 'customer@kriyalifescience.com',
      user_email: address.email.trim() || currentUser?.email || 'customer@kriyalifescience.com',
      product_name: `${mainProduct}${cart.length > 1 ? ` (+${cart.length - 1} items)` : ''}`,
      category: cart[0]?.product?.category || 'Skincare',
      price: avgUnitPrice,
      total_price: finalTotal,
      quantity: totalQuantity,
      address: fullAddress,
      shipping_address: fullAddress,
      phone: address.phone.trim(),
      customer_phone: address.phone.trim(),
      shipping_method: shippingMethod,
      shipping_cost: finalShipping,
      payment_method: paymentMethod,
      payment_status: paymentMethod.toLowerCase().includes('card') ? 'Paid' : 'Pending',
      status: 'Pending',
      items: cart.map(c => ({ product_id: c.product.id, name: c.product.name, quantity: c.quantity, price: c.product.price, selectedShade: c.selectedShade?.name })),
      items_breakdown: itemsSummary,
      created_at: new Date().toISOString()
    }).catch(console.error);

    // Send complete order details to Formspree
    sendOrderToFormspree(newOrder).catch((err) => {
      console.warn('Formspree dispatch error:', err);
    });

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2C523B', '#8BAA91', '#E8F3E9', '#D1E0D4', '#3A5A40']
      });
    } catch {
      // safe fallback
    }

    return newOrder;
  };

  const findOrderById = (orderId: string) => {
    if (!orderId) return undefined;
    const target = (orderId || '').toLowerCase().trim();
    return pastOrders.find((o) => (o.id || '').toLowerCase() === target);
  };

  // Add Review
  const addReviewToProduct = (productId: string, userName: string, rating: number, title: string, comment: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newReview = {
            id: 'rev_' + Date.now(),
            userName,
            rating,
            date: new Date().toISOString().split('T')[0],
            title,
            comment,
            verified: true
          };
          const updatedReviews = [newReview, ...p.reviews];
          const avgRating = parseFloat(
            (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: avgRating
          };
        }
        return p;
      })
    );
    showToast('Review Submitted', 'Thank you for sharing your botanical experience!');
  };

  const deleteReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = p.reviews.filter((r) => r.id !== reviewId);
          const avgRating = updatedReviews.length > 0 
            ? parseFloat((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1))
            : 0;
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: avgRating
          };
        }
        return p;
      })
    );
    showToast('Review Deleted', 'The review has been removed.', 'info');
  };

  const [mediaList, setMediaList] = useState<VideoMedia[]>(() => {
    try {
      const saved = localStorage.getItem('kriya_showcase_videos');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_VIDEOS;
  });

  useEffect(() => {
    localStorage.setItem('kriya_showcase_videos', JSON.stringify(mediaList));
  }, [mediaList]);

  const addVideoMedia = (videoData: Omit<VideoMedia, 'id'>) => {
    const newVideo: VideoMedia = {
      ...videoData,
      id: 'video_' + Date.now()
    };
    setMediaList((prev) => [newVideo, ...prev]);
    showToast('Video Published', `"${newVideo.title}" is now live in the showcase.`);
  };

  const deleteVideoMedia = (videoId: string) => {
    setMediaList((prev) => prev.filter((v) => (v.id || v.src) !== videoId));
    showToast('Video Removed', 'The showcase video has been deleted.', 'info');
  };

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        currentView,
        selectedProduct,
        selectedCategory,
        searchQuery,
        sortBy,
        priceRange,
        filterOnlyBestsellers,
        filterOnlyOrganic,
        filterOnlyNew,
        isCartOpen,
        isSkinQuizOpen,
        isSearchOpen,
        isBookOrderOpen,
        activeOrder,
        pastOrders,
        toasts,
        appliedPromo,
        discountPercentage,

        mediaList,
        addVideoMedia,
        deleteVideoMedia,

        adminUser,
        isAdminLoggedIn: Boolean(adminUser && adminUser.role === 'admin'),
        setAdminUser,
        logoutAdmin,
        currentUser,
        loginUser,
        logoutUser,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,

        setCurrentView,
        setSelectedProduct,
        setSelectedCategory,
        setSearchQuery,
        setSortBy,
        setPriceRange,
        setFilterOnlyBestsellers,
        setFilterOnlyOrganic,
        setFilterOnlyNew,

        setIsCartOpen,
        setIsSkinQuizOpen,
        setIsSearchOpen,
        setIsBookOrderOpen,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        findOrderById,
        addReviewToProduct,
        deleteReview,
        showToast,
        removeToast,
        viewProductDetails,
        getCartTotal
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
