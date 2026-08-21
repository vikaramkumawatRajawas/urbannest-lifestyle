import { apiClient } from "./apiClient";

export const orderService = {
  // POST /api/orders
  async createOrder(orderData) {
    return await apiClient.post("/orders", orderData);
  },

  // GET /api/orders
  async getOrders() {
    return await apiClient.get("/orders");
  },

  // GET /api/orders/:orderId
  async getOrderById(orderId) {
    return await apiClient.get(`/orders/${orderId}`);
  },

  // PUT /api/orders/:orderId/status
  async updateOrderStatus(orderId, statusData) {
    return await apiClient.put(`/orders/${orderId}/status`, statusData);
  }
};
