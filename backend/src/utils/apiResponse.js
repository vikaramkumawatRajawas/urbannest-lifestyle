/**
 * Standardized API Response Helper
 */

export const successResponse = (res, data = {}, message = "Success", statusCode = 200, pagination = null) => {
  const payload = {
    success: true,
    message,
    data
  };
  if (pagination) {
    payload.pagination = pagination;
  }
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, message = "An unexpected error occurred", statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message
  };
  if (errors) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};
