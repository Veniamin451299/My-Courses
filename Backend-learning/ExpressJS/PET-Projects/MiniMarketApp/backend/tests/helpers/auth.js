// path: backend/tests/helpers/auth.js
const request = require('supertest');
const { app } = require('../../src/app');
const config = require('../../src/config/env');
const logger = require('../../src/config/logger');

const adminLogin = async () => {
    try{ 
        const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: config.adminEmail,
            password: config.adminPassword
        });
        if (response.body?.data) {
            return {
                response,
                accessToken: response.body.data.accessToken,
                refreshToken: response.body.data.refreshToken
            };
        }
    } catch (err) {
        logger.error('Admin login failed', err);
        return null;
    }
};

const userLogin = async (email, password) => {
    try {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password });

        if (response.body?.data) {
            return {
                response,
                accessToken: response.body.data.accessToken,
                refreshToken: response.body.data.refreshToken
            };
        }
    } catch (err) {
        logger.error('User login failed', err);
        return null;
    }
};

const createUserAndLogin = async (email, password) => {
    try {
        await request(app)
        .post('/api/auth/register')
        .send({ email, password });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password });

        if (response.body?.data) {
            return {
                response,
                accessToken: response.body.data.accessToken,
                refreshToken: response.body.data.refreshToken
            };
        }
    } catch (err) {
        logger.error('User login failed', err);
    }
};

const refreshToken = async (refreshToken) => {
    try {
        const response = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken });

        if (response.status === 200 && response.body?.accessToken) {
            return {
                response,
                accessToken: response.body.accessToken,
                refreshToken: response.body.refreshToken
            };
        } else {
            console.error('Refresh failed:', response.status, response.body);
            return null;
        }
    } catch (err) {
        logger.error('Refresh token failed', err);
        return null;
    }
};

const meResponse = async (accessToken) => {
    try {
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${accessToken}`);
        return response;
    } catch (err) {
        logger.error('Me request failed', err);
    }
};

const logout = async (accessToken) => {
    try {
        await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);
    } catch (err) {
        logger.error('Logout failed', err);
    }
};

module.exports = {
    adminLogin,
    userLogin,
    createUserAndLogin,
    refreshToken,
    meResponse,
    logout
};