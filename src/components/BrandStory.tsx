import React from 'react';
import { Leaf, Award, ShieldCheck } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="about-us-section" className="bg-[#0D2217] text-white py-16 sm:py-20 border-t border-[#1C4430]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-white/15 text-center space-y-4 hover:border-emerald-400/50 hover:shadow-2xl transition-all">
            <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Leaf className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="font-serif text-xl font-medium text-white">100% Bioactive Nectars</h4>
            <p className="text-sm text-emerald-100/70 leading-relaxed font-light">
              Cold-pressed botanical extracts sourced from organic micro-farms without synthetic dilution.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-white/15 text-center space-y-4 hover:border-emerald-400/50 hover:shadow-2xl transition-all">
            <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="font-serif text-xl font-medium text-white">Dermatologist Tested</h4>
            <p className="text-sm text-emerald-100/70 leading-relaxed font-light">
              Rigorously clinical testing on sensitive skin conditions to ensure zero irritation and maximal efficacy.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-white/15 text-center space-y-4 hover:border-emerald-400/50 hover:shadow-2xl transition-all">
            <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="font-serif text-xl font-medium text-white">Sustainable Glass Vaults</h4>
            <p className="text-sm text-emerald-100/70 leading-relaxed font-light">
              Housed in UV-protected recyclable glass bottles designed for infinite refillability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


