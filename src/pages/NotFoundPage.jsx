import React from "react";
import { Home, ArrowLeft } from "lucide-react";

export const NotFoundPage = ({ setActivePage }) => {
  return (
    <div className="pt-32 pb-24 bg-stone-50/60 dark:bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4 space-y-5">
        <span className="text-6xl font-black text-amber-600 dark:text-amber-400 font-mono">
          404
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
          The page or product link you requested might have been moved or doesn't exist in our boutique store.
        </p>
        <button
          onClick={() => {
            setActivePage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home Page</span>
        </button>
      </div>
    </div>
  );
};
