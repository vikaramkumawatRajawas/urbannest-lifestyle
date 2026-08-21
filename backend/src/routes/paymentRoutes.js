import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

export default router;
