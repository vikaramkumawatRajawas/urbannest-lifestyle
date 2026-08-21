import { sendChatbotMessageToN8N } from "../services/n8nService.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const PRODUCT_KNOWLEDGE_BASE = [
  {
    keywords: ["vase", "ceramic", "ribbed", "flower", "decor"],
    response: "Our best-selling Ceramic Minimalist Ribbed Vase is ₹899 (31% OFF from ₹1,299). It features a matte ceramic finish, 22cm height, waterproof internal glazing, and Scandinavian aesthetics!"
  },
  {
    keywords: ["candle", "soy", "wax", "amber", "cedarwood", "scent", "aroma"],
    response: "The Scented Soy Wax Candle (Amber & Cedarwood) is ₹599 (25% OFF). Hand-poured 100% natural soy wax with 45+ hours clean burn time, organic cotton wick, and amber glass jar."
  },
  {
    keywords: ["lamp", "light", "lighting", "table lamp", "brass"],
    response: "The Warm Brass Decorative Table Lamp is ₹2,499. It features a mushroom-inspired design, 3-level touch brightness adjustment, rechargeable 4000mAh battery, and Type-C fast charging!"
  },
  {
    keywords: ["gift", "hamper", "celebration", "box", "present"],
    response: "Our popular Curated Celebration Gift Hamper is ₹1,899 (original ₹2,299). Contains a mini soy candle, gourmet chocolate, brass bookmark, herbal tea tin, and personalized handwritten greeting card."
  },
  {
    keywords: ["timing", "hour", "open", "close", "store"],
    response: "Our Indiranagar Bengaluru retail store is open Monday through Sunday from 10:00 AM to 9:00 PM IST."
  },
  {
    keywords: ["location", "address", "where", "bengaluru", "indiranagar"],
    response: "We are located at #42 Heritage Design Arcade, Indiranagar 100ft Road, Bengaluru, Karnataka 560038."
  }
];

// POST /api/chat
export const processChatbotMessage = async (req, res, next) => {
  try {
    const { message, sessionId, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return errorResponse(res, "Message string is required", 400);
    }

    const n8nChatResult = await sendChatbotMessageToN8N(
      message.trim(),
      sessionId || "urbannest-session-1",
      history || []
    );

    if (n8nChatResult.success) {
      return successResponse(
        res,
        {
          message: n8nChatResult.data.message,
          source: "N8N Cloud Webhook"
        },
        "N8N Chatbot response received"
      );
    }

    // N8N unavailable fallback handler
    const lowerMessage = message.toLowerCase();
    const matched = PRODUCT_KNOWLEDGE_BASE.find((entry) =>
      entry.keywords.some((kw) => lowerMessage.includes(kw))
    );

    const fallbackText = matched
      ? matched.response
      : "Thank you for asking! UrbanNest specializes in curated Home Décor, Soy Candles, Gift Hampers, Stationery & Planners, and Lifestyle Accessories. How can I help you choose the right product?";

    return successResponse(
      res,
      {
        message: fallbackText,
        source: "UrbanNest Fallback Knowledge Base",
        n8nStatus: "unavailable"
      },
      "AI assistant response generated (fallback mode)"
    );
  } catch (error) {
    next(error);
  }
};
