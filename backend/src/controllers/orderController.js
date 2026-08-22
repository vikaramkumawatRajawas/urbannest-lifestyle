import { orderService } from "../services/orderService.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shippingDetails, paymentMethod, items } = req.body;

    const order = await orderService.createOrder({
      userId,
      shippingDetails,
      paymentMethod,
      items
    });

    return successResponse(
      res,
      { order },
      "Order created successfully.",
      201
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// GET /api/orders
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const result = await orderService.getUserOrders({
      userId,
      page,
      limit
    });

    return successResponse(
      res,
      result,
      "User orders retrieved successfully."
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// GET /api/orders/:orderId
export const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { orderId } = req.params;

    const order = await orderService.getOrderById({
      userId,
      userRole,
      orderId
    });

    return successResponse(
      res,
      { order },
      "Order details retrieved successfully."
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// GET /api/orders/:orderId/track
export const getOrderTracking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { orderId } = req.params;

    const trackingData = await orderService.getOrderTracking({
      userId,
      userRole,
      orderId
    });

    return successResponse(
      res,
      { tracking: trackingData },
      "Tracking information retrieved successfully."
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// PATCH /api/orders/:orderId/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await orderService.cancelOrder({
      userId,
      userRole,
      orderId,
      reason
    });

    return successResponse(
      res,
      { order },
      "Order cancelled successfully."
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// POST /api/orders/:orderId/return
export const requestReturn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await orderService.requestReturn({
      userId,
      orderId,
      reason
    });

    return successResponse(
      res,
      { order },
      "Return request submitted successfully."
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};
