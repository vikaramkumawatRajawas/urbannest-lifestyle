import { ContactMessage } from "../models/ContactMessage.js";
import { Newsletter } from "../models/Newsletter.js";
import { validateContactMessage, validateNewsletter } from "../validators/contactValidator.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";

// POST /api/contact
export const submitContactMessage = async (req, res, next) => {
  try {
    const { error, value } = validateContactMessage(req.body);
    if (error) {
      return errorResponse(res, "Validation error", 422, error.details.map((d) => d.message));
    }

    try {
      await ContactMessage.create(value);
      logger.info(`Saved contact message from ${value.email}`);
    } catch (dbErr) {
      logger.warn(`Contact message DB save skipped: ${dbErr.message}`);
    }

    return successResponse(
      res,
      { email: value.email },
      "Thank you for contacting UrbanNest. We will respond shortly!",
      201
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/newsletter/subscribe
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { error, value } = validateNewsletter(req.body);
    if (error) {
      return errorResponse(res, "Please enter a valid email address", 422);
    }

    try {
      const existing = await Newsletter.findOne({ email: value.email.toLowerCase() });
      if (existing) {
        return successResponse(res, { email: value.email }, "You are already subscribed to UrbanNest newsletter!");
      }
      await Newsletter.create({ email: value.email });
    } catch (dbErr) {
      logger.warn(`Newsletter DB save skipped: ${dbErr.message}`);
    }

    return successResponse(
      res,
      { email: value.email },
      "Successfully subscribed to UrbanNest newsletter!",
      201
    );
  } catch (err) {
    next(err);
  }
};
