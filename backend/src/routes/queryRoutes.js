import express from "express";
import { createCustomerQuery } from "../controllers/queryController.js";
import { queryLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/queries", queryLimiter, createCustomerQuery);

export default router;
