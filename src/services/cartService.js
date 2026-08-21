import { apiClient } from "./apiClient";

export const cartService = {
  // GET /api/cart
  async getCart() {
    return await apiClient.get("/cart");
  },

  // POST /api/cart/add
  async addToCart({ productId, quantity = 1, priceAtAdd }) {
    return await apiClient.post("/cart/add", { productId, quantity, priceAtAdd });
  },

  // PUT /api/cart/update
  async updateQuantity({ productId, quantity }) {
    return await apiClient.put("/cart/update", { productId, quantity });
  },

  // DELETE /api/cart/remove/:productId
  async removeFromCart(productId) {
    return await apiClient.request(`/cart/remove/${productId}`, { method: "DELETE" });
  },

  // DELETE /api/cart/clear
  async clearCart() {
    return await apiClient.request("/cart/clear", { method: "DELETE" });
  }
};
