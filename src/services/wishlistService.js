import { apiClient } from "./apiClient";

export const wishlistService = {
  // GET /api/wishlist
  getWishlist: async () => {
    return await apiClient.get("/wishlist");
  },

  // POST /api/wishlist/:productId
  addToWishlist: async (productId) => {
    return await apiClient.post(`/wishlist/${productId}`);
  },

  // DELETE /api/wishlist/:productId
  removeFromWishlist: async (productId) => {
    return await apiClient.delete(`/wishlist/${productId}`);
  },

  // GET /api/wishlist/check/:productId
  checkWishlistStatus: async (productId) => {
    return await apiClient.get(`/wishlist/check/${productId}`);
  }
};
