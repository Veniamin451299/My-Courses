// path: backend/src/middlewares/errors/errorResponse.js
const logger = require('../logger');

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

  // Определяем статус код и сообщение
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.name || 'INTERNAL_ERROR';

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate field: ${err.meta?.target?.join(', ')}`;
    code = 'DUPLICATION_ERROR';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
    code = 'NOT_FOUND';
  }

  // Validation Joi Errors
  if (err.isJoi) {
    statusCode = 400;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
    return res.status(statusCode).json({
      success: false,
      message,
      errors: err.details.map(d => d.message),
      code
    });
  }

  // Отправляем ответ
  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};