import React, { useState } from "react";
import { Settings, Shield, Bell, Moon, Sun, Lock, CheckCircle2, User, KeyRound } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, token } = useAuth();

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: true
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (!passwordState.currentPassword || !passwordState.newPassword) {
      setPasswordMsg({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (passwordState.newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    if (token && token !== "mock_jwt_token_local") {
      const res = await authService.changePassword({
        currentPassword: passwordState.currentPassword,
        newPassword: passwordState.newPassword
      });
      setIsSubmitting(false);

      if (res.success) {
        setPasswordMsg({ type: "success", text: "Password changed successfully!" });
        setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMsg({ type: "error", text: res.message || "Failed to change password." });
      }
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setPasswordMsg({ type: "success", text: "Password changed successfully!" });
        setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] transition-colors duration-400">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left border-b border-[#E6DFD5] dark:border-[#222926] pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#151918] text-[#D6B77A] border border-[#D6B77A]/30 uppercase tracking-widest shadow-xs">
            <Settings className="w-3.5 h-3.5 text-[#059669] dark:text-[#7FFFD4]" />
            <span>Preferences & Security</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Account Settings
          </h1>
        </div>

        {/* Section 1: Appearance & Theme */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6DFD5] dark:border-[#222926] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#D6B77A]">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg font-bold uppercase tracking-wide">
                  Theme Appearance
                </h3>
                <p className="text-xs text-[#6E6860] dark:text-[#9E988F]">
                  Switch between Warm Editorial Light Mode and Dramatic Dark Mode.
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-5 py-2.5 rounded-2xl bg-[#D6B77A] text-[#0B0D0E] text-xs font-extrabold uppercase tracking-wider hover:bg-[#c4a466] transition-all cursor-pointer shadow-md"
            >
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </div>

        {/* Section 2: Notifications */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E6DFD5] dark:border-[#222926] pb-4">
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#087F68] dark:text-[#7FFFD4]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold uppercase tracking-wide">
                Notification Preferences
              </h3>
              <p className="text-xs text-[#6E6860] dark:text-[#9E988F]">
                Manage order tracking updates and lifestyle offers.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] cursor-pointer">
              <span>Order & Live Delivery Tracking SMS Updates</span>
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={(e) =>
                  setNotifications({ ...notifications, orderUpdates: e.target.checked })
                }
                className="w-4 h-4 accent-[#D6B77A]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] cursor-pointer">
              <span>Exclusive Member Offers & Seasonal Drop Alerts</span>
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={(e) =>
                  setNotifications({ ...notifications, promotions: e.target.checked })
                }
                className="w-4 h-4 accent-[#D6B77A]"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Security & Change Password */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151918] border border-[#E6DFD5] dark:border-[#222926] shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E6DFD5] dark:border-[#222926] pb-4">
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#B98232] dark:text-[#D6B77A]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold uppercase tracking-wide">
                Security & Password
              </h3>
              <p className="text-xs text-[#6E6860] dark:text-[#9E988F]">
                Update your account password safely.
              </p>
            </div>
          </div>

          {passwordMsg.text && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold ${
                passwordMsg.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
              }`}
            >
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={passwordState.currentPassword}
                onChange={(e) =>
                  setPasswordState({ ...passwordState, currentPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] focus:outline-none focus:border-[#D6B77A]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                New Password (Min 8 characters)
              </label>
              <input
                type="password"
                value={passwordState.newPassword}
                onChange={(e) =>
                  setPasswordState({ ...passwordState, newPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] focus:outline-none focus:border-[#D6B77A]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordState.confirmPassword}
                onChange={(e) =>
                  setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#FAF8F5] dark:bg-[#0B0D0E] border border-[#E6DFD5] dark:border-[#222926] focus:outline-none focus:border-[#D6B77A]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-[#D6B77A] text-[#0B0D0E] text-xs font-extrabold uppercase tracking-wider hover:bg-[#c4a466] transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
