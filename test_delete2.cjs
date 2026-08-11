require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const rawUrl = supabaseUrl || 'https://fjxmeqvtdseamgzsazxk.supabase.co';
const correctUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

const supabase = createClient(correctUrl, supabaseKey);
(async () => {
  const { data, error } = await supabase.from('orders').delete().eq('id', '11111111-1111-1111-1111-111111111111');
  console.log('Delete result:', error);
})();
