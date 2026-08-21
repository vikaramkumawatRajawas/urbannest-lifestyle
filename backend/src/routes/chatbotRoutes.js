import express from "express";
import { processChatbotMessage } from "../controllers/chatbotController.js";
import { chatLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/chat", chatLimiter, processChatbotMessage);

export default router;
