import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setCurrentView,
    viewProductDetails
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  const { subtotal, discount, shipping, tax, total } = getCartTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      setPromoInput('');
    }
  };

  return (
    <div className="bg-[#0D2217] text-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 block mb-1">
              Your Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white">
              Botanical Ritual Cart
            </h1>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/15 max-w-xl mx-auto space-y-4 shadow-2xl">
            <ShoppingBag className="w-16 h-16 text-emerald-400 mx-auto opacity-40" />
            <h2 className="font-serif text-2xl font-semibold text-white">Your cart is currently empty</h2>
            <p className="text-sm text-emerald-100/70 max-w-md mx-auto font-light">
              Explore our bioactive skincare formulations, glass skin oils, and hydrating lip tints.
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-4 px-8 py-3 bg-emerald-500 text-stone-950 font-extrabold text-xs rounded-full hover:bg-emerald-400 transition-all shadow-lg uppercase tracking-wider cursor-pointer"
            >
              EXPLORE KRIYA CATALOG
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Item List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/15 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-emerald-200/70">
                  <span>Product Details</span>
                  <div className="hidden sm:flex items-center gap-12 pr-4">
                    <span>Quantity</span>
                    <span>Subtotal</span>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {cart.map((item) => (
                    <div
                      key={item.product.id + (item.selectedShade?.name || '')}
                      className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product Thumbnail & Title */}
                      <div className="flex items-center gap-4 flex-1">
                        <ImageWithFallback
                          src={item.product.images[0]}
                          alt={item.product.name}
                          onClick={() => viewProductDetails(item.product)}
                          className="w-20 h-20 object-cover rounded-2xl cursor-pointer shadow-md hover:scale-105 transition-transform"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                            {item.product.category}
                          </span>
                          <h3
                            onClick={() => viewProductDetails(item.product)}
                            className="font-serif text-base font-semibold text-white hover:text-emerald-300 cursor-pointer transition-colors"
                          >
                            {item.product.name}
                          </h3>
                          {item.selectedShade && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className="w-3 h-3 rounded-full border border-white/40"
                                style={{ backgroundColor: item.selectedShade.colorHex }}
                              />
                              <span className="text-xs text-emerald-100/70">{item.selectedShade.name}</span>
                            </div>
                          )}
                          <span className="text-sm font-bold text-white block mt-1">₹{item.product.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-10 pt-2 sm:pt-0 border-t sm:border-0 border-white/10">
                        {/* Quantity Counter */}
                        <div className="flex items-center bg-stone-950 border border-white/20 rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedShade?.name)}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedShade?.name)}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="flex items-center gap-4">
                          <span className="font-serif text-base font-bold text-white">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedShade?.name)}
                            className="text-white/40 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                  <button
                    onClick={clearCart}
                    className="text-white/50 hover:text-rose-400 transition-colors underline cursor-pointer"
                  >
                    Clear Entire Cart
                  </button>
                  <span className="text-emerald-100/60 font-medium">
                    {cart.length} unique formulation(s) in cart
                  </span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/15 shadow-xl space-y-6">
                <h3 className="font-serif text-xl font-semibold text-white pb-3 border-b border-white/10">
                  Order Summary
                </h3>

                {/* Promo Coupon Applicator */}
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-950/80 p-3 rounded-2xl border border-emerald-500/30 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300 font-medium">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>Code <strong>{appliedPromo}</strong> active</span>
                    </div>
                    <button onClick={removePromoCode} className="text-emerald-400 hover:underline font-semibold cursor-pointer">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">Promo Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="e.g. KRIYA10"
                        className="flex-1 px-4 py-2.5 bg-stone-950 border border-white/20 rounded-xl text-xs uppercase focus:outline-none focus:border-emerald-400 text-white placeholder-white/40"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-500 text-stone-950 text-xs font-extrabold rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer"
                      >
                        APPLY
                      </button>
                    </div>
                  </form>
                )}

                {/* Price Lines */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-emerald-100/80">
                    <span>Subtotal</span>
                    <span className="font-medium text-white">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                  )}


                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-bold text-base text-white">
                    <span>Total Amount</span>
                    <span className="text-2xl text-emerald-400 font-serif">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  id="cart-page-checkout-btn"
                  onClick={() => setCurrentView('checkout')}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs rounded-full transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer uppercase tracking-wider"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>

                {/* Secure Guarantee */}
                <div className="pt-2 text-center text-[11px] text-emerald-100/60 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-medium text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
