import React from "react";
import { Heart, Sparkles, ShieldCheck, Award, Users, Store } from "lucide-react";

export const AboutPage = ({ setActivePage }) => {
  return (
    <div className="pt-28 pb-20 bg-stone-50/60 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Our Story & Values
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            About UrbanNest Lifestyle Store
          </h1>
          <p className="text-base sm:text-lg text-amber-600 dark:text-amber-400 font-serif italic">
            “Little Things. Beautiful Living.”
          </p>
        </div>

        {/* Narrative & Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
              Bringing Warmth & Character to Every Space
            </h2>
            <p>
              Founded in Bengaluru, <strong>UrbanNest Lifestyle Store</strong> was born out of a simple realization: your living environment deeply influences your daily mindset, happiness, and peace.
            </p>
            <p>
              Rather than mass-produced, soul-less commodities, we curate artisanal home accents, organic soy candles, mango wood desk organizers, structured weekly planners, and thoughtful gift hampers that turn routine moments into beautiful rituals.
            </p>
            <p>
              We pride ourselves on offering <strong>boutique-quality aesthetics at honest local prices</strong>, paired with modern tech innovations like our automated N8N AI query and support system.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
                alt="UrbanNest Flagship Store Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Handpicked Quality</h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Every vase, candle, and journal is evaluated for finish, durability, and eco-friendliness before reaching store shelves.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Personal Connection</h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Whether you visit our Indiranagar store or interact with our N8N AI assistant, you receive warm, attentive service.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Community First</h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              We collaborate with local Indian artisans and sustainable material growers to support ethical micro-craftsmanship.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
