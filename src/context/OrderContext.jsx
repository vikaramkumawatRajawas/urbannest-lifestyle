import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { orderService } from "../services/orderService";

const OrderContext = createContext();

const formatBackendOrder = (ord) => {
  const statusKey = ord.status || ord.orderStatus || "Order Placed";

  const dateStr = ord.createdAt
    ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : ord.placedAt || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const history = Array.isArray(ord.statusHistory) && ord.statusHistory.length > 0
    ? ord.statusHistory
    : [
        {
          status: "Order Placed",
          timestamp: ord.createdAt || new Date(),
          message: "Your order has been placed successfully."
        }
      ];

  const trackingObj = ord.tracking || {};

  return {
    ...ord,
    id: ord._id || ord.id,
    orderId: ord.orderId || ord.orderNumber || `ORD-${Date.now()}`,
    orderNumber: ord.orderNumber || ord.orderId || `ORD-${Date.now()}`,
    placedAt: dateStr,
    totalAmount: ord.totalAmount || ord.subtotal || 0,
    subtotal: ord.subtotal || ord.totalAmount || 0,
    discount: ord.discount || 0,
    shippingFee: ord.shippingFee !== undefined ? ord.shippingFee : 0,
    status: statusKey,
    orderStatus: statusKey,
    statusHistory: history,
    tracking: {
      trackingNumber: trackingObj.trackingNumber || `TRK${(ord.orderId || "").replace(/[^0-9]/g, "") || Math.floor(100000 + Math.random() * 900000)}`,
      courier: trackingObj.courier || "UrbanNest Logistics Partner",
      estimatedDelivery: trackingObj.estimatedDelivery || "Expected in 3-5 Business Days"
    },
    courier: trackingObj.courier || "UrbanNest Logistics Partner",
    awbNumber: trackingObj.trackingNumber || `TRK${(ord.orderId || "").replace(/[^0-9]/g, "") || "109823"}`,
    estimatedDelivery: trackingObj.estimatedDelivery || "Expected in 3-5 Business Days",
    shippingDetails: ord.shippingDetails || {},
    items: (ord.items || []).map((item) => ({
      ...item,
      id: item.product || item._id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || ""
    }))
  };
};

export const OrderProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders from backend when user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserOrders();
    } else {
      // Fallback to local storage for guests
      try {
        const saved = localStorage.getItem("urbannest_orders");
        setOrders(saved ? JSON.parse(saved) : []);
      } catch {
        setOrders([]);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated && orders.length > 0) {
      localStorage.setItem("urbannest_orders", JSON.stringify(orders));
    }
  }, [orders, isAuthenticated]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getOrders();
      if (res.success && Array.isArray(res.data?.orders)) {
        const formatted = res.data.orders.map(formatBackendOrder);
        setOrders(formatted);
      } else if (!res.success) {
        setError(res.message || "Unable to load your orders. Please try again.");
      }
    } catch (err) {
      console.warn("[OrderContext] Failed to fetch orders from backend:", err);
      setError("Unable to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatusHandler = async (orderId, updateData) => {
    try {
      setLoading(true);
      const res = await orderService.updateOrderStatus(orderId, updateData);
      if (res.success && res.data?.order) {
        const updated = formatBackendOrder(res.data.order);
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId || o.id === orderId ? updated : o))
        );
        if (selectedOrderForTracking && (selectedOrderForTracking.orderId === orderId || selectedOrderForTracking.id === orderId)) {
          setSelectedOrderForTracking(updated);
        }
        return { success: true, order: updated };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (newOrderData) => {
    let createdOrderFormatted = null;

    if (isAuthenticated) {
      try {
        setLoading(true);
        // Prepare items array for backend validation
        const apiItems = (newOrderData.items || []).map((item) => ({
          productId: (item._id || item.id || item.product || "6a8878f2c661c454f6c03ede").toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || ""
        }));

        const payload = {
          items: apiItems,
          shippingDetails: {
            name: newOrderData.shippingDetails?.name || user?.name || "Customer",
            email: newOrderData.shippingDetails?.email || user?.email || "customer@example.com",
            phone: newOrderData.shippingDetails?.phone || user?.phone || "+91 9876543210",
            address: newOrderData.shippingDetails?.address || "Address",
            city: newOrderData.shippingDetails?.city || "Bengaluru",
            state: newOrderData.shippingDetails?.state || "Karnataka",
            pincode: newOrderData.shippingDetails?.pincode || "560001"
          },
          paymentMethod: newOrderData.paymentMethod || "COD",
          subtotal: newOrderData.subtotal || newOrderData.totalAmount,
          tax: newOrderData.tax || 0,
          shippingFee: newOrderData.shippingFee || 0,
          totalAmount: newOrderData.totalAmount
        };

        const res = await orderService.createOrder(payload);
        if (res.success && res.data?.order) {
          createdOrderFormatted = formatBackendOrder(res.data.order);
          setOrders((prev) => [createdOrderFormatted, ...prev]);
          setSelectedOrderForTracking(createdOrderFormatted);
          return { success: true, order: createdOrderFormatted };
        }
      } catch (err) {
        console.warn("[OrderContext] Backend createOrder failed:", err);
      } finally {
        setLoading(false);
      }
    }

    // Fallback for guests or network issue
    const localOrder = formatBackendOrder({
      ...newOrderData,
      orderId: newOrderData.orderId || `UN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      placedAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      status: "Order Placed",
      statusHistory: [
        {
          status: "Order Placed",
          timestamp: new Date(),
          message: "Your order has been placed successfully."
        }
      ]
    });

    setOrders((prev) => [localOrder, ...prev]);
    setSelectedOrderForTracking(localOrder);
    return { success: true, order: localOrder };
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        fetchUserOrders,
        updateOrderStatus: updateOrderStatusHandler,
        selectedOrderForTracking,
        setSelectedOrderForTracking,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        loading,
        error
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
