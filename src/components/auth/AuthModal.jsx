import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  LogOut,
  Package,
  CheckCircle2,
  Edit3,
  Save,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  HelpCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import { authService } from "../../services/authService";

export const AuthModal = ({ isOpen, onClose }) => {
  const {
    user,
    login,
    register,
    googleLogin,
    facebookLogin,
    logout,
    updateProfile,
    authModalMode,
    setAuthModalMode,
    loading
  } = useAuth();

  const { setIsOrdersModalOpen } = useOrders();

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password / Username State
  const [forgotEmail, setForgotEmail] = useState("");
  const [submittingRecovery, setSubmittingRecovery] = useState(false);

  // SEPARATE Provider-Specific Social Loading States
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editAddress, setEditAddress] = useState(user?.address || "");

  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize Facebook SDK if FB_APP_ID is present
  useEffect(() => {
    const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (window.FB || !fbAppId) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: fbAppId,
        cookie: true,
        xfbml: true,
        version: "v19.0"
      });
    };
  }, []);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    const errs = {};
    if (!loginEmail.trim()) errs.email = "Email Address is required";
    if (!loginPassword) errs.password = "Password is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const res = await login(loginEmail, loginPassword);
    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1000);
    } else {
      setMessage({ type: "error", text: res.message || "Invalid email or password." });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    const errs = {};
    if (!regName.trim()) errs.name = "Full Name is required";
    if (!regEmail.trim()) {
      errs.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (!regPassword) {
      errs.password = "Password is required";
    } else if (regPassword.length < 8) {
      errs.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(regPassword)) {
      errs.password =
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number & 1 special char (@$!%*?&)";
    }

    if (regPassword !== regConfirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const res = await register(regName, regEmail, regPhone, regPassword);
    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1000);
    } else {
      setMessage({ type: "error", text: res.message || "Registration failed. Please try again." });
    }
  };

  const handleGoogleSocialSignIn = async () => {
    setMessage(null);
    setGoogleLoading(true);

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (window.google?.accounts?.id && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: function (response) {
          (async () => {
            try {
              if (response.credential) {
                setMessage({ type: "success", text: "Verifying Google credential..." });
                const res = await googleLogin(response.credential);
                if (res.success) {
                  setMessage({ type: "success", text: res.message });
                  setTimeout(() => {
                    onClose();
                    setMessage(null);
                  }, 1000);
                } else {
                  setMessage({ type: "error", text: res.message || "Google login failed. Please try again." });
                }
              } else {
                setMessage({ type: "error", text: "Google sign-in was cancelled." });
              }
            } catch (err) {
              setMessage({ type: "error", text: err.message || "Google sign-in error." });
            } finally {
              setGoogleLoading(false);
            }
          })();
        }
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          executeGoogleDirectCall();
        }
      });
    } else {
      await executeGoogleDirectCall();
    }
  };

  const executeGoogleDirectCall = async () => {
    try {
      setMessage({ type: "success", text: "Signing in with Google..." });
      const mockToken = "mock_google_id_token_" + Date.now();
      const res = await googleLogin(mockToken);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setTimeout(() => {
          onClose();
          setMessage(null);
        }, 1000);
      } else {
        setMessage({ type: "error", text: res.message || "Google login failed." });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookSocialSignIn = async () => {
    setMessage(null);
    setFacebookLoading(true);

    try {
      if (window.FB) {
        window.FB.login(
          function (response) {
            (async () => {
              try {
                if (response.authResponse?.accessToken) {
                  setMessage({ type: "success", text: "Verifying Facebook authentication..." });
                  const res = await facebookLogin(response.authResponse.accessToken);
                  if (res.success) {
                    setMessage({ type: "success", text: res.message });
                    setTimeout(() => {
                      onClose();
                      setMessage(null);
                    }, 1000);
                  } else {
                    setMessage({ type: "error", text: res.message || "Facebook login failed." });
                  }
                } else {
                  setMessage({ type: "error", text: "Facebook sign-in was cancelled." });
                }
              } catch (err) {
                setMessage({ type: "error", text: err.message || "Facebook authentication error." });
              } finally {
                setFacebookLoading(false);
              }
            })();
          },
          { scope: "public_profile,email" }
        );
      } else {
        setMessage({ type: "success", text: "Signing in with Facebook..." });
        const mockToken = "mock_fb_access_token_" + Date.now();
        const res = await facebookLogin(mockToken);
        if (res.success) {
          setMessage({ type: "success", text: res.message });
          setTimeout(() => {
            onClose();
            setMessage(null);
          }, 1000);
        } else {
          setMessage({ type: "error", text: res.message || "Facebook login failed." });
        }
        setFacebookLoading(false);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Facebook login error." });
      setFacebookLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    if (!forgotEmail.trim()) {
      setErrors({ forgotEmail: "Please enter your registered email address" });
      return;
    }

    try {
      setSubmittingRecovery(true);
      const res = await authService.forgotPassword({ email: forgotEmail });
      setMessage({
        type: "success",
        text: res.message || "If an account exists for this email, reset instructions have been sent."
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to process request. Please try again."
      });
    } finally {
      setSubmittingRecovery(false);
    }
  };

  const handleForgotUsernameSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    if (!forgotEmail.trim()) {
      setErrors({ forgotEmail: "Please enter your registered email address" });
      return;
    }

    try {
      setSubmittingRecovery(true);
      const res = await authService.forgotUsername({ email: forgotEmail });
      setMessage({
        type: "success",
        text: res.message || "If an account exists for this email, account recovery instructions have been sent."
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to process request. Please try again."
      });
    } finally {
      setSubmittingRecovery(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile({
      name: editName,
      phone: editPhone,
      address: editAddress
    });
    setIsEditing(false);
    setMessage({ type: "success", text: res.message || "Profile updated successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const getUserInitials = (name) => {
    if (!name) return "UN";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#151918] text-[#F4EFE6] rounded-3xl border border-[#D6B77A]/40 shadow-[0_35px_90px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#0B0D0E] border-b border-[#222926] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#151918] border border-[#D6B77A]/40 flex items-center justify-center text-[#D6B77A]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#F4EFE6] uppercase tracking-wider">
                {authModalMode === "profile"
                  ? "User Profile"
                  : authModalMode === "register"
                  ? "Create Account"
                  : authModalMode === "forgot-password"
                  ? "Forgot Password"
                  : authModalMode === "forgot-username"
                  ? "Account Recovery"
                  : "Member Login"}
              </h3>
              <p className="text-[10px] text-[#9E988F] uppercase tracking-widest">
                UrbanNest Account Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-500/20 text-[#9E988F] hover:text-rose-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Message Banner */}
        {message && (
          <div
            className={`p-3 border-b text-xs text-center font-semibold flex items-center justify-center gap-2 animate-fadeIn ${
              message.type === "success"
                ? "bg-[#0B0D0E] border-[#7FFFD4]/40 text-[#7FFFD4]"
                : "bg-rose-950/40 border-rose-500/40 text-rose-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-[#7FFFD4]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-5">

          {/* MODE 1: LOGIN FORM */}
          {authModalMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 mb-2 text-center sm:text-left">
                <h4 className="font-serif-luxury text-xl font-bold text-[#F4EFE6] uppercase tracking-wide">
                  Welcome Back
                </h4>
                <p className="text-xs text-[#9E988F]">
                  Log in to access saved addresses, order tracking, and VIP member perks.
                </p>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={googleLoading || facebookLoading}
                  onClick={handleGoogleSocialSignIn}
                  className="py-2.5 px-3 rounded-2xl bg-[#0B0D0E] border border-[#222926] hover:border-[#D6B77A]/50 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                  <span>{googleLoading ? "Connecting..." : "Google"}</span>
                </button>

                <button
                  type="button"
                  disabled={googleLoading || facebookLoading}
                  onClick={handleFacebookSocialSignIn}
                  className="py-2.5 px-3 rounded-2xl bg-[#0B0D0E] border border-[#222926] hover:border-[#4267B2]/60 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs text-[#1877F2] disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>{facebookLoading ? "Connecting..." : "Facebook"}</span>
                </button>
              </div>

              <div className="relative flex items-center my-2">
                <div className="flex-grow border-t border-[#222926]"></div>
                <span className="shrink mx-3 text-[10px] uppercase tracking-widest text-[#9E988F]">
                  or email login
                </span>
                <div className="flex-grow border-t border-[#222926]"></div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                  Email Address <span className="text-[#D6B77A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. user@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E988F]" />
                </div>
                {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest">
                    Password <span className="text-[#D6B77A]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setMessage(null);
                      setForgotEmail(loginEmail);
                      setAuthModalMode("forgot-password");
                    }}
                    className="text-[10px] text-[#D6B77A] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E988F]" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-[#9E988F] hover:text-[#F4EFE6] cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-rose-400 mt-1">{errors.password}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setMessage(null);
                    setForgotEmail(loginEmail);
                    setAuthModalMode("forgot-username");
                  }}
                  className="text-[10px] text-[#9E988F] hover:text-[#7FFFD4] underline font-medium cursor-pointer"
                >
                  Forgot Username / Account Email?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? "Logging in..." : "Log In To Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-[#222926] text-center space-y-2 text-xs">
                <p className="text-[#9E988F]">
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setMessage(null);
                      setAuthModalMode("register");
                    }}
                    className="text-[#7FFFD4] font-bold underline hover:opacity-80 cursor-pointer"
                  >
                    Create New Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {authModalMode === "forgot-password" && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1 mb-2 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-[#0B0D0E] border border-[#D6B77A]/40 flex items-center justify-center text-[#D6B77A] mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-[#F4EFE6] uppercase tracking-wide">
                  Forgot Password?
                </h4>
                <p className="text-xs text-[#9E988F]">
                  Enter your registered email address below. We'll send you instructions to reset your password.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                  Registered Email Address <span className="text-[#D6B77A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. user@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E988F]" />
                </div>
                {errors.forgotEmail && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.forgotEmail}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingRecovery}
                className="w-full py-3.5 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{submittingRecovery ? "Sending Instructions..." : "Send Reset Link"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-[#222926] text-center text-xs">
                <p className="text-[#9E988F]">
                  Remembered your password?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setMessage(null);
                      setAuthModalMode("login");
                    }}
                    className="text-[#7FFFD4] font-bold underline hover:opacity-80 cursor-pointer"
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: FORGOT USERNAME / ACCOUNT RECOVERY */}
          {authModalMode === "forgot-username" && (
            <form onSubmit={handleForgotUsernameSubmit} className="space-y-4">
              <div className="space-y-1 mb-2 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-[#0B0D0E] border border-[#7FFFD4]/40 flex items-center justify-center text-[#7FFFD4] mb-2">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-[#F4EFE6] uppercase tracking-wide">
                  Account Recovery
                </h4>
                <p className="text-xs text-[#9E988F]">
                  Enter your email address to retrieve login credentials or social sign-in instructions.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                  Email Address <span className="text-[#D6B77A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. user@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E988F]" />
                </div>
                {errors.forgotEmail && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.forgotEmail}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingRecovery}
                className="w-full py-3.5 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{submittingRecovery ? "Recovering..." : "Recover Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-[#222926] text-center text-xs">
                <p className="text-[#9E988F]">
                  Remembered your details?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setMessage(null);
                      setAuthModalMode("login");
                    }}
                    className="text-[#7FFFD4] font-bold underline hover:opacity-80 cursor-pointer"
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE 2: REGISTER FORM */}
          {authModalMode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif-luxury text-xl font-bold text-[#F4EFE6] uppercase tracking-wide">
                  Create Your UrbanNest Account
                </h4>
                <p className="text-xs text-[#9E988F]">
                  Join UrbanNest to enjoy fast checkout, order tracking, and VIP member perks.
                </p>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={googleLoading || facebookLoading}
                  onClick={handleGoogleSocialSignIn}
                  className="py-2.5 px-3 rounded-2xl bg-[#0B0D0E] border border-[#222926] hover:border-[#D6B77A]/50 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                  <span>{googleLoading ? "Connecting..." : "Google"}</span>
                </button>

                <button
                  type="button"
                  disabled={googleLoading || facebookLoading}
                  onClick={handleFacebookSocialSignIn}
                  className="py-2.5 px-3 rounded-2xl bg-[#0B0D0E] border border-[#222926] hover:border-[#4267B2]/60 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs text-[#1877F2] disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>{facebookLoading ? "Connecting..." : "Facebook"}</span>
                </button>
              </div>

              <div className="relative flex items-center my-2">
                <div className="flex-grow border-t border-[#222926]"></div>
                <span className="shrink mx-3 text-[10px] uppercase tracking-widest text-[#9E988F]">
                  or email signup
                </span>
                <div className="flex-grow border-t border-[#222926]"></div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                  Full Name <span className="text-[#D6B77A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Vikram Kumawat"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-[#9E988F]" />
                </div>
                {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                  Email Address <span className="text-[#D6B77A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#9E988F]" />
                </div>
                {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-[#9E988F]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                  Password <span className="text-[#D6B77A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Min 8 chars (1 upper, 1 lower, 1 number, 1 special)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#9E988F]" />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-3 text-[#9E988F] hover:text-[#F4EFE6] cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-rose-400 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                  Confirm Password <span className="text-[#D6B77A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                  />
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#9E988F]" />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-[#222926] text-center text-xs">
                <p className="text-[#9E988F]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setMessage(null);
                      setAuthModalMode("login");
                    }}
                    className="text-[#7FFFD4] font-bold underline hover:opacity-80 cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE 3: PROFILE VIEW */}
          {authModalMode === "profile" && user && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-5 rounded-3xl bg-[#0B0D0E] border border-[#D6B77A]/40 flex items-center gap-4 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-[#151918] border-2 border-[#D6B77A] text-[#D6B77A] font-serif-luxury font-extrabold text-2xl flex items-center justify-center shadow-md">
                  {getUserInitials(user.name)}
                </div>

                <div className="space-y-1 flex-1 overflow-hidden">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#151918] text-[#7FFFD4] border border-[#7FFFD4]/30 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3 text-[#D6B77A]" />
                    VIP Member
                  </span>
                  <h4 className="font-serif-luxury font-extrabold text-xl text-[#F4EFE6] truncate">
                    {user.name}
                  </h4>
                  <p className="text-xs text-[#9E988F] truncate">{user.email}</p>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1">
                      Shipping Address
                    </label>
                    <textarea
                      rows={2}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0B0D0E] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-2xl bg-[#D6B77A] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-3 rounded-2xl bg-[#0B0D0E] text-[#9E988F] font-bold text-xs uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-[#0B0D0E] border border-[#222926] space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#222926] pb-2">
                    <span className="text-[#9E988F]">Phone Number:</span>
                    <span className="font-semibold text-[#F4EFE6]">{user.phone || "Not provided"}</span>
                  </div>

                  <div className="border-b border-[#222926] pb-2">
                    <span className="text-[#9E988F] block mb-1">Delivery Address:</span>
                    <span className="font-normal text-[#F4EFE6] leading-relaxed block">
                      {user.address || "Add address in profile settings"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#9E988F]">Account Role:</span>
                    <span className="font-semibold text-[#D6B77A] uppercase">{user.role || "customer"}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditName(user.name || "");
                      setEditPhone(user.phone || "");
                      setEditAddress(user.address || "");
                      setIsEditing(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-[#0B0D0E] border border-[#222926] text-[#F4EFE6] hover:border-[#D6B77A]/50 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#D6B77A]" />
                    <span>Edit Profile Details</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    setIsOrdersModalOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-[#0B0D0E] border border-[#222926] text-[#7FFFD4] hover:border-[#7FFFD4]/50 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Package className="w-4 h-4 text-[#7FFFD4]" />
                  <span>My Orders & Live Tracking</span>
                </button>

                <button
                  onClick={logout}
                  className="w-full py-3 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:bg-rose-900/60 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
