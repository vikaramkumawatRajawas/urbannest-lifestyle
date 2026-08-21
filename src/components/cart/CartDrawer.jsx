import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Truck
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { CheckoutModal } from "./CheckoutModal";

const createSvgFallback = (name, category) => {
  const bg = category === 'Home Décor' ? '#151918' : category === 'Gifts' ? '#1E1A24' : '#141E22';
  const text = name || 'UrbanNest Item';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="${bg}"/><circle cx="100" cy="85" r="40" fill="#D6B77A" opacity="0.2"/><path d="M85,120 L115,120 L108,70 Q100,55 92,70 Z" fill="#D6B77A"/><text x="50%" y="160" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#F4EFE6">${text.substring(0, 15)}...</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const CartDrawer = ({ setActivePage }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee
  } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const grandTotal = subtotal + shippingFee;
  const freeShippingThreshold = 1499;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleOpenCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
        {/* Backdrop */}
        <div
          onClick={handleClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white dark:bg-[#151918] text-[#141210] dark:text-[#F4EFE6] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-[#E6DFD5] dark:border-[#222926] flex items-center justify-between bg-[#F3EFE9] dark:bg-[#0B0D0E]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#151918] text-[#D6B77A] border border-[#D6B77A]/30">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg leading-tight uppercase tracking-wider">Your Cart</h3>
                  <p className="text-xs text-[#6E6860] dark:text-[#9E988F]">
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"} selected
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-rose-500/20 text-[#6E6860] dark:text-[#9E988F] hover:text-rose-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {cartItems.length > 0 && (
              <div className="px-5 py-3 bg-[#F3EFE9] dark:bg-[#0B0D0E] border-b border-[#E6DFD5] dark:border-[#222926] text-xs">
                <div className="flex items-center justify-between font-medium text-[#6E6860] dark:text-[#9E988F] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#D6B77A]" />
                    {amountForFreeShipping === 0 ? (
                      <span className="text-[#059669] dark:text-[#7FFFD4] font-bold">You unlocked FREE Delivery!</span>
                    ) : (
                      <span>
                        Add <strong className="text-[#D6B77A]">₹{amountForFreeShipping}</strong> for FREE Delivery
                      </span>
                    )}
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E6DFD5] dark:bg-[#222926] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D6B77A] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 bg-[#F3EFE9] dark:bg-[#0B0D0E] rounded-full flex items-center justify-center mx-auto text-[#9E988F]">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-xl text-[#141210] dark:text-[#F4EFE6] uppercase tracking-wider">
                    Your cart is empty
                  </h4>
                  <p className="text-xs text-[#6E6860] dark:text-[#9E988F] max-w-xs mx-auto">
                    Explore our curated lifestyle items, candles, vases and stationery to start filling your space.
                  </p>
                  <button
                    onClick={() => {
                      handleClose();
                      if (setActivePage) setActivePage("products");
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#D6B77A] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest hover:bg-[#c4a466] transition-colors shadow"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = createSvgFallback(item.name, item.category);
                      }}
                      className="w-20 h-20 object-cover rounded-xl shrink-0 border border-[#E6DFD5] dark:border-[#222926]"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif-luxury font-bold text-sm line-clamp-1 text-[#141210] dark:text-[#F4EFE6]">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#6E6860] dark:text-[#9E988F] hover:text-rose-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-[#059669] dark:text-[#7FFFD4] uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#E6DFD5] dark:border-[#222926] rounded-lg overflow-hidden bg-white dark:bg-[#151918]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-[#6E6860] dark:text-[#9E988F] hover:bg-[#F3EFE9] dark:hover:bg-[#222926]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#141210] dark:text-[#F4EFE6]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-[#6E6860] dark:text-[#9E988F] hover:bg-[#F3EFE9] dark:hover:bg-[#222926]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-[#141210] dark:text-[#F4EFE6]">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-[#E6DFD5] dark:border-[#222926] bg-[#F3EFE9] dark:bg-[#0B0D0E] space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6E6860] dark:text-[#9E988F]">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#6E6860] dark:text-[#9E988F]">
                    <span>Delivery Charge</span>
                    <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#141210] dark:text-[#F4EFE6] pt-2 border-t border-[#E6DFD5] dark:border-[#222926]">
                    <span>Grand Total</span>
                    <span className="text-[#D6B77A] font-extrabold text-base">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleOpenCheckout}
                  className="w-full py-4 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout & Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout & Payment Gateway Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        setActivePage={setActivePage}
      />
    </>
  );
};
