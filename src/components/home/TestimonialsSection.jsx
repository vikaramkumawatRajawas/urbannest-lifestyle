import React from "react";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "../../data/testimonialsData";
import { StarRating } from "../common/StarRating";

export const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-stone-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Customer Love
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Loved by Homes Across India
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Read real feedback from customers who transformed their homes with UrbanNest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-stone-50 dark:bg-slate-800 border border-stone-200/70 dark:border-slate-700/70 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-amber-500/40" />
                <StarRating rating={item.rating} />
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-stone-200 dark:border-slate-700">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                />
                <div>
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">
                    {item.name}
                  </h4>
                  <span className="block text-[10px] text-stone-500 dark:text-stone-400">
                    {item.role} • {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
