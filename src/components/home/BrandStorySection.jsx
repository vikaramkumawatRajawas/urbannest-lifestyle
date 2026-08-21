import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export const BrandStorySection = ({ setActivePage }) => {
  return (
    <section className="py-20 md:py-28 bg-[#F3EFE9] dark:bg-[#151918] text-[#141210] dark:text-[#F4EFE6] border-y border-[#E6DFD5] dark:border-[#222926] transition-colors duration-400 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D6B77A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0B0D0E] text-[#D6B77A] border border-[#D6B77A]/25 text-xs font-semibold uppercase tracking-widest shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#059669] dark:text-[#7FFFD4]" />
              <span>Our Philosophy</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-[#141210] dark:text-[#F4EFE6] leading-tight uppercase">
              Objects with a <br />
              <span className="text-gold-gradient italic lowercase font-normal">little more meaning.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#6E6860] dark:text-[#9E988F] leading-relaxed font-light">
              Founded in Indiranagar, Bengaluru, UrbanNest was born from a simple belief: that your home should be a reflection of calm, beauty, and personal intent. We curate small-batch ceramics, hand-poured soy candles, and tactile stationery that elevate ordinary daily rituals into memorable moments.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <button
                onClick={() => {
                  setActivePage("about");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-xl border border-[#D6B77A]/60 text-[#D6B77A] hover:bg-[#D6B77A] hover:text-[#0B0D0E] font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Read Full Brand Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E6DFD5] dark:border-[#222926] aspect-4/3 group">
              <img
                src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80"
                alt="UrbanNest Craftsmanship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E]/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-xs font-serif-luxury text-[#D6B77A] italic">Hand-Glazed Stoneware</span>
                  <h4 className="text-base font-bold text-[#F4EFE6]">Designed for Slow Mornings</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
