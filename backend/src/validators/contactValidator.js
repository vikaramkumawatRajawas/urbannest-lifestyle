import Joi from "joi";

export const validateContactMessage = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    phone: Joi.string().allow("", null).optional(),
    message: Joi.string().trim().min(3).required()
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateNewsletter = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required()
  });

  return schema.validate(data);
};
