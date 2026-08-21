import Joi from "joi";

export const validateAddToCart = (data) => {
  const schema = Joi.object({
    productId: Joi.string().required().messages({
      "any.required": "productId is required"
    }),
    quantity: Joi.number().integer().min(1).default(1),
    priceAtAdd: Joi.number().min(0)
  });
  return schema.validate(data, { abortEarly: false });
};

export const validateUpdateCartItem = (data) => {
  const schema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required().messages({
      "any.required": "quantity is required"
    })
  });
  return schema.validate(data, { abortEarly: false });
};
