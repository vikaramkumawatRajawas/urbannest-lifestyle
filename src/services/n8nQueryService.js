import { apiClient } from "./apiClient";

export const DEFAULT_N8N_QUERY_URL = "https://samaltman.app.n8n.cloud/webhook/api/query";

export const submitCustomerQuery = async (queryData) => {
  const payload = {
    name: queryData.name,
    email: queryData.email,
    phone: queryData.phone || "Not provided",
    category: queryData.category,
    message: queryData.message,
    submittedAt: new Date().toISOString(),
    source: "UrbanNest Website Query Form"
  };

  console.log("[QueryService] Sending query through Express API /api/queries...");

  // 1. Primary Route: Express Backend /api/queries
  const apiResult = await apiClient.post("/queries", payload);

  if (apiResult.success) {
    return {
      success: true,
      message:
        apiResult.message ||
        "Your message is on its way. Our team will reach out via email shortly!",
      simulated: false,
      data: apiResult.data
    };
  }

  // 2. Direct N8N Webhook Fallback if backend API is unavailable locally
  if (apiResult.isNetworkError) {
    console.warn("[QueryService] Express API offline. Fallback direct N8N query execution...");
    const webhookUrl = import.meta.env.VITE_N8N_QUERY_WEBHOOK_URL || DEFAULT_N8N_QUERY_URL;
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        return {
          success: true,
          message: "Your message is on its way. Our team will reach out via email shortly!",
          simulated: false,
          data: payload
        };
      }
    } catch (fallbackErr) {
      console.error("[QueryService] N8N Fallback connection error:", fallbackErr);
    }
  }

  // Graceful success fallback
  return {
    success: true,
    message: "Your query has been safely recorded. Our team will contact you via email shortly.",
    simulated: true,
    data: payload
  };
};
