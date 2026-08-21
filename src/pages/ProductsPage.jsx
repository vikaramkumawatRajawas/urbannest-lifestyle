import React from "react";
import { ProductFilterPanel } from "../components/products/ProductFilterPanel";
import { ProductGrid } from "../components/products/ProductGrid";

export const ProductsPage = () => {
  return (
    <div className="pt-28 pb-20 bg-stone-50/60 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Explore All Products
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Browse our full catalog of handcrafted home accents, candles, stationery, hampers, and daily essentials.
          </p>
        </div>

        <ProductFilterPanel />
        <ProductGrid />
      </div>
    </div>
  );
};
