import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Home,
  Grid,
  Tag,
  Info,
  Mail,
  ArrowRight,
  Package,
  Heart
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { ProfileDropdown } from "../auth/ProfileDropdown";
import { MobileNavDrawer } from "./MobileNavDrawer";

export const Navbar = ({ activePage, setActivePage, onOpenChatbot }) => {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { products, setSearchQuery, setSelectedProduct } = useProducts();
  const { orders, setIsOrdersModalOpen } = useOrders();
  const { user, openAuthModal } = useAuth();
  const { wishlistCount } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home", icon: Home },
    { id: "products", label: "Products", icon: Grid },
    { id: "offers", label: "Offers", icon: Tag },
    { id: "about", label: "About", icon: Info },
    { id: "faq", label: "FAQ", icon: Sparkles },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchInputText.trim()) {
      setSearchQuery(searchInputText);
      setActivePage("products");
      setIsSearchOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const searchSuggestions = searchInputText.trim().length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchInputText.toLowerCase()) ||
        p.category.toLowerCase().includes(searchInputText.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(searchInputText.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
        isScrolled
          ? "bg-white/90 dark:bg-[#0B0D0E]/85 backdrop-blur-xl border-b border-[#E6DFD5] dark:border-[#222926] py-3 shadow-xl"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#151918] border border-[#D6B77A]/40 text-[#D6B77A] flex items-center justify-center font-serif-luxury font-bold text-lg shadow-md group-hover:border-[#7FFFD4] transition-all">
              U
            </div>
            <div>
              <span className="font-serif-luxury text-xl font-bold tracking-widest text-[#141210] dark:text-[#F4EFE6] uppercase group-hover:text-[#D6B77A] transition-colors">
                Urban<span className="text-[#D6B77A]">Nest</span>
              </span>
              <span className="block text-[9px] tracking-[0.2em] font-medium text-[#6E6860] dark:text-[#9E988F] uppercase -mt-1">
                Lifestyle Store
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 dark:bg-[#151918]/80 p-1.5 rounded-full border border-[#E6DFD5] dark:border-[#222926] backdrop-blur-md shadow-xs">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#D6B77A] text-[#0B0D0E] font-extrabold shadow-sm"
                      : "text-[#6E6860] dark:text-[#9E988F] hover:text-[#141210] dark:hover:text-[#F4EFE6] hover:bg-[#F3EFE9] dark:hover:bg-[#222926]/50"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Tools (Right Header) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Action Group (Hidden on Mobile/Tablet) */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              {/* 1. Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full text-[#6E6860] dark:text-[#9E988F] hover:text-[#141210] dark:hover:text-[#F4EFE6] hover:bg-[#F3EFE9] dark:hover:bg-[#151918] transition-colors cursor-pointer"
                title="Search products"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* 2. Wishlist Trigger Button */}
              <button
                onClick={() => handleNavClick("wishlist")}
                className="relative p-2 rounded-full text-[#141210] dark:text-[#F4EFE6] bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] hover:border-rose-400 transition-colors cursor-pointer shadow-xs"
                title="View Saved Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-rose-500 hover:fill-rose-500 transition-all" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* 3. My Orders & Live Tracking Trigger */}
              <button
                onClick={() => setIsOrdersModalOpen(true)}
                className="relative p-2 rounded-full text-[#141210] dark:text-[#F4EFE6] bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] hover:border-[#D6B77A]/50 transition-colors cursor-pointer shadow-xs"
                title="My Orders & Live Tracking"
                aria-label="My Orders"
              >
                <Package className="w-5 h-5 text-[#D6B77A]" />
                {orders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7FFFD4] text-[#0B0D0E] text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                    {orders.length}
                  </span>
                )}
              </button>

              {/* 4. AI Assistant Button with Glow */}
              <button
                onClick={onOpenChatbot}
                className="btn-ai-glow hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#141210] dark:text-[#F4EFE6] uppercase tracking-wider transition-all cursor-pointer"
                title="Open AI Assistant"
              >
                <span className="text-[#059669] dark:text-[#7FFFD4] text-sm">✦</span>
                <span>AI</span>
              </button>

              {/* 5. Dark/Light Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-[#141210] dark:text-[#F4EFE6] bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] hover:border-[#D6B77A]/50 transition-all cursor-pointer shadow-xs"
                title="Toggle Theme"
                aria-label="Theme toggle"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[#D6B77A]" />
                ) : (
                  <Moon className="w-5 h-5 text-[#D97706]" />
                )}
              </button>

              {/* 6. Shopping Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full text-[#141210] dark:text-[#F4EFE6] bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] hover:border-[#D6B77A]/50 transition-colors cursor-pointer shadow-xs"
                title="Shopping Cart"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#141210] dark:text-[#F4EFE6]" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D6B77A] text-[#0B0D0E] text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* 7. User Account Profile Dropdown */}
              <ProfileDropdown setActivePage={setActivePage} />
            </div>

            {/* Mobile Hamburger Toggle Button (Visible on Mobile/Tablet <= 767px) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#141210] dark:text-[#F4EFE6] hover:bg-[#F3EFE9] dark:hover:bg-[#151918] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D6B77A]"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="mt-3 pt-3 border-t border-[#E6DFD5] dark:border-[#222926] animate-fadeIn relative">
            <div className="max-w-xl mx-auto relative">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Type product name (e.g. vase, candle, lamp, planner)..."
                  value={searchInputText}
                  onChange={(e) => setSearchInputText(e.target.value)}
                  className="w-full pl-10 pr-24 py-2.5 text-xs rounded-full bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#D6B77A]/40 text-[#141210] dark:text-[#F4EFE6] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#7FFFD4]"
                  autoFocus
                />
                <Search className="w-4 h-4 absolute left-3.5 text-[#6E6860] dark:text-[#9E988F]" />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1 rounded-full text-xs font-bold bg-[#D6B77A] text-[#0B0D0E] uppercase tracking-wider cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Real-time Product Suggestions */}
              {searchInputText.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#D6B77A]/40 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                  {searchSuggestions.length > 0 ? (
                    <div className="p-2 divide-y divide-[#E6DFD5]/50 dark:divide-[#222926]">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-[#6E6860] dark:text-[#9E988F] uppercase tracking-wider flex justify-between items-center">
                        <span>Suggested Products ({searchSuggestions.length})</span>
                        <span className="text-[#D6B77A]">Click to view</span>
                      </div>
                      {searchSuggestions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedProduct(item);
                            setIsSearchOpen(false);
                            setSearchInputText("");
                          }}
                          className="p-2.5 flex items-center gap-3 hover:bg-[#F3EFE9] dark:hover:bg-[#0B0D0E] cursor-pointer transition-colors rounded-xl"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[#E6DFD5] dark:border-[#222926]"
                          />
                          <div className="flex-1 overflow-hidden">
                            <h4 className="font-serif-luxury font-bold text-xs text-[#141210] dark:text-[#F4EFE6] truncate">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-[#059669] dark:text-[#7FFFD4] font-semibold uppercase">
                              {item.category}
                            </span>
                          </div>
                          <span className="font-extrabold text-xs text-[#D6B77A] shrink-0">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                      <div
                        onClick={handleSearchSubmit}
                        className="p-2.5 text-center text-xs font-bold text-[#D6B77A] hover:bg-[#F3EFE9] dark:hover:bg-[#0B0D0E] cursor-pointer transition-colors rounded-b-xl flex items-center justify-center gap-1"
                      >
                        <span>View all matches for "{searchInputText}"</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-[#6E6860] dark:text-[#9E988F]">
                      No products found matching "<strong>{searchInputText}</strong>"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer Panel */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenChatbot={onOpenChatbot}
        navLinks={navLinks}
      />
    </header>
  );
};

