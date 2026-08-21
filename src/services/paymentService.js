import { apiClient } from "./apiClient";

export const paymentService = {
  // POST /api/payment/create-order
  async createRazorpayOrder(paymentData) {
    return await apiClient.post("/payment/create-order", paymentData);
  },

  // POST /api/payment/verify
  async verifyPayment(verificationData) {
    return await apiClient.post("/payment/verify", verificationData);
  }
};
