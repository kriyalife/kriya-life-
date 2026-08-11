import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Lock, EyeOff, FileText, ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export const PrivacyPolicy: React.FC = () => {
  const { setCurrentView } = useShop();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-[#0D2217] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button & Breadcrumb */}
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
            Legal &amp; Compliance
          </span>
        </motion.div>

        {/* Hero Banner Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-stone-900 via-stone-900/90 to-emerald-950/60 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Data Protection Guarantee</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-bold leading-tight">
              Privacy &amp; Policy
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/80 font-light max-w-xl">
              At Kriya Life Science, we respect your privacy and are committed to protecting your personal information with absolute integrity and transparency.
            </p>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Lock className="w-10 h-10 text-emerald-400" />
          </div>
        </motion.div>

        {/* Main Privacy Document Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-stone-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl space-y-8 text-white"
        >
          {/* Main Policy Text Box */}
          <div className="bg-stone-950/70 p-6 sm:p-8 rounded-2xl border border-emerald-500/20 space-y-6 text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
            
            <p className="font-normal text-white text-base sm:text-lg border-l-4 border-emerald-400 pl-4 py-1 bg-emerald-950/30 rounded-r-xl">
              At <strong className="text-emerald-300 font-semibold">Kriya Life Science</strong>, we respect your privacy and are committed to protecting your personal information. When you use our website, we may collect information such as your name, email address, phone number, and shipping details.
            </p>

            <p>
              This information is used solely for processing orders, improving user experience, and communicating updates or offers. We do not sell, rent, or share your personal information with third parties, except with trusted partners such as payment gateways and delivery services for order fulfillment.
            </p>

            <p>
              We implement appropriate security measures to protect your data from unauthorized access. However, while we strive to protect your information, no method of transmission over the internet is 100% secure.
            </p>

            <p className="text-emerald-300 font-medium bg-emerald-900/30 p-4 rounded-xl border border-emerald-500/30">
              By using our website, you consent to the collection and use of your information as described in this policy.
            </p>
          </div>

          {/* Key Principles Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-5 bg-stone-950/50 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Information We Collect</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Name, email address, contact phone number, and shipping address gathered securely during store browsing and checkout.
              </p>
            </div>

            <div className="p-5 bg-stone-950/50 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Purpose of Collection</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Exclusively for fulfilling cosmetic orders, delivering updates, handling customer support, and enhancing your sanctuary experience.
              </p>
            </div>

            <div className="p-5 bg-stone-950/50 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <EyeOff className="w-4 h-4" />
                <span>Zero Data Selling</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                We never rent, trade, or monetize your personal details. Information is shared only with verified delivery partners and payment gateways.
              </p>
            </div>

            <div className="p-5 bg-stone-950/50 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Security Standards</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Encrypted database storage, SSL certificate security protocol, and stringent access controls to prevent unauthorized access.
              </p>
            </div>
          </div>

          {/* Inquiry / Contact Footer Notice */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-950/80 p-6 rounded-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Have Privacy Questions?</span>
              </h4>
              <p className="text-xs text-emerald-100/70">
                Our support team is here to assist with any inquiries regarding your personal data.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('contact')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer shrink-0"
            >
              Contact Sanctuary Support
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
