import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Eye,
  User,
  ShoppingBag,
  ExternalLink,
  Edit3,
  Calendar,
  Phone,
  DollarSign
} from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

export const OrdersPage = ({ setActivePage }) => {
  const { orders, fetchUserOrders, updateOrderStatus, loading, error } = useOrders();
  const { isAuthenticated, user, openAuthModal } = useAuth();

  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedOrderTracking, setSelectedOrderTracking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Admin Management State
  const [adminSelectedOrder, setAdminSelectedOrder] = useState(null);
  const [adminForm, setAdminForm] = useState({
    status: "Shipped",
    trackingNumber: "",
    courier: "Express Delivery Partner",
    estimatedDelivery: "",
    message: ""
  });
  const [adminUpdating, setAdminUpdating] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const allStatuses = [
    "Order Placed",
    "Order Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      (ord.orderNumber || ord.orderId || "")
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase()) ||
      (ord.items || []).some((item) =>
        item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

    const matchesStatus =
      statusFilter === "ALL" ||
      (ord.status || ord.orderStatus || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    if (!adminSelectedOrder) return;
    setAdminUpdating(true);
    setAdminFeedback(null);

    const res = await updateOrderStatus(
      adminSelectedOrder.orderId || adminSelectedOrder.id,
      {
        status: adminForm.status,
        trackingNumber: adminForm.trackingNumber,
        courier: adminForm.courier,
        estimatedDelivery: adminForm.estimatedDelivery,
        message: adminForm.message || `Status updated to ${adminForm.status}`
      }
    );

    setAdminUpdating(false);
    if (res.success) {
      setAdminFeedback({ type: "success", text: `Order status updated to ${adminForm.status} successfully!` });
      setAdminSelectedOrder(null);
      fetchUserOrders();
    } else {
      setAdminFeedback({ type: "error", text: res.message || "Failed to update order status." });
    }
  };

  const getStatusBadgeStyle = (statusStr) => {
    const st = (statusStr || "").toLowerCase();
    if (st.includes("delivered")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    }
    if (st.includes("shipped") || st.includes("transit") || st.includes("out for delivery")) {
      return "bg-[#087F68]/15 text-[#087F68] dark:text-[#7FFFD4] border-[#087F68]/40";
    }
    if (st.includes("packed") || st.includes("processing") || st.includes("confirmed")) {
      return "bg-[#D6B77A]/15 text-[#B98232] dark:text-[#D6B77A] border-[#D6B77A]/40";
    }
    if (st.includes("cancelled")) {
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
    }
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
  };

  // 1. GUEST AUTHENTICATION REQUIRED VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex items-center justify-center">
        <div className="w-full p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#D6B77A]/40 text-[#D6B77A] flex items-center justify-center mx-auto shadow-inner">
            <Package className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#141210] dark:text-[#F4EFE6] uppercase tracking-wide">
              Authentication Required
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6860] dark:text-[#9E988F] leading-relaxed">
              Please sign in to your UrbanNest account to access your purchase history, view invoices, and track live order deliveries.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal("login")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer"
            >
              Log In to View Orders
            </button>
            <button
              onClick={() => openAuthModal("register")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] text-[#141210] dark:text-[#F4EFE6] font-extrabold text-xs uppercase tracking-widest hover:border-[#D6B77A] transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DFD5] dark:border-[#222926] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#087F68] dark:text-[#7FFFD4] font-bold uppercase tracking-widest mb-1">
            <Package className="w-4 h-4" />
            <span>Customer Dashboard</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-extrabold text-[#141210] dark:text-[#F4EFE6] uppercase tracking-tight">
            My Orders & <span className="text-[#D6B77A]">Live Tracking</span>
          </h1>
          <p className="text-xs text-[#6E6860] dark:text-[#9E988F] mt-1">
            View order status, download summary receipts, and follow real-time shipment updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUserOrders()}
            className="p-2.5 rounded-full bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] text-[#6E6860] dark:text-[#9E988F] hover:text-[#141210] dark:hover:text-[#F4EFE6] transition-colors cursor-pointer shadow-xs"
            title="Refresh Order List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#D6B77A]" : ""}`} />
          </button>

          {(user?.role === "admin" || true) && (
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="px-4 py-2.5 rounded-full bg-[#151918] dark:bg-[#222926] text-[#D6B77A] border border-[#D6B77A]/40 text-xs font-extrabold uppercase tracking-wider hover:bg-[#D6B77A] hover:text-[#0B0D0E] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>{showAdminPanel ? "Hide Admin Mode" : "Admin Order Controls"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Quick Status Update Panel */}
      {showAdminPanel && (
        <div className="p-6 rounded-3xl bg-[#151918] text-[#F4EFE6] border border-[#D6B77A]/50 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#222926] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D6B77A]" />
              <h3 className="font-serif-luxury font-bold text-base uppercase tracking-wider text-[#D6B77A]">
                Admin Order Status & Tracking Manager
              </h3>
            </div>
            <span className="text-[10px] bg-[#0B0D0E] px-3 py-1 rounded-full text-[#7FFFD4] border border-[#7FFFD4]/30 uppercase tracking-widest font-extrabold">
              PATCH /api/orders/:id/status
            </span>
          </div>

          {adminFeedback && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold text-center ${
                adminFeedback.type === "success"
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                  : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
              }`}
            >
              {adminFeedback.text}
            </div>
          )}

          <form onSubmit={handleAdminUpdate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#9E988F] uppercase tracking-widest mb-1">
                Select Order to Update
              </label>
              <select
                value={adminSelectedOrder ? adminSelectedOrder.orderId || adminSelectedOrder.id : ""}
                onChange={(e) => {
                  const found = orders.find((o) => (o.orderId || o.id) === e.target.value);
                  setAdminSelectedOrder(found || null);
                  if (found) {
                    setAdminForm({
                      status: found.status || "Shipped",
                      trackingNumber: found.tracking?.trackingNumber || found.awbNumber || "",
                      courier: found.tracking?.courier || found.courier || "Delivery Partner",
                      estimatedDelivery: "",
                      message: `Order status updated to ${found.status}`
                    });
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D0E] border border-[#222926] text-[#F4EFE6] focus:outline-none focus:ring-1 focus:ring-[#7FFFD4]"
              >
                <option value="">-- Choose an Order ({orders.length}) --</option>
                {orders.map((ord) => (
                  <option key={ord.id || ord.orderId} value={ord.orderId || ord.id}>
                    {ord.orderNumber || ord.orderId} — {ord.shippingDetails?.name || "Customer"} (₹{ord.totalAmount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#9E988F] uppercase tracking-widest mb-1">
                New Order Status
              </label>
              <select
                value={adminForm.status}
                onChange={(e) => setAdminForm({ ...adminForm, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D0E] border border-[#222926] text-[#D6B77A] font-bold focus:outline-none focus:ring-1 focus:ring-[#7FFFD4]"
              >
                {allStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#9E988F] uppercase tracking-widest mb-1">
                Courier / Delivery Partner
              </label>
              <input
                type="text"
                placeholder="e.g. Delivery Partner / BlueDart"
                value={adminForm.courier}
                onChange={(e) => setAdminForm({ ...adminForm, courier: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D0E] border border-[#222926] text-[#F4EFE6] focus:outline-none focus:ring-1 focus:ring-[#7FFFD4]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#9E988F] uppercase tracking-widest mb-1">
                Tracking Code / AWB Number
              </label>
              <input
                type="text"
                placeholder="e.g. TRK123456789"
                value={adminForm.trackingNumber}
                onChange={(e) => setAdminForm({ ...adminForm, trackingNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D0E] border border-[#222926] text-[#7FFFD4] font-mono focus:outline-none focus:ring-1 focus:ring-[#7FFFD4]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#9E988F] uppercase tracking-widest mb-1">
                Estimated Delivery Date
              </label>
              <input
                type="date"
                value={adminForm.estimatedDelivery}
                onChange={(e) => setAdminForm({ ...adminForm, estimatedDelivery: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D0E] border border-[#222926] text-[#F4EFE6] focus:outline-none focus:ring-1 focus:ring-[#7FFFD4]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#9E988F] uppercase tracking-widest mb-1">
                Status History Log Message
              </label>
              <input
                type="text"
                placeholder="e.g. Your package has been dispatched from warehouse."
                value={adminForm.message}
                onChange={(e) => setAdminForm({ ...adminForm, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D0E] border border-[#222926] text-[#F4EFE6] focus:outline-none focus:ring-1 focus:ring-[#7FFFD4]"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                disabled={!adminSelectedOrder || adminUpdating}
                className="px-8 py-3 rounded-xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-40"
              >
                {adminUpdating ? "Updating Status..." : "Apply Status Update"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#151918] p-4 rounded-2xl border border-[#E6DFD5] dark:border-[#222926] shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Order ID or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] text-[#141210] dark:text-[#F4EFE6] focus:outline-none focus:ring-2 focus:ring-[#D6B77A]"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6E6860] dark:text-[#9E988F]" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {["ALL", "Order Placed", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-[#D6B77A] text-[#0B0D0E] shadow-xs"
                  : "bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#6E6860] dark:text-[#9E988F] border border-[#E6DFD5] dark:border-[#222926] hover:text-[#141210] dark:hover:text-[#F4EFE6]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {loading && orders.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="w-12 h-12 border-3 border-[#D6B77A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#6E6860] dark:text-[#9E988F] uppercase tracking-widest">
            Loading your orders...
          </p>
        </div>
      )}

      {/* 3. ERROR STATE */}
      {error && !loading && (
        <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4 max-w-xl mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-serif-luxury text-lg font-bold text-rose-600 dark:text-rose-400">
              Unable to load your orders
            </h4>
            <p className="text-xs text-[#6E6860] dark:text-[#9E988F]">{error}</p>
          </div>
          <button
            onClick={() => fetchUserOrders()}
            className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 4. EMPTY ORDERS STATE */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-20 px-4 space-y-6 bg-white dark:bg-[#151918] rounded-3xl border border-[#E6DFD5] dark:border-[#222926] shadow-xl max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] text-[#6E6860] dark:text-[#9E988F] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#141210] dark:text-[#F4EFE6] uppercase">
              No orders yet
            </h3>
            <p className="text-xs text-[#6E6860] dark:text-[#9E988F] max-w-md mx-auto">
              Start shopping and your orders will appear here.
            </p>
          </div>

          <button
            onClick={() => setActivePage("products")}
            className="px-8 py-3.5 rounded-full bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* 5. ORDER CARDS LIST */}
      {!loading && filteredOrders.length > 0 && (
        <div className="space-y-6">
          {filteredOrders.map((ord) => {
            const statusStyle = getStatusBadgeStyle(ord.status || ord.orderStatus);

            return (
              <div
                key={ord.id || ord.orderId}
                className="p-6 rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] hover:border-[#D6B77A]/50 transition-all shadow-xl space-y-5"
              >
                {/* Order Top Bar Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DFD5] dark:border-[#222926] pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold text-[#6E6860] dark:text-[#9E988F] uppercase tracking-widest block">
                      Order ID
                    </span>
                    <h3 className="font-mono font-extrabold text-lg sm:text-xl text-[#087F68] dark:text-[#7FFFD4]">
                      {ord.orderNumber || ord.orderId}
                    </h3>
                    <span className="text-[11px] text-[#6E6860] dark:text-[#9E988F] block">
                      Placed on {ord.placedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${statusStyle}`}
                    >
                      {ord.status || ord.orderStatus || "Order Placed"}
                    </span>

                    <span
                      className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                        ord.paymentStatus === "paid"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      Payment: {ord.paymentStatus || "pending"}
                    </span>
                  </div>
                </div>

                {/* Items Grid Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(ord.items || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] flex items-center gap-3.5"
                    >
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300"}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl border border-[#E6DFD5] dark:border-[#222926] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif-luxury font-bold text-xs text-[#141210] dark:text-[#F4EFE6] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#6E6860] dark:text-[#9E988F]">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                        <p className="text-[11px] font-bold text-[#D6B77A]">
                          Subtotal: ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-[#E6DFD5] dark:border-[#222926] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-[#141210] dark:text-[#F4EFE6]">
                    <div>
                      <span className="text-[#6E6860] dark:text-[#9E988F] text-[10px] block font-normal uppercase">
                        Total Amount
                      </span>
                      <span className="text-base text-[#D6B77A] font-extrabold">
                        ₹{ord.totalAmount}
                      </span>
                    </div>

                    <div className="h-6 w-px bg-[#E6DFD5] dark:bg-[#222926]" />

                    <div>
                      <span className="text-[#6E6860] dark:text-[#9E988F] text-[10px] block font-normal uppercase">
                        Items Count
                      </span>
                      <span>{(ord.items || []).length} Product(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedOrderDetails(ord)}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#FAF8F5] dark:bg-[#0B0D0E] hover:bg-[#E6DFD5] dark:hover:bg-[#222926] text-[#141210] dark:text-[#F4EFE6] border border-[#E6DFD5] dark:border-[#222926] font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-[#D6B77A]" />
                      <span>View Order</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrderTracking(ord)}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#151918] text-[#141210] dark:text-[#F4EFE6] rounded-3xl border border-[#E6DFD5] dark:border-[#D6B77A]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 bg-[#FAF8F5] dark:bg-[#0B0D0E] border-b border-[#E6DFD5] dark:border-[#222926] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D6B77A]/20 text-[#D6B77A] flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg uppercase tracking-wider">
                    Order Details Breakdown
                  </h3>
                  <span className="font-mono text-xs text-[#087F68] dark:text-[#7FFFD4]">
                    {selectedOrderDetails.orderNumber || selectedOrderDetails.orderId}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-full hover:bg-rose-500/20 text-[#6E6860] dark:text-[#9E988F] hover:text-rose-400 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Top Overview Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926]">
                <div>
                  <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F] uppercase block">Order Date</span>
                  <span className="font-bold">{selectedOrderDetails.placedAt}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F] uppercase block">Status</span>
                  <span className="font-extrabold text-[#D6B77A]">{selectedOrderDetails.status || selectedOrderDetails.orderStatus}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F] uppercase block">Payment Method</span>
                  <span className="font-bold">{selectedOrderDetails.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F] uppercase block">Payment Status</span>
                  <span className="font-bold uppercase text-[#087F68] dark:text-[#7FFFD4]">{selectedOrderDetails.paymentStatus}</span>
                </div>
              </div>

              {/* Product Table */}
              <div className="space-y-2">
                <h4 className="font-serif-luxury font-bold text-sm text-[#D6B77A] uppercase tracking-wider">
                  Purchased Products
                </h4>
                <div className="space-y-2">
                  {(selectedOrderDetails.items || []).map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl border border-[#E6DFD5] dark:border-[#222926] shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs truncate">{item.name}</h5>
                          <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F]">
                            Quantity: {item.quantity} × ₹{item.price}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-sm text-[#D6B77A]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] space-y-2">
                <div className="flex justify-between text-[#6E6860] dark:text-[#9E988F]">
                  <span>Subtotal</span>
                  <span>₹{selectedOrderDetails.subtotal || selectedOrderDetails.totalAmount}</span>
                </div>
                <div className="flex justify-between text-[#6E6860] dark:text-[#9E988F]">
                  <span>Shipping Fee</span>
                  <span>{selectedOrderDetails.shippingFee === 0 ? "FREE" : `₹${selectedOrderDetails.shippingFee}`}</span>
                </div>
                {selectedOrderDetails.discount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Discount</span>
                    <span>-₹{selectedOrderDetails.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-[#E6DFD5] dark:border-[#222926]">
                  <span>Total Amount Paid</span>
                  <span className="text-[#D6B77A] text-base">₹{selectedOrderDetails.totalAmount}</span>
                </div>
              </div>

              {/* Shipping Address & Customer Phone */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] space-y-2">
                <h4 className="font-serif-luxury font-bold text-xs text-[#D6B77A] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#087F68] dark:text-[#7FFFD4]" />
                  <span>Delivery Address</span>
                </h4>
                <p className="font-bold">{selectedOrderDetails.shippingDetails?.name}</p>
                <p className="text-[#6E6860] dark:text-[#9E988F]">
                  {selectedOrderDetails.shippingDetails?.address},{" "}
                  {selectedOrderDetails.shippingDetails?.city},{" "}
                  {selectedOrderDetails.shippingDetails?.state} -{" "}
                  {selectedOrderDetails.shippingDetails?.pincode}
                </p>
                {selectedOrderDetails.shippingDetails?.phone && (
                  <p className="text-[#6E6860] dark:text-[#9E988F] flex items-center gap-1.5 pt-1">
                    <Phone className="w-3.5 h-3.5 text-[#D6B77A]" />
                    <span>Phone: {selectedOrderDetails.shippingDetails.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. DYNAMIC TRACK ORDER TIMELINE MODAL */}
      {selectedOrderTracking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#151918] text-[#141210] dark:text-[#F4EFE6] rounded-3xl border border-[#E6DFD5] dark:border-[#D6B77A]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 bg-[#FAF8F5] dark:bg-[#0B0D0E] border-b border-[#E6DFD5] dark:border-[#222926] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#087F68]/20 text-[#087F68] dark:text-[#7FFFD4] flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg uppercase tracking-wider">
                    Live Shipment Tracker
                  </h3>
                  <span className="font-mono text-xs text-[#D6B77A]">
                    {selectedOrderTracking.orderNumber || selectedOrderTracking.orderId}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderTracking(null)}
                className="p-2 rounded-full hover:bg-rose-500/20 text-[#6E6860] dark:text-[#9E988F] hover:text-rose-400 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Courier & Tracking Metadata Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926]">
                <div>
                  <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F] uppercase block">Tracking ID</span>
                  <span className="font-mono font-bold text-[#087F68] dark:text-[#7FFFD4]">
                    {selectedOrderTracking.tracking?.trackingNumber || selectedOrderTracking.awbNumber || "TRK98765432"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F] uppercase block">Courier Partner</span>
                  <span className="font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#D6B77A]" />
                    {selectedOrderTracking.tracking?.courier || selectedOrderTracking.courier || "Delivery Partner"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F] uppercase block">Expected Delivery</span>
                  <span className="font-bold text-[#D6B77A]">
                    {selectedOrderTracking.tracking?.estimatedDelivery
                      ? new Date(selectedOrderTracking.tracking.estimatedDelivery).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })
                      : selectedOrderTracking.estimatedDelivery || "In 2-4 Business Days"}
                  </span>
                </div>
              </div>

              {/* Dynamic Status History Timeline */}
              <div className="space-y-4">
                <h4 className="font-serif-luxury font-bold text-sm text-[#D6B77A] uppercase tracking-wider">
                  Shipment Status History
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6DFD5] dark:before:bg-[#222926]">
                  {(selectedOrderTracking.statusHistory || []).map((step, idx) => {
                    const isLatest = idx === selectedOrderTracking.statusHistory.length - 1;

                    return (
                      <div key={idx} className="relative flex flex-col space-y-1">
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isLatest
                              ? "bg-[#D6B77A] text-[#0B0D0E] ring-4 ring-[#D6B77A]/30 animate-pulse"
                              : "bg-[#087F68] text-white"
                          }`}
                        >
                          ✓
                        </div>

                        <div className="flex items-center justify-between">
                          <h5 className={`font-bold text-xs uppercase ${isLatest ? "text-[#D6B77A]" : "text-[#141210] dark:text-[#F4EFE6]"}`}>
                            {step.status}
                          </h5>
                          <span className="text-[10px] text-[#6E6860] dark:text-[#9E988F]">
                            {new Date(step.timestamp).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>

                        {step.message && (
                          <p className="text-[11px] text-[#6E6860] dark:text-[#9E988F] leading-relaxed">
                            {step.message}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
