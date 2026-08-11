const fs = require('fs');

const content = `import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useShop } from '../context/ShopContext';
import { User, Package, Award, MapPin, X, ArrowRight, Sparkles, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({ isOpen, onClose }) => {
  const { pastOrders, setCurrentView, showToast, currentUser, logoutUser, loginUser } = useShop();
  const [activeTab, setActiveTab] = useState<'orders' | 'rewards' | 'addresses'>('orders');
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY === 'missing-key') {
         setTimeout(() => {
           showToast('Notice', 'Supabase key missing. Using demo local login.', 'info');
           loginUser(email, name || 'Demo User');
           setIsLoading(false);
         }, 1000);
         return;
      }

      if (isLoginMode) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        showToast('Login Successful', 'Welcome back!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        if (error) throw error;
        showToast('Account Created', 'Please check your email to verify your account (if required) or you are now logged in.', 'success');
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div 
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#F5E6E1] overflow-hidden flex flex-col animate-scaleUp relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#153323] text-white flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#153323]">{isLoginMode ? 'Sign In' : 'Create Account'}</h2>
              <p className="text-xs text-stone-500 mt-2">Access your orders, rewards, and saved items.</p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-xs font-bold text-[#2C1A1D] uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya R."
                    className="w-full px-4 py-2 bg-[#FFF8F6] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C85A32] text-[#153323]"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#2C1A1D] uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full px-4 py-2 bg-[#FFF8F6] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C85A32] text-[#153323]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C1A1D] uppercase mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-[#FFF8F6] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C85A32] text-[#153323]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#153323] text-white font-semibold text-sm rounded-xl hover:bg-[#1C4430] transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoginMode ? 'LOG IN SECURELY' : 'SIGN UP'}
              </button>
            </form>
            
            <p className="text-center text-xs text-stone-500 mt-4">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-[#153323] font-bold hover:underline"
              >
                {isLoginMode ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#F5E6E1] overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F5E6E1] bg-[#153323] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Welcome, {currentUser.name || 'Botanical Member'}</h2>
              <p className="text-xs text-emerald-100/70">Kriya Ritual Member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-100/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close account modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#F5E6E1] bg-[#FFF8F6] px-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={\`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer \${
              activeTab === 'orders'
                ? 'border-[#153323] text-[#153323] bg-white'
                : 'border-transparent text-[#6B5A5C] hover:text-[#153323]'
            }\`}
          >
            <Package className="w-4 h-4" />
            Order History ({pastOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={\`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer \${
              activeTab === 'rewards'
                ? 'border-[#153323] text-[#153323] bg-white'
                : 'border-transparent text-[#6B5A5C] hover:text-[#153323]'
            }\`}
          >
            <Award className="w-4 h-4 text-[#C85A32]" />
            Ritual Rewards
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={\`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer \${
              activeTab === 'addresses'
                ? 'border-[#153323] text-[#153323] bg-white'
                : 'border-transparent text-[#6B5A5C] hover:text-[#153323]'
            }\`}
          >
            <MapPin className="w-4 h-4" />
            Saved Address
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {pastOrders.length === 0 ? (
                <div className="text-center py-10 text-stone-500">
                  <Package className="w-12 h-12 mx-auto text-stone-300 mb-2" />
                  <p className="text-sm font-medium">No recent orders yet</p>
                  <p className="text-xs text-stone-400 mt-1">Your botanical formulations will appear here once ordered.</p>
                </div>
              ) : (
                pastOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-[#F5E6E1] bg-[#FFF8F6]/40 hover:bg-white transition-all text-[#153323]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F5E6E1]/60">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#153323]">{order.id}</span>
                        <span className="text-[11px] text-[#6B5A5C] block mt-0.5">{order.date}</span>
                      </div>
                      <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {order.status}
                      </span>
                    </div>
                    <div className="py-3 space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-[#2C1A1D] font-medium">{item.product.name} x{item.quantity}</span>
                          <span className="text-[#153323] font-semibold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-[#F5E6E1]/60 flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#153323]">Total: ₹{order.total.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => {
                          onClose();
                          setCurrentView('order-tracking');
                        }}
                        className="inline-flex items-center gap-1 text-[#153323] font-semibold hover:underline"
                      >
                        Track Package <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#153323] to-[#2C523B] text-white flex items-center justify-between shadow-md">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    Botanical VIP Tier
                  </div>
                  <h3 className="text-2xl font-serif font-bold">250 Ritual Points</h3>
                  <p className="text-xs text-emerald-100/80 mt-1">Earn 10 points for every ₹100 spent</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Award className="w-7 h-7 text-amber-300" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#F5E6E1] bg-white space-y-3 text-[#153323]">
                <h4 className="text-xs font-bold text-[#153323] uppercase tracking-wider">Available Perks & Promos</h4>
                <div className="flex items-center justify-between p-3 bg-[#FFF8F6] rounded-lg border border-[#E8D7D2]">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#153323] block">WELCOMERITUAL</span>
                    <span className="text-[11px] text-[#6B5A5C]">15% off your next cold-pressed formulation</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('WELCOMERITUAL');
                      showToast('Code Copied!', 'WELCOMERITUAL copied to clipboard');
                    }}
                    className="text-xs font-semibold text-[#C85A32] hover:underline"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="p-4 rounded-xl border border-[#F5E6E1] bg-white space-y-2 text-[#153323]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#153323] uppercase tracking-wider">Default Shipping Address</span>
                <span className="px-2 py-0.5 text-[10px] bg-[#153323]/10 text-[#153323] font-semibold rounded">Primary</span>
              </div>
              <p className="text-xs font-medium text-[#2C1A1D] pt-1">{currentUser?.name || 'Aarav Sharma'}</p>
              <p className="text-xs text-[#6B5A5C]">42 Lotus Garden, Jubilee Hills</p>
              <p className="text-xs text-[#6B5A5C]">Hyderabad, Telangana 500033 — India</p>
              <p className="text-xs text-[#6B5A5C] pt-1">Phone: +91 98765 43210</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FFF8F6] px-6 py-4 border-t border-[#F5E6E1] flex items-center justify-between">
          <button
            onClick={() => {
              logoutUser();
              onClose();
            }}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Log Out
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#153323] text-white rounded-xl text-xs font-semibold hover:bg-[#1C4430] transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
`;

fs.writeFileSync('src/components/CustomerAccountModal.tsx', content);
console.log("Rewrote CustomerAccountModal.tsx");
