const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hojixnilttishopaeljo.supabase.co', 'sb_publishable_f5-zow_Mr67jRk_b6gdNpg_3bUUHIAs');
async function run() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  console.log('Orders in Supabase:', data?.length);
}
run();
