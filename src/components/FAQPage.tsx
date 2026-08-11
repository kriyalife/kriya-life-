import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle, Mail, Phone, ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Are Kriya Life science products suitable for all skin types?',
    answer: 'Yes, our products are formulated to be gentle and suitable for most skin types. However, we recommend doing a patch test before use.',
    category: 'Products & Formulation'
  },
  {
    id: 'faq-2',
    question: 'How long does delivery take?',
    answer: 'Orders are typically delivered within 3–7 business days, depending on your location.',
    category: 'Shipping & Delivery'
  },
  {
    id: 'faq-3',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'Yes, Cash on Delivery is available on selected orders.',
    category: 'Payment & Orders'
  },
  {
    id: 'faq-4',
    question: 'How can I contact kriya life science?',
    answer: 'You can contact us via email or phone number provided on our Contact Us page.',
    category: 'Customer Support'
  },
  {
    id: 'faq-5',
    question: 'Can I use multiple products together?',
    answer: 'Yes, our products are designed to work well together as part of a complete routine.',
    category: 'Products & Routine'
  }
];

export const FAQPage: React.FC = () => {
  const { setCurrentView } = useShop();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', 'Products & Routine', 'Shipping & Delivery', 'Payment & Orders', 'Customer Support'];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category.includes(selectedCategory) || (selectedCategory === 'Products & Routine' && (item.category.includes('Products') || item.category.includes('Formulation')));
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-24 pb-16 bg-[#0D2217] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-800 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-white/15 transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            Frequently Asked Questions
          </span>
        </motion.div>

        {/* Hero Header Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-stone-900 via-stone-900/90 to-emerald-950/60 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Help &amp; Guidance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-bold leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/80 font-light max-w-xl">
              Everything you need to know about Kriya Life Science formulations, delivery timelines, payment options, and routine care.
            </p>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <HelpCircle className="w-10 h-10 text-emerald-400" />
          </div>
        </motion.div>

        {/* Search & Category Filter Bar */}
        <div className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-5 border border-white/15 shadow-2xl space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. skin types, COD, delivery)..."
              className="w-full pl-11 pr-4 py-3 bg-stone-950/80 rounded-2xl border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-400 text-stone-950 shadow-md scale-105'
                    : 'bg-black/40 text-emerald-100/70 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ Items List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={faq.id}
                  className="bg-stone-900/90 backdrop-blur-xl rounded-2xl border border-white/15 overflow-hidden transition-all duration-300 shadow-lg hover:border-emerald-500/40"
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
            })
          ) : (
            <div className="bg-stone-900/80 rounded-2xl p-8 text-center text-emerald-100/70 space-y-2 border border-white/10">
              <p className="text-sm">No matching questions found.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-xs text-emerald-400 underline font-bold"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Still Have Questions Contact Box */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-serif font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>Still Have Questions?</span>
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/70 font-light">
              Our botanical sanctuary team is here to assist you via email or phone.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('contact')}
              className="px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
