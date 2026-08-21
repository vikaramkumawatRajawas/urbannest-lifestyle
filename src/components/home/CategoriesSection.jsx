import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES } from "../../data/categoriesData";
import { useProducts } from "../../context/ProductContext";

export const CategoriesSection = ({ setActivePage }) => {
  const { setSelectedCategory } = useProducts();

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setActivePage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28 bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] border-b border-[#E6DFD5] dark:border-[#222926] transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#151918] text-[#D6B77A] border border-[#D6B77A]/30 uppercase tracking-widest shadow-xs">
            Curated Collections
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-[#141210] dark:text-[#F4EFE6] uppercase tracking-tight">
            Explore Everyday Living
          </h2>
          <p className="text-sm sm:text-base text-[#6E6860] dark:text-[#9E988F] leading-relaxed font-light">
            From handcrafted ceramic home accents to thoughtful gifts and tactile workspace tools.
          </p>
        </div>

        {/* Asymmetric Category Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const colSpanClass =
              idx === 0
                ? "md:col-span-7"
                : idx === 1
                ? "md:col-span-5"
                : idx === 2
                ? "md:col-span-4"
                : idx === 3
                ? "md:col-span-4"
                : "md:col-span-4";

            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`category-card-3d group relative bg-white dark:bg-[#151918] rounded-3xl overflow-hidden border border-[#E6DFD5] dark:border-[#222926] hover:border-[#D6B77A]/40 shadow-xl flex flex-col justify-between cursor-pointer ${colSpanClass} min-h-[300px]`}
              >
                {/* Category Image */}
                <div className="relative aspect-16/9 md:aspect-auto md:h-64 overflow-hidden bg-[#F3EFE9] dark:bg-[#0B0D0E]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E]/80 via-[#0B0D0E]/30 to-transparent" />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-[#0B0D0E]/80 text-[#7FFFD4] border border-[#7FFFD4]/30 backdrop-blur-md">
                    {cat.itemCount}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-[#151918]">
                  <div className="space-y-1">
                    <h3 className="font-serif-luxury font-extrabold text-xl sm:text-2xl text-[#141210] dark:text-[#F4EFE6] group-hover:text-[#D6B77A] transition-colors uppercase tracking-wider">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#6E6860] dark:text-[#9E988F] line-clamp-2 leading-relaxed font-light">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#D6B77A] group-hover:translate-x-2 transition-transform uppercase tracking-widest">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 text-[#059669] dark:text-[#7FFFD4]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
