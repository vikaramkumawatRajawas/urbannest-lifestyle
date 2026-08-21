import React from "react";
import { Search, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { CATEGORIES } from "../../data/categoriesData";

export const ProductFilterPanel = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    resetFilters,
    filteredProducts
  } = useProducts();

  const categoryOptions = ["All", ...CATEGORIES.map((c) => c.name)];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-base text-stone-900 dark:text-white">
            Filter & Sort Products
          </h3>
        </div>

        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Pills */}
      <div>
        <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-3">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-stone-100 dark:bg-slate-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-600"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price & Sort Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Price Slider */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
            <span>Max Price Filter</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              Up to ₹{maxPrice}
            </span>
          </div>
          <input
            type="range"
            min="400"
            max="3000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
            <span>₹400</span>
            <span>₹1,500</span>
            <span>₹3,000</span>
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-2">
            Sort Products By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-slate-700 text-stone-800 dark:text-white border border-stone-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="featured">Featured & Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="text-xs text-stone-500 dark:text-stone-400 font-medium pt-2 flex items-center justify-between">
        <span>Showing <strong>{filteredProducts.length}</strong> items</span>
        {searchQuery && (
          <span>
            Search query: <em className="text-amber-600">"{searchQuery}"</em>
          </span>
        )}
      </div>
    </div>
  );
};
