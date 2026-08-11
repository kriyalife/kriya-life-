import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, X, ArrowRight, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';

export const SkinQuizModal: React.FC = () => {
  const { isSkinQuizOpen, setIsSkinQuizOpen, products, viewProductDetails } = useShop();

  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState('');
  const [skinGoal, setSkinGoal] = useState('');
  const [finish, setFinish] = useState('');

  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  const handleFinishQuiz = () => {
    // Determine recommendation
    let match = products.find((p) => p.id === 'kriya-night-cream');
    if (skinGoal === 'pore-detox' || skinGoal === 'glass-glow') {
      match = products.find((p) => p.id === 'kriya-vit-c-facewash') || match;
    }

    setRecommendedProduct(match || products[0] || null);
    setStep(3.5); setTimeout(() => setStep(4), 2000);
  };

  const resetQuiz = () => {
    setStep(1);
    setSkinType('');
    setSkinGoal('');
    setFinish('');
    setRecommendedProduct(null);
  };

  return (
    <AnimatePresence>
      {isSkinQuizOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#0D2217] text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-white/20 relative space-y-6"
          >
          {/* Close button */}
          <button
            onClick={() => { setIsSkinQuizOpen(false); resetQuiz(); }}
            className="absolute top-4 right-4 text-white/60 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI Skin Analysis Engine
            </span>
            <h3 className="font-serif text-2xl font-medium text-white">
              {step <= 3 ? `Step ${step} of 3` : (step === 3.5 ? 'AI Formulating...' : 'Your AI Recommendation')}
            </h3>
          </div>

          {/* Step 1: Skin Type */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-center text-emerald-100/80 font-light">How would you describe your skin’s daily moisture balance?</p>
              <div className="space-y-2">
                {[
                  { id: 'dry', label: 'Dry & Dehydrated (Feels tight easily)' },
                  { id: 'combo', label: 'Combination (Oily T-zone, normal cheeks)' },
                  { id: 'oily', label: 'Oily / Congested (Prone to shine & pores)' },
                  { id: 'sensitive', label: 'Sensitive (Prone to reactivity)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSkinType(opt.id); setStep(2); }}
                    className="w-full text-left p-3.5 rounded-2xl bg-stone-900/80 border border-white/15 hover:border-emerald-400 text-xs font-semibold text-white hover:bg-emerald-950/60 transition-all cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Main Goal */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-center text-emerald-100/80 font-light">What is your primary skincare or cosmetic goal right now?</p>
              <div className="space-y-2">
                {[
                  { id: 'glass-glow', label: 'Ethereal Glass Skin & Candlelight Glow' },
                  { id: 'hydration', label: 'Deep Cellular Hydration & Barrier Repair' },
                  { id: 'anti-aging', label: 'Overnight Firming & Line Smoothing' },
                  { id: 'lip-hydration', label: 'Plump Velvet Lip Pigment & Nourishment' },
                  { id: 'pore-detox', label: 'Pore Tightening & Sebum Balance' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSkinGoal(opt.id); setStep(3); }}
                    className="w-full text-left p-3.5 rounded-2xl bg-stone-900/80 border border-white/15 hover:border-emerald-400 text-xs font-semibold text-white hover:bg-emerald-950/60 transition-all cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Finish Preference */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-center text-emerald-100/80 font-light">What texture & finish do you prefer on skin?</p>
              <div className="space-y-2">
                {[
                  { id: 'dewy', label: 'Dewy & Luminous Oil / Nectar' },
                  { id: 'satin', label: 'Silky Velvet Satin' },
                  { id: 'weightless', label: 'Weightless Sheer Veil' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setFinish(opt.id); handleFinishQuiz(); }}
                    className="w-full text-left p-3.5 rounded-2xl bg-stone-900/80 border border-white/15 hover:border-emerald-400 text-xs font-semibold text-white hover:bg-emerald-950/60 transition-all cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3.5: AI Formulating */}
          {step === 3.5 && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-emerald-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-emerald-300 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-white">Analyzing your profile...</p>
              <p className="text-xs text-emerald-100/70">Matching ingredients for optimal results</p>
            </div>
          )}

          {/* Step 4: Recommendation */}
          {step === 4 && recommendedProduct && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-stone-900/90 rounded-2xl border border-white/15 flex items-center gap-4 text-left">
                <ImageWithFallback
                  src={recommendedProduct.images[0]}
                  alt={recommendedProduct.name}
                  className="w-20 h-20 object-cover rounded-xl shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{recommendedProduct.category}</span>
                  <h4 className="font-serif text-base font-semibold text-white">{recommendedProduct.name}</h4>
                  <p className="text-xs text-emerald-100/70 line-clamp-2 mt-0.5 font-light">{recommendedProduct.tagline}</p>
                  <span className="text-sm font-bold text-white block mt-1">₹{recommendedProduct.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  viewProductDetails(recommendedProduct);
                  setIsSkinQuizOpen(false);
                  resetQuiz();
                }}
                className="w-full py-3.5 bg-emerald-500 text-stone-950 text-xs font-bold rounded-full hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>VIEW MATCHED FORMULATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
