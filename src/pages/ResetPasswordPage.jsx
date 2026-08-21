import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, ArrowRight } from "lucide-react";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const ResetPasswordPage = ({ setActivePage }) => {
  const { openAuthModal } = useAuth();
  
  // Extract token from URL query string
  const queryParams = new URLSearchParams(window.location.search);
  const resetToken = queryParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error' | 'expired', message: '' }
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatus(null);

    const errs = {};
    if (!newPassword) {
      errs.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errs.newPassword = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
      errs.newPassword =
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number & 1 special char (@$!%*?&)";
    }

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (!resetToken) {
      setStatus({
        type: "error",
        message: "This password reset link is invalid. No reset token was found in the URL."
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await authService.resetPassword({
        token: resetToken,
        newPassword,
        confirmPassword
      });

      if (res.success) {
        setStatus({
          type: "success",
          message: res.message || "Your password has been reset successfully."
        });
      } else {
        setStatus({
          type: "error",
          message: res.message || "Failed to reset password."
        });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to reset password.";
      const isExpired = errMsg.toLowerCase().includes("expired") || errMsg.toLowerCase().includes("invalid");
      setStatus({
        type: isExpired ? "expired" : "error",
        message: errMsg
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-transparent text-[#141210] dark:text-[#F4EFE6] flex items-center justify-center">
      <div className="w-full max-w-md bg-[#151918] text-[#F4EFE6] rounded-3xl border border-[#D6B77A]/40 shadow-[0_35px_90px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Card Header */}
        <div className="p-6 bg-[#0B0D0E] border-b border-[#222926] text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#151918] border border-[#D6B77A]/40 flex items-center justify-center text-[#D6B77A]">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-serif-luxury font-extrabold text-2xl text-[#F4EFE6] uppercase tracking-wide">
            Reset Password
          </h2>
          <p className="text-xs text-[#9E988F]">
            Create a new strong password for your UrbanNest account.
          </p>
        </div>

        {/* Status Banners */}
        {status && (
          <div
            className={`p-4 text-xs font-semibold flex items-start gap-3 border-b ${
              status.type === "success"
                ? "bg-[#0B0D0E] border-[#7FFFD4]/40 text-[#7FFFD4]"
                : "bg-rose-950/50 border-rose-800/40 text-rose-300"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#7FFFD4] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-2">
              <p>{status.message}</p>
              {status.type === "success" && (
                <button
                  onClick={() => {
                    openAuthModal("login");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#D6B77A] text-[#0B0D0E] font-extrabold text-[10px] uppercase tracking-widest inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Log In Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {status.type === "expired" && (
                <button
                  onClick={() => openAuthModal("forgot-password")}
                  className="px-4 py-2 rounded-xl bg-rose-800 text-white font-extrabold text-[10px] uppercase tracking-widest inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Request New Link</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        {status?.type !== "success" && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                New Password <span className="text-[#D6B77A]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars (1 upper, 1 lower, 1 number, 1 special)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E988F]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#9E988F] hover:text-[#F4EFE6] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[10px] text-rose-400 mt-1">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                Confirm New Password <span className="text-[#D6B77A]">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E988F]" />
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] text-rose-400 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? "Resetting Password..." : "Reset Password"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
