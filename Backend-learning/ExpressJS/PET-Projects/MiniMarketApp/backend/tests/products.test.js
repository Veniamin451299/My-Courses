// path: backend/tests/products.test.js
const request = require('supertest');
const { app } = require('../src/app');
const redisClient = require('../src/config/redis');
const prisma = require('../src/config/prisma');
const hashId = require('../src/utils/hashid');
const cache = require('../src/utils/cache');
const { getProducts, createProducts, getProductById, updateProduct, deleteProduct } = require('./helpers/product');
const { adminLogin, userLogin } = require('./helpers/auth');

describe('Categories API', () => {
    let adminTokens, userTokens, productId, categoryId;
    const userEmail = "ivanov@email.com";
    const userPassword = "12345678";

    beforeAll(async () => {
        await redisClient.connect();
        await cache.delPattern('products:*'); 

        adminTokens = await adminLogin();
        userTokens = await userLogin(userEmail, userPassword);
        if (!adminTokens || !userTokens) {
            logger.error('Failed to get auth tokens');
        }

        const category = await prisma.category.findFirst();
        if (!category) throw new Error('No category found in DB');
        categoryId = hashId.generateHash(category.id);
    });

    afterAll(async () => {
        await redisClient.quit();
    });

    // Without filters and pagination
    it('Should get all products', async () => {
        const response = await getProducts();
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Products retrieved successfully');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0]).toHaveProperty('name');
        expect(response.body.data[0]).toHaveProperty('description');
        expect(response.body.data[0]).toHaveProperty('price');
        expect(response.body.data[0]).toHaveProperty('stock');
        expect(response.body.data[0]).toHaveProperty('images');
        expect(response.body.data[0]).toHaveProperty('categoryId');
        expect(response.body.data[0]).toHaveProperty('isActive');
    });
    

    it('Should create product by admin', async () => {
        const response = await createProducts(adminTokens.accessToken,
             `Test product ${Date.now()}`, `Test description ${Date.now()}`, 2.76, 67, 
            ['https://picsum.photos/200/300', 'https://picsum.photos/200/301'],
             categoryId, true);
        expect(response.statusCode).toBe(201);
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('price');
        expect(response.body.data).toHaveProperty('stock');
        expect(response.body.data).toHaveProperty('images');
        expect(response.body.data).toHaveProperty('categoryId');
        expect(response.body.data).toHaveProperty('isActive');
        if (response.statusCode === 201) productId = response.body.data.id;
    });

    it('Shouldn\'t create product by user', async () => {
        const response = await createProducts(userTokens.accessToken,
             `Test product ${Date.now()}`, `Test description ${Date.now()}`, 2.76, 67, 
            ['https://picsum.photos/200/300', 'https://picsum.photos/200/301'], 
            categoryId, true);
        expect(response.statusCode).toBe(403);
    });

    // With filters and pagination
    it('Should get all products', async () => {
        const response = await getProducts(1, 10, categoryId, 'Test product');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Products retrieved successfully');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0]).toHaveProperty('name');
        expect(response.body.data[0]).toHaveProperty('description');
        expect(response.body.data[0]).toHaveProperty('price');
        expect(response.body.data[0]).toHaveProperty('stock');
        expect(response.body.data[0]).toHaveProperty('images');
        expect(response.body.data[0]).toHaveProperty('categoryId');
        expect(response.body.data[0]).toHaveProperty('isActive');
    });

    it('Should get product by id', async () => {
        const response = await getProductById(productId);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Product retrieved successfully');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('price');
        expect(response.body.data).toHaveProperty('stock');
        expect(response.body.data).toHaveProperty('images');
        expect(response.body.data).toHaveProperty('categoryId');
        expect(response.body.data).toHaveProperty('isActive');
    });


    it('Should update product by admin', async () => {
        const response = await updateProduct(adminTokens.accessToken, productId,
             `Updated Test product ${Date.now()}`, `Updated Test description ${Date.now()}`, 3.76, 228, 
            ['https://picsum.photos/200/300', 'https://picsum.photos/200/301', 
             'https://picsum.photos/200/302'], categoryId, true);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('price');
        expect(response.body.data).toHaveProperty('stock');
        expect(response.body.data).toHaveProperty('images');
        expect(response.body.data).toHaveProperty('categoryId');
        expect(response.body.data).toHaveProperty('isActive');
    });

    it('Shouldn\'t update category by user', async () => {
        const response = await updateProduct(userTokens.accessToken, productId,
             `Updated Test product ${Date.now()}`, `Updated Test description ${Date.now()}`, 3.76, 228, 
            ['https://picsum.photos/200/300', 'https://picsum.photos/200/301', 
             'https://picsum.photos/200/302'], categoryId, true);
        expect(response.statusCode).toBe(403);
    });

    it('Should delete product by admin', async () => {
        const response = await deleteProduct(adminTokens.accessToken, productId);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
    });

    it('Shouldn\'t delete product by user', async () => {
        const response = await deleteProduct(userTokens.accessToken, productId);
        expect(response.statusCode).toBe(403);
    });
});