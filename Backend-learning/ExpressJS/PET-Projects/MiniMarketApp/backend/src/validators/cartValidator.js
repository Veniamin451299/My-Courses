// path: backend/src/validators/cartValidator.js
const Joi = require('joi');

const addItemSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1),
}).options({presence: 'required' }).required();

const updateItemQuantitySchema = Joi.object({
    quantity: Joi.number().integer().min(1),
}).options({presence: 'required' }).required();

module.exports = { addItemSchema, updateItemQuantitySchema };