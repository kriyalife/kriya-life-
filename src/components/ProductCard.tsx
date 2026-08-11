import React, { useState } from 'react';
import { Product, Shade } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, viewProductDetails } = useShop();
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(
    product.shades ? product.shades[0] : undefined
  );
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedShade);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-stone-900/80 backdrop-blur-xl rounded-3xl border border-white/15 overflow-hidden shadow-xl hover:shadow-2xl hover:border-emerald-400/50 transition-all duration-300 flex flex-col h-full text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div 
        onClick={() => viewProductDetails(product)}
        className="relative aspect-[4/5] sm:aspect-square w-full bg-black/40 overflow-hidden cursor-pointer"
      >
        <ImageWithFallback
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              SALE
            </span>
          )}
          {product.isOrganic && (
            <span className="bg-emerald-500 text-stone-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              NATURAL
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border border-white/20 shadow-md transition-all z-10 ${
            isFavorite
              ? 'bg-emerald-500 text-stone-950'
              : 'bg-stone-900/70 text-white hover:bg-emerald-500 hover:text-stone-950'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Floating Overlay */}
        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              viewProductDetails(product);
            }}
            className="flex-1 bg-stone-900/90 border border-white/20 backdrop-blur-md hover:bg-emerald-500 hover:text-stone-950 text-white text-xs font-semibold py-2 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400 group-hover:text-stone-950" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-stone-900/60 backdrop-blur-md">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-300 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{product.rating}</span>
              <span className="text-white/50 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Name */}
          <h3 
            onClick={() => viewProductDetails(product)}
            className="font-serif text-sm sm:text-base font-medium text-white hover:text-emerald-300 transition-colors cursor-pointer line-clamp-2"
          >
            {product.name}
          </h3>

          {/* Shades Selector (If Applicable) */}
          {product.shades && product.shades.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-white/10">
              <span className="text-[10px] font-semibold text-emerald-200/80 uppercase tracking-wider block mb-1.5">
                Shade: <span className="text-white font-bold">{selectedShade?.name}</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.shades.map((shade) => (
                  <button
                    key={shade.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShade(shade);
                    }}
                    title={shade.name}
                    className={`w-5 h-5 rounded-full border border-white/40 shadow-xs transition-transform flex items-center justify-center ${
                      selectedShade?.name === shade.name ? 'scale-125 ring-2 ring-emerald-400' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: shade.colorHex }}
                  >
                    {selectedShade?.name === shade.name && (
                      <Check className="w-3 h-3 text-white drop-shadow-xs" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm sm:text-lg font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <>
                  <span className="text-[10px] sm:text-xs text-white/50 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] bg-emerald-500 text-stone-950 font-extrabold px-1.5 py-0.5 rounded-md">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] font-medium text-emerald-300/90 bg-emerald-950/60 border border-emerald-500/20 px-1.5 py-0.5 rounded-md inline-block mt-1 tracking-wide">{product.volume}</span>
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-[10px] sm:text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-stone-950" />
            <span className="hidden sm:inline">ADD TO CART</span>
            <span className="sm:hidden hidden min-[360px]:inline">ADD</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
