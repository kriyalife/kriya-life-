import React, { useState } from 'react';
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
  Mail, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  FileText, 
  ExternalLink,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [formspreeId, setFormspreeIdState] = useState(getFormspreeId());
  const [preorderFormspreeId, setPreorderFormspreeIdState] = useState(getPreorderFormspreeId());
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPreorder, setCopiedPreorder] = useState(false);
  const { showToast } = useShop();

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
    { label: 'Payment Method', key: 'payment_method', example: 'Credit Card (ending 4242)' },
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
            <span>Store & Formspree Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-1">
            Configure separate Formspree Form IDs for Standard Store Checkout vs. Bulk / Pre-Order bookings.
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

