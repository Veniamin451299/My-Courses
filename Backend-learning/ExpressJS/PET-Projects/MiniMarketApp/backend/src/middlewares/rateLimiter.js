// path: backend/src/middlewares/rateLimiter.js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes..."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 час
    max: 5, // максимум 5 попыток
    skipSuccessfulRequests: false,
    message: {
        success: false,
        message: "Too many login attempts, please try again after 1 hour..."
    },
});

module.exports = { limiter, authLimiter };