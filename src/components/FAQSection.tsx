import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { HelpCircle, ChevronDown, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_ITEMS } from './FAQPage';

export const FAQSection: React.FC = () => {
  const { setCurrentView } = useShop();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="kriya-faq-section" className="py-16 sm:py-20 bg-[#0A1D13] text-white border-t border-[#1C4430] relative overflow-hidden">
      {/* Decorative Blur Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Title Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/70 font-light">
            Quick answers regarding Kriya Life Science formulations, delivery, and cash on delivery options.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.id}
                className="bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 shadow-md hover:border-emerald-500/40"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-white hover:text-emerald-300 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  
                  <div className={`p-1.5 rounded-full bg-stone-950 border border-white/10 text-emerald-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-emerald-500/20 border-emerald-500/40' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/10 bg-stone-950/60 p-5 sm:p-6"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-sm sm:text-base text-emerald-100/90 font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* View All / Contact CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => setCurrentView('faq')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-2xl border border-emerald-500/30 transition-all shadow-md hover:border-emerald-400 cursor-pointer"
          >
            <span>View Full Help Center</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
