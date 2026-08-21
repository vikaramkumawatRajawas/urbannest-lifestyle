import React from "react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../../context/ProductContext";
import { ShoppingBag, RotateCcw } from "lucide-react";

export const ProductGrid = () => {
  const { filteredProducts, resetFilters } = useProducts();

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-stone-200 dark:border-slate-700 shadow-xs max-w-md mx-auto my-8 space-y-4">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 dark:text-white">
          No products found
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          We couldn't find any products matching your selected category, price range, or search criteria.
        </p>
        <button
          onClick={resetFilters}
          className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 mx-auto shadow transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
