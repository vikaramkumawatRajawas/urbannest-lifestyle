import dotenv from "dotenv";

// Load .env file
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://kumawatvikram642_db_user:iBSx4elqDybFRwpG@cluster0.r0adqxe.mongodb.net/urbannest?retryWrites=true&w=majority",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  N8N_QUERY_WEBHOOK_URL:
    process.env.N8N_QUERY_WEBHOOK_URL ||
    "https://samaltman.app.n8n.cloud/webhook/api/query",
  N8N_CHATBOT_WEBHOOK_URL:
    process.env.N8N_CHATBOT_WEBHOOK_URL ||
    "https://uttamjangid.app.n8n.cloud/webhook/urbannest/chat",
  JWT_SECRET: process.env.JWT_SECRET || "urbannest_super_secret_jwt_key_2026_hackathon",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_test_urbannest_dev_key",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "urbannest_razorpay_secret_dev_key",
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 mins
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10)
};
