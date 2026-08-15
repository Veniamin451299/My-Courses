// path: backend/src/validators/productValidator.js
const Joi = require('joi')

const createProductSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(), 
    description: Joi.string().max(500),
    price: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().min(0).default(0),
    images: Joi.array().items(Joi.string().uri()).default([]),
    categoryId: Joi.number().integer().required(), 
    isActive: Joi.boolean().default(true),
});

const updateProductSchema = Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    price: Joi.number().positive().precision(2),
    stock: Joi.number().integer().min(0),
    images: Joi.array().items(Joi.string().uri()),
    categoryId: Joi.number().integer(),
    isActive: Joi.boolean(),
});

module.exports = { createProductSchema, updateProductSchema };