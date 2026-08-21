import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  facebookLogin,
  getCurrentUser,
  logoutUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  forgotUsername
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public auth endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/facebook", facebookLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/forgot-username", forgotUsername);

// Protected user endpoints
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
router.put("/profile", protect, updateProfile);
router.post("/change-password", protect, changePassword);

export default router;
