import Joi from "joi";

export const validateCreateOrder = (data) => {
  const itemSchema = Joi.object({
    productId: Joi.string().optional(),
    product: Joi.string().optional(),
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(1).required(),
    image: Joi.string().allow("", null)
  }).or("productId", "product");

  const shippingDetailsSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required()
  });

  const schema = Joi.object({
    items: Joi.array().items(itemSchema).min(1).required(),
    shippingDetails: shippingDetailsSchema.required(),
    paymentMethod: Joi.string().valid("COD", "Card", "UPI", "NetBanking").default("COD"),
    subtotal: Joi.number().min(0),
    tax: Joi.number().min(0),
    shippingFee: Joi.number().min(0),
    totalAmount: Joi.number().min(0).required()
  });

  return schema.validate(data, { abortEarly: false });
};
