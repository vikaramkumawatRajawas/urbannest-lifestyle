import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { User } from "../models/User.js";
import { errorResponse } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return errorResponse(res, "Not authorized to access this route. Please log in.", 401);
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash").lean();

    if (!user) {
      return errorResponse(res, "The user belonging to this token no longer exists.", 401);
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role
    };

    next();
  } catch (err) {
    return errorResponse(res, "Invalid or expired session token. Please log in again.", 401);
  }
};
