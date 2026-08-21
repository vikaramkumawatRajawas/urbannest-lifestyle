import React, { useState, useEffect } from "react";
import {
  X,
  ShoppingBag,
  CheckCircle,
  Bot,
  Plus,
  Minus
} from "lucide-react";
import { StarRating } from "../common/StarRating";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";

const createSvgFallback = (name, category) => {
  const bg = category === 'Home Décor' ? '#FEF3C7' : category === 'Gifts' ? '#FCE7F3' : category === 'Stationery' ? '#E0F2FE' : '#F3EFEA';
  const text = name || 'UrbanNest Item';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="${bg}"/><circle cx="300" cy="190" r="90" fill="#D97706" opacity="0.2"/><path d="M270,270 L330,270 L310,150 Q300,120 290,150 Z" fill="#D97706"/><text x="50%" y="350" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="#1C1917">${text}</text><text x="50%" y="385" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" fill="#78716C">UrbanNest Boutique Collection</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const ProductDetailModal = ({ onOpenChatbot }) => {
  const { selectedProduct, setSelectedProduct, products } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [modalImgSrc, setModalImgSrc] = useState(selectedProduct?.image);

  useEffect(() => {
    if (selectedProduct) {
      setModalImgSrc(selectedProduct.image);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const relatedProducts = products
    .filter(
      (p) =>
        p.category === selectedProduct.category && p.id !== selectedProduct.id
    )
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-slate-800 my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedProduct(null);
            setQuantity(1);
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-rose-100 hover:text-rose-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative bg-stone-100 dark:bg-slate-800 p-6 flex items-center justify-center min-h-[320px] md:min-h-[440px]">
            <img
              src={modalImgSrc}
              alt={selectedProduct.name}
              onError={() => setModalImgSrc(createSvgFallback(selectedProduct.name, selectedProduct.category))}
              className="w-full h-full object-cover max-h-[420px] rounded-2xl shadow-lg"
            />
            {selectedProduct.originalPrice && (
              <span className="absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow">
                Save ₹{selectedProduct.originalPrice - selectedProduct.price}
              </span>
            )}
          </div>

          {/* Product Information */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-2">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <StarRating
                    rating={selectedProduct.rating}
                    reviewsCount={selectedProduct.reviewsCount}
                  />
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> In Stock
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-stone-900 dark:text-white">
                  ₹{selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-base text-stone-400 line-through">
                    ₹{selectedProduct.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Features List */}
              {selectedProduct.features && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Product Highlights
                  </h4>
                  <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                    {selectedProduct.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 dark:border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-stone-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (₹{selectedProduct.price * quantity})</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    onOpenChatbot();
                  }}
                  className="w-full py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Bot className="w-4 h-4 text-amber-600" />
                  <span>Enquire Stock via AI Chatbot</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Recommendation Bar */}
        {relatedProducts.length > 0 && (
          <div className="p-6 bg-stone-50 dark:bg-slate-850 border-t border-stone-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              You Might Also Like in {selectedProduct.category}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setSelectedProduct(rel);
                    setQuantity(1);
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:border-amber-500 transition-colors"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = createSvgFallback(rel.name, rel.category);
                    }}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="overflow-hidden">
                    <h5 className="font-semibold text-xs text-stone-900 dark:text-white truncate">
                      {rel.name}
                    </h5>
                    <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">
                      ₹{rel.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
