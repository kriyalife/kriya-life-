import React from 'react';
import { Sparkles, ShieldCheck, Heart, Leaf, Award, CheckCircle2 } from 'lucide-react';
import kriyaLogoImg from '../assets/images/regenerated_image_1784990001904.png';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-[#0D2217] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Science Behind Natural Beauty</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">About Us</h1>
          <p className="text-lg text-emerald-300 font-serif italic">Welcome to KRIYA Life Science</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-stone-900/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="flex justify-center mb-6">
            <img src={kriyaLogoImg} alt="KRIYA Life Science" className="h-14 sm:h-16 w-auto object-contain brightness-0 invert opacity-90" />
          </div>

          <div className="space-y-6 text-emerald-100/90 leading-relaxed font-light text-base sm:text-lg">
            <p className="border-l-4 border-emerald-400 pl-4 py-1 bg-emerald-950/30 rounded-r-xl">
              At <strong className="text-white font-medium">KRIYA Life Science</strong>, we believe that healthy, radiant skin begins with the perfect balance of nature and science. Guided by our philosophy, <span className="text-emerald-300 font-normal italic">"Science Behind Natural Beauty,"</span> we create high-quality skincare products that combine carefully selected natural ingredients with modern cosmetic research.
            </p>

            <p className="p-5 bg-stone-950/50 rounded-2xl border border-white/10">
              Our mission is to deliver safe, effective, and affordable skincare solutions that help people achieve naturally healthy skin with confidence. Every product is developed with a focus on quality, innovation, and customer satisfaction.
            </p>

            <p className="p-5 bg-stone-950/50 rounded-2xl border border-white/10">
              From nourishing face washes and creams to advanced skincare formulations, our products are crafted using premium ingredients and manufactured under strict quality standards to ensure consistency, safety, and performance.
            </p>
          </div>

          {/* Core Brand Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/20">
              <Leaf className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Natural Balance</h4>
                <p className="text-[11px] text-emerald-200/70">Bioactive Botanicals</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Strict Safety</h4>
                <p className="text-[11px] text-emerald-200/70">Dermatologically Tested</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/20">
              <Award className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Proven Efficacy</h4>
                <p className="text-[11px] text-emerald-200/70">Science Backed Results</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
