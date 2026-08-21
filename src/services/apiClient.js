// Centralized REST API Client for UrbanNest Express Backend

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiClient = {
  baseUrl: API_BASE_URL,

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const token = localStorage.getItem("urbannest_auth_token");

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: data.message || `Request failed with status ${response.status}`,
          errors: data.errors || null,
          data: null
        };
      }

      return {
        success: true,
        status: response.status,
        message: data.message || "Success",
        data: data.data !== undefined ? data.data : data
      };
    } catch (error) {
      console.warn(`[apiClient] Network / connection error to ${url}:`, error.message);
      return {
        success: false,
        status: 0,
        message: error.message || "Network error. Backend server unreachable.",
        data: null,
        isNetworkError: true
      };
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body)
    });
  }
};
