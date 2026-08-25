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
    setSelectedCategory('All');
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

      {/* Order Tracking */}
      <button
        onClick={() => setCurrentView('order-tracking')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          currentView === 'order-tracking' ? 'text-emerald-400 font-bold' : 'text-emerald-100/60 hover:text-white'
        }`}
      >
        <PackageCheck className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-wider uppercase whitespace-nowrap">My Order</span>
      </button>
    </nav>
  );
};
