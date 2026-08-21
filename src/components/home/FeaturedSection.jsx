import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "../products/ProductCard";
import { useProducts } from "../../context/ProductContext";

export const FeaturedSection = ({ setActivePage }) => {
  const { products } = useProducts();
  const featuredList = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-stone-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Handpicked Essentials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
              Discover customer favorites and newly curated aesthetic items for your home, desk, and lifestyle.
            </p>
          </div>

          <button
            onClick={() => {
              setActivePage("products");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white dark:bg-amber-600 font-bold text-xs hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors shadow-sm self-start md:self-auto"
          >
            <span>View All Products ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
