/**
 * Utility functions untuk standard API responses
 */

const success = (res, data, message = 'Berjaya', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const error = (res, message = 'Ralat berlaku', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

const notFound = (res, message = 'Data tidak ditemui') => {
  return error(res, message, 404);
};

const badRequest = (res, message = 'Permintaan tidak sah', errors = null) => {
  return error(res, message, 400, errors);
};

const unauthorized = (res, message = 'Tidak dibenarkan') => {
  return error(res, message, 401);
};

const forbidden = (res, message = 'Akses ditolak') => {
  return error(res, message, 403);
};

const conflict = (res, message = 'Data sudah wujud') => {
  return error(res, message, 409);
};

module.exports = {
  success,
  error,
  notFound,
  badRequest,
  unauthorized,
  forbidden,
  conflict
};
