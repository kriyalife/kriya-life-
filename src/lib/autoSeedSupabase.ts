import { supabase } from './supabaseClient';
import { PRODUCTS } from '../data/products';

let seedTriggered = false;

export async function autoSeedSupabase() {
  if (seedTriggered) return;
  seedTriggered = true;

  try {
    // 1. Auto-seed Products into Supabase if empty
    const { data: existingProducts, error: prodErr } = await supabase
      .from('products')
      .select('id, name, slug');

    if (!prodErr && (!existingProducts || existingProducts.length === 0)) {
      console.log('Supabase products table is empty. Auto-seeding catalog...');
      const productRows = PRODUCTS.map((p) => ({
        name: p.name,
        slug: p.id,
        tagline: p.tagline || '',
        category: p.category || 'Skincare',
        price: p.price,
        original_price: p.originalPrice || null,
        description: p.description || '',
        image_url: p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800',
        image_urls: p.images || [],
        video_url: p.media?.find((m) => m.type === 'video')?.src || '',
        is_bestseller: p.isBestseller || false,
        is_new: p.isNew || false,
        is_organic: p.isOrganic ?? true,
        is_active: true,
        stock_quantity: 100
      }));

      const { error: insertProdErr } = await supabase.from('products').upsert(productRows, { onConflict: 'slug' });
      if (insertProdErr) {
        console.warn('Notice batch seeding products to Supabase, attempting individual rows:', insertProdErr.message);
        for (const row of productRows) {
          try {
            await supabase.from('products').insert([row]);
          } catch {}
        }
      } else {
        console.log('Successfully auto-seeded all products into Supabase products table!');
      }
    }

    // 2. Auto-seed Orders into Supabase if empty
    const { data: existingOrders, error: orderErr } = await supabase
      .from('orders')
      .select('id');

    if (!orderErr && (!existingOrders || existingOrders.length === 0)) {
      console.log('Supabase orders table is empty. Auto-seeding initial orders...');
      const sampleOrders = [
        {
          customer_name: 'Meet Dave',
          customer_email: 'meetdave3640@gmail.com',
          user_email: 'meetdave3640@gmail.com',
          phone: '+91 98765 43210',
          address: 'G-4, Silver Heights, CG Road, Ahmedabad, Gujarat 380009',
          shipping_address: 'G-4, Silver Heights, CG Road, Ahmedabad, Gujarat 380009',
          product_name: 'Kriya Complete Glow & Renew Combo Duo',
          quantity: 1,
          price: 899.00,
          total_price: 899.00,
          shipping_method: 'Standard Express',
          shipping_cost: 0,
          payment_method: 'Cash on Delivery',
          payment_status: 'Pending (COD)',
          status: 'pending',
          items_breakdown: '1. Kriya Complete Glow & Renew Combo Duo | Qty: 1 | Unit: ₹899 | Total: ₹899',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          customer_name: 'Ananya Sharma',
          customer_email: 'ananya.sharma@example.com',
          user_email: 'ananya.sharma@example.com',
          phone: '+91 98234 56789',
          address: 'B-202 Lotus Park, Bandra West, Mumbai, Maharashtra 400050',
          shipping_address: 'B-202 Lotus Park, Bandra West, Mumbai, Maharashtra 400050',
          product_name: 'Olive Night Cream (30g)',
          quantity: 2,
          price: 799.00,
          total_price: 1598.00,
          shipping_method: 'Standard Express',
          shipping_cost: 0,
          payment_method: 'UPI / Online',
          payment_status: 'Paid',
          status: 'confirmed',
          items_breakdown: '1. Olive Night Cream (30g) | Qty: 2 | Unit: ₹799 | Total: ₹1598',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          customer_name: 'Rohan Verma',
          customer_email: 'rohan.verma@example.com',
          user_email: 'rohan.verma@example.com',
          phone: '+91 97112 34567',
          address: '14/B Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103',
          shipping_address: '14/B Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103',
          product_name: 'Vitamin C Face Wash (100ml)',
          quantity: 3,
          price: 199.00,
          total_price: 597.00,
          shipping_method: 'Standard Express',
          shipping_cost: 0,
          payment_method: 'Cash on Delivery',
          payment_status: 'Pending (COD)',
          status: 'shipped',
          items_breakdown: '1. Vitamin C Face Wash (100ml) | Qty: 3 | Unit: ₹199 | Total: ₹597',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];

      const { error: insertOrderErr } = await supabase.from('orders').insert(sampleOrders);
      if (insertOrderErr) {
        console.warn('Notice seeding sample orders to Supabase:', insertOrderErr.message);
      } else {
        console.log('Successfully auto-seeded initial sample orders into Supabase orders table!');
      }
    }
  } catch (err) {
    console.warn('Auto seed Supabase exception:', err);
  }
}
