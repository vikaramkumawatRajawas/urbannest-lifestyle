import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  normalizeStatus,
  validateStatusTransition,
  generateOrderNumber
} from "../utils/orderStatusHelper.js";

export const orderService = {
  /**
   * Creates a new Order with server-side price calculation and stock verification.
   */
  async createOrder({ userId, shippingDetails, paymentMethod = "COD", items = null }) {
    if (!shippingDetails || !shippingDetails.address) {
      const err = new Error("Shipping address details are required.");
      err.statusCode = 400;
      throw err;
    }

    let itemsToProcess = items;

    // 1. Fetch user's cart from DB if items not explicitly provided
    if (!itemsToProcess || !Array.isArray(itemsToProcess) || itemsToProcess.length === 0) {
      const userCart = await Cart.findOne({ user: userId }).populate("items.product");
      if (!userCart || !userCart.items || userCart.items.length === 0) {
        const err = new Error("Your cart is empty. Please add products before checkout.");
        err.statusCode = 400;
        throw err;
      }
      itemsToProcess = userCart.items.map((ci) => ({
        productId: ci.product._id || ci.product,
        quantity: ci.quantity
      }));
    }

    // 2. Server-side price verification & stock check from Product DB
    let computedSubtotal = 0;
    const validatedOrderItems = [];

    for (const item of itemsToProcess) {
      const pId = item.productId || item.product;
      if (!pId) continue;

      const dbProduct = await Product.findById(pId);
      if (!dbProduct) {
        const err = new Error(`Product not found or unavailable.`);
        err.statusCode = 404;
        throw err;
      }

      const qty = Math.max(1, parseInt(item.quantity || 1, 10));

      // Stock check
      if (typeof dbProduct.stockQuantity === "number" && dbProduct.stockQuantity < qty) {
        const err = new Error(`Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stockQuantity}, Requested: ${qty}`);
        err.statusCode = 400;
        throw err;
      }

      const dbPrice = dbProduct.price;
      const dbImage = dbProduct.image || (dbProduct.images && dbProduct.images[0]) || "";

      computedSubtotal += dbPrice * qty;
      validatedOrderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbPrice,
        quantity: qty,
        image: dbImage
      });
    }

    if (validatedOrderItems.length === 0) {
      const err = new Error("No valid products found to place order.");
      err.statusCode = 400;
      throw err;
    }

    // 3. Server-side financial calculations (Never trust client values)
    const discount = 0;
    const shippingFee = computedSubtotal > 1499 || computedSubtotal === 0 ? 0 : 99;
    const computedTotal = computedSubtotal - discount + shippingFee;

    const orderNumber = generateOrderNumber();
    const initialStatus = ORDER_STATUS.ORDER_PLACED;
    const normalizedPaymentMethod = (paymentMethod || "COD").toUpperCase();
    const initialPaymentStatus = normalizedPaymentMethod === "COD" ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID;

    const initialStatusHistory = [
      {
        status: initialStatus,
        timestamp: new Date(),
        message: "Your order has been placed successfully."
      }
    ];

    const shippingAddressData = {
      name: shippingDetails.name,
      email: shippingDetails.email,
      phone: shippingDetails.phone,
      address: shippingDetails.address,
      city: shippingDetails.city || "Bengaluru",
      state: shippingDetails.state || "Karnataka",
      pincode: shippingDetails.pincode || "560001",
      country: shippingDetails.country || "India"
    };

    // 4. Create Order document
    const newOrder = await Order.create({
      user: userId,
      orderId: orderNumber,
      orderNumber,
      items: validatedOrderItems,
      shippingDetails: shippingAddressData,
      shippingAddress: shippingAddressData,
      subtotal: computedSubtotal,
      discount,
      shippingFee,
      total: computedTotal,
      totalAmount: computedTotal,
      currency: "INR",
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: initialPaymentStatus,
      status: initialStatus,
      orderStatus: initialStatus,
      statusHistory: initialStatusHistory
    });

    // 5. Decrement product stock in DB asynchronously
    for (const orderItem of validatedOrderItems) {
      try {
        const prod = await Product.findById(orderItem.product);
        if (prod && typeof prod.stockQuantity === "number") {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - orderItem.quantity);
          await prod.save();
        }
      } catch (e) {
        // Non-blocking stock decrement error log
        console.warn("[OrderService] Stock update warning:", e.message);
      }
    }

    // 6. Clear only authenticated user's cart
    try {
      let cart = await Cart.findOne({ user: userId });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
    } catch (e) {
      console.warn("[OrderService] Cart clear warning:", e.message);
    }

    return newOrder;
  },

  /**
   * Retrieves paginated orders for the authenticated user.
   */
  async getUserOrders({ userId, page = 1, limit = 10 }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = { user: userId };

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limitNum) || 1;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return {
      orders,
      currentPage: pageNum,
      totalPages,
      totalOrders
    };
  },

  /**
   * Retrieves a single order with strict ownership security authorization.
   */
  async getOrderById({ userId, userRole, orderId }) {
    const order = await Order.findOne({
      $or: [
        { orderNumber: orderId },
        { orderId },
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }
      ]
    });

    if (!order) {
      const err = new Error("Order not found.");
      err.statusCode = 404;
      throw err;
    }

    // Security Check: Verify user owns the order or is Admin
    if (order.user.toString() !== userId.toString() && userRole !== "admin") {
      const err = new Error("Forbidden: You do not have permission to access this order.");
      err.statusCode = 403;
      throw err;
    }

    return order;
  },

  /**
   * Retrieves tracking details and statusHistory for an order.
   */
  async getOrderTracking({ userId, userRole, orderId }) {
    const order = await this.getOrderById({ userId, userRole, orderId });

    return {
      orderNumber: order.orderNumber || order.orderId,
      currentStatus: order.status || order.orderStatus,
      trackingNumber: order.tracking?.trackingNumber || "",
      courier: order.tracking?.courier || "",
      estimatedDelivery: order.tracking?.estimatedDelivery || null,
      statusHistory: order.statusHistory || [],
      shippingAddress: order.shippingAddress || order.shippingDetails
    };
  },

  /**
   * Allows user to cancel an eligible order.
   */
  async cancelOrder({ userId, userRole, orderId, reason }) {
    const order = await this.getOrderById({ userId, userRole, orderId });

    const currentNorm = normalizeStatus(order.status);
    const cancellableStatuses = [
      ORDER_STATUS.ORDER_PLACED,
      ORDER_STATUS.ORDER_CONFIRMED,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.PACKED
    ];

    if (!cancellableStatuses.includes(currentNorm)) {
      const err = new Error(`Order cannot be cancelled at status '${order.status}'. Please contact customer support.`);
      err.statusCode = 400;
      throw err;
    }

    const transitionCheck = validateStatusTransition(order.status, ORDER_STATUS.CANCELLED);
    if (!transitionCheck.isValid) {
      const err = new Error(transitionCheck.error);
      err.statusCode = 400;
      throw err;
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.orderStatus = ORDER_STATUS.CANCELLED;

    if (order.paymentStatus === PAYMENT_STATUS.PAID || order.paymentStatus === "paid") {
      order.refundStatus = "REFUND_REQUIRED";
    }

    const historyMessage = reason ? `Cancelled by user: ${reason}` : "Order cancelled by customer.";
    if (!Array.isArray(order.statusHistory)) order.statusHistory = [];
    order.statusHistory.push({
      status: ORDER_STATUS.CANCELLED,
      timestamp: new Date(),
      message: historyMessage
    });

    // Restore stock in DB
    for (const item of order.items) {
      if (item.product) {
        try {
          const prod = await Product.findById(item.product);
          if (prod && typeof prod.stockQuantity === "number") {
            prod.stockQuantity += item.quantity;
            await prod.save();
          }
        } catch (e) {
          console.warn("[OrderService] Restoring stock warning:", e.message);
        }
      }
    }

    await order.save();
    return order;
  },

  /**
   * Allows user to request a return for a delivered order.
   */
  async requestReturn({ userId, orderId, reason }) {
    const order = await this.getOrderById({ userId, userRole: "customer", orderId });

    const currentNorm = normalizeStatus(order.status);
    if (currentNorm !== ORDER_STATUS.DELIVERED) {
      const err = new Error(`Return can only be requested for Delivered orders. Current status: ${order.status}`);
      err.statusCode = 400;
      throw err;
    }

    const transitionCheck = validateStatusTransition(order.status, ORDER_STATUS.RETURN_REQUESTED);
    if (!transitionCheck.isValid) {
      const err = new Error(transitionCheck.error);
      err.statusCode = 400;
      throw err;
    }

    order.status = ORDER_STATUS.RETURN_REQUESTED;
    order.orderStatus = ORDER_STATUS.RETURN_REQUESTED;
    order.returnReason = reason || "Customer requested return";

    if (!Array.isArray(order.statusHistory)) order.statusHistory = [];
    order.statusHistory.push({
      status: ORDER_STATUS.RETURN_REQUESTED,
      timestamp: new Date(),
      message: reason ? `Return Requested: ${reason}` : "Customer submitted a return request."
    });

    await order.save();
    return order;
  },

  /**
   * Admin endpoint: Paginated list of all orders with search, status, and date filters.
   */
  async getAdminOrders({
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    search,
    startDate,
    endDate
  }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (status) {
      query.$or = [
        { status: normalizeStatus(status) },
        { orderStatus: status },
        { status: status }
      ];
    }

    if (paymentStatus) {
      query.paymentStatus = new RegExp(`^${paymentStatus}$`, "i");
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { orderNumber: regex },
        { orderId: regex },
        { "shippingDetails.name": regex },
        { "shippingDetails.email": regex }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limitNum) || 1;

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return {
      orders,
      currentPage: pageNum,
      totalPages,
      totalOrders
    };
  },

  /**
   * Admin endpoint: Detailed view of any order.
   */
  async getAdminOrderById(orderId) {
    const order = await Order.findOne({
      $or: [
        { orderNumber: orderId },
        { orderId },
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }
      ]
    }).populate("user", "name email phone role");

    if (!order) {
      const err = new Error("Order not found.");
      err.statusCode = 404;
      throw err;
    }

    return order;
  },

  /**
   * Admin endpoint: Update order status & tracking details with transition validation.
   */
  async updateAdminOrderStatus({
    orderId,
    status,
    message,
    trackingNumber,
    courier,
    estimatedDelivery
  }) {
    const order = await Order.findOne({
      $or: [
        { orderNumber: orderId },
        { orderId },
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }
      ]
    });

    if (!order) {
      const err = new Error("Order not found.");
      err.statusCode = 404;
      throw err;
    }

    if (!status) {
      const err = new Error("Status parameter is required for update.");
      err.statusCode = 400;
      throw err;
    }

    const targetNormalized = normalizeStatus(status);
    const transitionCheck = validateStatusTransition(order.status, targetNormalized);

    if (!transitionCheck.isValid) {
      const err = new Error(transitionCheck.error);
      err.statusCode = 400;
      throw err;
    }

    order.status = targetNormalized;
    order.orderStatus = targetNormalized;

    // Update tracking info if supplied
    if (trackingNumber || courier || estimatedDelivery) {
      order.tracking = {
        trackingNumber: trackingNumber || order.tracking?.trackingNumber || "",
        courier: courier || order.tracking?.courier || "",
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : order.tracking?.estimatedDelivery
      };
    }

    // Append to status history (never overwrite history)
    const historyMessage = message || `Order status updated to ${targetNormalized}.`;
    if (!Array.isArray(order.statusHistory)) order.statusHistory = [];
    order.statusHistory.push({
      status: targetNormalized,
      timestamp: new Date(),
      message: historyMessage
    });

    await order.save();
    return order;
  }
};
