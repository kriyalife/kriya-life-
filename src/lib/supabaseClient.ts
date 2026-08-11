import { createClient } from '@supabase/supabase-js';

const sanitizeSupabaseUrl = (rawUrl?: string): string => {
  let url = (rawUrl || 'https://hojixnilttishopaeljo.supabase.co').trim();
  url = url.replace(/\/rest\/v1\/?$/i, '').replace(/\/auth\/v1\/?$/i, '').replace(/\/+$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}.supabase.co`;
  }
  return url;
};

const supabaseUrl = sanitizeSupabaseUrl(
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://hojixnilttishopaeljo.supabase.co'
);

const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_f5-zow_Mr67jRk_b6gdNpg_3bUUHIAs'
).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    timeout: 20000,
  }
});






