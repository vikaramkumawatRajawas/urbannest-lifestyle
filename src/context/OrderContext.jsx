import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { orderService } from "../services/orderService";

const OrderContext = createContext();

const formatBackendOrder = (ord) => {
  const stepMap = {
    confirmed: 1,
    packed: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 0
  };

  const statusLabelMap = {
    confirmed: "Order Confirmed",
    packed: "Packed & Ready",
    shipped: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };

  const statusKey = ord.orderStatus || "confirmed";
  const step = stepMap[statusKey] || 1;
  const statusText = statusLabelMap[statusKey] || "Order Confirmed";

  const dateStr = ord.createdAt
    ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Recently Placed";

  return {
    ...ord,
    id: ord._id || ord.id,
    orderId: ord.orderId,
    placedAt: dateStr,
    totalAmount: ord.totalAmount,
    status: statusText,
    currentStep: step,
    courier: "Pan-India Express Logistics",
    awbNumber: `EX-${ord.orderId ? ord.orderId.replace(/[^0-9]/g, "") : "109823"}-IN`,
    estimatedDelivery: step === 4 ? "Delivered" : "Expected in 2-3 Business Days",
    currentLocation:
      step === 4
        ? "Delivered to recipient"
        : step === 3
        ? "In Transit — Regional Distribution Center"
        : step === 2
        ? "Packed at UrbanNest Warehouse"
        : "Order Confirmed & Processing",
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
      const res = await orderService.getOrders();
      if (res.success && Array.isArray(res.data?.orders)) {
        const formatted = res.data.orders.map(formatBackendOrder);
        setOrders(formatted);
      }
    } catch (err) {
      console.warn("[OrderContext] Failed to fetch orders from backend:", err);
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
    const localOrder = {
      ...newOrderData,
      orderId: newOrderData.orderId || `UN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      placedAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      status: "Order Confirmed",
      currentStep: 1,
      courier: "Pan-India Express Logistics",
      awbNumber: `EX-${Math.floor(100000 + Math.random() * 900000)}-IN`,
      estimatedDelivery: "Expected in 2-3 Business Days",
      currentLocation: "UrbanNest Warehouse"
    };

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
        selectedOrderForTracking,
        setSelectedOrderForTracking,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        loading
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
