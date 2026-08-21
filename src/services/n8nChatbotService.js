import { apiClient } from "./apiClient";
import { PRODUCTS } from "../data/productsData";

export const DEFAULT_N8N_CHATBOT_URL = "https://uttamjangid.app.n8n.cloud/webhook/urbannest/chat";

export const getActiveN8nChatbotUrl = () => {
  const customUrl = localStorage.getItem("urbannest_custom_n8n_chatbot_url");
  if (customUrl && customUrl.trim()) {
    return customUrl.trim();
  }
  return import.meta.env.VITE_N8N_CHATBOT_URL || DEFAULT_N8N_CHATBOT_URL;
};

export const setCustomN8nChatbotUrl = (url) => {
  if (url && url.trim()) {
    localStorage.setItem("urbannest_custom_n8n_chatbot_url", url.trim());
  } else {
    localStorage.removeItem("urbannest_custom_n8n_chatbot_url");
  }
};

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
    keywords: ["organizer", "desk", "wood", "wooden", "stationery"],
    response: "The Handcrafted Wooden Desk Organizer is ₹1,199 (crafted from solid mango wood with smartphone docking groove), and our Artisan Leather Journal & Pen Set is ₹799."
  },
  {
    keywords: ["planner", "journal", "notebook", "weekly"],
    response: "Our Pastel Hardcover Weekly Planner 2026 is ₹699. Features 120 GSM bleed-resistant paper, habit trackers, silk ribbons, and cute planning stickers!"
  },
  {
    keywords: ["mug", "coffee", "cup", "coaster", "tableware"],
    response: "The Ceramic Coffee Mug with Cork Coaster Set is ₹499 (350ml microwave safe stoneware), and Handmade Ceramic Terrazzo Coasters (Pack of 4) are ₹649."
  },
  {
    keywords: ["tote", "bag", "flask", "tumbler", "bottle", "spray"],
    response: "Our Insulated Stainless Steel Flask (500ml) is ₹849, Organic Cotton Canvas Tote Bag is ₹499, and Linen Scented Room & Fabric Spray (200ml) is ₹449."
  },
  {
    keywords: ["basket", "storage", "seagrass", "woven"],
    response: "The Woven Natural Seagrass Storage Basket is ₹999 (32cm diameter). Handwoven 100% natural seagrass with reinforced handles!"
  },
  {
    keywords: ["price", "cost", "range", "rate", "cheap", "inr", "₹", "rupee"],
    response: "UrbanNest product prices range from ₹399 (Brass Bookmarks) up to ₹2,499 (Warm Brass Table Lamp). All prices are in INR (₹) with no hidden fees!"
  },
  {
    keywords: ["discount", "coupon", "offer", "code", "sale", "promo"],
    response: "Current Offers: Use code WEEKEND20 for 20% OFF Home Décor, GIFTNEST10 for 10% OFF 2+ gift hampers, or URBANNEST150 for flat ₹150 OFF orders over ₹1,499!"
  },
  {
    keywords: ["delivery", "shipping", "courier", "free delivery"],
    response: "We offer FREE Delivery on all orders above ₹1,499! Standard shipping is ₹99. Metro cities receive orders in 24–48 hours."
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

export const sendChatbotMessage = async (userMessage, chatHistory = []) => {
  console.log("[ChatbotService] Sending chat message through Express API /api/chat...");

  const payload = {
    message: userMessage,
    sessionId: "urbannest-user-session-1",
    history: chatHistory
  };

  // 1. Primary Route: Express API /api/chat
  const apiResult = await apiClient.post("/chat", payload);

  if (apiResult.success && apiResult.data) {
    const replyText =
      apiResult.data.message ||
      apiResult.data.reply ||
      apiResult.data.output ||
      apiResult.data.response ||
      "Response received from UrbanNest AI Assistant.";

    return {
      text: replyText,
      sender: "bot",
      simulated: false,
      source: "Express API & N8N Cloud",
      data: apiResult.data
    };
  }

  // 2. Direct N8N Webhook Fallback if backend API is unreachable locally
  if (apiResult.isNetworkError) {
    console.warn("[ChatbotService] Express API offline. Fallback direct N8N chatbot execution...");
    const chatbotUrl = getActiveN8nChatbotUrl();
    try {
      const response = await fetch(chatbotUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: userMessage,
          message: userMessage,
          question: userMessage,
          sessionId: "urbannest-user-session-1"
        })
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.output || data.reply || data.message || data.text || JSON.stringify(data);
        return {
          text: typeof text === "string" ? text : JSON.stringify(text),
          sender: "bot",
          simulated: false,
          source: "Direct N8N Webhook",
          data
        };
      }
    } catch (directErr) {
      console.error("[ChatbotService] Direct N8N connection error:", directErr);
    }
  }

  // 3. Knowledge Base Fallback Engine
  const lowerMessage = userMessage.toLowerCase();
  const matched = PRODUCT_KNOWLEDGE_BASE.find((entry) =>
    entry.keywords.some((kw) => lowerMessage.includes(kw))
  );

  const fallbackReply = matched
    ? matched.response
    : "Thank you for asking! UrbanNest specializes in curated Home Décor, Soy Candles, Gift Hampers, Stationery & Planners, and Lifestyle Accessories. How can I help you choose the right product?";

  return {
    text: fallbackReply,
    sender: "bot",
    simulated: true,
    source: "UrbanNest Product AI Knowledge Engine"
  };
};
