import express from "express";
import mongoose from "mongoose";
import { successResponse } from "../utils/apiResponse.js";

const router = express.Router();

// GET /api/health
router.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  return successResponse(res, {
    status: "healthy",
    service: "UrbanNest Backend REST API",
    version: "1.0.0",
    database: dbStatusMap[dbState] || "unknown",
    timestamp: new Date().toISOString()
  }, "UrbanNest Backend is healthy");
});

export default router;
