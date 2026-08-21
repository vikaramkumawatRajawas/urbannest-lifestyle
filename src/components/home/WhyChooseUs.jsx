import React from "react";
import { ShieldCheck, Tag, HeartHandshake, Zap } from "lucide-react";

export const WhyChooseUs = () => {
  const valueProps = [
    {
      icon: ShieldCheck,
      title: "Curated Quality",
      description: "Hand-curated materials, non-toxic soy wax, solid teak wood, and durable ceramics designed to last for years."
    },
    {
      icon: Tag,
      title: "Honest Pricing",
      description: "Boutique aesthetic without exorbitant markup tags. Honest INR pricing direct to modern homes."
    },
    {
      icon: HeartHandshake,
      title: "Personal Service",
      description: "Warm, friendly shopping assistance with custom gift wrapping options and personalized greeting cards."
    },
    {
      icon: Zap,
      title: "Fast Support",
      description: "Instant assistance via our floating AI Chatbot and automated N8N query form response system."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F3EFE9] dark:bg-[#151918] text-[#141210] dark:text-[#F4EFE6] border-y border-[#E6DFD5] dark:border-[#222926] transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#0B0D0E] text-[#D6B77A] border border-[#D6B77A]/30 uppercase tracking-widest shadow-xs">
            Why UrbanNest
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-[#141210] dark:text-[#F4EFE6] uppercase tracking-tight">
            Crafted for Comfort & Intent
          </h2>
          <p className="text-sm sm:text-base text-[#6E6860] dark:text-[#9E988F] font-light">
            Small details that transform everyday living into something truly extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, idx) => {
            const IconComp = prop.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-white dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] hover:border-[#D6B77A]/50 transition-all duration-300 space-y-4 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(214,183,122,0.1)]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F3EFE9] dark:bg-[#151918] border border-[#D6B77A]/30 text-[#D6B77A] group-hover:text-[#059669] dark:group-hover:text-[#7FFFD4] group-hover:border-[#7FFFD4]/50 flex items-center justify-center shadow-md transition-colors">
                  <IconComp className="w-6 h-6 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="font-serif-luxury font-bold text-xl text-[#141210] dark:text-[#F4EFE6] uppercase tracking-wider">
                  {prop.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6860] dark:text-[#9E988F] leading-relaxed font-light">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
