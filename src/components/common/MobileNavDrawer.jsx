import React, { useEffect } from "react";
import {
  X,
  Home,
  Grid,
  Tag,
  Info,
  Sparkles,
  Mail,
  Heart,
  Package,
  Settings,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Sun,
  Moon,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { getUserInitials } from "../auth/ProfileDropdown";

export const MobileNavDrawer = ({
  isOpen,
  onClose,
  activePage,
  setActivePage,
  onOpenChatbot,
  navLinks
}) => {
  const { theme, toggleTheme } = useTheme();
  const { orders, setIsOrdersModalOpen } = useOrders();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { wishlistCount } = useWishlist();
  const { totalItemCount, setIsCartOpen } = useCart();

  // 1. ESC Key Event Listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 2. Lock Body Scroll when Drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Centralized Navigation Handler (navigates & closes sidebar automatically)
  const handleNavigation = (pageId) => {
    setActivePage(pageId);
    onClose();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const userInitials = user?.name ? getUserInitials(user.name) : "UN";

  return (
    <div
      aria-hidden={!isOpen}
      className="md:hidden"
    >
      {/* Semi-Transparent Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Close navigation overlay"
      />

      {/* Slide-In Navigation Drawer Panel */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-white dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] border-l border-[#E6DFD5] dark:border-[#222926] shadow-2xl backdrop-blur-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header Bar */}
        <div className="p-4 border-b border-[#E6DFD5] dark:border-[#222926] flex items-center justify-between bg-[#FAF8F5]/80 dark:bg-[#151918]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#151918] border border-[#D6B77A]/40 text-[#D6B77A] flex items-center justify-center font-serif-luxury font-bold text-sm shadow-md">
              U
            </div>
            <div>
              <span className="font-serif-luxury text-base font-bold tracking-widest text-[#141210] dark:text-[#F4EFE6] uppercase">
                Urban<span className="text-[#D6B77A]">Nest</span>
              </span>
              <span className="block text-[8px] tracking-[0.2em] font-medium text-[#6E6860] dark:text-[#9E988F] uppercase -mt-0.5">
                Navigation Menu
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6E6860] dark:text-[#9E988F] hover:text-[#141210] dark:hover:text-[#F4EFE6] hover:bg-[#E6DFD5]/50 dark:hover:bg-[#222926] transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Body Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
          {/* User Account Card */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926]">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#087F68] to-[#B98232] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md border border-[#D6B77A]/40 tracking-wider">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#141210] dark:text-[#F4EFE6] truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[#6E6860] dark:text-[#9E988F] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    openAuthModal("profile");
                  }}
                  className="p-1.5 rounded-lg text-[#D6B77A] hover:bg-[#E6DFD5]/40 dark:hover:bg-[#222926] transition-colors cursor-pointer"
                  title="My Profile"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-[#141210] dark:text-[#F4EFE6]">
                    Welcome Guest!
                  </p>
                  <p className="text-[10px] text-[#6E6860] dark:text-[#9E988F]">
                    Sign in for personalized features
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal("login");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#D6B77A] text-[#0B0D0E] text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Primary Navigation Links */}
          <div>
            <p className="px-2 mb-2 text-[10px] font-extrabold text-[#6E6860] dark:text-[#9E988F] uppercase tracking-widest">
              Explore Pages
            </p>
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigation(link.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#D6B77A] text-[#0B0D0E] font-extrabold shadow-sm"
                        : "text-[#6E6860] dark:text-[#9E988F] hover:text-[#141210] dark:hover:text-[#F4EFE6] hover:bg-[#FAF8F5] dark:hover:bg-[#151918]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-60 ${
                        isActive ? "text-[#0B0D0E]" : "text-[#6E6860] dark:text-[#9E988F]"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Secondary Quick Actions */}
          <div>
            <p className="px-2 mb-2 text-[10px] font-extrabold text-[#6E6860] dark:text-[#9E988F] uppercase tracking-widest">
              Quick Shortcuts
            </p>
            <div className="space-y-1">
              {/* Add to Cart Link */}
              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#141210] dark:text-[#F4EFE6] hover:bg-[#FAF8F5] dark:hover:bg-[#151918] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#D6B77A]" />
                  <span>🛒 Add to Cart</span>
                </div>
                {totalItemCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D6B77A] text-[#0B0D0E] text-[10px] font-black">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* My Orders Link */}
              <button
                onClick={() => {
                  handleNavigation("orders");
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activePage === "orders"
                    ? "bg-[#D6B77A] text-[#0B0D0E] font-extrabold shadow-sm"
                    : "text-[#141210] dark:text-[#F4EFE6] hover:bg-[#FAF8F5] dark:hover:bg-[#151918]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#087F68] dark:text-[#7FFFD4]" />
                  <span>📦 My Orders</span>
                </div>
                {orders.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#087F68] dark:bg-[#7FFFD4] text-white dark:text-[#0B0D0E] text-[10px] font-black">
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Wishlist Link */}
              <button
                onClick={() => handleNavigation("wishlist")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#141210] dark:text-[#F4EFE6] hover:bg-[#FAF8F5] dark:hover:bg-[#151918] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span>My Saved Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Settings Page */}
              <button
                onClick={() => handleNavigation("settings")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#6E6860] dark:text-[#9E988F] hover:text-[#141210] dark:hover:text-[#F4EFE6] hover:bg-[#FAF8F5] dark:hover:bg-[#151918] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
              </button>
            </div>
          </div>

          {/* AI Assistant Button Banner */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenChatbot();
              }}
              className="btn-ai-glow w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[#141210] dark:text-[#F4EFE6] font-extrabold text-xs uppercase tracking-widest cursor-pointer shadow-md"
            >
              <span className="text-[#059669] dark:text-[#7FFFD4]">✦</span>
              <span>Ask AI Lifestyle Assistant</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[#E6DFD5] dark:border-[#222926] bg-[#FAF8F5]/80 dark:bg-[#151918]/80 space-y-3">
          {/* Theme Toggle Option */}
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-bold text-[#6E6860] dark:text-[#9E988F] uppercase tracking-wider">
              App Appearance
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] text-xs font-bold text-[#141210] dark:text-[#F4EFE6] cursor-pointer shadow-xs"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-[#D6B77A]" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#D97706]" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          {/* Auth Button Action (Logout / Register / Login) */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  openAuthModal("login");
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] text-[#141210] dark:text-[#F4EFE6] font-extrabold text-xs uppercase tracking-wider hover:border-[#D6B77A] transition-all cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#087F68] dark:text-[#7FFFD4]" />
                <span>Login</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  openAuthModal("register");
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#D6B77A] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
