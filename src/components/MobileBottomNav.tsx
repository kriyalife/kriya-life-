import React from 'react';
import { useShop } from '../context/ShopContext';
import { Home, Grid, Sparkles, PackageCheck, ShoppingBag, Heart } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    cart, 
    wishlist,
    currentView, 
    setCurrentView, 
    setIsCartOpen, 
    setIsSkinQuizOpen,
    setSelectedCategory 
  } = useShop();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleHomeClick = () => {
    setCurrentView('home');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopClick = () => {
    setCurrentView('home');
    const catalogEl = document.getElementById('kriya-products-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-2xl border-t border-emerald-500/20 px-2 py-2 text-white shadow-2xl flex items-center justify-around">
      {/* Home */}
      <button
        onClick={handleHomeClick}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          currentView === 'home' ? 'text-emerald-400 font-bold' : 'text-emerald-100/60 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-wider uppercase">Home</span>
      </button>

      {/* Shop Catalog */}
      <button
        onClick={handleShopClick}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all text-emerald-100/60 hover:text-white cursor-pointer"
      >
        <Grid className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-wider uppercase">Shop</span>
      </button>

      {/* Skin Quiz CTA */}
      <button
        onClick={() => setIsSkinQuizOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all text-emerald-300 hover:text-white cursor-pointer"
      >
        <div className="p-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full mb-0.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-300">Quiz</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => setCurrentView('wishlist')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
          currentView === 'wishlist' ? 'text-emerald-400 font-bold' : 'text-emerald-100/60 hover:text-white'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5 mb-0.5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-emerald-400 text-stone-950 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-wider uppercase">Saved</span>
      </button>

      {/* Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all text-emerald-100/60 hover:text-white cursor-pointer relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 mb-0.5 text-emerald-400" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-2.5 bg-emerald-400 text-stone-950 text-[9px] font-black rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center shadow-md">
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-extrabold tracking-wider uppercase text-white">Cart</span>
      </button>
    </nav>
  );
};
