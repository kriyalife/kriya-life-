import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { getPreorderFormspreeEndpoint } from '../lib/formspree';
import { supabase } from '../lib/supabaseClient';
import { saveOrderToSupabase } from '../lib/db';
import { useShop } from '../context/ShopContext';
import { X, Send, CheckCircle2, AlertCircle, ShoppingBag, Loader2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export const BookOrderModal: React.FC<BookOrderModalProps> = ({
  isOpen,
  onClose,
  defaultProduct = 'Botanical Radiance Cleanser'
}) => {
  const { products, showToast } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: defaultProduct,
    quantity: 1,
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const msg = 'Please fill out all required fields before placing your order.';
      setErrorMessage(msg);
      showToast('Form Error', msg, 'warning');
      return;
    }

    setLoading(true);

    try {
      const selectedProduct = products.find(p => p.name === formData.product);
      const unitPrice = formData.product === 'Custom Botanical Ritual Set' 
        ? 1850 
        : (selectedProduct ? selectedProduct.price : 650);
      const total = Number((unitPrice * formData.quantity).toFixed(2));

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
            _subject: `📦 New Quick Order #${orderId} - ${formData.product}`,
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
            total_price: `₹${total.toLocaleString('en-IN')}`,
            total_amount_paid: `₹${total.toLocaleString('en-IN')}`,
            items_breakdown: `1. ${formData.product} | Qty: ${formData.quantity} | Unit: ₹${unitPrice} | Total: ₹${total}`,
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
        product_id: selectedProduct?.id || formData.product,
        product_name: formData.product,
        quantity: Number(formData.quantity),
        price: unitPrice,
        total_price: total,
        customer_name: formData.name,
        customer_email: formData.email,
        user_email: formData.email,
        customer_phone: formData.phone,
        phone: formData.phone,
        address: formData.address,
        shipping_address: formData.address,
        shipping_method: 'Standard Express',
        payment_method: 'Cash on Delivery',
        status: 'Pending',
        payment_status: 'Pending (COD)',
        items_breakdown: `1. ${formData.product} | Qty: ${formData.quantity} | Unit: ₹${unitPrice} | Total: ₹${total}`,
        created_at: new Date().toISOString()
      };

      // Save to local storage buffer & Supabase with identical orderId
      await saveOrderToSupabase(orderPayload).catch(console.error);

      const successText = `Thank you, ${formData.name}! Your order #${orderId} for ${formData.quantity}x ${formData.product} has been recorded!`;
      setSuccessMessage(successText);
      showToast('Order Booked Successfully!', successText, 'success');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        product: products[0]?.name || 'Botanical Radiance Cleanser',
        quantity: 1,
        address: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save order to database.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-stone-900/90 backdrop-blur-2xl text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/15 relative my-8"
          >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShoppingBag className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
              KRIYA Direct Booking
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">Book Your Cosmetic Order</h2>
            <p className="text-xs text-emerald-100/70 max-w-sm mx-auto font-light">
              Fill out this quick form to store your booking directly into our database.
            </p>
          </div>

          {/* Success / Error Alerts */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs flex items-start gap-3 mb-4"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Order Confirmed</p>
                <p className="mt-1 leading-relaxed text-emerald-200/90">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-950/80 border border-amber-500/40 text-amber-200 rounded-2xl text-xs flex items-start gap-3 mb-6"
            >
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-100">Database Info</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. priya@example.com"
                  className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Cosmetic Product *
                </label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name} className="bg-stone-900 text-white">
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                  <option value="Custom Botanical Ritual Set" className="bg-stone-900 text-white">Custom Botanical Ritual Set</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  max="50"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Delivery Address *
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="Street name, landmark, city, state and PIN code"
                className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs tracking-widest uppercase rounded-full transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-stone-950" />
                  <span>SUBMIT ORDER</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
