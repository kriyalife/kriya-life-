require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('No supabase credentials');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);
(async () => {
  const { data, error } = await supabase.from('orders').update({ status: 'Completed' }).neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Update result:', data, error);
})();
