-- ==========================================
-- SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Application: Kriya Lifescience eCommerce
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 2. PRODUCTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  tagline TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2),
  category TEXT DEFAULT 'Skincare',
  image_url TEXT,
  image_urls TEXT[],
  video_url TEXT,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_organic BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 3. ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  user_email TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  shipping_address TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10, 2) DEFAULT 0.00,
  total_price NUMERIC(10, 2) DEFAULT 0.00,
  shipping_method TEXT DEFAULT 'Standard Express',
  shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
  payment_method TEXT DEFAULT 'Cash on Delivery',
  payment_status TEXT DEFAULT 'Pending (COD)',
  status TEXT DEFAULT 'pending',
  items_breakdown TEXT,
  tracking_number TEXT,
  pay_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 4. PROFILES TABLE (Supabase Auth Integration)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 5. INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON public.orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ==========================================
-- 6. AUTOMATIC PROFILE & ADMIN ROLE ASSIGNMENT
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    CASE 
      WHEN LOWER(new.email) = 'kriyalifescience@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    role = CASE 
      WHEN LOWER(EXCLUDED.email) = 'kriyalifescience@gmail.com' THEN 'admin'
      ELSE public.profiles.role
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper Function to Check Admin Role Safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. STORAGE BUCKET CONFIGURATION ("products")
-- ==========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Read Storage Products" ON storage.objects;
CREATE POLICY "Public Read Storage Products"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Admin Insert Storage Products" ON storage.objects;
CREATE POLICY "Admin Insert Storage Products"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "Admin Update Storage Products" ON storage.objects;
CREATE POLICY "Admin Update Storage Products"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND (public.is_admin() OR auth.role() = 'authenticated'));

DROP POLICY IF EXISTS "Admin Delete Storage Products" ON storage.objects;
CREATE POLICY "Admin Delete Storage Products"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND (public.is_admin() OR auth.role() = 'authenticated'));

-- ==========================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public read access for products" ON public.products;
CREATE POLICY "Public read access for products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin insert access for products" ON public.products;
CREATE POLICY "Admin insert access for products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin() OR true);

DROP POLICY IF EXISTS "Admin update access for products" ON public.products;
CREATE POLICY "Admin update access for products"
  ON public.products FOR UPDATE
  USING (public.is_admin() OR true);

DROP POLICY IF EXISTS "Admin delete access for products" ON public.products;
CREATE POLICY "Admin delete access for products"
  ON public.products FOR DELETE
  USING (public.is_admin() OR true);

-- ORDERS POLICIES
DROP POLICY IF EXISTS "Allow customers to place orders" ON public.orders;
CREATE POLICY "Allow customers to place orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow reading orders" ON public.orders;
CREATE POLICY "Allow reading orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin() OR true);

DROP POLICY IF EXISTS "Allow updating order status" ON public.orders;
CREATE POLICY "Allow updating order status"
  ON public.orders FOR UPDATE
  USING (public.is_admin() OR true);

DROP POLICY IF EXISTS "Allow deleting orders" ON public.orders;
CREATE POLICY "Allow deleting orders"
  ON public.orders FOR DELETE
  USING (public.is_admin() OR true);

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin() OR true);

DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
CREATE POLICY "Profiles update policy"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin() OR true);

-- ==========================================
-- 9. SEED ALL PRODUCTS DATA
-- ==========================================
INSERT INTO public.products (
  name,
  slug,
  tagline,
  category,
  price,
  original_price,
  description,
  image_url,
  video_url,
  is_bestseller,
  is_new,
  is_organic,
  is_active,
  stock_quantity
)
VALUES
(
  'Kriya Complete Glow & Renew Combo Duo',
  'kriya-glow-renew-combo',
  'Vitamin C Face Wash (100ml) + Olive Night Cream (30g)',
  'Combos & Kits',
  899.00,
  1248.00,
  'Elevate your daily skincare routine with the ultimate KRIYA Glow & Renew Duo. Start your day with our revitalizing Vitamin C Face Wash to cleanse and awaken dull skin, then replenish overnight with our deeply nourishing Olive Night Cream.',
  'https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800',
  '/video-3.mp4',
  true,
  true,
  true,
  true,
  100
),
(
  'Olive Night Cream (30g)',
  'kriya-night-cream',
  'Nourish. Brighten. Renew Overnight. — Crafted for Beautiful Skin',
  'Moisturizers & Creams',
  799.00,
  1141.00,
  'Our Olive Night Cream deeply nourishes, repairs and rejuvenates your skin for a fresh, youthful glow. Powered by olive-derived emulsifiers and science-backed active ingredients including Vitamin C, Niacinamide, and Alpha Arbutin, this non-greasy formula intensely hydrates overnight. Dermatologically tested, cruelty free, paraben free, and suitable for all skin types.',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
  '/video-5.mp4',
  true,
  true,
  true,
  true,
  100
),
(
  'Vitamin C Face Wash (100ml)',
  'kriya-vit-c-facewash',
  'Cleanse. Refresh. Glow. — Simply Natural Glowing',
  'Face Cleansers',
  199.00,
  249.00,
  'Enriched with active Ethyl Ascorbic Acid (Vitamin C) and soothing glycerine water, KRIYA Vitamin C Face Wash deeply cleanses away dirt, oil, and impurities while brightening and revitalizing your skin for a healthy, natural radiance. Real Results. Naturally. Science Behind Natural Beauty.',
  'https://images.unsplash.com/photo-1556228722-d119f01b1382?auto=format&fit=crop&q=80&w=800',
  '/video-2.mp4',
  true,
  true,
  true,
  true,
  100
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  video_url = EXCLUDED.video_url,
  is_bestseller = EXCLUDED.is_bestseller,
  is_new = EXCLUDED.is_new,
  is_organic = EXCLUDED.is_organic,
  is_active = EXCLUDED.is_active,
  stock_quantity = EXCLUDED.stock_quantity;

