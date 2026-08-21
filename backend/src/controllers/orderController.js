import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { validateCreateOrder } from "../validators/orderValidator.js";

const generateUniqueOrderId = async () => {
  const currentYear = new Date().getFullYear();
  let orderId = "";
  let isUnique = false;

  while (!isUnique) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    orderId = `UN-${currentYear}-${randomNum}`;
    const existing = await Order.findOne({ orderId });
    if (!existing) {
      isUnique = true;
    }
  }

  return orderId;
};

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      items,
      shippingDetails,
      paymentMethod = "COD",
      subtotal,
      tax = 0,
      shippingFee = 0,
      totalAmount
    } = req.body;

    const { error } = validateCreateOrder({
      items,
      shippingDetails,
      paymentMethod,
      subtotal,
      tax,
      shippingFee,
      totalAmount
    });

    if (error) {
      return errorResponse(res, error.details.map((d) => d.message).join(", "), 400);
    }

    const computedSubtotal = subtotal !== undefined
      ? subtotal
      : items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

    const computedTotal = totalAmount !== undefined
      ? totalAmount
      : computedSubtotal + tax + shippingFee;

    const orderId = await generateUniqueOrderId();

    const orderItems = items.map((item) => ({
      product: item.productId || item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || ""
    }));

    // Create Order Record
    const newOrder = await Order.create({
      user: userId,
      orderId,
      items: orderItems,
      shippingDetails,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      orderStatus: "confirmed",
      subtotal: computedSubtotal,
      tax,
      shippingFee,
      totalAmount: computedTotal
    });

    // Reduce Product stock quantities asynchronously
    for (const item of items) {
      const pId = item.productId || item.product;
      if (pId) {
        try {
          const product = await Product.findById(pId);
          if (product && typeof product.stockQuantity === "number") {
            product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
            await product.save();
          }
        } catch (e) {
          // Non-blocking
        }
      }
    }

    // Auto-clear user's backend Cart upon successful order placement
    try {
      let cart = await Cart.findOne({ user: userId });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
    } catch (e) {
      // Non-blocking cart clear
    }

    return successResponse(
      res,
      { order: newOrder },
      "Order created successfully.",
      201
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/orders
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return successResponse(
      res,
      { orders },
      "User orders retrieved successfully."
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:orderId
export const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      $and: [
        { user: userId },
        { $or: [{ orderId }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }] }
      ]
    });

    if (!order) {
      return errorResponse(res, "Order not found.", 404);
    }

    return successResponse(res, { order }, "Order details retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:orderId/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findOne({
      $or: [{ orderId }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }]
    });

    if (!order) {
      return errorResponse(res, "Order not found.", 404);
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return successResponse(res, { order }, "Order status updated successfully.");
  } catch (error) {
    next(error);
  }
};
