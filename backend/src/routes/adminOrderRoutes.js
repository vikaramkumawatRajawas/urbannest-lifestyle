import express from "express";
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus
} from "../controllers/adminOrderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require both user authentication and admin authorization
router.use(protect);
router.use(adminOnly);

// GET /api/admin/orders
router.get("/", getAdminOrders);

// GET /api/admin/orders/:id
router.get("/:id", getAdminOrderById);

// PATCH /api/admin/orders/:id/status
router.patch("/:id/status", updateOrderStatus);

// PUT /api/admin/orders/:id/status
router.put("/:id/status", updateOrderStatus);

export default router;
