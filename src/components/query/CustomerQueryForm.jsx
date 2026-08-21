import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { submitCustomerQuery } from "../../services/n8nQueryService";

export const CustomerQueryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Product Inquiry",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [responseInfo, setResponseInfo] = useState(null);

  const categories = [
    "Product Inquiry",
    "Order Inquiry",
    "Delivery",
    "Store Information",
    "Complaint",
    "Feedback",
    "Other"
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) errs.message = "Message details are required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setResponseInfo(null);

    try {
      const res = await submitCustomerQuery(formData);
      setStatus("success");
      setResponseInfo(res);
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "Product Inquiry",
        message: ""
      });
      setErrors({});
    } catch (err) {
      setStatus("error");
      setResponseInfo({ error: err.message });
    }
  };

  return (
    <div className="bg-white dark:bg-[#151918] rounded-3xl p-6 sm:p-10 border border-[#E6DFD5] dark:border-[#D6B77A]/30 shadow-2xl space-y-6 text-[#141210] dark:text-[#F4EFE6] transition-colors duration-400">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#F3EFE9] dark:bg-[#0B0D0E] text-[#D6B77A] border border-[#D6B77A]/30 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#059669] dark:text-[#7FFFD4]" />
          <span>N8N Connected</span>
        </div>
        <h3 className="font-serif-luxury text-2xl sm:text-4xl font-extrabold text-[#141210] dark:text-[#F4EFE6] uppercase tracking-tight">
          Ask a Question / Submit Query
        </h3>
        <p className="text-xs sm:text-sm text-[#6E6860] dark:text-[#9E988F] font-light leading-relaxed">
          Have a question about product availability, custom gift hampers, or store details? Direct input into our automated N8N workflow engine.
        </p>
      </div>

      {/* Success State Banner */}
      {status === "success" && (
        <div className="p-6 rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] border border-[#059669] dark:border-[#7FFFD4]/50 text-[#141210] dark:text-[#F4EFE6] space-y-3 animate-fadeIn">
          <div className="flex items-center gap-3 text-[#059669] dark:text-[#7FFFD4]">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <h4 className="font-serif-luxury font-bold text-lg sm:text-xl uppercase tracking-wider text-[#141210] dark:text-[#F4EFE6]">
              Your message is on its way.
            </h4>
          </div>
          <p className="text-xs text-[#6E6860] dark:text-[#9E988F] leading-relaxed pl-9 font-light">
            {responseInfo?.message || "Your inquiry has been transmitted to our N8N workflow engine. Our representative will contact you shortly."}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs font-bold text-[#D6B77A] underline hover:opacity-80 pl-9 pt-1 block uppercase tracking-widest cursor-pointer"
          >
            Submit Another Query
          </button>
        </div>
      )}

      {/* Error State Banner */}
      {status === "error" && (
        <div className="p-6 rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] border border-rose-500/50 text-[#141210] dark:text-[#F4EFE6] space-y-3 animate-fadeIn">
          <div className="flex items-center gap-3 text-rose-500">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <h4 className="font-bold text-sm sm:text-base uppercase tracking-wider">
              Submission Error
            </h4>
          </div>
          <p className="text-xs text-rose-500 dark:text-rose-300 leading-relaxed pl-9">
            {responseInfo?.error || "We encountered an issue submitting your request to N8N. Please try again."}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs font-bold bg-rose-600 text-white px-4 py-2 rounded-xl ml-9 mt-2 inline-flex items-center gap-1.5 hover:bg-rose-700 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Query Form */}
      {status !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141210] dark:text-[#F4EFE6] mb-1.5">
                Full Name <span className="text-[#D6B77A]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Vikram Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 text-xs rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] border ${
                  errors.name ? "border-rose-500" : "border-[#E6DFD5] dark:border-[#222926]"
                } focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#7FFFD4]`}
              />
              {errors.name && (
                <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141210] dark:text-[#F4EFE6] mb-1.5">
                Email Address <span className="text-[#D6B77A]">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. vikram@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 text-xs rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] border ${
                  errors.email ? "border-rose-500" : "border-[#E6DFD5] dark:border-[#222926]"
                } focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#7FFFD4]`}
              />
              {errors.email && (
                <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone (Optional) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141210] dark:text-[#F4EFE6] mb-1.5">
                Phone Number <span className="text-[#6E6860] dark:text-[#9E988F] font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] border border-[#E6DFD5] dark:border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#7FFFD4]"
              />
            </div>

            {/* Query Category */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141210] dark:text-[#F4EFE6] mb-1.5">
                Query Category <span className="text-[#D6B77A]">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] border border-[#E6DFD5] dark:border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#7FFFD4]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141210] dark:text-[#F4EFE6] mb-1.5">
              Inquiry Details <span className="text-[#D6B77A]">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe your question or gift inquiry..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-4 py-3 text-xs rounded-2xl bg-[#F3EFE9] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] border ${
                errors.message ? "border-rose-500" : "border-[#E6DFD5] dark:border-[#222926]"
              } focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#7FFFD4]`}
            />
            {errors.message && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Transmitting to N8N Workflow...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Query to N8N</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
