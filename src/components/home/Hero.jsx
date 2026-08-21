import React from "react";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star } from "lucide-react";
import { Hero3DCanvas } from "./Hero3DCanvas";

export const Hero = ({ setActivePage, onOpenChatbot }) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] transition-colors duration-400">
      {/* Ambient Radial Lighting Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-[#D6B77A]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#7FFFD4]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#151918] text-[#D6B77A] border border-[#D6B77A]/30 text-xs font-semibold uppercase tracking-widest shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#059669] dark:text-[#7FFFD4] animate-pulse" />
              <span>Neo-Luxury Collection 2026</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#141210] dark:text-[#F4EFE6] tracking-tight leading-[1.08] uppercase">
              LITTLE THINGS. <br />
              <span className="text-gold-gradient font-normal italic lowercase text-3xl sm:text-5xl lg:text-6xl tracking-normal">
                beautiful living.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E6860] dark:text-[#9E988F] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Thoughtfully selected objects that make everyday spaces feel more personal.
            </p>

            {/* Magnetic CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => {
                  setActivePage("products");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenChatbot}
                className="btn-ai-glow w-full sm:w-auto px-7 py-3.5 rounded-2xl text-[#141210] dark:text-[#F4EFE6] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span className="text-[#059669] dark:text-[#7FFFD4] font-serif text-base">✦</span>
                <span>Meet Your AI Assistant</span>
              </button>
            </div>

            {/* Micro Badges */}
            <div className="pt-8 border-t border-[#E6DFD5] dark:border-[#222926] grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <span className="block text-xl font-bold font-serif-luxury text-[#141210] dark:text-[#F4EFE6]">100%</span>
                <span className="text-[11px] text-[#6E6860] dark:text-[#9E988F] uppercase tracking-wider">Artisanal Quality</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif-luxury text-[#141210] dark:text-[#F4EFE6]">24-48h</span>
                <span className="text-[11px] text-[#6E6860] dark:text-[#9E988F] uppercase tracking-wider">Pan-India Express</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif-luxury text-[#059669] dark:text-[#7FFFD4] flex items-center justify-center lg:justify-start gap-1">
                  4.9 <Star className="w-3.5 h-3.5 fill-[#D6B77A] text-[#D6B77A]" />
                </span>
                <span className="text-[11px] text-[#6E6860] dark:text-[#9E988F] uppercase tracking-wider">Client Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Canvas */}
          <div className="lg:col-span-5 relative">
            <Hero3DCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};
