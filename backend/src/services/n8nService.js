import axios from "axios";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

const HTTP_TIMEOUT = 8000; // 8 seconds timeout for N8N webhooks

/**
 * Send Customer Query Payload to N8N Webhook
 */
export const sendCustomerQueryToN8N = async (queryData) => {
  const webhookUrl = ENV.N8N_QUERY_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.trim() === "" || webhookUrl.includes("example.com")) {
    logger.warn("N8N_QUERY_WEBHOOK_URL is not set or using default placeholder. N8N forwarding skipped.");
    return {
      delivered: false,
      message: "N8N_QUERY_WEBHOOK_URL environment variable is not configured.",
      simulated: true
    };
  }

  const payload = {
    queryId: queryData._id || queryData.id,
    name: queryData.name,
    email: queryData.email,
    phone: queryData.phone || "Not provided",
    category: queryData.category,
    message: queryData.message,
    submittedAt: queryData.createdAt || new Date().toISOString(),
    source: "UrbanNest Express Backend API"
  };

  try {
    logger.info(`Transmitting customer query [${payload.queryId}] to N8N webhook...`);

    const response = await axios.post(webhookUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      timeout: HTTP_TIMEOUT
    });

    logger.info(`N8N Query Webhook responded with HTTP status ${response.status}`);

    return {
      delivered: true,
      status: response.status,
      responseData: response.data
    };
  } catch (error) {
    logger.error(`N8N Query Webhook dispatch failed: ${error.message}`);
    return {
      delivered: false,
      error: error.message,
      code: error.code || "N8N_DISPATCH_ERROR"
    };
  }
};

/**
 * Relay User Chat Message to N8N AI Chatbot Webhook
 */
export const sendChatbotMessageToN8N = async (message, sessionId = "urbannest-session-1", history = []) => {
  const chatbotUrl = ENV.N8N_CHATBOT_WEBHOOK_URL;

  if (!chatbotUrl || chatbotUrl.trim() === "" || chatbotUrl.includes("example.com")) {
    logger.warn("N8N_CHATBOT_WEBHOOK_URL is not configured.");
    return {
      success: false,
      message: "The N8N AI assistant endpoint is currently not configured in environment variables.",
      isConfigured: false
    };
  }

  const payload = {
    chatInput: message,
    sessionId: sessionId,
    history: history,
    timestamp: new Date().toISOString()
  };

  try {
    logger.info(`Sending chat input to N8N Chatbot webhook...`);

    const response = await axios.post(chatbotUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      timeout: HTTP_TIMEOUT
    });

    const data = response.data;
    let replyText = "";

    if (typeof data === "string") {
      replyText = data;
    } else if (data && typeof data === "object") {
      replyText =
        data.output ||
        data.response ||
        data.text ||
        data.message ||
        (Array.isArray(data) && data[0]?.output) ||
        JSON.stringify(data);
    } else {
      replyText = "Response received from N8N AI workflow.";
    }

    return {
      success: true,
      data: {
        message: replyText
      }
    };
  } catch (error) {
    logger.error(`N8N Chatbot Webhook request failed: ${error.message}`);
    return {
      success: false,
      message: "The N8N AI assistant is temporarily unavailable. Please try again or submit a query.",
      error: error.message
    };
  }
};
