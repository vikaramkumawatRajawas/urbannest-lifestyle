import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { wishlistService } from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hydrate wishlist when authenticated user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    } else {
      setWishlistProducts([]);
    }
  }, [isAuthenticated, user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.success && res.data?.products) {
        setWishlistProducts(res.data.products);
      }
    } catch (err) {
      console.warn("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const isWishlisted = (productId) => {
    if (!productId) return false;
    return wishlistProducts.some(
      (p) => (p._id || p.id || p.productId)?.toString() === productId.toString()
    );
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return { success: false, message: "Please log in to save items to your wishlist." };
    }

    const productId = product._id || product.id;
    if (!productId) return { success: false, message: "Invalid product identifier." };

    const currentlyWishlisted = isWishlisted(productId);

    if (currentlyWishlisted) {
      // Optimistic update
      setWishlistProducts((prev) =>
        prev.filter((p) => (p._id || p.id)?.toString() !== productId.toString())
      );

      try {
        const res = await wishlistService.removeFromWishlist(productId);
        if (res.success && res.data?.wishlist?.products) {
          setWishlistProducts(res.data.wishlist.products);
        }
        return { success: true, action: "removed", message: "Removed from wishlist" };
      } catch (err) {
        // Rollback on error
        fetchWishlist();
        return { success: false, message: "Failed to remove item from wishlist." };
      }
    } else {
      // Optimistic update
      setWishlistProducts((prev) => [product, ...prev]);

      try {
        const res = await wishlistService.addToWishlist(productId);
        if (res.success && res.data?.wishlist?.products) {
          setWishlistProducts(res.data.wishlist.products);
        }
        return { success: true, action: "added", message: "Added to wishlist" };
      } catch (err) {
        // Rollback on error
        fetchWishlist();
        return { success: false, message: "Failed to add item to wishlist." };
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistProducts,
        wishlistCount: wishlistProducts.length,
        loading,
        fetchWishlist,
        isWishlisted,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
