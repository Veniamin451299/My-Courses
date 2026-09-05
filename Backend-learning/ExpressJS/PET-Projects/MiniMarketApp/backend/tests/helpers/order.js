// path: backend/tests/helpers/order.js
const request = require('supertest');
const { app } = require('../../src/app');
const logger = require('../../src/config/logger');

const getOrders = async (accessToken) => {
    try {
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${accessToken}`);
        return res;
    } catch (err) {
        logger.error('Get orders failed', err);
    }
};

const getOrderById = async (accessToken, orderId) => {
    try {
        const res = await request(app)
            .get(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        return res;
    } catch (err) {
        logger.error('Get order by ID failed', err);
    }
};

const createOrder = async (accessToken, address) => {
    try {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ address });
        return res;
    } catch (err) {
        logger.error('Create order failed', err);
    }
};

const updateOrderStatus = async (accessToken, orderId, status) => {
    try {
        const res = await request(app)
            .put(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ status });
        return res;
    } catch (err) {
        logger.error('Update order status failed', err);
    }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };