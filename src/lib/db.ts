import { supabase } from './supabaseClient';
import { PRODUCTS } from '../data/products';

export interface OrderRecord {
  id?: string;
  user_id?: string | null;
  product_id?: string;
  customer_name?: string;
  customer_email?: string;
  user_email?: string;
  email?: string;
  phone?: string;
  customer_phone?: string;
  product_name?: string;
  category?: string;
  price?: number;
  total_price?: number;
  quantity?: number;
  created_at?: string;
  address?: string;
  shipping_address?: string;
  shipping_method?: string;
  shipping_cost?: number;
  payment_method?: string;
  payment_status?: string;
  status?: string;
  items?: any;
  items_breakdown?: string;
  tracking_number?: string;
  pay_link?: string;
}

const LOCAL_ORDERS_KEY = 'kriya_local_orders';
const DELETED_ORDERS_KEY = 'kriya_deleted_orders';

export const getDeletedOrderIds = (): string[] => {
  try {
    const data = localStorage.getItem(DELETED_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getLocalOrders = (): OrderRecord[] => {
  try {
    const data = localStorage.getItem(LOCAL_ORDERS_KEY);
    const parsed: OrderRecord[] = data ? JSON.parse(data) : [];
    const deletedIds = getDeletedOrderIds();
    return parsed.filter(o => o.id && !deletedIds.includes(o.id));
  } catch {
    return [];
  }
};

export const getOrders = async (): Promise<OrderRecord[] | null> => {
  const deletedIds = getDeletedOrderIds();
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      const local = getLocalOrders();
      return local.filter(o => o.id && !deletedIds.includes(o.id));
    }
    const filtered = data.filter((o: any) => o.id && !deletedIds.includes(o.id));
    return filtered;
  } catch (err) {
    console.warn('Supabase getOrders exception, using local orders:', err);
    const local = getLocalOrders();
    return local.filter(o => o.id && !deletedIds.includes(o.id));
  }
};

export const fetchOrdersFromSupabase = async (): Promise<OrderRecord[]> => {
  const orders = await getOrders();
  return orders || getLocalOrders();
};

const isUuid = (val?: string | null): boolean =>
  !!val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export const saveOrderToSupabase = async (order: Partial<OrderRecord>) => {
  const existing = getLocalOrders();
  const qty = order.quantity || 1;
  const unitPrice = order.price && order.total_price && order.price === order.total_price && qty > 1
    ? order.price / qty
    : (order.price || (order.total_price ? order.total_price / qty : 0));
  const totalPrice = order.total_price || Number((unitPrice * qty).toFixed(2));
  const custEmail = order.customer_email || order.user_email || order.email || 'customer@kriyalifescience.com';
  const custName = order.customer_name || 'Valued Customer';
  const phone = order.phone || order.customer_phone || '';
  const addr = order.address || order.shipping_address || 'India';

  const newOrder: OrderRecord = {
    id: order.id || `KRIYA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    user_id: order.user_id || null,
    product_id: order.product_id || order.product_name,
    product_name: order.product_name || 'Botanical Product',
    customer_name: custName,
    customer_email: custEmail,
    user_email: custEmail,
    email: custEmail,
    category: order.category || 'Skincare',
    price: Number(unitPrice.toFixed(2)),
    quantity: qty,
    total_price: Number(totalPrice.toFixed(2)),
    address: addr,
    shipping_address: addr,
    phone: phone,
    customer_phone: phone,
    shipping_method: order.shipping_method || 'Standard Express',
    shipping_cost: order.shipping_cost || 0,
    payment_method: order.payment_method || 'Cash on Delivery',
    created_at: order.created_at || new Date().toISOString(),
    status: order.status || 'pending',
    payment_status: order.payment_status || 'Pending (COD)',
    items: order.items || null,
    items_breakdown: order.items_breakdown || `${order.product_name || 'Botanical Product'} (Qty: ${qty})`,
    tracking_number: order.tracking_number || '',
    pay_link: order.pay_link || ''
  };

  // Always store locally first for instant UX
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([newOrder, ...existing.filter(o => o.id !== newOrder.id)]));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }

  // 1. Prepare clean primary payload for Supabase
  const primaryPayload: Record<string, any> = {
    customer_name: newOrder.customer_name,
    customer_email: newOrder.customer_email,
    user_email: newOrder.user_email,
    phone: newOrder.phone,
    address: newOrder.address,
    shipping_address: newOrder.shipping_address,
    product_name: newOrder.product_name,
    quantity: newOrder.quantity,
    price: newOrder.price,
    total_price: newOrder.total_price,
    shipping_method: newOrder.shipping_method,
    shipping_cost: newOrder.shipping_cost,
    payment_method: newOrder.payment_method,
    payment_status: newOrder.payment_status,
    status: newOrder.status?.toLowerCase() || 'pending',
    items_breakdown: newOrder.items_breakdown,
    created_at: newOrder.created_at
  };

  // Only pass UUIDs to UUID columns
  if (isUuid(newOrder.id)) {
    primaryPayload.id = newOrder.id;
  }
  if (isUuid(newOrder.product_id)) {
    primaryPayload.product_id = newOrder.product_id;
  }
  if (isUuid(newOrder.user_id)) {
    primaryPayload.user_id = newOrder.user_id;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([primaryPayload])
      .select();

    if (!error) {
      console.log('Successfully inserted order into Supabase orders table:', data);
      return;
    }

    console.warn('Supabase primary order insert notice:', error.message, '— retrying with standard schema...');

    // Fallback 1: Standard requested schema (customer_name, phone, email, address, product_id/name, quantity, status)
    const secondaryPayload: Record<string, any> = {
      customer_name: newOrder.customer_name,
      phone: newOrder.phone,
      email: newOrder.customer_email,
      address: newOrder.address,
      quantity: newOrder.quantity,
      status: newOrder.status?.toLowerCase() || 'pending',
      created_at: newOrder.created_at
    };
    if (isUuid(newOrder.product_id)) {
      secondaryPayload.product_id = newOrder.product_id;
    }

    const { error: err2 } = await supabase.from('orders').insert([secondaryPayload]);
    if (!err2) {
      console.log('Successfully saved order to Supabase orders table with secondary schema!');
      return;
    }

    console.warn('Supabase secondary order insert notice:', err2.message, '— retrying minimal payload...');

    // Fallback 2: Basic minimal payload
    const minimalPayload: Record<string, any> = {
      customer_name: newOrder.customer_name,
      phone: newOrder.phone,
      address: newOrder.address,
      quantity: newOrder.quantity,
      status: 'pending'
    };

    const { error: err3 } = await supabase.from('orders').insert([minimalPayload]);
    if (err3) {
      console.error('All Supabase order insertion attempts encountered schema notices:', err3.message);
    } else {
      console.log('Successfully saved order to Supabase orders table with minimal schema!');
    }
  } catch (err) {
    console.warn('Supabase order insert exception:', err);
  }
};

export const updateOrderStatusInSupabase = async (id: string, status: string): Promise<void> => {
  const existing = getLocalOrders();
  const updated = existing.map((o) => (o.id === id ? { ...o, status } : o));
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update order status in localStorage', e);
  }

  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      console.warn('Notice updating order status in Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Supabase update order status exception:', err);
  }
};

export const deleteOrderFromSupabase = async (id: string, fullOrder?: Partial<OrderRecord>): Promise<void> => {
  if (!id) return;

  // Mark as seeded so autoSeed doesn't re-add deleted orders
  try {
    localStorage.setItem('kriya_has_seeded_orders', 'true');
  } catch {}

  // Add to deleted set
  try {
    const deleted = getDeletedOrderIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_ORDERS_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Failed to update deleted order ids in localStorage', e);
  }

  // Remove from local storage kriya_local_orders
  try {
    const existing = getLocalOrders();
    const updated = existing.filter((o) => o.id !== id);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete order from localStorage', e);
  }

  // Remove from kriya_orders (ShopContext storage)
  try {
    const shopOrdersRaw = localStorage.getItem('kriya_orders');
    if (shopOrdersRaw) {
      const shopOrders = JSON.parse(shopOrdersRaw);
      if (Array.isArray(shopOrders)) {
        const filteredShop = shopOrders.filter((o: any) => o.id !== id);
        localStorage.setItem('kriya_orders', JSON.stringify(filteredShop));
      }
    }
  } catch (e) {
    console.error('Failed to update kriya_orders in localStorage', e);
  }

  // Delete from Supabase
  try {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) {
      console.warn('Notice deleting order from Supabase by id:', error.message);
      if (fullOrder?.customer_email && fullOrder?.created_at) {
        await supabase
          .from('orders')
          .delete()
          .eq('customer_email', fullOrder.customer_email)
          .eq('created_at', fullOrder.created_at);
      }
    }
  } catch (err) {
    console.warn('Supabase delete order exception:', err);
  }
};

export const fetchProductsFromSupabase = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.warn('Notice fetching products from Supabase:', error.message);
      return [];
    }
    if (!data || data.length === 0) return [];

    return data.map((row: any) => {
      const prodId = row.slug || row.id || `prod_${Date.now()}`;
      const defaultProd = PRODUCTS.find((p) => p.id === prodId || p.id === row.slug);

      let rawImages: string[] = Array.isArray(row.image_urls) && row.image_urls.length > 0
        ? row.image_urls
        : (row.image_url ? [row.image_url] : []);

      let images: string[] = rawImages.map((imgUrl, idx) => {
        if (!imgUrl || typeof imgUrl !== 'string') return '';
        let cleanUrl = imgUrl.trim();
        if (cleanUrl.startsWith('data:image/svg+xml;utf8,')) {
          cleanUrl = 'data:image/svg+xml;charset=utf-8,' + cleanUrl.slice('data:image/svg+xml;utf8,'.length);
        }
        // If it's a dev path (/src/assets/, @fs/, blob:) replace with default product image if available
        if (cleanUrl.startsWith('/src/assets/') || cleanUrl.startsWith('@fs/') || cleanUrl.startsWith('blob:')) {
          if (defaultProd && defaultProd.images && defaultProd.images[idx]) {
            return defaultProd.images[idx];
          }
          if (defaultProd && defaultProd.images && defaultProd.images[0]) {
            return defaultProd.images[0];
          }
          cleanUrl = cleanUrl.replace('/src/assets/images/', '/images/').replace('/src/assets/', '/');
        }
        return cleanUrl;
      }).filter(Boolean);

      if (images.length === 0 && defaultProd && defaultProd.images) {
        images = defaultProd.images;
      }
      if (images.length === 0) {
        images = ['https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800'];
      }

      let media = Array.isArray(row.media) && row.media.length > 0 ? row.media : images.map((url) => ({
        type: url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image',
        src: url
      }));
      
      // If row.media is absent, preserve videos from defaultProd.media
      if ((!Array.isArray(row.media) || row.media.length === 0) && defaultProd && Array.isArray(defaultProd.media)) {
        const defaultVideos = defaultProd.media.filter(m => m.type === 'video');
        media = [...media, ...defaultVideos];
      }

      return {
        id: String(prodId),
        name: row.name || defaultProd?.name || 'Botanical Product',
        tagline: row.tagline || defaultProd?.tagline || 'Handcrafted Organic Formulation',
        category: row.category || defaultProd?.category || 'Face Cleansers',
        price: Number(row.price || defaultProd?.price || 0),
        originalPrice: row.original_price ? Number(row.original_price) : defaultProd?.originalPrice,
        rating: Number(row.rating || defaultProd?.rating || 5.0),
        reviewsCount: Number(row.reviews_count || defaultProd?.reviewsCount || 1),
        isBestseller: Boolean(row.is_bestseller ?? defaultProd?.isBestseller),
        isNew: Boolean(row.is_new ?? defaultProd?.isNew),
        isOrganic: row.is_organic !== undefined ? Boolean(row.is_organic) : (defaultProd?.isOrganic ?? true),
        description: row.description || defaultProd?.description || `${row.name || 'Botanical Product'} - Handcrafted organic formulation.`,
        ingredients: Array.isArray(row.ingredients) && row.ingredients.length > 0 ? row.ingredients : (defaultProd?.ingredients || ['DM Water', 'Kumkumadi Oil', 'Saffron Extract']),
        howToUse: row.how_to_use || defaultProd?.howToUse || 'Apply gently onto cleansed face.',
        volume: row.volume || defaultProd?.volume || '30g',
        images,
        media,
        inStock: row.is_active !== false && (row.stock_quantity === undefined || row.stock_quantity > 0) && row.in_stock !== false,
        skinTypes: Array.isArray(row.skin_types) && row.skin_types.length > 0 ? row.skin_types : (defaultProd?.skinTypes || ['All Skin Types']),
        reviews: Array.isArray(row.reviews) ? row.reviews : (defaultProd?.reviews || [])
      };
    });
  } catch (err) {
    console.warn('Exception fetching products from Supabase:', err);
    return [];
  }
};

export const saveProductToSupabase = async (product: any): Promise<void> => {
  const prodSlug = product.id;

  const primaryPayload: Record<string, any> = {
    slug: prodSlug,
    name: product.name,
    tagline: product.tagline || '',
    category: product.category || 'Face Cleansers',
    price: product.price,
    original_price: product.originalPrice || null,
    volume: product.volume || '30g',
    description: product.description || '',
    image_url: product.images?.[0] || '',
    image_urls: product.images || [],
    video_url: product.media?.find((m: any) => m.type === 'video')?.src || '',
    is_bestseller: Boolean(product.isBestseller),
    is_organic: Boolean(product.isOrganic ?? true),
    is_new: Boolean(product.isNew),
    is_active: product.inStock !== false,
    stock_quantity: product.inStock ? 100 : 0,
    rating: product.rating || 5.0,
    reviews_count: product.reviewsCount || 1,
    ingredients: product.ingredients || [],
    how_to_use: product.howToUse || '',
    skin_types: product.skinTypes || [],
    reviews: product.reviews || []
  };

  if (isUuid(product.id)) {
    primaryPayload.id = product.id;
  }

  try {
    const { error } = await supabase.from('products').upsert(primaryPayload, { onConflict: 'slug' });
    if (!error) {
      console.log('Successfully saved/updated product in Supabase products table!');
      return;
    }

    console.warn('Primary product upsert notice:', error.message, '— trying fallback update/insert...');

    const { data: updateRes, error: updateErr } = await supabase
      .from('products')
      .update(primaryPayload)
      .eq('slug', prodSlug)
      .select();

    if (!updateErr && updateRes && updateRes.length > 0) {
      console.log('Successfully updated product in Supabase by slug!');
      return;
    }

    const secondaryPayload: Record<string, any> = {
      slug: prodSlug,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock_quantity: product.inStock ? 50 : 0,
      is_active: product.inStock !== false,
      image_url: product.images?.[0] || '',
      image_urls: product.images || []
    };

    const { error: insertErr } = await supabase.from('products').insert([secondaryPayload]);
    if (!insertErr) {
      console.log('Successfully saved product to Supabase with secondary payload!');
    } else {
      console.warn('Notice saving product to Supabase:', insertErr.message);
    }
  } catch (err) {
    console.warn('Exception saving product to Supabase:', err);
  }
};

export const deleteProductFromSupabase = async (productId: string): Promise<void> => {
  try {
    const { error: err1 } = await supabase.from('products').delete().eq('slug', productId);
    if (err1) {
      await supabase.from('products').delete().eq('id', productId);
    }
  } catch (err) {
    console.warn('Exception deleting product from Supabase:', err);
  }
};


