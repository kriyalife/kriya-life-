const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hojixnilttishopaeljo.supabase.co', 'sb_publishable_f5-zow_Mr67jRk_b6gdNpg_3bUUHIAs');

const isUuid = (val) => !!val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

async function run() {
  const newOrder = {
    id: `KRIYA-2026-999999`,
    customer_name: 'Test Customer New',
    customer_email: 'testnew@example.com',
    user_email: 'testnew@example.com',
    phone: '1234567890',
    address: 'New Address',
    shipping_address: 'New Address',
    product_name: 'Vitamin C Face Wash (100ml)',
    quantity: 1,
    price: 199,
    total_price: 199,
    shipping_method: 'Standard Express',
    shipping_cost: 0,
    payment_method: 'Cash on Delivery',
    payment_status: 'Pending (COD)',
    status: 'pending',
    items_breakdown: '...',
    created_at: new Date().toISOString()
  };

  const primaryPayload = { ...newOrder };
  if (!isUuid(newOrder.id)) delete primaryPayload.id;

  console.log('Inserting...', primaryPayload);
  const { data, error } = await supabase.from('orders').insert([primaryPayload]).select();
  console.log('Result:', data, error);
}
run();
