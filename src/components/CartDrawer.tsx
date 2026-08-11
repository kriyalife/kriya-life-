import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setCurrentView,
    currentUser,
    showToast
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  const { subtotal, discount, shipping, tax, total } = getCartTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      showToast('Authentication Required', 'Please sign in or create an account to proceed.', 'warning');
      // Let the main layout handle the rest, or just don't go to checkout
      return;
    }
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#153323]/60 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#0D2217] text-white shadow-2xl flex flex-col border-l border-white/15"
            >
              {/* Header */}
              <div className="p-6 bg-stone-900/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-serif text-xl font-semibold text-white">Your Botanical Cart</h3>
                  <span className="text-xs bg-emerald-950 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {cart.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-emerald-400 mx-auto opacity-40" />
                    <p className="font-serif text-lg font-medium text-white">Your cart is currently empty</p>
                    <p className="text-xs text-emerald-100/60">Discover our botanical elixirs and lip rituals to get started.</p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setCurrentView('home');
                      }}
                      className="mt-4 px-6 py-2.5 bg-emerald-500 text-stone-950 font-bold text-xs rounded-full hover:bg-emerald-400 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      EXPLORE COLLECTION
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id + (item.selectedShade?.name || '')}
                      className="p-4 bg-stone-900/80 rounded-2xl border border-white/15 flex gap-4 relative shadow-md"
                    >
                      <ImageWithFallback
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl shrink-0"
                      />
                      <div className="flex-1 pr-6">
                        <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">{item.product.category}</span>
                        <h4 className="font-serif text-sm font-semibold text-white line-clamp-1">{item.product.name}</h4>
                        {item.selectedShade && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: item.selectedShade.colorHex }} />
                            <span className="text-[11px] text-emerald-100/70">{item.selectedShade.name}</span>
                          </div>
                        )}
                        <span className="text-xs font-bold text-white block mt-1">₹{item.product.price.toLocaleString('en-IN')}</span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedShade?.name)}
                            className="p-1 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedShade?.name)}
                            className="p-1 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedShade?.name)}
                        className="absolute top-4 right-4 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-stone-900/90 border-t border-white/10 space-y-4">
                  {/* Promo Input */}
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-500/30 text-xs text-white">
                      <div className="flex items-center gap-2 text-emerald-300 font-medium">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <span>Code <strong>{appliedPromo}</strong> applied</span>
                      </div>
                      <button onClick={removePromoCode} className="text-emerald-400 hover:underline text-[11px] cursor-pointer">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo Code (e.g. KRIYA10)"
                        className="flex-1 px-3 py-2 bg-stone-950 border border-white/20 rounded-xl text-xs uppercase focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-500 text-stone-950 text-xs font-extrabold rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer"
                      >
                        APPLY
                      </button>
                    </form>
                  )}

                  {/* Summary rows */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-emerald-100/70">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-white/10">
                      <span>Estimated Total</span>
                      <span className="text-emerald-400">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      id="drawer-checkout-btn"
                      onClick={handleCheckoutClick}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs rounded-full transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                    >
                      <span>PROCEED TO CHECKOUT</span>
                      <ArrowRight className="w-4 h-4 text-stone-950" />
                    </button>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setCurrentView('cart');
                      }}
                      className="w-full py-2.5 bg-transparent text-emerald-300 hover:text-white text-xs font-semibold uppercase hover:underline text-center block cursor-pointer"
                    >
                      View Detailed Cart Page
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
