// path: backend/tests/helpers/cart.js
const request = require('supertest');
const { app } = require('../../src/app');
const logger = require('../../src/config/logger');

const getCart = async (accessToken) => {
    try {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${accessToken}`);
        return res;
    } catch (err) {
        logger.error('Get cart failed', err);
    }
};

const addItem = async (accessToken, productId, quantity) => {
    try {
        const res = await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ productId, quantity });
        return res;
    } catch (err) {
        logger.error('Add item to cart failed', err);
    }
};

const updateItemQuantity = async (accessToken, cartItemId, quantity) => {
    try {
        const res = await request(app)
            .put(`/api/cart/items/${cartItemId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ quantity });
        return res;
    } catch (err) {
        logger.error('Update item quantity failed', err);
    }
};

const deleteItem = async (accessToken, cartItemId) => {
    try {
        const res = await request(app)
            .delete(`/api/cart/items/${cartItemId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        return res;
    } catch (err) {
        logger.error('Delete item from cart failed', err);
    }
};

const clearCart = async (accessToken) => {
    try {
        const res = await request(app)
            .delete('/api/cart')
            .set('Authorization', `Bearer ${accessToken}`);
        return res;
    } catch (err) {
        logger.error('Clear cart failed', err);
    }
};

module.exports = { getCart, addItem, updateItemQuantity, deleteItem, clearCart };