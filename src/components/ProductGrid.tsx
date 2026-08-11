import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Category } from '../types';
import { RefreshCw, Sparkles, Search, X } from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Combos & Kits',
  'Face Cleansers',
  'Moisturizers & Creams'
];

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    filterOnlyBestsellers,
    filterOnlyOrganic,
    filterOnlyNew,
    setFilterOnlyBestsellers,
    setFilterOnlyOrganic,
    setFilterOnlyNew
  } = useShop();

  // Filter products logic
  const filteredProducts = products.filter((product) => {
    // Category match
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }

    // Search query match
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (product?.name || '').toLowerCase().includes(q);
      const matchCategory = (product?.category || '').toLowerCase().includes(q);
      const matchTagline = (product?.tagline || '').toLowerCase().includes(q);
      const matchIngredient = Array.isArray(product?.ingredients)
        ? product.ingredients.some((i) => (i || '').toLowerCase().includes(q))
        : false;
      if (!matchName && !matchCategory && !matchTagline && !matchIngredient) return false;
    }

    // Price range match
    if (product.price > priceRange) return false;

    // Badges match
    if (filterOnlyBestsellers && !product.isBestseller) return false;
    if (filterOnlyOrganic && !product.isOrganic) return false;
    if (filterOnlyNew && !product.isNew) return false;

    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // popular / default
  });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('popular');
    setPriceRange(10000);
    setFilterOnlyBestsellers(false);
    setFilterOnlyOrganic(false);
    setFilterOnlyNew(false);
  };

  return (
    <section id="kriya-products-catalog" className="relative py-16 md:py-24 bg-[#0D2217] text-white border-b border-[#1C4430]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-emerald-400 block mb-4">
            Curated Formulations
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-white leading-tight drop-shadow-md">
            Discover Your Ritual
          </h2>
          <p className="text-base text-emerald-100/80 mt-4 max-w-xl mx-auto font-light leading-relaxed">
            Elegantly crafted botanical skincare designed to nurture, balance, and restore your skin's natural vitality.
          </p>
        </div>

        {/* Visible Search & Filter Bar */}
        <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/15 shadow-2xl mb-8 space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-400 text-stone-950 shadow-md scale-105'
                      : 'bg-black/40 text-emerald-100/70 hover:text-white border border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Main Search Bar - Full Width */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulations (e.g., cleanser, vitamin C, glow...)"
              className="block w-full pl-11 pr-10 py-3 bg-black/40 border border-white/15 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/50 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-end gap-4 pt-4 border-t border-white/10">

            {/* Price & Sort Controls */}
            <div className="flex items-center gap-4 flex-wrap justify-between lg:justify-end">
              {/* Price Slider */}
              <div className="flex items-center gap-2 bg-black/30 px-3.5 py-1.5 rounded-full border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs font-medium text-emerald-200/80 shrink-0">Max Price:</span>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full sm:w-36 accent-emerald-400 cursor-pointer flex-1"
                />
                <span className="text-xs font-bold text-white min-w-[55px] text-right shrink-0">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>

              {/* Sort Select */}
              <div className="flex items-center gap-2 bg-black/30 px-3.5 py-1.5 rounded-full border border-white/10">
                <span className="text-xs font-medium text-emerald-200/80">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer [&>option]:bg-stone-900 [&>option]:text-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Reset Filters button */}
              <button
                onClick={resetFilters}
                className="p-2 text-white/60 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count & Product Grid */}
        <div className="mb-6 text-xs font-semibold uppercase tracking-wider text-emerald-200/90">
          Showing {sortedProducts.length} KRIYA Formulations
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-white/15 p-8">
            <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="font-serif text-2xl font-medium text-white">No formulations match your filter criteria</h3>
            <p className="text-sm text-emerald-100/70 mt-1 max-w-md mx-auto">
              Try adjusting your max price or resetting search filters to view full KRIYA botanical catalog.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 bg-emerald-500 text-stone-950 text-xs font-bold rounded-full hover:bg-emerald-400 transition-all cursor-pointer uppercase tracking-wider"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

