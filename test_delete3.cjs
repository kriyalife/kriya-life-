require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const rawUrl = 'https://fjxmeqvtdseamgzsazxk.supabase.co';
const correctUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseKey = 'sb_publishable_NiK8giMC7PCfebshFm_7aQ_XjR4cyB1';

const supabase = createClient(correctUrl, supabaseKey);
(async () => {
  const { data, error } = await supabase.from('orders').select('*');
  console.log('Orders:', data, error);
  if (data && data.length > 0) {
    const { data: d2, error: e2 } = await supabase.from('orders').delete().eq('id', data[0].id);
    console.log('Delete result:', e2);
  }
})();
