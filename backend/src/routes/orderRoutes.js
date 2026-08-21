import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.put("/:orderId/status", updateOrderStatus);

export default router;
