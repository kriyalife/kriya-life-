require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl) process.exit(1);

const rawUrl = supabaseUrl || 'https://fjxmeqvtdseamgzsazxk.supabase.co';
const correctUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

const supabase = createClient(correctUrl, supabaseKey);
(async () => {
  const { data, error } = await supabase.from('orders').delete().neq('id', '0');
  console.log('Delete result:', error);
})();
