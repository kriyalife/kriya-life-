import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setCurrentView } = useShop();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#0D2217] text-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 block mb-1">
              Your Personal Sanctuary
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white">
              Saved Botanical Wishlist
            </h1>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </button>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/15 max-w-lg mx-auto space-y-4 shadow-2xl">
            <Heart className="w-16 h-16 text-emerald-400 mx-auto opacity-30" />
            <h2 className="font-serif text-2xl font-semibold text-white">Your wishlist is currently empty</h2>
            <p className="text-xs text-emerald-100/70 font-light">
              Click the heart icon on any product to save your favorite formulations for later.
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-4 px-8 py-3 bg-emerald-500 text-stone-950 font-extrabold text-xs rounded-full hover:bg-emerald-400 transition-all shadow-lg uppercase tracking-wider cursor-pointer"
            >
              EXPLORE KRIYA CATALOG
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
