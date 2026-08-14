// path: backend/src/validators/authValidator.js
const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
    }),
}).options({presence: 'required' }).required();

const loginSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
}).options({presence: 'required' }).required();

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string(),
}).options({presence: 'required' }).required();

module.exports = { registerSchema, loginSchema, refreshTokenSchema };