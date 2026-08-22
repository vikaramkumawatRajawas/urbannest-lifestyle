import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderTracking,
  cancelOrder,
  requestReturn
} from "../controllers/orderController.js";
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus
} from "../controllers/adminOrderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User Protected Routes
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.get("/:orderId/track", getOrderTracking);
router.patch("/:orderId/cancel", cancelOrder);
router.post("/:orderId/return", requestReturn);

// Admin Protected Routes (Mounted under /api/orders/admin/* for compatibility)
router.get("/admin/all", adminOnly, getAdminOrders);
router.get("/admin/:id", adminOnly, getAdminOrderById);
router.patch("/admin/:id/status", adminOnly, updateOrderStatus);
router.put("/admin/:id/status", adminOnly, updateOrderStatus);

export default router;
