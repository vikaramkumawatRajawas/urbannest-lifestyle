import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("urbannest_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBackendCart();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("urbannest_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.data?.cart?.items) {
        const backendItems = res.data.cart.items.map((item) => ({
          ...item.product,
          id: item.product.id || item.product._id,
          _id: item.product._id || item.product.id,
          quantity: item.quantity,
          price: item.product.price || item.priceAtAdd
        }));
        setCartItems(backendItems);
      }
    } catch (err) {
      console.warn("[CartContext] Failed to fetch backend cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = async (product, quantity = 1) => {
    const productId = product._id || product.id;

    // Optimistic local update
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item._id || item.id)?.toString() === productId?.toString()
      );
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });

    showToast(`Added "${product.name}" to cart!`);

    // Sync to backend if authenticated
    if (isAuthenticated && productId) {
      try {
        const res = await cartService.addToCart({
          productId,
          quantity,
          priceAtAdd: product.price
        });
        if (res.success && res.data?.cart?.items) {
          const backendItems = res.data.cart.items.map((item) => ({
            ...item.product,
            id: item.product.id || item.product._id,
            _id: item.product._id || item.product.id,
            quantity: item.quantity,
            price: item.product.price || item.priceAtAdd
          }));
          setCartItems(backendItems);
        }
      } catch (err) {
        console.warn("[CartContext] Backend addToCart failed:", err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    // Optimistic update
    setCartItems((prev) =>
      prev.filter((item) => (item._id || item.id)?.toString() !== productId?.toString())
    );
    showToast("Item removed from cart.");

    if (isAuthenticated && productId) {
      try {
        const res = await cartService.removeFromCart(productId);
        if (res.success && res.data?.cart?.items) {
          const backendItems = res.data.cart.items.map((item) => ({
            ...item.product,
            id: item.product.id || item.product._id,
            _id: item.product._id || item.product.id,
            quantity: item.quantity,
            price: item.product.price || item.priceAtAdd
          }));
          setCartItems(backendItems);
        }
      } catch (err) {
        console.warn("[CartContext] Backend removeFromCart failed:", err);
      }
    }
  };

  const updateQuantity = async (productId, delta) => {
    const currentItem = cartItems.find(
      (item) => (item._id || item.id)?.toString() === productId?.toString()
    );
    if (!currentItem) return;

    const newQty = currentItem.quantity + delta;

    if (newQty <= 0) {
      await removeFromCart(productId);
      return;
    }

    // Optimistic update
    setCartItems((prev) =>
      prev.map((item) => {
        if ((item._id || item.id)?.toString() === productId?.toString()) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    if (isAuthenticated && productId) {
      try {
        const res = await cartService.updateQuantity({ productId, quantity: newQty });
        if (res.success && res.data?.cart?.items) {
          const backendItems = res.data.cart.items.map((item) => ({
            ...item.product,
            id: item.product.id || item.product._id,
            _id: item.product._id || item.product.id,
            quantity: item.quantity,
            price: item.product.price || item.priceAtAdd
          }));
          setCartItems(backendItems);
        }
      } catch (err) {
        console.warn("[CartContext] Backend updateQuantity failed:", err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem("urbannest_cart");

    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn("[CartContext] Backend clearCart failed:", err);
      }
    }
  };

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const shippingFee = subtotal > 1499 || subtotal === 0 ? 0 : 99;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        shippingFee,
        toastMessage,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
