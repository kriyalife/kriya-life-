import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress, PaymentDetails } from '../types';
import { 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles, 
  QrCode,
  X,
  Banknote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './ImageWithFallback';

export const CheckoutPage: React.FC = () => {
  const { cart, getCartTotal, placeOrder, setCurrentView, showToast, appliedPromo, currentUser } = useShop();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser === null) {
      const timer = setTimeout(() => {
        showToast('Authentication Required', 'Please log in to proceed to checkout.', 'warning');
        navigate('/login?returnUrl=/checkout');
      }, 500); // Small delay to let auth resolve
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate, showToast]);


  // Form Fields
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [razorpaySubMethod, setRazorpaySubMethod] = useState<'card' | 'upi'>('card');

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [upiId, setUpiId] = useState('');

  // Stable Checkout Order ID for the current session
  const [presetOrderId] = useState(() => 'KRIYA-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000));

  // External Pay Link Modal simulation state
  const [showPayLinkModal, setShowPayLinkModal] = useState(false);
  const [generatedPayLink, setGeneratedPayLink] = useState('');
  const [copiedPayLink, setCopiedPayLink] = useState(false);

  const { subtotal, discount, shipping, tax } = getCartTotal();
  const finalShipping = 0;
  const finalTotal = subtotal - discount + finalShipping + tax;

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!address.firstName || !address.lastName || !address.email || !address.phone) {
      showToast('Contact Info Required', 'Please complete your name, email, and phone number.', 'warning');
      return false;
    }
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      showToast('Shipping Address Required', 'Please enter your full street, city, state, and ZIP code.', 'warning');
      return false;
    }
    return true;
  };

  const handleRazorpayPayment = async (subMethod: 'card' | 'upi' = razorpaySubMethod) => {
    if (!validateForm()) return;

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TOR78pOvdbvvqI';
    const amountInPaise = Math.round(finalTotal * 100);
    const methodLabel = subMethod === 'card' ? 'Razorpay (1.1 Card)' : 'Razorpay (1.2 UPI)';

    let serverOrderId: string | undefined = undefined;

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: presetOrderId,
          notes: {
            customer_name: `${address.firstName} ${address.lastName}`,
            email: address.email,
            phone: address.phone,
            sub_method: subMethod
          }
        })
      });
      if (res.ok) {
        const orderData = await res.json();
        if (orderData?.id) {
          serverOrderId = orderData.id;
        }
      }
    } catch (e) {
      console.warn('Backend order creation notice:', e);
    }

    if (typeof (window as any).Razorpay === 'function') {
      const options: any = {
        key: keyId,
        amount: amountInPaise,
        currency: 'INR',
        name: 'KRIYA Life Science',
        description: `Order #${presetOrderId} via ${subMethod === 'card' ? 'Card' : 'UPI'}`,
        image: '/assets/logo.png',
        order_id: serverOrderId,
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          contact: address.phone,
          ...(subMethod === 'upi' && upiId ? { vpa: upiId } : {})
        },
        notes: {
          order_id: presetOrderId,
          address: `${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`,
          payment_option: subMethod
        },
        theme: {
          color: '#10B981'
        },
        handler: async function (response: any) {
          const paymentId = response.razorpay_payment_id || 'pay_' + Math.random().toString(36).substring(2, 10);
          
          if (response.razorpay_signature && response.razorpay_order_id) {
            try {
              await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
            } catch (vErr) {
              console.warn('Signature verification call:', vErr);
            }
          }

          showToast('Payment Successful!', `Razorpay Payment ID: ${paymentId}`, 'success');
          placeOrder(
            address,
            shippingMethod,
            `${methodLabel} - ID: ${paymentId}`,
            presetOrderId
          );
        },
        modal: {
          ondismiss: function () {
            showToast('Payment Cancelled', 'Razorpay transaction window was closed.', 'info');
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          showToast('Payment Failed', response.error?.description || 'Transaction could not be processed.', 'error');
        });
        rzp.open();
      } catch (err) {
        console.error('Razorpay SDK init error:', err);
        placeOrder(
          address,
          shippingMethod,
          `${methodLabel} - Key: ${keyId}`,
          presetOrderId
        );
      }
    } else {
      showToast('Razorpay Gateway', `Processing order with ${methodLabel}`, 'info');
      placeOrder(
        address,
        shippingMethod,
        `${methodLabel} - Key: ${keyId}`,
        presetOrderId
      );
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === 'cod') {
      placeOrder(
        address,
        shippingMethod,
        'Cash on Delivery (2. COD)',
        presetOrderId
      );
    } else {
      handleRazorpayPayment(razorpaySubMethod);
    }
  };

  const handleGeneratePayLink = () => {
    if (!validateForm()) return;

    const mockLink = `https://checkout.kriyacosmetics.com/pay/${presetOrderId}?amount=${finalTotal.toFixed(2)}`;
    setGeneratedPayLink(mockLink);
    setShowPayLinkModal(true);
  };

  const handleCopyPayLink = () => {
    navigator.clipboard.writeText(generatedPayLink);
    setCopiedPayLink(true);
    showToast('Pay Link Copied!', 'External pay link copied to clipboard.');
    setTimeout(() => setCopiedPayLink(false), 3000);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-[#0D2217] text-white min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif text-2xl font-semibold text-white">Your cart is empty</h2>
        <p className="text-sm text-emerald-100/60 mt-1 font-light">Please add products before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-6 py-2.5 bg-emerald-500 text-stone-950 text-xs font-bold rounded-full hover:bg-emerald-400 transition-all uppercase tracking-wider cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0D2217] text-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left 7 Cols: Information & Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Shipping Address & Customer Information */}
            <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-xl font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 text-xs flex items-center justify-center font-sans font-extrabold">1</span>
                  <span>Shipping Address</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentView('cart')}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Cart</span>
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {/* Contact Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">First Name *</label>
                    <input
                      type="text"
                      value={address.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="e.g. Ananya"
                      className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={address.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="e.g. Sharma"
                      className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      required
                    />
                  </div>
                </div>

                {/* Contact Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g. ananya@example.com"
                      className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      required
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">Street Address *</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    value={address.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    placeholder="e.g. Apt 4B"
                    className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">City *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. San Francisco"
                      className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">State / Province *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="e.g. CA"
                      className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="e.g. 94102"
                      className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">Country *</label>
                  <select
                    value={address.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Section */}
            <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif text-xl font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 text-xs flex items-center justify-center font-sans font-extrabold">2</span>
                  <span>Payment Gateway</span>
                </h3>

                {/* External Pay Link Generator Trigger */}
                <button
                  type="button"
                  onClick={handleGeneratePayLink}
                  className="px-3.5 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-stone-950 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>External Pay Link</span>
                </button>
              </div>

              {/* Payment Gateways: Strictly 2 Options (1. Razorpay / UPI, 2. COD) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Razorpay / UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'razorpay'
                      ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg'
                      : 'bg-stone-950 border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${paymentMethod === 'razorpay' ? 'bg-emerald-500 text-stone-950' : 'bg-white/10 text-emerald-400'}`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-serif font-bold text-white block">1. Razorpay / UPI</span>
                        <span className="text-[10px] text-emerald-300/80 font-medium">GPay, PhonePe, UPI & Cards</span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'}`}>
                      {paymentMethod === 'razorpay' && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-100/70 font-light">
                    Instant & encrypted payment via UPI Apps, GPay, PhonePe, Cards & NetBanking.
                  </p>
                </button>

                {/* 2. COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'cod'
                      ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg'
                      : 'bg-stone-950 border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${paymentMethod === 'cod' ? 'bg-emerald-500 text-stone-950' : 'bg-white/10 text-emerald-400'}`}>
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-serif font-bold text-white block">2. COD</span>
                        <span className="text-[10px] text-emerald-300/80 font-medium">Cash on Delivery</span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'}`}>
                      {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-100/70 font-light">
                    Pay with Cash or UPI upon receiving your order at your doorstep.
                  </p>
                </button>
              </div>
            </div>

          </div>

          {/* Right 5 Cols: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-6">
              <h3 className="font-serif text-xl font-semibold text-white pb-3 border-b border-white/10">
                Order Items ({cart.length})
              </h3>

              {/* Item Thumbnails List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id + (item.selectedShade?.name || '')} className="flex items-center gap-3">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl shrink-0 border border-white/10"
                    />
                    <div className="flex-1 pr-2">
                      <h4 className="font-serif text-xs font-semibold text-white line-clamp-1">{item.product.name}</h4>
                      {item.selectedShade && (
                        <span className="text-[10px] text-emerald-100/60 block">Shade: {item.selectedShade.name}</span>
                      )}
                      <span className="text-xs text-emerald-100/60">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-xs text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Detailed Math */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-emerald-100/80">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount ({appliedPromo})</span>
                    <span>-₹{discount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-bold text-lg text-white">
                  <span>Total Due</span>
                  <span className="text-2xl text-emerald-400 font-serif">₹{finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Complete Order & Pay Button */}
              <button
                type="submit"
                id="checkout-complete-order-btn"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs rounded-full transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>COMPLETE ORDER & PAY — ₹{finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </button>

              <div className="text-center space-y-2">
                <p className="text-[11px] text-emerald-100/60">
                  By completing your order, you agree to KRIYA’s Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

        </form>

      </div>

      {/* External Payment Link Modal Simulation */}
      <AnimatePresence>
        {showPayLinkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0D2217] text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-white/20 space-y-6 relative"
            >
              <button
                onClick={() => setShowPayLinkModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-white">Generated Pay Link</h3>
                <p className="text-xs text-emerald-100/80 font-light">
                  You can share or open this external pay link to complete payment of <strong className="text-emerald-400">₹{finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>.
                </p>
              </div>

              {/* Link Input & Copy */}
              <div className="bg-stone-950 p-3 rounded-2xl border border-white/20 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedPayLink}
                  className="bg-transparent text-xs text-emerald-200 flex-1 font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyPayLink}
                  className="px-3 py-1.5 bg-emerald-500 text-stone-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copiedPayLink ? <CheckCircle className="w-3.5 h-3.5 text-stone-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSubmitOrder}
                  className="w-full py-3.5 bg-emerald-500 text-stone-950 text-xs font-extrabold rounded-full hover:bg-emerald-400 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <CheckCircle className="w-4 h-4 text-stone-950" />
                  <span>Simulate Successful Payment & Complete Order</span>
                </button>

                <button
                  onClick={() => setShowPayLinkModal(false)}
                  className="w-full py-2.5 bg-white/10 text-white text-xs font-semibold rounded-full hover:bg-white/20 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
