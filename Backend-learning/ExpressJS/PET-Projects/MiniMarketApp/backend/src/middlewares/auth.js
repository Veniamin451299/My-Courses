// path: backend/src/middlewares/auth.js
const { UnauthorizedError, ForbiddenError } = require("./errors/errorHandler");
const jwtService = require("../utils/jwt");

// Token verification
const authMiddleware = (req, res, next) => { 
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new UnauthorizedError("No token provided"));
    }

    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
}

// Admin verification
const adminMiddleware = (req, res, next) => { 
    if (req.user.role !== 'ADMIN') {
        return next(new ForbiddenError("Admin access required"));
    }
    next();
}

module.exports = { authMiddleware, adminMiddleware }