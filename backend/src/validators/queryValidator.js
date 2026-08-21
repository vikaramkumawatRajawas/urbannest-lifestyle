import Joi from "joi";

export const validateCustomerQuery = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Full Name is required",
      "any.required": "Full Name is required"
    }),
    email: Joi.string().email().trim().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required"
    }),
    phone: Joi.string().allow("", null).optional(),
    category: Joi.string()
      .valid(
        "Product Inquiry",
        "Order Inquiry",
        "Delivery",
        "Store Information",
        "Complaint",
        "Feedback",
        "Other"
      )
      .required()
      .messages({
        "any.only": "Invalid query category selected",
        "any.required": "Query category is required"
      }),
    message: Joi.string().trim().min(5).required().messages({
      "string.min": "Message must be at least 5 characters long",
      "string.empty": "Message details are required",
      "any.required": "Message details are required"
    })
  });

  return schema.validate(data, { abortEarly: false });
};
