import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useShop } from '../context/ShopContext';
import { User, Package, Award, MapPin, X, ArrowRight, Sparkles, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { OrderHistory } from './OrderHistory';

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
    setTimeout(() => {
      loginUser(email || 'customer@kriyalifescience.com', name || 'Valued Patron');
      showToast(isLoginMode ? 'Welcome Back' : 'Account Created', isLoginMode ? 'Signed in successfully.' : 'Account created successfully.');
      setIsLoading(false);
    }, 400);
  };

  if (!currentUser) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <div 
          className="bg-stone-900/90 backdrop-blur-2xl text-white w-full max-w-md rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col animate-scaleUp relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">{isLoginMode ? 'Sign In' : 'Create Account'}</h2>
              <p className="text-xs text-emerald-100/70 mt-2 font-light">Access your orders, rewards, and saved items.</p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-xs font-bold text-white uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya R."
                    className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-emerald-500 text-stone-950 font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-stone-950" />}
                {isLoginMode ? 'LOG IN SECURELY' : 'SIGN UP'}
              </button>
            </form>
            
            <p className="text-center text-xs text-emerald-100/70 mt-4">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-stone-900/90 backdrop-blur-2xl text-white w-full max-w-2xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-emerald-950/80 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Welcome, {currentUser.name || 'Botanical Member'}</h2>
              <p className="text-xs text-emerald-300">Kriya Ritual Member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close account modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-stone-950 px-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-emerald-400 text-emerald-400 bg-stone-900/60'
                : 'border-transparent text-emerald-100/70 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Order History
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'rewards'
                ? 'border-emerald-400 text-emerald-400 bg-stone-900/60'
                : 'border-transparent text-emerald-100/70 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            Ritual Rewards
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-emerald-400 text-emerald-400 bg-stone-900/60'
                : 'border-transparent text-emerald-100/70 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Saved Address
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'orders' && <OrderHistory onClose={onClose} />}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-stone-900 text-white flex items-center justify-between shadow-lg border border-emerald-500/30">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    Botanical VIP Tier
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">250 Ritual Points</h3>
                  <p className="text-xs text-emerald-100/80 mt-1">Earn 10 points for every ₹100 spent</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Award className="w-7 h-7 text-amber-300" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-stone-950 space-y-3 text-white">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Available Perks & Promos</h4>
                <div className="flex items-center justify-between p-3 bg-stone-900/80 rounded-lg border border-white/10">
                  <div>
                    <span className="font-mono text-xs font-bold text-white block">WELCOMERITUAL</span>
                    <span className="text-[11px] text-emerald-100/70">15% off your next cold-pressed formulation</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('WELCOMERITUAL');
                      showToast('Code Copied!', 'WELCOMERITUAL copied to clipboard');
                    }}
                    className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="p-4 rounded-xl border border-white/10 bg-stone-950 space-y-2 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Default Shipping Address</span>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold rounded">Primary</span>
              </div>
              <p className="text-xs font-medium text-white pt-1">{currentUser?.name || 'Aarav Sharma'}</p>
              <p className="text-xs text-emerald-100/70">42 Lotus Garden, Jubilee Hills</p>
              <p className="text-xs text-emerald-100/70">Hyderabad, Telangana 500033 — India</p>
              <p className="text-xs text-emerald-100/70 pt-1">Phone: +91 98765 43210</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-950 px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              logoutUser();
              onClose();
            }}
            className="text-xs font-semibold text-red-400 hover:underline cursor-pointer"
          >
            Log Out
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 text-stone-950 font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
