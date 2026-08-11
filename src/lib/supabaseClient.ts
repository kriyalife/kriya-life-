import { createClient } from '@supabase/supabase-js';

const sanitizeSupabaseUrl = (rawUrl?: string): string => {
  let url = (rawUrl || 'https://hojixnilttishopaeljo.supabase.co').trim();
  url = url.replace(/\/rest\/v1\/?$/i, '').replace(/\/auth\/v1\/?$/i, '').replace(/\/+$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}.supabase.co`;
  }
  return url;
};

export const getSupabaseConfig = () => {
  let customUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('kriya_supabase_url') : null;
  let customKey = typeof localStorage !== 'undefined' ? localStorage.getItem('kriya_supabase_anon_key') : null;

  const envUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://hojixnilttishopaeljo.supabase.co';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_f5-zow_Mr67jRk_b6gdNpg_3bUUHIAs';

  const url = sanitizeSupabaseUrl(customUrl || envUrl);
  const anonKey = (customKey || envKey).trim();
  const isCustom = Boolean(customUrl || customKey);

  return { url, anonKey, isCustom };
};

const config = getSupabaseConfig();

export let supabase = createClient(config.url, config.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    timeout: 20000,
  }
});

export const updateSupabaseCredentials = (url: string, anonKey: string) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('kriya_supabase_url', url.trim());
    localStorage.setItem('kriya_supabase_anon_key', anonKey.trim());
  }
  const newConfig = getSupabaseConfig();
  supabase = createClient(newConfig.url, newConfig.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
    realtime: { timeout: 20000 }
  });
  return newConfig;
};

export const resetSupabaseCredentials = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('kriya_supabase_url');
    localStorage.removeItem('kriya_supabase_anon_key');
  }
  const newConfig = getSupabaseConfig();
  supabase = createClient(newConfig.url, newConfig.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
    realtime: { timeout: 20000 }
  });
  return newConfig;
};

export interface SupabaseConnectionStatus {
  connected: boolean;
  latencyMs: number;
  url: string;
  productsCount: number | null;
  ordersCount: number | null;
  error: string | null;
}

export const testSupabaseConnection = async (): Promise<SupabaseConnectionStatus> => {
  const startTime = Date.now();
  const currentConfig = getSupabaseConfig();
  try {
    const { count: productsCount, error: prodErr } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const latencyMs = Date.now() - startTime;

    if (prodErr) {
      // Try querying orders as secondary check
      const { count: ordersCount, error: orderErr } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (orderErr) {
        return {
          connected: false,
          latencyMs,
          url: currentConfig.url,
          productsCount: null,
          ordersCount: null,
          error: `Table query notice: ${prodErr.message} | ${orderErr.message}`
        };
      }

      return {
        connected: true,
        latencyMs,
        url: currentConfig.url,
        productsCount: null,
        ordersCount: ordersCount ?? 0,
        error: null
      };
    }

    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    return {
      connected: true,
      latencyMs,
      url: currentConfig.url,
      productsCount: productsCount ?? 0,
      ordersCount: ordersCount ?? 0,
      error: null
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - startTime,
      url: currentConfig.url,
      productsCount: null,
      ordersCount: null,
      error: err?.message || 'Connection timeout or network failure'
    };
  }
};







