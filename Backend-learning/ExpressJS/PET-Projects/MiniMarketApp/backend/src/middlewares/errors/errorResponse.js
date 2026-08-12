// path: backend/src/middlewares/errors/errorResponse.js
const logger = require('../logger')

module.exports = (err, req, res, next) => {
  // Log the error
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.userId
  }, 'Error occurred');
  res.status(err.statusCode || 500).json({ error: err.message });

  // Prisma errors
  if (err.code === 'P2002') {
    return res.statusCode(409).json({
      success: false,
      message: `Duplicate field: ${err.meta?.target?.join(', ')}`,
      code: 'DUCPLICATION_ERROR'
    });
  }

  if (err.code === 'P2025') {
    return res.statusCode(404).json({
      success: false,
      message: `Record not found`,
      code: 'NOT_FOUND'
    });
  }

  // Validation Joi Errors
  if (err.isJoi) {
    return res.statusCode(400).json({
      success: false,
      message: 'Validation error',
      errors: err.details.map(d => d.message),
      code: 'VALIDATION_ERROR'
    });
  }

  // Our custom errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    code: err.name || 'INTERNAL_ERROR',
    ...process.env.NODE_ENV === 'development' && { stack: err.stack }
  });
};