import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Shade } from '../types';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Ban, 
  Check, 
  Plus, 
  Minus, 
  Sparkles, 
  ArrowLeft,
  Share2,
  MessageSquarePlus,
  Leaf
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductGallery } from './ProductGallery';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedProduct,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
    addReviewToProduct,
    showToast,
    currentUser,
    loginUser
  } = useShop();

  const product = selectedProduct || products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="py-20 text-center bg-[#0D2217] text-white min-h-[60vh]">
        <p className="text-base font-semibold text-white">No product selected.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-6 py-2.5 bg-emerald-500 text-stone-950 font-bold text-xs rounded-full hover:bg-emerald-400 transition-all uppercase tracking-wider"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(
    product.shades ? product.shades[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'usage' | 'reviews'>('details');

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  
  // Login Form state for Review
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedShade);
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      showToast('Authentication Required', 'Please log in to place an order.', 'warning');
      // Just redirect to login
      const navigate = (window as any)._navigate;
      if (navigate) {
         navigate('/login?returnUrl=/checkout');
      } else {
         setCurrentView('checkout'); // Let checkout handle redirect
      }
      return;
    }
    addToCart(product, quantity, selectedShade);
    setCurrentView('checkout');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = currentUser?.name || reviewName;
    if (!finalName || !reviewTitle || !reviewComment) {
      showToast('Form Incomplete', 'Please fill out all fields.', 'warning');
      return;
    }
    addReviewToProduct(product.id, finalName, reviewRating, reviewTitle, reviewComment);
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestseller))
    .slice(0, 4);

  return (
    <div className="bg-[#0D2217] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button
            id="pdp-back-btn"
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Botanical Collection</span>
          </button>

          <nav className="hidden sm:flex items-center gap-2 text-xs text-emerald-100/60 font-medium">
            <span className="cursor-pointer hover:text-white" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="cursor-pointer hover:text-white" onClick={() => setCurrentView('home')}>{product.category}</span>
            <span>/</span>
            <span className="text-white font-semibold">{product.name}</span>
          </nav>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery 
              media={product.media || product.images.map(src => ({ type: 'image', src }))}
              productName={product.name}
              isBestseller={product.isBestseller}
              isOrganic={product.isOrganic}
              isFavorite={isFavorite}
              onToggleWishlist={() => toggleWishlist(product.id)}
            />
          </div>

          {/* Right Column: Product Info & Buy Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-400 block mb-1">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium leading-tight">
                {product.name}
              </h1>
              <p className="text-sm font-semibold text-emerald-300 mt-1 italic">
                "{product.tagline}"
              </p>

              {/* Introductory Paragraph */}
              {product.introParagraph && (
                <div className="mt-3 p-4 bg-stone-900/60 backdrop-blur-xl rounded-2xl border border-white/15 text-xs text-emerald-100/80 leading-relaxed font-light">
                  {product.introParagraph}
                </div>
              )}

              {/* Key Features & Highlights Pills */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {product.highlights.map((hl, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      {hl}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30">
                  <div className="flex text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating) ? 'fill-amber-300 text-amber-300' : 'text-amber-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-200">{product.rating}</span>
                  <span className="text-xs text-amber-300/80">({product.reviewsCount} reviews)</span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-white/50 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="bg-emerald-500 text-stone-950 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
              <span className="text-xs font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-md tracking-wide shadow-xs inline-flex items-center">
                / {product.volume}
              </span>
            </div>

            {/* Shade Selection (If Applicable) */}
            {product.shades && product.shades.length > 0 && (
              <div className="bg-stone-900/60 backdrop-blur-xl p-4 rounded-2xl border border-white/15">
                <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  Select Shade: <span className="text-emerald-400">{selectedShade?.name}</span>
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.shades.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShade(shade)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedShade?.name === shade.name
                          ? 'border-emerald-400 bg-emerald-950 text-white shadow-md'
                          : 'border-white/20 hover:border-white/40 text-emerald-100/80'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                        style={{ backgroundColor: shade.colorHex }}
                      />
                      <span>{shade.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center bg-stone-900 border border-white/20 rounded-full p-1.5 shadow-md">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  id="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-sm rounded-full transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-950" />
                  <span>ADD TO RITUAL CART — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                id="pdp-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-white text-stone-950 hover:bg-emerald-100 font-extrabold text-sm rounded-full transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>INSTANT BUY NOW & CHECKOUT</span>
              </button>
            </div>

            {/* Express Value Props */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Fast Express Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
                <Ban className="w-4 h-4 text-rose-400" />
                <span>Not Returnable</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Dermatologically Tested</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>100% Recyclable Glass</span>
              </div>
            </div>
          </div>

        </div>

        {/* Tabbed Detailed Sections */}
        <div className="mt-16 bg-stone-900/60 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl">
          <div className="flex items-center gap-4 border-b border-white/10 overflow-x-auto pb-4 mb-8">
            {[
              { id: 'details', label: 'Formulation Details' },
              { id: 'ingredients', label: 'Botanical Ingredients' },
              { id: 'usage', label: 'How to Use' },
              { id: 'reviews', label: `Customer Reviews (${product.reviewsCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-sm font-semibold uppercase tracking-wider py-2 px-4 rounded-full transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-stone-950 font-bold shadow-md'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Details & Benefits */}
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-white">Pure Science Meets Botanical Alchemy</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed mt-2 font-light">{product.description}</p>
              </div>

              {/* Product Benefits Section */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Product Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.benefits.map((b, idx) => (
                      <div key={idx} className="p-4 bg-stone-900/80 rounded-2xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-xs text-white">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{b.title}</span>
                        </div>
                        <p className="text-xs text-emerald-100/70 pl-6 leading-relaxed font-light">{b.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Suitable Skin Types</h4>
                <div className="flex flex-wrap gap-2">
                  {(product.skinTypes || []).map((st) => (
                    <span key={st} className="px-3.5 py-1 bg-emerald-950/80 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-white">Active Botanical Bio-Actives</h3>
                <p className="text-xs text-emerald-100/60 mt-1 font-light">Formulated without parabens, sulfates, phthalates, synthetic dyes, or silicone fillers.</p>
              </div>

              {/* Detailed Ingredients with Function Descriptions */}
              {product.detailedIngredients && product.detailedIngredients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.detailedIngredients.map((item, idx) => (
                    <div key={idx} className="p-4 bg-stone-900/80 rounded-2xl border border-white/10 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-xs text-white">
                        <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      <p className="text-xs text-emerald-100/75 pl-6 leading-relaxed font-light">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(product.ingredients || []).map((ing) => (
                    <div key={ing} className="p-3 bg-stone-900/80 rounded-xl border border-white/10 flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-white">{ing}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Usage */}
          {activeTab === 'usage' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-2xl font-semibold text-white">The KRIYA Application Ritual</h3>
              <div className="p-5 bg-emerald-950/80 rounded-2xl border border-emerald-500/30">
                <p className="text-sm text-emerald-100 font-medium leading-relaxed">{product.howToUse}</p>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews & Add Review */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-white">Verified Community Feedback</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-amber-300">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-white">{product.rating} out of 5 stars</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-5 py-2.5 bg-emerald-500 text-stone-950 font-bold text-xs rounded-full hover:bg-emerald-400 transition-colors flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>WRITE A REVIEW</span>
                </button>
              </div>

              {/* Review Submission Form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-stone-900/90 p-6 rounded-2xl border border-white/15 space-y-4 overflow-hidden"
                  >
                    {!currentUser ? (
                      <div className="space-y-4">
                        <h4 className="font-serif text-lg font-semibold text-[#153323]">Log In to Share Your Experience</h4>
                        <p className="text-xs text-[#153323]/70">Please enter your details to write a review.</p>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (loginEmail && loginName) {
                              loginUser(loginEmail, loginName);
                            }
                          }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <div>
                            <label className="block text-xs font-bold text-[#153323] uppercase mb-1">Your Name</label>
                            <input
                              type="text"
                              value={loginName}
                              onChange={(e) => setLoginName(e.target.value)}
                              placeholder="e.g. Maya R."
                              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2C523B]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#153323] uppercase mb-1">Email Address</label>
                            <input
                              type="email"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="maya@example.com"
                              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2C523B]"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-[#153323] text-white font-semibold text-xs rounded-full hover:bg-[#4CAF50] transition-colors"
                            >
                              LOG IN SECURELY
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <h4 className="font-serif text-lg font-semibold text-[#153323]">Share Your Ritual Experience</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#153323] uppercase mb-1">Your Name</label>
                            <input
                              type="text"
                              value={currentUser.name}
                              disabled
                              className="w-full px-4 py-2 bg-gray-100 rounded-xl border border-gray-200 text-sm text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#153323] uppercase mb-1">Star Rating</label>
                            <select
                              value={reviewRating}
                              onChange={(e) => setReviewRating(Number(e.target.value))}
                              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2C523B]"
                            >
                              <option value="5">5 Stars - Exceptional</option>
                              <option value="4">4 Stars - Very Good</option>
                              <option value="3">3 Stars - Average</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#153323] uppercase mb-1">Review Headline</label>
                          <input
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="e.g. Leaves my skin glowing all day!"
                            className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2C523B]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#153323] uppercase mb-1">Detailed Review</label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={3}
                            placeholder="Describe texture, aroma, feel, and results..."
                            className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2C523B]"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#2C523B] text-white font-semibold text-xs rounded-full hover:bg-[#1C4430]"
                        >
                          SUBMIT REVIEW
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reviews List */}
              <div className="space-y-4">
                {(product.reviews || []).map((rev) => (
                  <div key={rev.id} className="p-5 bg-[#FAFCFA] rounded-2xl border border-[#E8F3E9] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#153323]">{rev.userName}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#153323]/50">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-500 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>

                    <h5 className="font-bold text-sm text-[#153323]">{rev.title}</h5>
                    <p className="text-xs text-[#153323]/80 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-semibold text-[#153323]">Complete Your Beauty Ritual</h3>
              <button
                onClick={() => setCurrentView('home')}
                className="text-xs font-bold text-[#2C523B] uppercase tracking-wider hover:underline"
              >
                View Full Catalog →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
