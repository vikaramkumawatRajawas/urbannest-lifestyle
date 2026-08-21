import { errorResponse } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";
import { ENV } from "../config/env.js";

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  logger.error(`[Unhandled Error] ${err.message}`, err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;
  const message = ENV.NODE_ENV === "production" && statusCode === 500
    ? "Internal Server Error"
    : err.message || "Something went wrong";

  return errorResponse(res, message, statusCode);
};
