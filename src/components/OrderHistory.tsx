import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useShop } from '../context/ShopContext';
import { Package, CheckCircle, Loader2, Calendar, MapPin } from 'lucide-react';
import { OrderRecord, getLocalOrders, getDeletedOrderIds } from '../lib/db';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const OrderHistory: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const { currentUser, setCurrentView } = useShop();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.email) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .or(`user_email.eq.${currentUser.email},customer_email.eq.${currentUser.email}`)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        const deletedIds = getDeletedOrderIds();
        if (data && data.length > 0) {
          const validOrders = data.filter((o: any) => o.id && !deletedIds.includes(o.id));
          setOrders(validOrders);
        } else {
          const local = getLocalOrders().filter(o => 
            (o.customer_email || o.user_email || o.email || '').toLowerCase() === currentUser.email.toLowerCase()
          );
          setOrders(local);
        }
      } catch (err: any) {
        console.warn('Notice fetching order history from Supabase, using local fallback:', err);
        const local = getLocalOrders().filter(o => 
          (o.customer_email || o.user_email || o.email || '').toLowerCase() === (currentUser?.email || '').toLowerCase()
        );
        setOrders(local);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center py-10 text-emerald-100/70">
        <Package className="w-12 h-12 mx-auto text-emerald-400/50 mb-2" />
        <p className="text-sm font-medium text-white">Please sign in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-400">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-stone-950 rounded-2xl border border-white/10 flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-white mb-2">No Orders Found</h3>
        <p className="text-sm text-emerald-100/70 max-w-sm mb-6 leading-relaxed font-light">
          It looks like you haven't placed any orders yet. Discover our premium botanical formulations to start your journey.
        </p>
        <button 
          onClick={() => {
            if (onClose) onClose();
            setCurrentView('home');
            navigate('/products');
          }}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-extrabold tracking-widest uppercase rounded-full transition-all cursor-pointer shadow-md"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="p-5 rounded-xl border border-white/10 bg-stone-950 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-white">Order #{order.id.toString().substring(0, 8)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-100/70">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(order.created_at), 'MMM dd, yyyy - h:mm a')}
              </div>
            </div>
            
            <span className="px-3 py-1.5 text-[11px] font-semibold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 w-fit">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {order.status || 'Processing'}
            </span>
          </div>
          
          <div className="py-1">
            <h4 className="text-sm font-bold text-white mb-2">{order.product_name}</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-100/70">Quantity: <span className="font-semibold text-white">{order.quantity || 1}</span></span>
              <span className="font-bold text-emerald-300">
                ₹{(
                  typeof order.total_price === 'number' && order.total_price > 0
                    ? order.total_price
                    : (order.price || 0) * (order.quantity || 1)
                ).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
             <div className="flex items-start gap-1.5 text-xs text-emerald-100/70">
               <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
               <span className="line-clamp-2 max-w-[200px]">{order.address}</span>
             </div>
             <div className="text-right w-full sm:w-auto">
               <span className="text-[10px] uppercase tracking-wider text-emerald-100/60 font-bold block mb-0.5">Total Paid</span>
               <span className="font-serif text-lg font-bold text-white">
                 ₹{(
                   typeof order.total_price === 'number' && order.total_price > 0
                     ? order.total_price
                     : (order.price || 0) * (order.quantity || 1)
                 ).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
               </span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
