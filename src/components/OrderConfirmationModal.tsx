import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  CheckCircle, 
  PackageCheck, 
  Truck, 
  ExternalLink, 
  Printer, 
  ArrowRight, 
  Clock, 
  Copy, 
  MapPin, 
  CreditCard 
} from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';

export const OrderConfirmationModal: React.FC = () => {
  const { activeOrder, currentView, setCurrentView, showToast } = useShop();

  if (!activeOrder || currentView !== 'order-confirmation') {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(activeOrder.trackingNumber);
    showToast('Tracking Number Copied!', activeOrder.trackingNumber);
  };

  return (
    <div className="bg-[#0D2217] text-white py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/15 shadow-2xl text-center space-y-4 relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 block">
            Ritual Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium">
            Thank You For Your Order!
          </h1>

          <p className="text-sm text-emerald-100/70 max-w-lg mx-auto font-light">
            We have received your order <strong className="text-white font-mono">{activeOrder.id}</strong>. A confirmation receipt has been sent to <strong>{activeOrder.shippingAddress.email}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 bg-stone-950 px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-white">
            <span>Tracking Number:</span>
            <span className="font-mono text-emerald-400">{activeOrder.trackingNumber}</span>
            <button onClick={handleCopyTracking} className="p-1 hover:text-emerald-300 cursor-pointer" title="Copy">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Order Status Timeline Bar */}
        <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4">
          <h3 className="font-serif text-lg font-semibold text-white">Live Formulation Status</h3>
          
          <div className="grid grid-cols-4 gap-2 text-center relative">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center text-xs font-extrabold z-10 shadow-md">
                1
              </div>
              <span className="text-[11px] font-bold text-white">Order Placed</span>
            </div>

            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center text-xs font-bold z-10">
                2
              </div>
              <span className="text-[11px] font-medium text-emerald-100/70">Formulating</span>
            </div>

            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center text-xs font-bold z-10">
                3
              </div>
              <span className="text-[11px] font-medium text-emerald-100/70">Quality Check</span>
            </div>

            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center text-xs font-bold z-10">
                4
              </div>
              <span className="text-[11px] font-medium text-emerald-100/70">Shipped</span>
            </div>

            {/* Connecting Line */}
            <div className="absolute top-4 left-1/8 right-1/8 h-0.5 bg-white/10 -z-0" />
          </div>
        </div>

        {/* Invoice Itemized Receipt */}
        <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif text-xl font-semibold text-white">Itemized Receipt</h3>
              <p className="text-xs text-emerald-100/70 mt-0.5">Order Date: {activeOrder.date}</p>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white border border-white/20 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Items */}
          <div className="divide-y divide-white/10">
            {activeOrder.items.map((item) => (
              <div key={item.product.id + (item.selectedShade?.name || '')} className="py-4 flex items-center gap-4">
                <ImageWithFallback
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-400">{item.product.category}</span>
                  <h4 className="font-serif text-sm font-semibold text-white">{item.product.name}</h4>
                  {item.selectedShade && (
                    <span className="text-xs text-emerald-100/70 block">Shade: {item.selectedShade.name}</span>
                  )}
                  <span className="text-xs text-emerald-100/60 block">Quantity: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}</span>
                </div>
                <span className="font-serif text-base font-bold text-emerald-300">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Address & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="p-4 bg-stone-950 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Shipping Address
              </span>
              <p className="text-sm font-semibold text-white">
                {activeOrder.shippingAddress.firstName} {activeOrder.shippingAddress.lastName}
              </p>
              <p className="text-xs text-emerald-100/80">
                {activeOrder.shippingAddress.street} {activeOrder.shippingAddress.apartment}
              </p>
              <p className="text-xs text-emerald-100/80">
                {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.zipCode}
              </p>
              <p className="text-xs text-emerald-100/80">{activeOrder.shippingAddress.country}</p>
              <p className="text-xs text-emerald-100/80">Phone: {activeOrder.shippingAddress.phone}</p>
            </div>

            <div className="p-4 bg-stone-950 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Payment Method
              </span>
              <p className="text-sm font-semibold text-white">{activeOrder.paymentMethod}</p>
              <p className="text-xs text-emerald-100/80">Payment Status: <strong className="text-emerald-400">PAID IN FULL</strong></p>
              <p className="text-xs text-emerald-100/80 mt-2">
                External Pay Link: <a href={activeOrder.payLink} target="_blank" rel="noreferrer" className="text-emerald-300 underline truncate block max-w-xs">{activeOrder.payLink}</a>
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs max-w-sm ml-auto">
            <div className="flex justify-between text-emerald-100/80">
              <span>Subtotal</span>
              <span>₹{activeOrder.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount</span>
                <span>-₹{activeOrder.discount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-lg text-white">
              <span>Total Paid</span>
              <span className="text-xl text-emerald-300 font-serif">₹{activeOrder.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView('order-tracking')}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-lg"
          >
            <PackageCheck className="w-4 h-4 text-stone-950" />
            <span>TRACK ACTIVE SHIPMENT</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto px-8 py-3.5 bg-stone-950 text-white border border-white/20 font-bold text-xs rounded-full hover:bg-stone-800 transition-colors cursor-pointer uppercase tracking-wider"
          >
            CONTINUE SHOPPING
          </button>
        </div>

      </div>
    </div>
  );
};
