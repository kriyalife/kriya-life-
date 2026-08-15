import React, { useState, useEffect } from 'react';
import { 
  getFormspreeId, 
  saveFormspreeId, 
  getPreorderFormspreeId,
  savePreorderFormspreeId,
  sendTestNotificationToFormspree, 
  DEFAULT_FORMSPREE_ID, 
  DEFAULT_PREORDER_FORMSPREE_ID,
  getFormspreeEndpoint,
  getPreorderFormspreeEndpoint
} from '../../lib/formspree';
import { useShop } from '../../context/ShopContext';
import { 
  getSupabaseConfig, 
  updateSupabaseCredentials, 
  resetSupabaseCredentials, 
  testSupabaseConnection,
  SupabaseConnectionStatus 
} from '../../lib/supabaseClient';
import { autoSeedSupabase } from '../../lib/autoSeedSupabase';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  FileText, 
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Database,
  ShieldAlert,
  Zap,
  KeyRound,
  Layers,
  Activity
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [formspreeId, setFormspreeIdState] = useState(getFormspreeId());
  const [preorderFormspreeId, setPreorderFormspreeIdState] = useState(getPreorderFormspreeId());
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPreorder, setCopiedPreorder] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase state
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const [customUrlInput, setCustomUrlInput] = useState(supabaseConfig.url);
  const [customKeyInput, setCustomKeyInput] = useState(supabaseConfig.anonKey);
  const [dbStatus, setDbStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [testingDb, setTestingDb] = useState(false);
  const [seedingDb, setSeedingDb] = useState(false);

  const { showToast } = useShop();

  useEffect(() => {
    runDbCheck();
  }, []);

  const runDbCheck = async () => {
    setTestingDb(true);
    const result = await testSupabaseConnection();
    setDbStatus(result);
    setTestingDb(false);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim() || !customKeyInput.trim()) {
      showToast('Invalid Credentials', 'Please enter a valid Supabase URL and Anon Key.', 'error');
      return;
    }
    const updated = updateSupabaseCredentials(customUrlInput, customKeyInput);
    setSupabaseConfig(updated);
    showToast('Supabase Settings Saved', 'Updated local Supabase client configuration.', 'success');
    runDbCheck();
  };

  const handleResetSupabaseConfig = () => {
    const res = resetSupabaseCredentials();
    setSupabaseConfig(res);
    setCustomUrlInput(res.url);
    setCustomKeyInput(res.anonKey);
    showToast('Reset Credentials', 'Restored environment default Supabase connection parameters.');
    runDbCheck();
  };

  const handleManualSeed = async () => {
    setSeedingDb(true);
    try {
      await autoSeedSupabase();
      showToast('Supabase Seeding Triggered', 'Dispatched products & sample orders to your Supabase tables.', 'success');
      await runDbCheck();
    } catch (err: any) {
      showToast('Seeding Notice', err?.message || 'Attempted seeding to Supabase.', 'info');
    } finally {
      setSeedingDb(false);
    }
  };

  const handleCopySqlScript = () => {
    const sqlCode = `-- KRIYA SUPABASE DATABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public write orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public delete orders" ON public.orders FOR DELETE USING (true);
`;
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    showToast('SQL Schema Copied!', 'Paste into your Supabase SQL Editor to initialize database tables.');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveStandard = (e: React.FormEvent) => {
    e.preventDefault();
    saveFormspreeId(formspreeId);
    showToast('Standard Order Formspree ID Saved', 'Your main store checkout notification endpoint has been updated.');
  };

  const handleSavePreorder = (e: React.FormEvent) => {
    e.preventDefault();
    savePreorderFormspreeId(preorderFormspreeId);
    showToast('Pre-Order Formspree ID Saved', 'Your bulk order / pre-order notification endpoint has been updated.');
  };

  const handleResetStandard = () => {
    setFormspreeIdState(DEFAULT_FORMSPREE_ID);
    saveFormspreeId(DEFAULT_FORMSPREE_ID);
    showToast('Reset Standard Endpoint', 'Restored default standard Formspree ID.');
  };

  const handleResetPreorder = () => {
    setPreorderFormspreeIdState(DEFAULT_PREORDER_FORMSPREE_ID);
    savePreorderFormspreeId(DEFAULT_PREORDER_FORMSPREE_ID);
    showToast('Reset Pre-Order Endpoint', 'Restored default pre-order Formspree ID.');
  };

  const handleSendTest = async () => {
    setTesting(true);
    try {
      const ok = await sendTestNotificationToFormspree();
      if (ok) {
        showToast('Test Order Dispatched!', 'Sample order details sent to Formspree successfully. Check your email inbox!', 'success');
      } else {
        showToast('Dispatch Notice', 'Sent request to Formspree. Please verify your Formspree form status.', 'info');
      }
    } catch (err) {
      showToast('Error', 'Failed to send test order notification to Formspree.', 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(getFormspreeEndpoint());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyPreorderEndpoint = () => {
    navigator.clipboard.writeText(getPreorderFormspreeEndpoint());
    setCopiedPreorder(true);
    setTimeout(() => setCopiedPreorder(false), 2500);
  };

  const capturedFields = [
    { label: 'Order ID', key: 'order_id', example: 'KRIYA-2026-849201' },
    { label: 'Order Date & Time', key: 'order_date', example: 'August 2, 2026' },
    { label: 'Customer Full Name', key: 'customer_name', example: 'Priya Sharma' },
    { label: 'Customer Email', key: 'customer_email', example: 'priya.s@example.com' },
    { label: 'Customer Phone', key: 'customer_phone', example: '+91 98765 43210' },
    { label: 'Full Shipping Address', key: 'shipping_address', example: '42 Lotus Heights, Bandra West, Mumbai, MH 400050' },
    { label: 'Shipping Speed', key: 'shipping_method', example: 'Express Delivery' },
    { label: 'Payment Method', key: 'payment_method', example: 'Option 1: Razorpay / UPI or Option 2: COD' },
    { label: 'Payment Gateway Details', key: 'payment_detail', example: 'Razorpay SSL Encrypted (GPay / PhonePe / UPI / Cards)' },
    { label: 'Payment Mode Type', key: 'payment_type', example: 'Online Payment (Razorpay / UPI)' },
    { label: 'Payment Status', key: 'payment_status', example: 'Paid / Verified Online' },
    { label: 'Payment Gateway SSL', key: 'payment_gateway', example: 'Razorpay Gateway (256-Bit SSL)' },
    { label: 'Detailed Items Breakdown', key: 'items_breakdown', example: '1. Saffron Glow Serum (Shade: Radiant Gold) | Qty: 2 | Price: ₹1,499 | Total: ₹2,998' },
    { label: 'Total Items Count', key: 'items_count', example: '2' },
    { label: 'Subtotal Amount', key: 'subtotal', example: '₹2,998' },
    { label: 'Discount Applied', key: 'discount_applied', example: '₹300' },
    { label: 'Shipping Fee', key: 'shipping_fee', example: 'FREE' },
    { label: 'Final Total Paid', key: 'total_amount_paid', example: '₹2,698' },
    { label: 'Tracking Number', key: 'tracking_number', example: 'KR783920194IN' },
    { label: 'Checkout Pay Link', key: 'pay_link', example: 'https://checkout.kriyacosmetics.com/pay/KRIYA-2026-849201' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white flex items-center gap-3">
            <Sliders className="w-7 h-7 text-emerald-400" />
            <span>Store & Integration Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-1">
            Manage your Supabase Database Connection &amp; Formspree Email Notification Endpoints.
          </p>
        </div>

        <button
          onClick={handleSendTest}
          disabled={testing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs rounded-full shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          {testing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Send Test Standard Email</span>
        </button>
      </div>

      {/* SECTION 1: SUPABASE CONNECTION & DATABASE SETTINGS */}
      <div className="bg-stone-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-white flex items-center gap-2">
                <span>Supabase Database Connection</span>
                {supabaseConfig.isCustom && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">Custom Override</span>
                )}
              </h2>
              <p className="text-xs text-emerald-100/70">Connects products catalog, user accounts, and real-time orders.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runDbCheck}
              disabled={testingDb}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingDb ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Test Connection</span>
            </button>
            <button
              onClick={handleManualSeed}
              disabled={seedingDb}
              className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{seedingDb ? 'Seeding...' : 'Seed Data to Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Live Status Overview Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border ${dbStatus?.connected ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-amber-950/30 border-amber-500/30'} flex items-start gap-3`}>
            {dbStatus?.connected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="text-xs font-semibold text-white block">
                {testingDb ? 'Checking connection...' : (dbStatus?.connected ? 'Supabase Connected' : 'Local Fallback Mode')}
              </span>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">
                {dbStatus?.connected
                  ? `Response latency: ${dbStatus.latencyMs}ms`
                  : (dbStatus?.error || 'Operating with high-speed browser IndexedDB / LocalStorage.')}
              </p>
            </div>
          </div>

          <div className="p-4 bg-stone-950/60 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-100/60 block">Supabase Products</span>
              <span className="text-lg font-serif font-bold text-white">
                {dbStatus?.productsCount !== null && dbStatus?.productsCount !== undefined ? dbStatus.productsCount : '—'}
              </span>
            </div>
            <Layers className="w-5 h-5 text-emerald-400/60" />
          </div>

          <div className="p-4 bg-stone-950/60 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-100/60 block">Supabase Orders</span>
              <span className="text-lg font-serif font-bold text-white">
                {dbStatus?.ordersCount !== null && dbStatus?.ordersCount !== undefined ? dbStatus.ordersCount : '—'}
              </span>
            </div>
            <Activity className="w-5 h-5 text-emerald-400/60" />
          </div>
        </div>

        {/* Form to Update Supabase URL and Anon Key */}
        <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-200/90 mb-1.5 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full bg-stone-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-200/90 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Anon / Publishable Key</span>
              </label>
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="sb_publishable_... or anon key"
                className="w-full bg-stone-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Save Supabase Credentials
              </button>
              {supabaseConfig.isCustom && (
                <button
                  type="button"
                  onClick={handleResetSupabaseConfig}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition-all cursor-pointer border border-white/10"
                >
                  Reset Default Credentials
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopySqlScript}
              className="px-4 py-2.5 bg-stone-950 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'SQL Schema Copied' : 'Copy Supabase SQL Setup Script'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Standard Checkout Formspree ID */}
        <div className="bg-stone-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-semibold text-white">Standard Checkout Formspree</h2>
                  <p className="text-xs text-emerald-100/60">Used for main store purchases &amp; cart checkout.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[11px] font-medium text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Active
              </span>
            </div>

            <form onSubmit={handleSaveStandard} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-200/90 mb-2">
                  Formspree Form ID
                </label>
                <input
                  type="text"
                  value={formspreeId}
                  onChange={(e) => setFormspreeIdState(e.target.value)}
                  placeholder="e.g. xdaqrjwy or https://formspree.io/f/xdaqrjwy"
                  className="w-full bg-stone-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Save Standard ID
                </button>
                <button
                  type="button"
                  onClick={handleResetStandard}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition-all cursor-pointer border border-white/10"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-white/10 flex items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5 truncate">
              <span className="text-emerald-100/50 block text-[11px]">Endpoint:</span>
              <span className="font-mono text-emerald-300 select-all truncate block">{getFormspreeEndpoint()}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyEndpoint}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Pre-Order / Bulk Order Formspree ID */}
        <div className="bg-stone-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-400/10 border border-emerald-400/30 rounded-2xl text-emerald-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-semibold text-white">Pre-Order &amp; Bulk Formspree</h2>
                  <p className="text-xs text-emerald-100/60">Used for /book-order &amp; Pre-Order modal forms.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[11px] font-medium text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Pre-Order
              </span>
            </div>

            <form onSubmit={handleSavePreorder} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-200/90 mb-2">
                  Pre-Order Formspree Form ID
                </label>
                <input
                  type="text"
                  value={preorderFormspreeId}
                  onChange={(e) => setPreorderFormspreeIdState(e.target.value)}
                  placeholder="e.g. xdaqrjwy or custom pre-order ID"
                  className="w-full bg-stone-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Save Pre-Order ID
                </button>
                <button
                  type="button"
                  onClick={handleResetPreorder}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition-all cursor-pointer border border-white/10"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-white/10 flex items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5 truncate">
              <span className="text-emerald-100/50 block text-[11px]">Pre-order Endpoint:</span>
              <span className="font-mono text-emerald-300 select-all truncate block">{getPreorderFormspreeEndpoint()}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyPreorderEndpoint}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer shrink-0"
            >
              {copiedPreorder ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPreorder ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Captured Order Data Schema Card */}
      <div className="bg-stone-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Formspree Email Payload Schema</span>
            </h3>
            <p className="text-xs text-emerald-100/60 mt-1">
              Whenever a customer places an order or pre-order, the system packages all these attributes and sends them directly to Formspree:
            </p>
          </div>
          <a
            href="https://formspree.io/dashboard"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 self-start sm:self-auto"
          >
            <span>Open Formspree Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {capturedFields.map((field) => (
            <div key={field.key} className="p-3.5 bg-stone-950/60 rounded-xl border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{field.label}</span>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">{field.key}</span>
              </div>
              <p className="text-xs text-emerald-100/70 font-mono truncate">{field.example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


