import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hojixnilttishopaeljo.supabase.co';
const supabaseKey = 'sb_publishable_f5-zow_Mr67jRk_b6gdNpg_3bUUHIAs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: existingData, error: fetchErr } = await supabase.from('products').select('*');
  if (fetchErr) return console.error(fetchErr);
  
  const product = existingData.find((p: any) => p.slug === 'kriya-vit-c-facewash' || p.id === 'kriya-vit-c-facewash');
  if (product) {
    let imageUrls = product.image_urls || [];
    
    // Set first image
    imageUrls = ['/images/facewash3.jpeg', '/images/facewash1.jpeg', '/images/facewash2.jpeg', ...imageUrls.slice(3)];
    
    await supabase.from('products').update({
      image_url: '/images/facewash3.jpeg',
      image_urls: imageUrls
    }).eq('id', product.id); 
    console.log('Database gallery updated for face wash');
  }
}
run();
