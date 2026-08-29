// path: backend/tests/categories.test.js
const request = require('supertest');
const { app } = require('../src/app');
const redisClient = require('../src/config/redis');
const prisma = require('../src/config/prisma');
const { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } = require('./helpers/category');
const { adminLogin, userLogin } = require('./helpers/auth');

describe('Categories API', () => {
    let adminTokens, userTokens, categoryId;
    const userEmail = "ivanov@email.com";
    const userPassword = "12345678";

    beforeAll(async () => {
        await redisClient.connect();

        adminTokens = await adminLogin();
        userTokens = await userLogin(userEmail, userPassword);
        if (!adminTokens || !userTokens) {
            logger.error('Failed to get auth tokens');
        }
    });

    afterAll(async () => {
        await redisClient.quit();
    });

    it('Should get all categories', async () => {
        const response = await getCategories();
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get categories successfully');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0]).toHaveProperty('name');
        expect(response.body.data[0]).toHaveProperty('description');
    });
    

    it('Should create category by admin', async () => {
        const response = await createCategory(adminTokens.accessToken,
             `Test category ${Date.now()}`, `Test description ${Date.now()}`);
        expect(response.statusCode).toBe(201);
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
        categoryId = response.body.data.id;
    });

    it('Shouldn\'t create category by user', async () => {
        const response = await createCategory(userTokens.accessToken,
             `Test category ${Date.now()}`, `Test description ${Date.now()}`);
        expect(response.statusCode).toBe(403);
    });

    it('Should get category by id', async () => {
        const response = await getCategoryById(categoryId);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get category successfully');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
    });


    it('Should update category by admin', async () => {
        const response = await updateCategory(adminTokens.accessToken, categoryId,
             `Updated Test category ${Date.now()}`, `Updated Test description ${Date.now()}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
    });

    it('Shouldn\'t update category by user', async () => {
        const response = await updateCategory(userTokens.accessToken, categoryId,
             `Updated Test category ${Date.now()}`, `Updated Test description ${Date.now()}`);
        expect(response.statusCode).toBe(403);
    });

    it('Should delete category by admin', async () => {
        const response = await deleteCategory(adminTokens.accessToken, categoryId);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
    });

    it('Shouldn\'t delete category by user', async () => {
        const response = await deleteCategory(userTokens.accessToken, categoryId);
        expect(response.statusCode).toBe(403);
    });
});