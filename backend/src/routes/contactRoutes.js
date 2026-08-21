import express from "express";
import { submitContactMessage, subscribeNewsletter } from "../controllers/contactController.js";
import { queryLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/contact", queryLimiter, submitContactMessage);
router.post("/newsletter/subscribe", queryLimiter, subscribeNewsletter);

export default router;
