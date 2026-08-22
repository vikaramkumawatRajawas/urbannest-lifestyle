import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { ENV } from "./config/env.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimitMiddleware.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";

import healthRoutes from "./routes/healthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ENV.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        ENV.NODE_ENV === "development" ||
        origin.endsWith(".onrender.com")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin '${origin}' not permitted`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// HTTP Request Logger
if (ENV.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// General API Rate Limiting
app.use("/api", apiLimiter);

// Specific Auth Endpoint Rate Limiting
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);
app.use("/api/auth/forgot-username", authLimiter);

// Mount API Routes
app.use("/api", healthRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", queryRoutes);
app.use("/api", chatbotRoutes);
app.use("/api", contactRoutes);
app.use("/api", offerRoutes);
app.use("/api", testimonialRoutes);
app.use("/api", newsletterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/payment", paymentRoutes);

// Root endpoint info
app.get("/", (req, res) => {
  res.json({
    service: "UrbanNest Lifestyle Store REST API",
    healthCheck: "/api/health",
    products: "/api/products",
    auth: "/api/auth/login",
    wishlist: "/api/wishlist",
    cart: "/api/cart",
    orders: "/api/orders",
    payment: "/api/payment/create-order"
  });
});

// Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
