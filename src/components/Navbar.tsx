import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  PackageCheck, 
  User,
  ShieldCheck
} from 'lucide-react';
import { Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './ImageWithFallback';
import { KriyaLogo } from './KriyaLogo';
import { CustomerAccountModal } from './CustomerAccountModal';
import { BookOrderModal } from './BookOrderModal';
import kriyaLogoImg from '../assets/images/regenerated_image_1784990001904.png';

const CATEGORIES: Category[] = [
  'All',
  'Face Cleansers',
  'Moisturizers & Creams',
  'Combos & Kits'
];

export const Navbar: React.FC = () => {
  const {
    cart,
    wishlist,
    currentView,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    setIsCartOpen,
    setIsSkinQuizOpen,
    isBookOrderOpen,
    currentUser,
    logoutUser,
    setIsBookOrderOpen,
    searchQuery,
    setSearchQuery,
    products,
    viewProductDetails
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setCurrentView('home');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const filteredSearchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0D2217]/95 text-white shadow-xl border-b border-[#1C4430] py-0' 
          : 'bg-[#0D2217]/85 text-white border-b border-white/10 shadow-lg py-0.5'
      }`}
    >
      {/* Main Navbar Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left Group: Logo & Desktop Category Navigation */}
          <div className="flex items-center gap-3 xl:gap-6 min-w-0">
            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-emerald-300 transition-colors rounded-lg hover:bg-white/10 shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo Container */}
            <div 
              onClick={() => { setCurrentView('home'); setSelectedCategory('All'); }}
              className="cursor-pointer group flex items-center shrink-0 select-none py-1"
              title="KRIYA Life Science"
            >
              {!logoImgError ? (
                <img 
                  src={kriyaLogoImg} 
                  alt="KRIYA Life Science Logo"
                  fetchPriority="high"
                  loading="eager"
                  className="h-[36px] sm:h-[42px] md:h-[48px] w-auto object-contain brightness-0 invert transition-transform duration-300 ease-out group-hover:scale-105"
                  onError={() => setLogoImgError(true)}
                />
              ) : (
                <KriyaLogo 
                  className="h-[36px] sm:h-[42px] md:h-[48px] w-auto transition-transform duration-300 ease-out group-hover:scale-105 text-white" 
                  variant="full" 
                />
              )}
            </div>

            {/* Center Navigation Menu */}
            <nav className="hidden xl:flex items-center space-x-3 2xl:space-x-5 whitespace-nowrap">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category && currentView === 'home';
                return (
                  <button
                    key={category}
                    id={`nav-cat-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleCategoryClick(category)}
                    className={`text-[11px] 2xl:text-xs uppercase tracking-[0.12em] font-semibold transition-all relative py-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-white'
                        : 'text-emerald-100/70 hover:text-white'
                    }`}
                  >
                    {category}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryBorder"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}

              <button
                id="nav-about-us-btn"
                onClick={() => setCurrentView('about')}
                className={`text-[11px] 2xl:text-xs uppercase tracking-[0.12em] font-semibold transition-all relative py-2 cursor-pointer whitespace-nowrap ${
                  currentView === 'about'
                    ? 'text-white'
                    : 'text-emerald-100/70 hover:text-white'
                }`}
              >
                About Us
                {currentView === 'about' && (
                  <motion.div
                    layoutId="activeCategoryBorder"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            
            {/* Book Order Button */}
            <button
              id="book-order-nav-btn"
              onClick={() => setCurrentView('book-order')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all shadow-md shrink-0 ${
                currentView === 'book-order'
                  ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-300'
                  : 'bg-white/10 text-white hover:bg-emerald-500 hover:text-stone-950 border border-white/15'
              }`}
              title="Bulk Cosmetic Order (/book-order)"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 group-hover:text-stone-950 shrink-0" />
              <span className="hidden 2xl:inline whitespace-nowrap">Bulk Order</span>
            </button>

            {/* Admin Panel Button */}
            <button
              id="admin-panel-nav-btn"
              onClick={() => setCurrentView('admin')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all shadow-md shrink-0 ${
                currentView === 'admin'
                  ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-300'
                  : 'bg-white/10 text-white hover:bg-emerald-500 hover:text-stone-950 border border-white/15'
              }`}
              title="Admin Panel (/admin)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden 2xl:inline whitespace-nowrap">Admin Panel</span>
            </button>

            {/* Search Icon */}
            <button
              id="search-trigger-btn"
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 text-emerald-100/90 hover:text-white hover:bg-white/10 transition-colors rounded-full relative group cursor-pointer shrink-0"
              aria-label="Search KRIYA products"
              title="Search Formulations"
            >
              <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
            </button>

            {/* Track Order Icon */}
            <button
              id="nav-track-order-btn"
              onClick={() => setCurrentView('order-tracking')}
              className={`hidden md:flex p-2 text-emerald-100/90 hover:text-white hover:bg-white/10 transition-colors rounded-full relative group cursor-pointer shrink-0 ${
                currentView === 'order-tracking' ? 'text-white bg-white/15' : ''
              }`}
              title="Track Order"
            >
              <PackageCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
            </button>

            {/* Wishlist Icon */}
            <button
              id="nav-wishlist-btn"
              onClick={() => setCurrentView('wishlist')}
              className={`p-2 text-emerald-100/90 hover:text-white hover:bg-white/10 transition-colors rounded-full relative group cursor-pointer shrink-0 ${
                currentView === 'wishlist' ? 'text-white bg-white/15' : ''
              }`}
              aria-label="View Wishlist"
              title="Saved Items"
            >
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-emerald-500 text-stone-950 text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Icon */}
            {currentUser ? (
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <span 
                  className="text-xs font-semibold text-white px-2.5 py-1 bg-white/10 border border-white/15 rounded-full max-w-[110px] xl:max-w-[150px] truncate"
                  title={currentUser.email}
                >
                  {currentUser.email}
                </span>
                <button 
                  onClick={() => logoutUser()} 
                  className="text-xs font-semibold text-emerald-200 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex p-2 text-emerald-100/90 hover:text-white hover:bg-white/10 transition-colors rounded-full relative group cursor-pointer shrink-0" title="Login / Register">
                <User className="w-5 h-5 transition-transform group-hover:scale-110" />
              </Link>
            )}

            {/* Cart Icon with Count Badge UI */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-stone-950 font-bold rounded-full hover:bg-emerald-400 transition-all shadow-md group relative hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-stone-950 shrink-0" />
              <span className="text-xs font-extrabold tracking-widest hidden lg:inline">CART</span>
              <span className="bg-stone-950 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-2xs">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0D2217] border-b border-[#1C4430] px-6 py-6 space-y-4 text-white"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-serif text-base text-white font-bold tracking-wide">Categories</span>
              <button
                onClick={() => { setIsSkinQuizOpen(true); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 text-xs text-stone-950 font-bold bg-emerald-400 px-3 py-1.5 rounded-full"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Skin Quiz
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-left text-xs uppercase tracking-widest py-2.5 px-3 rounded-lg font-bold transition-colors ${
                    selectedCategory === cat ? 'bg-emerald-500 text-stone-950' : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => { setCurrentView('about'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>About Us</span>
              </button>
              <button
                onClick={() => { setCurrentView('book-order'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Bulk Cosmetic Order</span>
              </button>
              <button
                onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Management Panel</span>
              </button>
              <button
                onClick={() => { setCurrentView('order-tracking'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span>Track Active Order</span>
              </button>
              <button
                onClick={() => { setCurrentView('wishlist'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-emerald-400" />
                <span>Saved Wishlist ({wishlist.length})</span>
              </button>
              <button
                onClick={() => { setIsAccountModalOpen(true); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>My Account &amp; Sanctuary</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#153323]/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-[#FAFCFA] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 relative max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-stone-300 pb-4 mb-4">
                <div className="flex items-center gap-3 flex-1 pr-4">
                  <Search className="w-6 h-6 text-[#153323]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cleansers, creams, serums..."
                    className="w-full bg-transparent text-lg text-[#153323] placeholder-stone-500 focus:outline-none font-semibold"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="p-1.5 rounded-full text-stone-500 hover:text-white hover:bg-[#153323] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Results */}
              <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                {searchQuery.trim() === '' ? (
                  <div className="text-center py-8">
                    <p className="text-xs uppercase tracking-widest text-[#527834] font-bold mb-3">Popular Botanical Searches</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Cleanser', 'Moisturizer', 'Serum', 'Botanical Cream', 'Glow Night Gel'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-3.5 py-1.5 bg-stone-200/80 text-[#153323] hover:bg-[#153323] hover:text-white text-xs font-semibold rounded-full transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : filteredSearchResults.length === 0 ? (
                  <div className="text-center py-12 text-stone-500">
                    <p className="text-base font-medium">No botanical formulations found matching "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try searching for 'cleanser', 'cream', or 'serum'</p>
                  </div>
                ) : (
                  filteredSearchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        viewProductDetails(prod);
                        setIsSearchModalOpen(false);
                      }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-200/70 cursor-pointer transition-colors group"
                    >
                      <ImageWithFallback
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-14 h-14 object-cover rounded-lg shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-[#527834] uppercase tracking-wider">{prod.category}</span>
                        <h4 className="text-sm font-semibold text-[#153323] group-hover:text-[#527834] transition-colors">{prod.name}</h4>
                        <p className="text-xs text-stone-600 line-clamp-1">{prod.tagline}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#153323]">₹{prod.price.toLocaleString('en-IN')}</span>
                        <div className="flex items-center justify-end text-xs text-amber-600 font-medium">
                          ★ {prod.rating}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Account Modal */}
      <CustomerAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      {/* Direct Book Order Modal */}
      <BookOrderModal
        isOpen={isBookOrderOpen}
        onClose={() => setIsBookOrderOpen(false)}
      />
    </motion.header>
  );
};

