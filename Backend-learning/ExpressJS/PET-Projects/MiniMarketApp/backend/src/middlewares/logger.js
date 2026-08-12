// path: backend/src/middlewares/logger.js
const logger = require('./config/logger');

const requestLogger = (req, res, next) => {
    const start = Data.now();

    res.on('finish', () => {
        const duration = Data.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        }, 'Request completed');
    });

    next();
};