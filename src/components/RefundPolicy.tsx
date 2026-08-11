import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { RotateCcw, ShieldAlert, CheckCircle2, Clock, Truck, ArrowLeft, Mail, PackageX } from 'lucide-react';
import { motion } from 'motion/react';

export const RefundPolicy: React.FC = () => {
  const { setCurrentView } = useShop();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-[#0D2217] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button & Header Badge */}
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
            <span>Back to Home</span>
          </button>
          
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            Customer Guarantee
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
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Hassle-Free Returns</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-bold leading-tight">
              Refund &amp; Return Policy
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/80 font-light max-w-xl">
              At Kriya Life Science, customer satisfaction is our priority. We are here to ensure your complete peace of mind with transparent return standards.
            </p>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <RotateCcw className="w-10 h-10 text-emerald-400" />
          </div>
        </motion.div>

        {/* Policy Document Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-stone-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl space-y-8 text-white"
        >
          {/* Main Content Card with exact requested wording */}
          <div className="bg-stone-950/70 p-6 sm:p-8 rounded-2xl border border-emerald-500/20 space-y-6 text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
            
            <p className="font-normal text-white text-base sm:text-lg border-l-4 border-emerald-400 pl-4 py-1 bg-emerald-950/30 rounded-r-xl">
              At <strong className="text-emerald-300 font-semibold">Kriya Life Science</strong>, customer satisfaction is our priority. If you receive a damaged, defective, or incorrect product, you may request a return or replacement within 7 days of delivery.
            </p>

            <p>
              To be eligible for a return, the product must be unused, unopened, and in its original packaging with all labels intact. Once the returned product is received and inspected, we will process your refund or replacement.
            </p>

            <p>
              Refunds are usually processed within 5–7 business days and will be credited to the original payment method. Shipping charges are non-refundable unless the return is due to our error.
            </p>

            <p className="text-amber-200/90 font-medium bg-amber-950/30 p-4 rounded-xl border border-amber-500/30 flex items-start gap-3">
              <PackageX className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>Due to hygiene and safety reasons, certain products may not be eligible for return once opened or used.</span>
            </p>
          </div>

          {/* At-a-Glance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 bg-stone-950/50 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>7-Day Return Window</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Requests accepted within 7 calendar days of delivery for damaged, defective, or incorrectly dispatched products.
              </p>
            </div>

            <div className="p-5 bg-stone-950/50 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Eligibility Criteria</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Must remain unused, unopened, in original packaging with unbroken seals and all tags intact upon inspection.
              </p>
            </div>

            <div className="p-5 bg-stone-950/50 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Truck className="w-4 h-4" />
                <span>5–7 Business Days Refund</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Refunds are processed back to your original payment method promptly after package inspection at our sanctuary facility.
              </p>
            </div>

            <div className="p-5 bg-stone-950/50 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Hygiene Exclusions</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Opened or used skincare creams and cleansers cannot be accepted for return due to strict health and safety standards.
              </p>
            </div>
          </div>

          {/* How to Initiate Return Box */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-950/80 p-6 rounded-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Need to Initiate a Return or Replacement?</span>
              </h4>
              <p className="text-xs text-emerald-100/70">
                Contact our concierge team with your order ID and product photos to start your request immediately.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('contact')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer shrink-0"
            >
              Request Return Support
            </button>
          </div>

        </motion.div>

      </div>
    </div>
  );
};
