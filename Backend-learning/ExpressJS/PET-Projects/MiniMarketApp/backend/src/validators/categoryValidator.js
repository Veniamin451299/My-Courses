// path: backend/src/validators/categoryValidator.js
const Joi = require('joi');

const createCategorySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(), 
    description: Joi.string().max(500).allow('', null), // allow разрешит пустые строки и null
});

const updateCategorySchema = Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().max(500).allow('', null),
}).min(1); // Гарантирует, что при обновлении передали хотя бы одно поле

module.exports = { createCategorySchema, updateCategorySchema };