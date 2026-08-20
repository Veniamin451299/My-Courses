// path: backend/src/validators/orderValidator.js
const Joi = require('joi');

const updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED').required(),
});

module.exports = { updateOrderStatusSchema };