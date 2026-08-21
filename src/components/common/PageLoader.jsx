import React, { useState, useEffect } from "react";

export const PageLoader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 1100);

    const timer2 = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#0B0D0E] text-[#F4EFE6] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="space-y-4 text-center px-4">
        {/* Brand Name */}
        <h1 className="font-serif-luxury text-4xl sm:text-6xl font-extrabold tracking-widest uppercase text-[#F4EFE6] animate-fadeIn">
          Urban<span className="text-[#D6B77A]">Nest</span>
        </h1>

        {/* Animated Gold Underline */}
        <div className="relative w-48 sm:w-64 h-0.5 bg-[#222926] mx-auto overflow-hidden rounded-full">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D6B77A] via-[#7FFFD4] to-[#D6B77A] animate-shimmer w-full" />
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm font-medium tracking-[0.25em] text-[#9E988F] uppercase pt-1">
          Little Things. Beautiful Living.
        </p>
      </div>
    </div>
  );
};
