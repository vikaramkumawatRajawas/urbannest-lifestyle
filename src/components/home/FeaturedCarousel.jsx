import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Star, Sparkles, Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useWishlist } from "../../context/WishlistContext";

const CAROUSEL_SLIDES = [
  {
    id: "prod-1",
    _id: "prod-1",
    name: "Ceramic Minimalist Ribbed Vase",
    category: "Home Décor",
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
    tag: "Trending 2026",
    description: "Elegantly textured ceramic vase designed for dried florals or modern pampas grass. Scandinavian aesthetic."
  },
  {
    id: "prod-2",
    _id: "prod-2",
    name: "Scented Soy Wax Candle - Amber & Cedarwood",
    category: "Home Décor",
    price: 599,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80",
    tag: "Best Seller",
    description: "Hand-poured 100% natural soy wax candle infused with warm amber & cedarwood essential oils. 45+ hours burn time."
  },
  {
    id: "prod-5",
    _id: "prod-5",
    name: "Warm Brass Decorative Table Lamp",
    category: "Home Décor",
    price: 2499,
    originalPrice: 3299,
    rating: 4.9,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    tag: "New Arrival",
    description: "Mushroom-inspired ambient bedside lamp with 3-level touch-controlled dimmable warm glow and 4000mAh battery."
  },
  {
    id: "prod-6",
    _id: "prod-6",
    name: "Curated Celebration Gift Hamper",
    category: "Gifts",
    price: 1899,
    originalPrice: 2299,
    rating: 5.0,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
    tag: "Gift Choice",
    description: "Luxury gift box containing mini soy candle, artisanal chocolate bar, brass bookmark, and herbal tea tin."
  }
];

const createSvgFallback = (name, category) => {
  const bg = category === 'Home Décor' ? '#151918' : category === 'Gifts' ? '#1E1A24' : '#141E22';
  const text = name || 'UrbanNest Item';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="100%" height="100%" fill="${bg}"/><circle cx="400" cy="210" r="100" fill="#D6B77A" opacity="0.18"/><path d="M360,290 L440,290 L420,150 Q400,120 380,150 Z" fill="#D6B77A"/><text x="50%" y="380" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#F4EFE6">${text}</text><text x="50%" y="420" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#7FFFD4">UrbanNest Featured Collection</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const { addToCart } = useCart();
  const { setSelectedProduct } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_SLIDES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const activeSlide = CAROUSEL_SLIDES[currentIndex];
  const activeId = activeSlide._id || activeSlide.id;
  const inWishlist = isWishlisted(activeId);

  const slideImageSrc = failedImages[activeSlide.id]
    ? createSvgFallback(activeSlide.name, activeSlide.category)
    : activeSlide.image;

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] relative overflow-hidden border-b border-[#E6DFD5] dark:border-[#222926] transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#151918] text-[#D6B77A] border border-[#D6B77A]/30 uppercase tracking-widest shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#059669] dark:text-[#7FFFD4] animate-pulse" />
              <span>Auto Showcase Slider</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-[#141210] dark:text-[#F4EFE6] uppercase tracking-tight">
              Featured Spotlights
            </h2>
          </div>

          {/* Controls & Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-[#D6B77A]"
                      : "w-2 bg-[#E6DFD5] dark:bg-[#222926] hover:bg-[#9E988F]"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] text-[#141210] dark:text-[#9E988F] hover:text-[#D6B77A] hover:border-[#D6B77A]/50 transition-all cursor-pointer shadow-xs"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] text-[#141210] dark:text-[#9E988F] hover:text-[#D6B77A] hover:border-[#D6B77A]/50 transition-all cursor-pointer shadow-xs"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Card Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#D6B77A]/30 overflow-hidden shadow-2xl transition-all duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
            {/* Visual Image */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-16/10 sm:aspect-16/9 bg-[#F3EFE9] dark:bg-[#0B0D0E] group">
              <img
                src={slideImageSrc}
                alt={activeSlide.name}
                onError={() => {
                  setFailedImages((prev) => ({ ...prev, [activeSlide.id]: true }));
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E]/60 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#0B0D0E]/80 text-[#D6B77A] border border-[#D6B77A]/40 backdrop-blur-md">
                {activeSlide.tag}
              </span>

              {/* Featured Wishlist Heart Button (Top Right) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(activeSlide);
                }}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all z-20 cursor-pointer shadow-xl hover:scale-110 ${
                  inWishlist
                    ? "bg-rose-500 text-white"
                    : "bg-[#0B0D0E]/70 text-[#F4EFE6] border border-[#D6B77A]/40 hover:bg-[#151918]"
                }`}
                title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Content & Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#059669] dark:text-[#7FFFD4] uppercase tracking-widest">
                    {activeSlide.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#D6B77A]">
                    <Star className="w-4 h-4 fill-[#D6B77A]" />
                    <span>{activeSlide.rating} ({activeSlide.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="font-serif-luxury text-2xl sm:text-4xl font-extrabold text-[#141210] dark:text-[#F4EFE6] uppercase tracking-wide">
                  {activeSlide.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#6E6860] dark:text-[#9E988F] font-light leading-relaxed">
                  {activeSlide.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-[#E6DFD5] dark:border-[#222926] flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#141210] dark:text-[#F4EFE6]">
                    ₹{activeSlide.price}
                  </span>
                  {activeSlide.originalPrice && (
                    <span className="text-sm text-[#6E6860] dark:text-[#9E988F] line-through">
                      ₹{activeSlide.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedProduct(activeSlide)}
                    className="p-3 rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] text-[#141210] dark:text-[#F4EFE6] hover:border-[#D6B77A] transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => addToCart(activeSlide)}
                    className="px-6 py-3 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
