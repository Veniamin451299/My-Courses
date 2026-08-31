// path: backend/tests/helpers/product.js
const request = require('supertest');
const { app } = require('../../src/app');
const config = require('../../src/config/env');
const logger = require('../../src/config/logger');

const getProducts = async (page = 1, limit = 10, category, name ) => {
    try{ 
        const query = { page, limit };
        if (category) query.category = category;
        if (name) query.name = name;
        const response = await request(app)
            .get('/api/products')
            .query(query);
        return response;
    } catch (err) {
        logger.error('Get products failed', err);
    }
};

const createProducts = async (accessToken, name, description = "Empty", price, stock,
     images, categoryId, isActive) => {
    try {
        const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name, description, price, stock, images, categoryId, isActive });
        return response;        
    } catch (err) {
        logger.error('Create products failed', err);
    }
};

const getProductById = async (productId) => {
    try{ 
        const response = await request(app)
        .get(`/api/products/${productId}`);
        return response;
    } catch (err) {
        logger.error('Get product by id failed', err);
    }
};

const updateProduct = async (accessToken, productId, name, description = "Empty", 
    price, stock, images, categoryId, isActive) => {
    try {
        const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name, description, price, stock, images, categoryId, isActive });
        return response;
    } catch (err) {
        logger.error('Update product failed', err);
    }
};

const deleteProduct = async (accessToken, productId) => {
    try { 
        const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`);
        return response; 
    } catch (err) {
        logger.error('Delete product failed', err);
    }
};

module.exports = {
    getProducts,
    createProducts,
    getProductById,
    updateProduct,
    deleteProduct
};