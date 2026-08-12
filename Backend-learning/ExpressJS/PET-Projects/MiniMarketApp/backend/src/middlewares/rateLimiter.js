// path: backend/src/middlewares/rateLimiter.js
const rateLimit = require("express-rate-limit");
const redisStore = require("rate-limiter-redis");
const redisClient = require("../config/redis");

const limiter = rateLimit({
    store: new redisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:{
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes..."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    store: new redisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 attempts
    skipSuccessfulRequests: false,
    message:{
        success: false,
        message: "Too many login attempts, please try again after 1 hour..."
    },
});

module.exports = { limiter, authLimiter };