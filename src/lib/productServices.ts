import { supabase } from './supabaseClient';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: string | null;
  is_active: boolean;
  images: string[];
  created_at: string;
}

export const productServices = {
  /**
   * Fetch all active products
   */
  async getActiveProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Notice querying active products from Supabase:', error.message);
        return [];
      }
      return (data as Product[]) || [];
    } catch {
      return [];
    }
  },

  /**
   * Fetch a single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        console.warn('Notice querying product by slug from Supabase:', error.message);
        return null;
      }
      return data as Product | null;
    } catch {
      return null;
    }
  },

  /**
   * Fetch all products
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Notice querying all products from Supabase:', error.message);
        return [];
      }
      return (data as Product[]) || [];
    } catch {
      return [];
    }
  }
};


