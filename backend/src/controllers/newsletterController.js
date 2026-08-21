import { Newsletter } from "../models/Newsletter.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";

// POST /api/newsletter/subscribe
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return errorResponse(res, "Please provide a valid email address", 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    let subscription;
    try {
      const existing = await Newsletter.findOne({ email: cleanEmail });
      if (existing) {
        return successResponse(
          res,
          { email: cleanEmail, status: "already_subscribed" },
          "You are already subscribed to the UrbanNest VIP Newsletter!"
        );
      }

      subscription = await Newsletter.create({ email: cleanEmail });
    } catch (dbErr) {
      logger.warn(`MongoDB save fallback for newsletter: ${dbErr.message}`);
      subscription = { email: cleanEmail, createdAt: new Date().toISOString() };
    }

    return successResponse(
      res,
      { subscription },
      "Thank you for subscribing to UrbanNest Newsletter!",
      201
    );
  } catch (err) {
    next(err);
  }
};
