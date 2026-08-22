import { orderService } from "../services/orderService.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// GET /api/admin/orders
export const getAdminOrders = async (req, res, next) => {
  try {
    const { page, limit, status, paymentStatus, search, startDate, endDate } = req.query;

    const result = await orderService.getAdminOrders({
      page,
      limit,
      status,
      paymentStatus,
      search,
      startDate,
      endDate
    });

    return successResponse(
      res,
      result,
      "Admin orders retrieved successfully."
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// GET /api/admin/orders/:id
export const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await orderService.getAdminOrderById(id);

    return successResponse(
      res,
      { order },
      "Admin order details retrieved successfully."
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// PATCH /api/admin/orders/:id/status or PUT /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, orderStatus, message, trackingNumber, courier, estimatedDelivery } = req.body;

    const targetStatus = status || orderStatus;

    const order = await orderService.updateAdminOrderStatus({
      orderId: id,
      status: targetStatus,
      message,
      trackingNumber,
      courier,
      estimatedDelivery
    });

    return successResponse(
      res,
      { order },
      `Order status updated to '${order.status}' successfully.`
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};
