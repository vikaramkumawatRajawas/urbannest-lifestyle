import React, { useState } from "react";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { StarRating } from "../common/StarRating";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useWishlist } from "../../context/WishlistContext";

const createSvgFallback = (name, category) => {
  const bg = category === 'Home Décor' ? '#151918' : category === 'Gifts' ? '#1E1A24' : '#141E22';
  const text = name || 'UrbanNest Item';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="${bg}"/><circle cx="300" cy="190" r="90" fill="#D6B77A" opacity="0.15"/><path d="M270,270 L330,270 L310,150 Q300,120 290,150 Z" fill="#D6B77A"/><text x="50%" y="350" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#F4EFE6">${text}</text><text x="50%" y="385" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#9E988F">Neo-Luxury Collection</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { setSelectedProduct } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [imageSrc, setImageSrc] = useState(product.image);

  const productId = product._id || product.id;
  const inWishlist = isWishlisted(productId);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="card-luxury-3d group relative bg-[#151918] rounded-3xl border border-[#222926] overflow-hidden shadow-xl flex flex-col justify-between w-full max-w-full min-w-0">
      {/* Image Container */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-4/3 overflow-hidden bg-[#0B0D0E] cursor-pointer"
      >
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImageSrc(createSvgFallback(product.name, product.category))}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 max-w-[70%]">
          {product.tags?.[0] && (
            <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-[#0B0D0E]/80 text-[#D6B77A] border border-[#D6B77A]/40 backdrop-blur-md truncate">
              {product.tags[0]}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#059669] text-white w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg hover:scale-110 ${
            inWishlist
              ? "bg-rose-500 text-white"
              : "bg-[#0B0D0E]/60 text-[#F4EFE6] border border-[#222926] hover:bg-[#151918]"
          }`}
          title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
        </button>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#0B0D0E]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="p-3.5 rounded-full bg-[#F4EFE6] text-[#0B0D0E] hover:bg-[#D6B77A] shadow-2xl transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1 min-w-0">
            <span className="text-[10px] font-bold text-[#7FFFD4] uppercase tracking-widest truncate">
              {product.category}
            </span>
            <StarRating rating={product.rating} reviewsCount={product.reviewsCount} />
          </div>

          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-serif-luxury font-bold text-base text-[#F4EFE6] line-clamp-1 group-hover:text-[#D6B77A] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#9E988F] line-clamp-2 mt-1 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-[#222926] flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-baseline gap-1.5 min-w-0 overflow-hidden">
            <span className="text-base sm:text-lg font-extrabold text-[#F4EFE6] truncate">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] sm:text-xs text-[#9E988F] line-through truncate">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="px-3 sm:px-4 py-2 rounded-xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer shrink-0 min-w-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
