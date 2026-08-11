import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { Search, PackageCheck, Truck, Clock, ArrowLeft, CheckCircle, MapPin, Copy } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export const OrderTrackingPage: React.FC = () => {
  const { pastOrders, findOrderById, setCurrentView, showToast } = useShop();

  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(pastOrders[0] || null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const found = findOrderById(searchId);
    setHasSearched(true);
    if (found) {
      setSearchedOrder(found);
      showToast('Order Located', `Found order ${found.id}`);
    } else {
      setSearchedOrder(null);
      showToast('Order Not Found', 'Check your Order ID and try again.', 'warning');
    }
  };

  return (
    <div className="bg-[#0D2217] text-white py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 block mb-1">
              Ritual Logistics
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white">
              Track Your Order Status
            </h1>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-stone-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4">
          <label className="text-xs font-bold text-white uppercase block">
            Enter Your Order ID or Tracking Number
          </label>
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. KRIYA-2026-89412 or KR928172641US"
              className="flex-1 px-4 py-3 bg-stone-950 border border-white/20 rounded-2xl text-sm font-mono text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-500 text-stone-950 text-xs font-extrabold rounded-2xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH ORDER</span>
            </button>
          </div>
        </form>

        {/* Order Result */}
        {searchedOrder ? (
          <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-400">Order ID</span>
                <h3 className="font-mono text-xl font-bold text-white">{searchedOrder.id}</h3>
                <span className="text-xs text-emerald-100/70">Placed on {searchedOrder.date}</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-950/80 px-4 py-2 rounded-full border border-emerald-500/40 text-xs font-bold text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Status: {searchedOrder.status}</span>
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase">Estimated Courier Timeline</span>
              <div className="p-4 bg-stone-950 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white block">Courier Waybill: {searchedOrder.trackingNumber}</span>
                    <span className="text-emerald-100/70">Method: {searchedOrder.shippingMethod === 'express' ? 'Express Courier' : 'Standard Delivery'}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(searchedOrder.trackingNumber);
                    showToast('Tracking Copied', searchedOrder.trackingNumber);
                  }}
                  className="p-2 text-stone-400 hover:text-emerald-300 cursor-pointer"
                  title="Copy Tracking"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-white/10 text-xs space-y-1">
              <span className="font-bold text-emerald-400 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Destination
              </span>
              <p className="font-semibold text-white">
                {searchedOrder.shippingAddress.firstName} {searchedOrder.shippingAddress.lastName}
              </p>
              <p className="text-emerald-100/80">
                {searchedOrder.shippingAddress.street}, {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} {searchedOrder.shippingAddress.zipCode}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-white uppercase">Order Formulations ({searchedOrder.items.length})</span>
              <div className="divide-y divide-white/10">
                {searchedOrder.items.map((item) => (
                  <div key={item.product.id + (item.selectedShade?.name || '')} className="py-3 flex items-center gap-3">
                    <ImageWithFallback src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-serif text-xs font-semibold text-white">{item.product.name}</h4>
                      <span className="text-[11px] text-emerald-100/70">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-xs text-emerald-300">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : hasSearched ? (
          <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/15 space-y-3">
            <p className="font-serif text-lg font-semibold text-white">No order found matching "{searchId}"</p>
            <p className="text-xs text-emerald-100/70">Check for typos in your order ID or place a new order.</p>
          </div>
        ) : null}

        {/* Past Orders List */}
        {pastOrders.length > 0 && (
          <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/15 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-semibold text-white">Your Local Order History</h3>
            <div className="space-y-3">
              {pastOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSearchedOrder(ord)}
                  className="p-4 bg-stone-950 rounded-2xl border border-white/10 hover:border-emerald-400 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-white">{ord.id}</span>
                    <span className="text-xs text-emerald-100/70 block">{ord.date} • {ord.items.length} item(s)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-sm text-emerald-400">₹{ord.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    <span className="text-[10px] bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold block mt-0.5">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
