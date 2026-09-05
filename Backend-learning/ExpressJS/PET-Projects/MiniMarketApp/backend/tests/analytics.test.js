// path: /backend/tests/analytics.test.js
const request = require('supertest');
const { app } = require('../src/app');
const redisClient = require('../src/config/redis');
const cache = require('../src/utils/cache');
const { getTopProducts, getRevenue, getUserStats } = require('./helpers/analytics');
const { adminLogin, userLogin, createUserAndLogin } = require('./helpers/auth');

describe('Analytics API', () => {
    let adminTokens, userTokens;

    beforeAll(async () => {
        await redisClient.connect();
        await cache.delPattern('products:*');

        adminTokens = await adminLogin();
        userTokens = await userLogin("ivanov@email.com", "12345678");
    });

    afterAll(async () => {
        await redisClient.quit();
    });

// USER role tests
    it('Should not allow user to access analytics', async () => {
        const res1 = await getTopProducts(userTokens.accessToken);
        expect(res1.statusCode).toBe(403);
    });

    it('Should not allow user to get revenue', async () => {
        const res = await getRevenue(userTokens.accessToken);
        expect(res.statusCode).toBe(403);
    });

    it('Should not allow user to get user stats', async () => {
        const res = await getUserStats(userTokens.accessToken);
        expect(res.statusCode).toBe(403);
    });

// ADMIN role tests
    it('Should allow admin to get top products', async () => {
        const res = await getTopProducts(adminTokens.accessToken, 5);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThanOrEqual(0);
    });

    it('Should allow admin to get revenue', async () => {
        const res = await getRevenue(adminTokens.accessToken, 'month');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
    });

    it('Should allow admin to get user stats', async () => {
        const res = await getUserStats(adminTokens.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('totalUsers');
        expect(res.body.data).toHaveProperty('activeUsers');
        expect(res.body.data).toHaveProperty('newUsers');
    });
});