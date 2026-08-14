// path: backend/src/middlewares/validation.js
const { BadRequestError } = require('./errors/errorHandler');

const validate = (schema) =>{ 
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new BadRequestError(error.details[0].message));
        }
        next();
    };
};

module.exports = validate;