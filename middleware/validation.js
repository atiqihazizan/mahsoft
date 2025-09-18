const { validationResult } = require('express-validator');
const { badRequest } = require('../utils/response');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return badRequest(res, 'Data tidak sah', formattedErrors);
  }
  next();
};

module.exports = {
  handleValidationErrors
};
