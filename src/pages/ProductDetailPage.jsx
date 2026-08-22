import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  CheckCircle2,
  Bot,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Share2
} from "lucide-react";
import { StarRating } from "../components/common/StarRating";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const createSvgFallback = (name, category) => {
  const bg = category === 'Home Décor' ? '#151918' : category === 'Gifts' ? '#1E1A24' : '#141E22';
  const text = name || 'UrbanNest Item';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="${bg}"/><circle cx="300" cy="190" r="90" fill="#D6B77A" opacity="0.15"/><path d="M270,270 L330,270 L310,150 Q300,120 290,150 Z" fill="#D6B77A"/><text x="50%" y="350" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="22" font-weight="bold" fill="#F4EFE6">${text}</text><text x="50%" y="385" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#9E988F">UrbanNest Boutique Collection</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const ProductDetailPage = ({ setActivePage, onOpenChatbot }) => {
  const { selectedProduct, setSelectedProduct, products } = useProducts();
  const { addToCart, setIsCartOpen } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [imageSrc, setImageSrc] = useState("");

  // Product fallback if navigated directly without selectedProduct state
  const product = selectedProduct || products[0];
  const productId = product ? (product._id || product.id) : null;
  const inWishlist = productId ? isWishlisted(productId) : false;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (product) {
      setImageSrc(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] pt-28 pb-16 flex items-center justify-center px-4 text-center">
        <div className="space-y-4">
          <h2 className="font-serif-luxury text-2xl font-bold">Product Not Found</h2>
          <button
            onClick={() => setActivePage("products")}
            className="px-6 py-2.5 rounded-full bg-[#D6B77A] text-[#0B0D0E] font-bold text-xs uppercase"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && (p.id || p._id) !== (product.id || product._id))
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fadeIn">
      
      {/* Top Breadcrumb & Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            if (setActivePage) setActivePage("products");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] text-xs font-bold uppercase tracking-wider text-[#141210] dark:text-[#F4EFE6] hover:border-[#D6B77A] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#D6B77A]" />
          <span>Back to Products</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#6E6860] dark:text-[#9E988F]">
          <span>Home</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-[#D6B77A] font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Full-Screen Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Product Image Gallery Container */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] p-4 sm:p-8 flex items-center justify-center overflow-hidden shadow-xl">
            <img
              src={imageSrc || product.image}
              alt={product.name}
              onError={() => setImageSrc(createSvgFallback(product.name, product.category))}
              className="w-full h-full object-contain max-h-[460px] transition-transform duration-500 hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.tags?.[0] && (
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#0B0D0E]/80 text-[#D6B77A] border border-[#D6B77A]/40 backdrop-blur-md">
                  {product.tags[0]}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#059669] text-white shadow-md">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg hover:scale-110 ${
                inWishlist
                  ? "bg-rose-500 text-white"
                  : "bg-white/80 dark:bg-[#0B0D0E]/80 text-[#141210] dark:text-[#F4EFE6] border border-[#E6DFD5] dark:border-[#222926]"
              }`}
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Thumbnail Preview Bar if variants exist */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageSrc(img)}
                  className={`w-16 h-16 rounded-xl border overflow-hidden shrink-0 cursor-pointer transition-all ${
                    imageSrc === img ? "border-[#D6B77A] ring-2 ring-[#D6B77A]/40" : "border-[#E6DFD5] dark:border-[#222926]"
                  }`}
                >
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Complete Product Information & Actions */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#D6B77A]/15 text-[#B98232] dark:text-[#D6B77A] border border-[#D6B77A]/30">
                {product.category}
              </span>
              <span className="text-xs text-[#059669] dark:text-[#7FFFD4] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> In Stock & Ready to Ship
              </span>
            </div>

            <h1 className="font-serif-luxury font-bold text-2xl sm:text-3xl lg:text-4xl text-[#141210] dark:text-[#F4EFE6] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 pt-1">
              <StarRating rating={product.rating || 4.8} reviewsCount={product.reviewsCount || 24} />
              <span className="text-xs text-[#6E6860] dark:text-[#9E988F]">
                UrbanNest Verified Quality
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] shadow-sm flex items-baseline gap-4">
            <span className="font-extrabold text-3xl sm:text-4xl text-[#141210] dark:text-[#F4EFE6]">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-base sm:text-lg text-[#6E6860] dark:text-[#9E988F] line-through font-normal">
                ₹{product.originalPrice}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-extrabold text-[#059669] dark:text-[#7FFFD4] uppercase tracking-wider">
                ({discountPercent}% OFF)
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#6E6860] dark:text-[#9E988F]">
              Product Overview
            </h3>
            <p className="text-xs sm:text-sm text-[#141210] dark:text-[#F4EFE6] leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Features Highlights */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E6DFD5] dark:border-[#222926]">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#6E6860] dark:text-[#9E988F]">
                Product Features & Crafting
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#141210] dark:text-[#F4EFE6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variants Selector if present */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E6DFD5] dark:border-[#222926]">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#6E6860] dark:text-[#9E988F]">
                Available Options
              </h4>
              <div className="flex gap-2.5 overflow-x-auto">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      selectedVariant === i
                        ? "bg-[#D6B77A] text-[#0B0D0E] shadow-sm"
                        : "bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] text-[#141210] dark:text-[#F4EFE6]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Main Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-[#E6DFD5] dark:border-[#222926]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#6E6860] dark:text-[#9E988F]">
                Quantity:
              </span>
              <div className="flex items-center border border-[#E6DFD5] dark:border-[#222926] rounded-xl bg-white dark:bg-[#151918] overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-[#FAF8F5] dark:hover:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-extrabold text-[#141210] dark:text-[#F4EFE6]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 hover:bg-[#FAF8F5] dark:hover:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-6 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart (₹{product.price * quantity})</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-2xl bg-[#087F68] dark:bg-[#7FFFD4] text-white dark:text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* AI Assistant Chat Banner */}
            <button
              onClick={onOpenChatbot}
              className="btn-ai-glow w-full py-3 rounded-2xl text-[#141210] dark:text-[#F4EFE6] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Bot className="w-4 h-4 text-[#059669] dark:text-[#7FFFD4]" />
              <span>Ask AI Assistant About This Product</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center border-t border-[#E6DFD5] dark:border-[#222926] text-[10px] font-bold text-[#6E6860] dark:text-[#9E988F] uppercase tracking-wider">
            <div className="p-3 rounded-xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#D6B77A]" />
              <span>Free Delivery &gt; ₹1499</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#7FFFD4]" />
              <span>100% Quality Assurance</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#D6B77A]" />
              <span>Easy 7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-[#E6DFD5] dark:border-[#222926] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury font-bold text-xl sm:text-2xl text-[#141210] dark:text-[#F4EFE6] uppercase tracking-wide">
              You Might Also Like in <span className="text-[#D6B77A]">{product.category}</span>
            </h3>
            <button
              onClick={() => setActivePage("products")}
              className="text-xs font-bold text-[#087F68] dark:text-[#7FFFD4] uppercase tracking-wider hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id || rel._id}
                onClick={() => {
                  setSelectedProduct(rel);
                  setQuantity(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group p-4 rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] hover:border-[#D6B77A] transition-all cursor-pointer shadow-md space-y-3"
              >
                <div className="aspect-4/3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif-luxury font-bold text-sm text-[#141210] dark:text-[#F4EFE6] truncate group-hover:text-[#D6B77A] transition-colors">
                    {rel.name}
                  </h4>
                  <span className="font-extrabold text-sm text-[#D6B77A] block">
                    ₹{rel.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
