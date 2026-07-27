// path: backend/src/middleware/ErrorHandler.js

// Error (404) Not found
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

// Error (400) Bad Request
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

// Error (401) Unauthorized
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}

// Error (403) Forbidden
class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 403;
    }
}

// Error (500) Internal Server Error
class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
    }
}

module.exports = { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, InternalServerError };