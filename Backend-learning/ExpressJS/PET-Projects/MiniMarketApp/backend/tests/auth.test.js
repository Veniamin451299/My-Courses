// path: backend/tests/auth.test.js
const request = require('supertest');
const { app } = require('../src/app');
const redisClient = require('../src/config/redis');
const prisma = require('../src/config/prisma');
const { adminLogin, createUserAndLogin, refreshToken, meResponse, logout } = require('./helpers/auth');

describe('Auth API', () => {
    let testEmail, testPassword;
    let adminTokens, userTokens;

    beforeAll(async () => {
        await redisClient.connect();
        testEmail = `testuser${Date.now()}@email.com`;
        testPassword = `secretPassword${Date.now()}`;

        adminTokens = await adminLogin();
        userTokens = await createUserAndLogin(testEmail, testPassword);
    });

    afterAll(async () => {
        await redisClient.quit();
        await prisma.$disconnect();
    });

    it('Should login as user', () => {
        expect(userTokens.response.statusCode).toBe(200);
        expect(userTokens.accessToken).toBeDefined();
        expect(userTokens.refreshToken).toBeDefined();
    });

    it('Should login as admin', () => {
        expect(adminTokens.response.statusCode).toBe(200);
        expect(adminTokens.accessToken).toBeDefined();
        expect(adminTokens.refreshToken).toBeDefined();
    });

    it('Should refresh admin token', async () => {
        const newTokens = await refreshToken(adminTokens.refreshToken);
        expect(newTokens.response.statusCode).toBe(200);
        expect(newTokens.accessToken).toBeDefined();
        expect(newTokens.refreshToken).toBeDefined();
    });

    it('Should refresh user token', async () => {
        const newTokens = await refreshToken(userTokens.refreshToken);
        expect(newTokens.response.statusCode).toBe(200);
        expect(newTokens.accessToken).toBeDefined();
        expect(newTokens.refreshToken).toBeDefined();
    });

    it('Should return 200 OK & user data to JSON structure', async () => {
        const response = await meResponse(userTokens.accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get user successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('role');
    });

    it('Should return 200 OK & admin data to JSON structure', async () => {
        const response = await meResponse(adminTokens.accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get user successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('role');
    });

    it('Should logout user', async () => {
        await expect(logout(userTokens.accessToken)).resolves.not.toThrow();
    });

    it('Should logout admin', async () => {
        await expect(logout(adminTokens.accessToken)).resolves.not.toThrow();
    });
});