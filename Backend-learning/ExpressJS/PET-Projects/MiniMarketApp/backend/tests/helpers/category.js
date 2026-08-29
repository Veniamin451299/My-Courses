// path: backend/tests/helpers/category.js
const request = require('supertest');
const { app } = require('../../src/app');
const config = require('../../src/config/env');
const logger = require('../../src/config/logger');

const getCategories = async () => {
    try{ 
        const response = await request(app)
        .get('/api/categories');
        return response;
    } catch (err) {
        logger.error('Get categories failed', err);
    }
};

const createCategory = async (accessToken, name, description = "Empty") => {
    try {
        const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name, description });
        return response;        
    } catch (err) {
        logger.error('Create category failed', err);
    }
};

const getCategoryById = async (categoryId) => {
    try{ 
        const response = await request(app)
        .get(`/api/categories/${categoryId}`);
        return response;
    } catch (err) {
        logger.error('Get category by id failed', err);
    }
};

const updateCategory = async (accessToken, categoryId, name, description = "Empty") => {
    try {
        const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name, description });
        return response;
    } catch (err) {
        logger.error('Update category failed', err);
    }
};

const deleteCategory = async (accessToken, categoryId) => {
    try { 
        const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`);
        return response; 
    } catch (err) {
        logger.error('Delete category failed', err);
    }
};

module.exports = {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};