export const ORDER_STATUS = {
  ORDER_PLACED: "ORDER_PLACED",
  ORDER_CONFIRMED: "ORDER_CONFIRMED",
  PROCESSING: "PROCESSING",
  PACKED: "PACKED",
  SHIPPED: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURN_REQUESTED: "RETURN_REQUESTED",
  RETURNED: "RETURNED"
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};

export const ALLOWED_STATUS_VALUES = Object.values(ORDER_STATUS);
export const ALLOWED_PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS);

// Allowed forward and cancel/return transitions
const STATUS_TRANSITION_MAP = {
  ORDER_PLACED: ["ORDER_CONFIRMED", "PROCESSING", "CANCELLED"],
  ORDER_CONFIRMED: ["PROCESSING", "PACKED", "CANCELLED"],
  PROCESSING: ["PACKED", "SHIPPED", "CANCELLED"],
  PACKED: ["SHIPPED", "OUT_FOR_DELIVERY", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURN_REQUESTED"],
  RETURN_REQUESTED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: []
};

/**
  Normalizes arbitrary status inputs (e.g. "Order Placed", "Order Confirmed", "ORDER_PLACED")
  to standard uppercase enum format.
 */
export const normalizeStatus = (statusStr) => {
  if (!statusStr || typeof statusStr !== "string") return ORDER_STATUS.ORDER_PLACED;
  const s = statusStr.trim().toUpperCase().replace(/\s+/g, "_");
  if (ALLOWED_STATUS_VALUES.includes(s)) {
    return s;
  }
  // Mapping fallback for legacy status strings
  const aliasMap = {
    CONFIRMED: ORDER_STATUS.ORDER_CONFIRMED,
    "PACKED_&_READY": ORDER_STATUS.PACKED,
    IN_TRANSIT: ORDER_STATUS.SHIPPED,
    UPDATED: ORDER_STATUS.ORDER_PLACED
  };
  return aliasMap[s] || ORDER_STATUS.ORDER_PLACED;
};

/**
  Validates if moving from currentStatus to targetStatus is an allowed transition.
 */
export const validateStatusTransition = (currentStatusRaw, targetStatusRaw) => {
  const currentStatus = normalizeStatus(currentStatusRaw);
  const targetStatus = normalizeStatus(targetStatusRaw);

  if (currentStatus === targetStatus) {
    return { isValid: true, currentStatus, targetStatus };
  }

  const allowedNextStatuses = STATUS_TRANSITION_MAP[currentStatus] || [];
  if (!allowedNextStatuses.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Invalid status transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${allowedNextStatuses.join(", ")}]`,
      currentStatus,
      targetStatus
    };
  }

  return { isValid: true, currentStatus, targetStatus };
};

/**
  Generates a human-readable unique order number e.g. ORD-20260822-891023
 */
export const generateOrderNumber = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${dateStr}-${randomSuffix}`;
};
