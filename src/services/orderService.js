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

  // GET /api/orders/:orderId/track
  async getOrderTracking(orderId) {
    return await apiClient.get(`/orders/${orderId}/track`);
  },

  // GET /api/orders/admin/all
  async getAllOrdersAdmin() {
    return await apiClient.get("/orders/admin/all");
  },

  // PATCH /api/orders/:orderId/status
  async updateOrderStatus(orderId, statusData) {
    return await apiClient.patch(`/orders/${orderId}/status`, statusData);
  }
};
