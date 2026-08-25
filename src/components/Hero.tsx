import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Droplet, ShoppingBag, Star, Check } from 'lucide-react';
import { motion } from 'motion/react';
import heroBgImage from '../assets/images/regenerated_image_1784986939391.png';
import comboHeroNewImg from '../assets/images/regenerated_image_1786447986783.jpg';

export const Hero: React.FC = () => {
  const { products, addToCart, setSelectedProduct, setSelectedCategory, setIsSkinQuizOpen, setIsCartOpen, setCurrentView } = useShop();

  // Retrieve the primary combo duo product
  const comboProduct = products.find(p => p.id === 'kriya-glow-renew-combo') || products[0];

  const handleAddComboToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (comboProduct) {
      addToCart(comboProduct, 1);
      setCurrentView('checkout');
      const navigate = (window as any)._navigate;
      if (navigate) navigate('/checkout');
    }
  };

  const handleQuickViewCombo = () => {
    if (comboProduct) {
      setSelectedProduct(comboProduct);
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center bg-[#0D2217] text-white py-12 sm:py-16 md:py-24 border-b border-[#1C4430]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={heroBgImage} 
          alt="Kriya Life Science Hero Background" 
          className="w-full h-full object-cover object-center lg:object-right transform scale-100 sm:scale-105 transition-transform duration-1000 filter brightness-105 sm:brightness-95"
          referrerPolicy="no-referrer"
        />
        {/* Desktop Gradient Overlay */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#0A1D13] via-[#0A1D13]/85 to-transparent z-10" />
        {/* Mobile Gradient Overlay */}
        <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-[#0A1D13]/85 via-black/40 to-[#0A1D13]/95 z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="order-2 lg:order-1 lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-xs font-semibold text-emerald-300 tracking-widest uppercase"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Pure Botanical Formulations</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl lg:text-7xl text-white font-normal leading-[1.15] sm:leading-[1.1] tracking-tight drop-shadow-md"
            >
              SCIENCE BEHIND <br className="hidden lg:block" />
              <span className="italic font-light text-emerald-300">NATURAL BEAUTY</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden sm:block text-base sm:text-lg text-emerald-100/90 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed drop-shadow-sm"
            >
              Transform your daily skin regimen with cold-pressed bioactive serums, 
              nutrient-dense botanical face washes, and clinically proven night creams 
              crafted to illuminate your natural aura.
            </motion.p>



            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-8 pt-4 sm:pt-6 border-t border-white/15 w-full max-w-xl mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-emerald-100/90 uppercase tracking-wider text-left">Dermatologist<br className="hidden sm:block" /> Approved</span>
              </div>
              <div className="h-8 w-px bg-white/15 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-emerald-100/90 uppercase tracking-wider text-left">100% Natural<br className="hidden sm:block" /> Bioactives</span>
              </div>
              <div className="h-8 w-px bg-white/15 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <Droplet className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-emerald-100/90 uppercase tracking-wider text-left">Paraben &amp;<br className="hidden sm:block" /> Toxin Free</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column Featured Combo Showcase Card - Mobile & Tablet Only */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="order-1 lg:order-2 lg:hidden w-full max-w-md mx-auto"
          >
            <div 
              onClick={handleQuickViewCombo}
              className="group relative bg-stone-900/90 backdrop-blur-2xl rounded-3xl border border-emerald-500/30 overflow-hidden shadow-2xl hover:border-emerald-400/60 transition-all duration-300 cursor-pointer text-white"
            >
              {/* Badge Overlay */}
              <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
                <span className="bg-emerald-500 text-stone-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-stone-950" />
                  Featured Combo Duo
                </span>
                <span className="bg-amber-400 text-stone-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg">
                  SAVE 28%
                </span>
              </div>

              {/* Combo Image Container */}
              <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden">
                <img 
                  src={comboHeroNewImg} 
                  alt="Kriya Complete Glow & Renew Combo Duo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/20" />
              </div>

              {/* Combo Product Details */}
              <div className="p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-xs font-bold text-white ml-1">5.0</span>
                    <span className="text-[10px] text-emerald-100/60">(342 Reviews)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                    24-Hour Coverage
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    Complete Glow &amp; Renew Combo Duo
                  </h3>
                  <p className="text-xs text-emerald-100/80 mt-1 line-clamp-1">
                    Vitamin C Face Wash (100ml) + Olive Night Cream (30g)
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2 text-xs text-emerald-200/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Morning Cleansing + Overnight Barrier Repair</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-200/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Botanical Gift Packaging &amp; Express Delivery</span>
                  </div>
                </div>

                {/* Price and CTA Button */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-100/60">Bundle Price</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">₹899</span>
                      <span className="text-xs text-stone-400 line-through font-medium">₹1,248</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddComboToCart}
                    className="px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2 shrink-0 group/btn"
                  >
                    <Sparkles className="w-4 h-4 fill-stone-950" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

