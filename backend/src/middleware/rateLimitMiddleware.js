import rateLimit from "express-rate-limit";
import { ENV } from "../config/env.js";

// General API Rate Limiter (100 req / 15m)
export const apiLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  }
});

// Auth API Rate Limiter (15 req / 15m)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login or registration attempts. Please try again after 15 minutes."
  }
});

// Chatbot API Rate Limiter (30 req / 15m)
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Chat request limit exceeded. Please wait a few minutes before asking more questions."
  }
});

// Query & Contact API Rate Limiter (10 req / 15m)
export const queryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Query submission limit exceeded for this IP. Please try again later."
  }
});
