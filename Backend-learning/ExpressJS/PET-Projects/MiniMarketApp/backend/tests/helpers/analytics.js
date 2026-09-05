// path: backend/tests/helpers/analytics.js
const request = require('supertest');
const { app } = require('../../src/app');
const logger = require('../../src/config/logger');

const getTopProducts = async (accessToken, limit = 10) => {
    try {
        const res = await request(app)
            .get(`/api/analytics/top-products?limit=${limit}`)
            .set('Authorization', `Bearer ${accessToken}`);
        return res;
    } catch (error) {
        logger.error(`Error fetching top products: ${error.message}`);
    }
};

const getRevenue = async (accessToken, period = 'month') => {
    try {
        const res = await request(app)
            .get(`/api/analytics/revenue?period=${period}`)
            .set('Authorization', `Bearer ${accessToken}`);
        return res;
    } catch (error) {
        logger.error(`Error fetching revenue: ${error.message}`);
    }
};

const getUserStats = async (accessToken) => {
    try {
        const res = await request(app)
            .get('/api/analytics/user-stats')
            .set('Authorization', `Bearer ${accessToken}`);
        return res;
    } catch (error) {
        logger.error(`Error fetching user stats: ${error.message}`);
    }
};

module.exports = { getTopProducts, getRevenue, getUserStats };