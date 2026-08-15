import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, MapPin, Phone, Mail, Calendar, CheckCircle, Clock, User, CreditCard } from 'lucide-react';
import { OrderRecord } from '../../lib/db';
import { format } from 'date-fns';

interface OrderDetailsModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onStatusChange }) => {
  if (!order) return null;

  const isCompleted = order.status === 'Completed';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-stone-900 rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-stone-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Order Details</h3>
                <p className="text-xs text-emerald-300 font-mono">#{order.id.toString()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-emerald-100/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Top row: Status and Date */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-2xl border border-white/15 bg-stone-950/80">
               <div>
                 <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block mb-1">Status</span>
                 <button 
                  onClick={() => onStatusChange(order.id, order.status)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                    isCompleted ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900' : 'bg-amber-950 text-amber-300 border-amber-500/40 hover:bg-amber-900'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                  {order.status || 'Pending'}
                </button>
               </div>
               <div>
                 <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block mb-1">Order Date</span>
                 <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                   <Calendar className="w-4 h-4 text-emerald-400" />
                   {order.created_at ? format(new Date(order.created_at), 'MMM dd, yyyy - h:mm a') : 'N/A'}
                 </div>
               </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-white/15 bg-stone-950/80 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-100/60 font-bold block">Customer Name</span>
                      <span className="text-sm font-medium text-white">{order.customer_name || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-100/60 font-bold block">Email Address</span>
                      <span className="text-sm font-medium text-white">{order.customer_email || order.user_email || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-100/60 font-bold block">Phone Number</span>
                      <span className="text-sm font-medium text-white">{order.phone || order.customer_phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl border border-white/15 bg-stone-950/80">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-100/60 font-bold block">Shipping Address</span>
                      <span className="text-sm text-white/90 leading-relaxed block mt-1">
                        {order.address || order.shipping_address || 'No address provided'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Line Items</h4>
              <div className="rounded-2xl border border-white/15 bg-stone-950/80 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-950 border-b border-white/10 text-emerald-300 font-medium">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {(() => {
                      if (order.items_breakdown) {
                        return order.items_breakdown.split('|').map((itemStr, idx) => {
                          if (!itemStr.trim()) return null;
                          return (
                            <tr key={idx} className="hover:bg-white/5">
                              <td colSpan={4} className="px-4 py-3 text-white text-sm whitespace-pre-wrap">
                                {itemStr.trim()}
                              </td>
                            </tr>
                          );
                        });
                      }
                      const qty = order.quantity || 1;
                      const orderTotal = typeof order.total_price === 'number' && order.total_price > 0
                        ? order.total_price
                        : (order.price || 0) * qty;
                      const unitPrice = typeof order.total_price === 'number' && order.total_price > 0 && qty > 0
                        ? Number((order.total_price / qty).toFixed(2))
                        : (order.price || 0);
                      return (
                        <>
                          <tr className="hover:bg-white/5">
                            <td className="px-4 py-3 font-medium text-white">{order.product_name}</td>
                            <td className="px-4 py-3 text-center text-emerald-100/80">{qty}</td>
                            <td className="px-4 py-3 text-right text-emerald-100/80">₹{unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                            <td className="px-4 py-3 text-right font-medium text-emerald-300">₹{orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
                <div className="p-4 bg-stone-950 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-100/70">Order Total</span>
                  <span className="text-lg font-bold text-emerald-300">
                    ₹{(
                      typeof order.total_price === 'number' && order.total_price > 0
                        ? order.total_price
                        : (order.price || 0) * (order.quantity || 1)
                    ).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Payment Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-white/15 bg-stone-950/80 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <CreditCard className="w-4 h-4 text-emerald-400" />
                     <span className="text-sm font-medium text-emerald-100/80">Method</span>
                   </div>
                   <span className="text-sm font-medium text-white">{order.payment_method || 'Cash on Delivery'}</span>
                </div>
                <div className="p-4 rounded-2xl border border-white/15 bg-stone-950/80 flex items-center justify-between">
                   <span className="text-sm font-medium text-emerald-100/80">Payment Status</span>
                   <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${order.payment_status?.toLowerCase().includes('paid') ? 'bg-blue-950 text-blue-300 border-blue-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'}`}>
                      {order.payment_status || 'Pending'}
                   </span>
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
