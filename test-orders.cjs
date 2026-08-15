const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hojixnilttishopaeljo.supabase.co', 'sb_publishable_f5-zow_Mr67jRk_b6gdNpg_3bUUHIAs');
async function run() {
  const { data, error } = await supabase.from('orders').select('*');
  console.log('data:', data);
  console.log('error:', error);
}
run();
