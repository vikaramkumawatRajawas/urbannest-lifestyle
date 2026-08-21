import React, { useState, useRef, useEffect } from "react";
import { User, LogIn, UserPlus, Settings, Package, Heart, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";

export const getUserInitials = (name) => {
  if (!name || typeof name !== "string") return "UN";
  const cleanName = name.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "UN";

  if (parts.length >= 2) {
    const firstChar = parts[0][0];
    const lastChar = parts[parts.length - 1][0];
    return `${firstChar}${lastChar}`.toUpperCase();
  }

  // Single name fallback (e.g. "Vikram" -> "VK")
  const single = parts[0];
  if (single.length >= 2) {
    return `${single[0]}${single[1]}`.toUpperCase();
  }

  return `${single[0]}X`.toUpperCase();
};

export const ProfileDropdown = ({ setActivePage }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { setIsOrdersModalOpen } = useOrders();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape Key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAction = (callback) => {
    setIsOpen(false);
    if (callback) callback();
  };

  const userInitials = user?.name ? getUserInitials(user.name) : "UN";
  const ariaLabelText = isAuthenticated && user?.name ? `${user.name} account` : "User account menu";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Navbar Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/70 dark:bg-[#151918]/70 border border-[#E6DFD5] dark:border-[#222926] text-[#141210] dark:text-[#F4EFE6] hover:border-[#D6B77A] transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D6B77A]"
        aria-label={ariaLabelText}
        aria-expanded={isOpen}
      >
        {isAuthenticated && user ? (
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#087F68] to-[#B98232] text-white text-xs font-black flex items-center justify-center shadow-md tracking-wider border border-[#D6B77A]/40">
            {userInitials}
          </span>
        ) : (
          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] flex items-center justify-center text-[#D6B77A]">
            <User className="w-4 h-4" />
          </div>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#6E6860] dark:text-[#9E988F] transition-transform duration-300 mr-0.5 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-64 rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#D6B77A]/30 shadow-2xl z-50 p-2 transform origin-top-right transition-all duration-250 ease-out animate-in fade-in zoom-in-95"
          role="menu"
        >
          {/* Header Banner */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] mb-1.5 flex items-center justify-between">
            {isAuthenticated && user ? (
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
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-extrabold text-[#141210] dark:text-[#F4EFE6] flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
                  <span>Welcome to UrbanNest</span>
                </span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5 text-xs font-semibold text-[#141210] dark:text-[#F4EFE6]">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleAction(() => openAuthModal("login"))}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#0B0D0E] transition-colors cursor-pointer text-left group"
                >
                  <LogIn className="w-4 h-4 text-[#087F68] dark:text-[#7FFFD4] group-hover:scale-110 transition-transform" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => handleAction(() => openAuthModal("register"))}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#0B0D0E] transition-colors cursor-pointer text-left group"
                >
                  <UserPlus className="w-4 h-4 text-[#B98232] dark:text-[#D6B77A] group-hover:scale-110 transition-transform" />
                  <span>Create New Account</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAction(() => openAuthModal("profile"))}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#0B0D0E] transition-colors cursor-pointer text-left group"
                >
                  <User className="w-4 h-4 text-[#D6B77A] group-hover:scale-110 transition-transform" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => handleAction(() => setIsOrdersModalOpen(true))}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#0B0D0E] transition-colors cursor-pointer text-left group"
                >
                  <Package className="w-4 h-4 text-[#087F68] dark:text-[#7FFFD4] group-hover:scale-110 transition-transform" />
                  <span>My Orders & Tracking</span>
                </button>

                <button
                  onClick={() => handleAction(() => {
                    if (setActivePage) setActivePage("wishlist");
                  })}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#0B0D0E] transition-colors cursor-pointer text-left group"
                >
                  <Heart className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                  <span>Wishlist</span>
                </button>
              </>
            )}

            <button
              onClick={() => handleAction(() => {
                if (setActivePage) setActivePage("settings");
              })}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#0B0D0E] transition-colors cursor-pointer text-left group"
            >
              <Settings className="w-4 h-4 text-[#6E6860] dark:text-[#9E988F] group-hover:scale-110 transition-transform" />
              <span>Settings</span>
            </button>

            {isAuthenticated && (
              <div className="pt-1 mt-1 border-t border-[#E6DFD5] dark:border-[#222926]">
                <button
                  onClick={() => handleAction(() => logout())}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer text-left group font-bold"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
