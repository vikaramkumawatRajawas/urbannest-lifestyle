import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xl transition-all duration-300 animate-bounce">
      <CheckCircle2 className="w-5 h-5 text-amber-500" />
      <span className="text-sm font-medium">{toastMessage}</span>
    </div>
  );
};
