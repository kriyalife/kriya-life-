import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Category } from '../types';
import { Instagram, Facebook, Twitter, ShieldCheck, Heart, Sparkles, Mail, ArrowRight, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import kriyaLogoImg from '../assets/images/regenerated_image_1784990001904.png';

const FOOTER_FAQS = [
  {
    q: 'Are Kriya Life science products suitable for all skin types?',
    a: 'Yes, our products are formulated to be gentle and suitable for most skin types. However, we recommend doing a patch test before use.'
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are typically delivered within 3–7 business days, depending on your location.'
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes, Cash on Delivery is available on selected orders.'
  },
  {
    q: 'How can I contact kriya life science?',
    a: 'You can contact us via email or phone number provided on our Contact Us page.'
  },
  {
    q: 'Can I use multiple products together?',
    a: 'Yes, our products are designed to work well together as part of a complete routine.'
  }
];

const CATEGORIES: Category[] = [
  'Face Cleansers',
  'Moisturizers & Creams'
];

export const Footer: React.FC = () => {
  const { setSelectedCategory, setCurrentView, setIsSkinQuizOpen, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleCatClick = (cat: Category) => {
    setSelectedCategory(cat);
    setCurrentView('home');
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call to store the email
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Subscribed Successfully!', 'Thank you for joining our newsletter. Check your inbox for your welcome gift.', 'success');
      setEmail('');
    }, 1000);
  };

  return (
    <footer className="bg-[#0D2217] text-white pt-16 pb-12 border-t border-[#1C4430]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex flex-col items-start">
              <img src={kriyaLogoImg} alt="Kriya Life Science" className="h-12 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" />
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-sm font-light">
              <strong className="text-white font-medium">Science Behind Natural Beauty.</strong> At KRIYA Life Science, we create high-quality skincare combining natural ingredients with modern cosmetic research to deliver safe, effective, and affordable solutions.
            </p>

            <button
              onClick={() => setCurrentView('about')}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:text-emerald-300 transition-colors group cursor-pointer"
            >
              <span>Read Our Full Story</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-3 pt-2 text-[#4CAF50]">
              <a href="https://www.instagram.com/kriya_lifescience?igsh=MjM1bGI0dG5xeGNn" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-[#4CAF50] hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/share/1Bw9bgEuC6/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-[#4CAF50] hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://wa.me/917405500454" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-[#4CAF50] hover:text-white transition-colors" aria-label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.031 0C5.385 0 0 5.383 0 12.029c0 2.124.553 4.195 1.604 6.012L.21 24l6.113-1.603c1.745.961 3.738 1.468 5.708 1.468 6.646 0 12.031-5.383 12.031-12.029C24.062 5.383 18.677 0 12.031 0zm.014 21.84c-1.802 0-3.567-.482-5.114-1.398l-.367-.217-3.793.995 1.013-3.7-.238-.38a9.972 9.972 0 0 1-1.537-5.271c0-5.508 4.481-9.988 9.993-9.988 5.51 0 9.988 4.48 9.988 9.988 0 5.508-4.478 9.988-9.988 9.988zm5.474-7.48c-.3-.15-1.775-.877-2.052-.977-.275-.101-.476-.15-.676.15-.201.301-.776.977-.952 1.177-.175.2-.35.226-.65.076-2.043-1.025-3.411-1.921-4.733-3.662-.175-.25-.018-.386.132-.536.136-.135.301-.351.451-.526.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.676-1.626-.926-2.226-.244-.585-.492-.505-.676-.514-.175-.01-.376-.01-.576-.01-.2 0-.526.075-.801.375-.275.301-1.051 1.026-1.051 2.502 0 1.477 1.076 2.903 1.226 3.103.15.201 2.115 3.229 5.122 4.529.715.308 1.272.493 1.706.63.717.228 1.369.196 1.884.119.576-.086 1.775-.726 2.027-1.427.25-.701.25-1.301.175-1.427-.076-.126-.276-.201-.576-.351z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#4CAF50] uppercase tracking-wider">
              Formulations
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCatClick(cat)}
                    className="hover:text-[#4CAF50] hover:underline transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Trust */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#4CAF50] uppercase tracking-wider">
              Customer Sanctuary
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/90 pb-3 border-b border-white/10">
              <li>
                <button onClick={() => setCurrentView('about')} className="hover:text-[#4CAF50] hover:underline cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-[#4CAF50] hover:underline cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('faq')} className="hover:text-[#4CAF50] hover:underline cursor-pointer">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => setIsSkinQuizOpen(true)} className="hover:text-[#4CAF50] hover:underline flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#4CAF50]" />
                  <span>Skin & Shade Finder Quiz</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('cart')} className="hover:text-[#4CAF50] hover:underline">
                  Cart Summary
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-[#4CAF50] hover:underline cursor-pointer">
                  Privacy &amp; Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('refund')} className="hover:text-[#4CAF50] hover:underline cursor-pointer">
                  Refund &amp; Return Policy
                </button>
              </li>
              <li><a href="#" className="hover:text-[#4CAF50] hover:underline">Clean Ingredients Index</a></li>
            </ul>
            <div className="space-y-2 text-xs text-emerald-100/90 pt-1">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#4CAF50]" />
                <span>100% Cruelty Free</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="md:col-span-4 space-y-4 lg:pl-8">
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-semibold text-[#4CAF50] uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Join The Ritual
              </h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-light">
                Subscribe to receive early access to new botanical formulations, exclusive rituals, and 10% off your first order.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="relative mt-4">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-[#162C1E] border border-white/10 text-white text-sm rounded-full py-3 px-5 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]/50 transition-all placeholder:text-emerald-100/40 pr-12"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-[#4CAF50] text-[#153323] rounded-full flex items-center justify-center hover:bg-[#45a049] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Subscribe"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#153323]/30 border-t-[#153323] rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Quick FAQs Accordion Block */}
        <div className="pt-6 pb-6 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-semibold text-[#4CAF50] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Frequently Asked Questions (FAQ)</span>
            </h4>
            <button
              onClick={() => setCurrentView('faq')}
              className="text-xs text-emerald-300 hover:text-emerald-200 underline font-semibold cursor-pointer"
            >
              View Full Help Center →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FOOTER_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#12281C] rounded-xl border border-white/10 overflow-hidden transition-all text-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-2 text-emerald-100 hover:text-white font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#4CAF50] font-bold">Q:</span>
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-emerald-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-3.5 pt-0 border-t border-white/5 text-emerald-100/80 font-light leading-relaxed flex items-start gap-2 bg-stone-950/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50] shrink-0 mt-0.5" />
                      <span>{faq.a}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-100/60 gap-4 pt-4">
          <p>© {new Date().getFullYear()} KRIYA Life Science. All rights reserved. Crafted with botanical purity.</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('privacy')} 
              className="hover:text-emerald-400 hover:underline transition-colors cursor-pointer"
            >
              Privacy &amp; Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentView('refund')} 
              className="hover:text-emerald-400 hover:underline transition-colors cursor-pointer"
            >
              Refund &amp; Return Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentView('faq')} 
              className="hover:text-emerald-400 hover:underline transition-colors cursor-pointer"
            >
              FAQs
            </button>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Sustainability Report</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
