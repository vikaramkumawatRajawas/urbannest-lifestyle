import React, { useState } from "react";
import { Heart, Trash2, ShoppingBag, ArrowLeft, Grid } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const createSvgFallback = (name, category) => {
  const bg = category === 'Home Décor' ? '#151918' : category === 'Gifts' ? '#1E1A24' : '#141E22';
  const text = name || 'UrbanNest Item';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="${bg}"/><circle cx="300" cy="190" r="90" fill="#D6B77A" opacity="0.15"/><path d="M270,270 L330,270 L310,150 Q300,120 290,150 Z" fill="#D6B77A"/><text x="50%" y="350" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#F4EFE6">${text}</text><text x="50%" y="385" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#9E988F">Neo-Luxury Collection</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const WishlistItemCard = ({ product }) => {
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { setSelectedProduct } = useProducts();

  const [imgSrc, setImgSrc] = useState(
    product.image || product.imageUrl || (product.images && product.images[0]) || ""
  );

  const productId = product._id || product.id;

  return (
    <div className="group relative rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] hover:border-[#D6B77A]/50 transition-all duration-300 shadow-md hover:shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* Image Container */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-4/3 overflow-hidden bg-[#F8F5F0] dark:bg-[#0B0D0E] cursor-pointer"
      >
        <img
          src={imgSrc || createSvgFallback(product.name, product.category)}
          alt={product.name}
          onError={() => setImgSrc(createSvgFallback(product.name, product.category))}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#0B0D0E]/80 backdrop-blur-md text-[#7FFFD4] border border-[#7FFFD4]/30 uppercase tracking-wider">
          {product.category || "UrbanNest"}
        </span>

        {/* Remove Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
          title="Remove from Wishlist"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div
          onClick={() => setSelectedProduct(product)}
          className="cursor-pointer space-y-1"
        >
          <h3 className="font-serif-luxury font-bold text-base text-[#141210] dark:text-[#F4EFE6] line-clamp-1 group-hover:text-[#D6B77A] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-[#6E6860] dark:text-[#9E988F] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-[#E6DFD5] dark:border-[#222926] flex items-center justify-between gap-2">
          <span className="font-serif-luxury font-black text-lg text-[#D6B77A]">
            ₹{product.price}
          </span>

          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add To Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const WishlistPage = ({ setActivePage }) => {
  const { wishlistProducts } = useWishlist();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-transparent text-[#141210] dark:text-[#F4EFE6]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD5] dark:border-[#222926]">
          <div className="space-y-1">
            <button
              onClick={() => setActivePage("products")}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#D6B77A] hover:underline cursor-pointer uppercase tracking-wider mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <h1 className="font-serif-luxury font-extrabold text-3xl sm:text-4xl text-[#141210] dark:text-[#F4EFE6] flex items-center gap-3">
              <span>My Saved Wishlist</span>
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500 animate-pulse" />
            </h1>
            <p className="text-xs text-[#6E6860] dark:text-[#9E988F]">
              Your curated collection of premium lifestyle items. ({wishlistProducts.length} items saved)
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <button
              onClick={() => setActivePage("products")}
              className="px-5 py-2.5 rounded-full bg-[#151918] text-[#F4EFE6] border border-[#D6B77A]/40 text-xs font-bold uppercase tracking-wider hover:border-[#7FFFD4] transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <Grid className="w-4 h-4 text-[#D6B77A]" />
              <span>Explore More Products</span>
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => {
              const productId = product._id || product.id;
              return <WishlistItemCard key={productId} product={product} />;
            })}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#151918] border-2 border-[#D6B77A]/40 flex items-center justify-center text-[#D6B77A]">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#141210] dark:text-[#F4EFE6]">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-[#6E6860] dark:text-[#9E988F]">
              Explore our luxury lifestyle products and click the heart icon on any item to save it here.
            </p>
            <button
              onClick={() => setActivePage("products")}
              className="mt-4 px-6 py-3 rounded-full bg-[#D6B77A] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl hover:bg-[#c4a466] transition-all cursor-pointer"
            >
              Discover Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
