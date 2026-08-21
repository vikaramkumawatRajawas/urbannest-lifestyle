import React, { useState } from "react";
import { Tag, Copy, Check, Sparkles, Clock } from "lucide-react";
import { OFFERS } from "../../data/offersData";
import { useCart } from "../../context/CartContext";

export const OffersSection = ({ setActivePage }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-16 md:py-24 bg-stone-100/60 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 uppercase tracking-wider">
            Exclusive Savings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Special Deals & Discount Offers
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Enjoy extra savings on your favorite home accents, gift sets, and desk stationery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-800 shadow-lg flex flex-col justify-between space-y-6 overflow-hidden group hover:border-amber-500 transition-all duration-300"
            >
              {/* Gradient Decorative Accent */}
              <div className={`h-2.5 w-full absolute top-0 left-0 bg-gradient-to-r ${offer.bgGradient}`} />

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {offer.expiresIn}
                  </span>
                  <Tag className="w-4 h-4 text-rose-500" />
                </div>

                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    {offer.subtitle}
                  </span>
                  <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white mt-1">
                    {offer.discount}
                  </h3>
                  <h4 className="font-semibold text-sm text-stone-700 dark:text-stone-300">
                    {offer.title}
                  </h4>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              {/* Promo Code Box */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 border border-dashed border-stone-300 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Promo Code</span>
                  <span className="font-mono font-bold text-sm text-stone-900 dark:text-white tracking-widest">
                    {offer.code}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-amber-600 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
