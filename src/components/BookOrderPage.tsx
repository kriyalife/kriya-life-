import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { saveOrderToSupabase } from '../lib/db';
import { getPreorderFormspreeEndpoint } from '../lib/formspree';
import { useShop } from '../context/ShopContext';
import { ImageWithFallback } from './ImageWithFallback';
import { 
  ShoppingBag, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Loader2, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  ArrowLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const BookOrderPage: React.FC = () => {
  const { products, showToast, setCurrentView } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: products[0]?.name || 'Botanical Radiance Cleanser',
    quantity: 1,
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);

  // Selected product object for price preview
  const selectedProductObj = products.find((p) => p.name === formData.product);
  const unitPrice = formData.product === 'Custom Botanical Ritual Set' 
    ? 1850 
    : (selectedProductObj ? selectedProductObj.price : 650);
  const totalPrice = Number((unitPrice * formData.quantity).toFixed(2));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value) || 1) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.product || !formData.address) {
      const msg = 'Please fill in all required fields to complete your cosmetic booking.';
      setErrorMessage(msg);
      showToast('Form Incomplete', msg, 'warning');
      return;
    }

    setLoading(true);

    try {
      // Generate consistent KRIYA Order ID and Pay Link
      const orderId = 'KRIYA-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
      const payLink = `https://checkout.kriyacosmetics.com/pay/${orderId}`;
      const orderDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      // Post to Formspree
      try {
        await fetch(getPreorderFormspreeEndpoint(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `📦 New Pre-Order #${orderId} - ${formData.product}`,
            order_id: orderId,
            order_date: orderDate,
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            product: formData.product,
            quantity: formData.quantity,
            total_price: `₹${totalPrice.toLocaleString('en-IN')}`,
            total_amount_paid: `₹${totalPrice.toLocaleString('en-IN')}`,
            items_breakdown: `1. ${formData.product} | Qty: ${formData.quantity} | Unit: ₹${unitPrice} | Total: ₹${totalPrice}`,
            shipping_address: formData.address,
            pay_link: payLink
          })
        });
      } catch (fErr) {
        console.warn('Formspree order notice:', fErr);
      }

      const { data: userData } = await supabase.auth.getUser();

      const orderPayload = {
        id: orderId,
        user_id: userData?.user?.id || null,
        product_id: selectedProductObj?.id || formData.product,
        product_name: formData.product,
        quantity: Number(formData.quantity),
        price: unitPrice,
        total_price: totalPrice,
        customer_name: formData.name,
        customer_email: formData.email,
        user_email: formData.email,
        customer_phone: formData.phone,
        phone: formData.phone,
        address: formData.address,
        shipping_address: formData.address,
        shipping_method: 'Standard Express',
        status: 'Pending',
        payment_method: 'Cash on Delivery',
        payment_status: 'Pending (COD)',
        items_breakdown: `1. ${formData.product} | Qty: ${formData.quantity} | Unit: ₹${unitPrice} | Total: ₹${totalPrice}`,
        created_at: new Date().toISOString()
      };

      await saveOrderToSupabase(orderPayload).catch(console.error);

      setSubmittedOrder(orderPayload);
      const successText = `Success! Your booking #${orderId} for ${formData.quantity}x ${formData.product} (Total: ₹${totalPrice}) has been stored!`;
      setSuccessMessage(successText);
      showToast('Order Booked Successfully!', successText, 'success');

      try {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#527834', '#2C523B', '#E8F3E9', '#153323']
        });
      } catch (e) {
        console.error('Confetti failed', e);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save order to database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2217] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to KRIYA Boutique</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-emerald-100/70">
            <button onClick={() => setCurrentView('home')} className="hover:underline cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3 text-emerald-100/40" />
            <span className="font-semibold text-white">Bulk Order</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Bulk Cosmetic Ordering
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white">
            Order Custom Botanical Formulation in Bulk
          </h1>
          <p className="text-sm text-emerald-100/70 font-light leading-relaxed">
            Reserve your fresh, small-batch organic cosmetic product in bulk directly into our database. Fast dispatch across India.
          </p>
        </div>

        {/* Main Grid: Form + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (7 Cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-500 text-stone-950 rounded-full flex items-center justify-center font-extrabold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-white">Order Details Form</h2>
                  <p className="text-[11px] text-emerald-100/70">Direct write to local database</p>
                </div>
              </div>
            </div>

            {/* Success Alert */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-emerald-100">Booking Confirmed! 🎉</p>
                      <p className="mt-1 leading-relaxed text-emerald-200/90">{successMessage}</p>
                      {submittedOrder && (
                        <div className="mt-2 text-[11px] font-mono bg-stone-950 border border-emerald-500/30 text-emerald-300 p-2 rounded-xl">
                          Order Record ID: {submittedOrder.id || 'order-9823'} | Status: {submittedOrder.status || 'Pending'}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Alert */}
            {errorMessage && !successMessage && (
              <div className="p-4 bg-amber-950/80 border border-amber-500/40 text-amber-200 rounded-2xl text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Roy"
                  className="w-full px-4 py-3 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ananya@example.com"
                    className="w-full px-4 py-3 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Select Formulation *
                  </label>
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white"
                    required
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name} className="bg-stone-900 text-white">
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                    <option value="Custom Botanical Ritual Set" className="bg-stone-900 text-white">Custom Botanical Ritual Set (₹1,850)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    max="50"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Shipping / Delivery Address *
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete street address, flat/building, city, state and PIN code"
                  className="w-full px-4 py-3 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs tracking-widest uppercase rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                    <span>SAVING...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-stone-950" />
                    <span>CONFIRM & PLACE BULK ORDER</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Summary & Product Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Selected Product Preview */}
            <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Selected Formulation
              </h3>

              {selectedProductObj && (
                <div className="flex gap-4 items-center bg-stone-950 p-4 rounded-2xl border border-white/10">
                  <ImageWithFallback
                    src={selectedProductObj.images[0]}
                    alt={selectedProductObj.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400">
                      {selectedProductObj.category}
                    </span>
                    <h4 className="font-serif font-bold text-white text-sm leading-snug">
                      {selectedProductObj.name}
                    </h4>
                    <p className="text-xs font-bold text-white">
                      ₹{selectedProductObj.price}{' '}
                      <span className="text-emerald-100/60 text-[11px] font-normal">per unit</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-emerald-100/80">
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span className="font-semibold text-white">₹{unitPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-semibold text-white">{formData.quantity}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/15">
                  <span>Total Amount:</span>
                  <span className="text-base text-emerald-300">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Value Guarantees */}
            <div className="bg-stone-950 border border-white/15 text-stone-100 rounded-3xl p-6 shadow-2xl space-y-4">
              <h4 className="font-serif font-bold text-white text-base">
                KRIYA Promise
              </h4>
              <ul className="space-y-3 text-xs text-emerald-100/80">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Cold-Pressed Organic Botanicals</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Express Air Dispatch Across India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Real-Time Sync with Database</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
