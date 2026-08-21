import { apiClient } from "./apiClient";

export const authService = {
  async registerUser({ name, email, phone, password }) {
    return await apiClient.post("/auth/register", { name, email, phone, password });
  },

  async loginUser({ email, password }) {
    return await apiClient.post("/auth/login", { email, password });
  },

  async googleLogin({ credential }) {
    return await apiClient.post("/auth/google", { credential });
  },

  async facebookLogin({ accessToken }) {
    return await apiClient.post("/auth/facebook", { accessToken });
  },

  async getCurrentUser() {
    return await apiClient.get("/auth/me");
  },

  async logoutUser() {
    return await apiClient.post("/auth/logout", {});
  },

  async updateProfile(profileData) {
    return await apiClient.put("/auth/profile", profileData);
  },

  async changePassword({ currentPassword, newPassword }) {
    return await apiClient.post("/auth/change-password", { currentPassword, newPassword });
  },

  async forgotPassword({ email }) {
    return await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword({ token, newPassword, confirmPassword }) {
    return await apiClient.post("/auth/reset-password", { token, newPassword, confirmPassword });
  },

  async forgotUsername({ email }) {
    return await apiClient.post("/auth/forgot-username", { email });
  }
};
