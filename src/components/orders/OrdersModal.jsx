import React, { useState } from "react";
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";

export const OrdersModal = ({ isOpen, onClose }) => {
  const { orders, selectedOrderForTracking, setSelectedOrderForTracking } = useOrders();
  const [searchOrderId, setSearchOrderId] = useState("");
  const [activeTab, setActiveTab] = useState("history"); // 'history' | 'tracking'

  if (!isOpen) return null;

  const currentTrackOrder = selectedOrderForTracking || orders[0];

  const handleTrackSelect = (order) => {
    setSelectedOrderForTracking(order);
    setActiveTab("tracking");
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchOrderId.trim()) return;
    const found = orders.find(
      (o) => o.orderId.toLowerCase() === searchOrderId.trim().toLowerCase()
    );
    if (found) {
      setSelectedOrderForTracking(found);
      setActiveTab("tracking");
    } else {
      alert(`No order found matching "${searchOrderId}". Please check your Order ID.`);
    }
  };

  const trackingSteps = [
    { title: "Order Confirmed", desc: "Order received & verified" },
    { title: "Packed at Warehouse", desc: "Hand-glazed & packed safely" },
    { title: "Out for Delivery", desc: "In transit with courier" },
    { title: "Delivered", desc: "Handed over to recipient" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#151918] text-[#F4EFE6] rounded-3xl border border-[#D6B77A]/40 shadow-[0_35px_90px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#0B0D0E] border-b border-[#222926] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#151918] border border-[#D6B77A]/40 flex items-center justify-center text-[#D6B77A]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#F4EFE6] uppercase tracking-wider">
                My Orders & <span className="text-[#D6B77A]">Live Tracking</span>
              </h3>
              <p className="text-[10px] text-[#9E988F] uppercase tracking-widest">
                UrbanNest Order Management System
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-500/20 text-[#9E988F] hover:text-rose-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="p-4 bg-[#0B0D0E] border-b border-[#222926] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#151918] p-1 rounded-full border border-[#222926]">
            <button
              onClick={() => setActiveTab("history")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-[#D6B77A] text-[#0B0D0E] shadow-sm"
                  : "text-[#9E988F] hover:text-[#F4EFE6]"
              }`}
            >
              Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "tracking"
                  ? "bg-[#D6B77A] text-[#0B0D0E] shadow-sm"
                  : "text-[#9E988F] hover:text-[#F4EFE6]"
              }`}
            >
              Live Order Tracker
            </button>
          </div>

          {/* Quick Search Input */}
          <form onSubmit={handleManualSearch} className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search Order ID (e.g. UN-2026-89412)..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-[#151918] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-1 focus:ring-[#7FFFD4]"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9E988F]" />
          </form>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: Order History List */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Package className="w-12 h-12 text-[#9E988F] mx-auto" />
                  <h4 className="font-serif-luxury text-lg font-bold">No Orders Placed Yet</h4>
                  <p className="text-xs text-[#9E988F]">Explore our curated lifestyle items to place your first order!</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 rounded-3xl bg-[#0B0D0E] border border-[#222926] hover:border-[#D6B77A]/40 transition-all space-y-4 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222926] pb-3 text-xs">
                      <div>
                        <span className="font-mono font-extrabold text-[#7FFFD4] text-sm">{order.orderId}</span>
                        <span className="block text-[10px] text-[#9E988F] mt-0.5">Placed on {order.placedAt}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                            order.status === "Delivered"
                              ? "bg-emerald-950/80 text-[#7FFFD4] border-[#7FFFD4]/40"
                              : "bg-[#151918] text-[#D6B77A] border-[#D6B77A]/40"
                          }`}
                        >
                          {order.status}
                        </span>

                        <button
                          onClick={() => handleTrackSelect(order)}
                          className="px-4 py-1.5 rounded-full bg-[#151918] hover:bg-[#D6B77A] text-[#F4EFE6] hover:text-[#0B0D0E] border border-[#222926] font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Track</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-[#151918] border border-[#222926]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg shrink-0 border border-[#222926]"
                          />
                          <div className="flex-1 overflow-hidden">
                            <h5 className="font-serif-luxury font-bold text-xs text-[#F4EFE6] truncate">{item.name}</h5>
                            <span className="text-[10px] text-[#9E988F]">Qty: {item.quantity} × ₹{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#222926] flex items-center justify-between text-xs font-bold">
                      <span className="text-[#9E988F]">Total Amount Paid:</span>
                      <span className="text-[#D6B77A] text-sm">₹{order.totalAmount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Interactive Live Order Tracker Visualizer */}
          {activeTab === "tracking" && currentTrackOrder && (
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="p-6 rounded-3xl bg-[#0B0D0E] border border-[#D6B77A]/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222926] pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#D6B77A] uppercase tracking-widest block">Live Tracking Order</span>
                    <h4 className="font-serif-luxury font-extrabold text-2xl text-[#F4EFE6] uppercase">{currentTrackOrder.orderId}</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#9E988F] uppercase block">Estimated Delivery</span>
                    <span className="text-xs font-bold text-[#7FFFD4]">{currentTrackOrder.estimatedDelivery}</span>
                  </div>
                </div>

                {/* 4-Step Interactive Visual Timeline */}
                <div className="pt-4 pb-2">
                  <div className="relative grid grid-cols-4 gap-2 text-center">
                    {/* Connecting Line */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-[#222926] -z-0">
                      <div
                        className="h-full bg-gradient-to-r from-[#D6B77A] to-[#7FFFD4] transition-all duration-700"
                        style={{ width: `${((currentTrackOrder.currentStep - 1) / 3) * 100}%` }}
                      />
                    </div>

                    {trackingSteps.map((s, idx) => {
                      const isCompleted = idx + 1 <= currentTrackOrder.currentStep;
                      const isCurrent = idx + 1 === currentTrackOrder.currentStep;
                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center space-y-2">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? "bg-[#7FFFD4] text-[#0B0D0E] shadow-[0_0_15px_rgba(127,255,212,0.5)]"
                                : "bg-[#151918] text-[#9E988F] border border-[#222926]"
                            } ${isCurrent ? "ring-4 ring-[#D6B77A]/40 animate-pulse" : ""}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <div>
                            <h5 className={`text-xs font-bold ${isCompleted ? "text-[#F4EFE6]" : "text-[#9E988F]"}`}>
                              {s.title}
                            </h5>
                            <p className="text-[9px] text-[#9E988F] hidden sm:block">{s.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logistics Metadata Details */}
                <div className="pt-4 border-t border-[#222926] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-[#151918] border border-[#222926]">
                    <span className="text-[10px] text-[#9E988F] uppercase block mb-1">Courier Partner</span>
                    <span className="font-bold text-[#F4EFE6] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#D6B77A]" />
                      {currentTrackOrder.courier}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#151918] border border-[#222926]">
                    <span className="text-[10px] text-[#9E988F] uppercase block mb-1">AWB Tracking Code</span>
                    <span className="font-mono font-bold text-[#7FFFD4]">{currentTrackOrder.awbNumber}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#151918] border border-[#222926]">
                    <span className="text-[10px] text-[#9E988F] uppercase block mb-1">Current Location</span>
                    <span className="font-bold text-[#F4EFE6] flex items-center gap-1.5 truncate">
                      <MapPin className="w-4 h-4 text-[#7FFFD4]" />
                      {currentTrackOrder.currentLocation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Snapshot */}
              <div className="space-y-2">
                <h5 className="font-serif-luxury font-bold text-sm text-[#D6B77A] uppercase tracking-wider">
                  Package Contents ({currentTrackOrder.items.length} items)
                </h5>
                <div className="space-y-2">
                  {currentTrackOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0D0E] border border-[#222926]">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl border border-[#222926]" />
                        <div>
                          <h6 className="font-serif-luxury font-bold text-xs text-[#F4EFE6]">{item.name}</h6>
                          <span className="text-[10px] text-[#9E988F]">Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#7FFFD4]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
