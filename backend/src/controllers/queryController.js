import { CustomerQuery } from "../models/CustomerQuery.js";
import { validateCustomerQuery } from "../validators/queryValidator.js";
import { sendCustomerQueryToN8N } from "../services/n8nService.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";

// POST /api/queries
export const createCustomerQuery = async (req, res, next) => {
  try {
    // 1. Validate Input
    const { error, value } = validateCustomerQuery(req.body);
    if (error) {
      const details = error.details.map((d) => d.message);
      return errorResponse(res, "Validation error", 422, details);
    }

    // 2. Save query to MongoDB
    let newQuery = null;
    try {
      newQuery = await CustomerQuery.create({
        name: value.name,
        email: value.email,
        phone: value.phone || "Not provided",
        category: value.category,
        message: value.message,
        status: "new",
        n8nStatus: "pending"
      });
      logger.info(`Saved customer query to MongoDB [ID: ${newQuery._id}]`);
    } catch (dbErr) {
      logger.warn(`MongoDB save fallback: ${dbErr.message}`);
      newQuery = {
        _id: `query-temp-${Date.now()}`,
        ...value,
        status: "new",
        n8nStatus: "pending",
        createdAt: new Date().toISOString()
      };
    }

    // 3. Send query to N8N Webhook
    const n8nResult = await sendCustomerQueryToN8N(newQuery);

    // 4. Update N8N status in MongoDB
    if (newQuery._id && typeof newQuery.save === "function") {
      try {
        newQuery.n8nStatus = n8nResult.delivered ? "success" : "failed";
        newQuery.n8nResponse = n8nResult;
        await newQuery.save();
      } catch (updateErr) {
        logger.error(`Failed to update N8N status in DB: ${updateErr.message}`);
      }
    }

    // 5. Return customer response
    return successResponse(
      res,
      {
        queryId: newQuery._id,
        n8nDelivered: n8nResult.delivered,
        simulated: n8nResult.simulated || false
      },
      n8nResult.delivered
        ? "Your query has been successfully received and transmitted to our N8N processing system."
        : "Your query has been safely recorded. Our team will contact you via email shortly.",
      201
    );
  } catch (err) {
    next(err);
  }
};
