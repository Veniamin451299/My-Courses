// path: /backend/tests/order.test.js
const request = require('supertest');
const { app } = require('../src/app');
const redisClient = require('../src/config/redis');
const prisma = require('../src/config/prisma');
const hashId = require('../src/utils/hashid');
const cache = require('../src/utils/cache');
const { getOrders, getOrderById, createOrder, updateOrderStatus } = require('./helpers/order');
const { adminLogin, userLogin, createUserAndLogin } = require('./helpers/auth');
const { createProducts } = require('./helpers/product');
const { addItem } = require('./helpers/cart');

describe('Orders API', () => {
    let adminTokens, userTokens, categoryId, orderId;
    const address = {
        city: 'Minsk',
        street: 'Lenina',
        house: '12',
        apartment: '12'
    };

    beforeAll(async () => {
        await redisClient.connect();
        await cache.delPattern('products:*');

        adminTokens = await adminLogin();
        userTokens = await userLogin("ivanov@email.com", "12345678");
        if(!adminTokens || !userTokens) {
            logger.error('Failed to get auth tokens');
        }

        const category = await prisma.category.findFirst();
        if (!category) throw new Error('No category found in DB');
        categoryId = hashId.generateHash(category.id);

        // Создаём корзину с товарами (используем те же helpers от product)
        // И затем создаём заказ
        const productRes = await createProducts(adminTokens.accessToken, `Cart Product${Date.now()}`, `desc${Date.now()}`, 10.3, 5, ['https://picsum.photos/200/300'], categoryId, true);
        const productId = productRes.body.data.id;
        await addItem(userTokens.accessToken, productId, 2);
        await addItem(adminTokens.accessToken, productId, 3);
    });

    afterAll(async () => {
        await redisClient.quit();
    });
// USER role tests
    it('Should get order history by user', async () => {
        const res = await getOrders(userTokens.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('Should create order from cart by user', async () => {
        const res = await createOrder(userTokens.accessToken, address);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.totalPrice);
        orderId = res.body.data.id;
    });

    it('Should get order by id by user', async () => {
        const res = await getOrderById(userTokens.accessToken, orderId);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.id).toBe(orderId);
    });

    it('Should not allow user to update order status', async () => {
        const res = await updateOrderStatus(userTokens.accessToken, orderId, 'PAID');
        expect(res.statusCode).toBe(403);
    });

    it('Should allow admin to update order status for user', async () => {
        const res = await updateOrderStatus(adminTokens.accessToken, orderId, 'PAID');
        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe('PAID');
    });

// ADMIN role tests
    it('Should get order history by admin', async () => {
        const res = await getOrders(adminTokens.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('Should create order from cart by admin', async () => {
        const res = await createOrder(adminTokens.accessToken, address);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.totalPrice);
        orderId = res.body.data.id;
    });

    it('Should get order by id by admin', async () => {
        const res = await getOrderById(adminTokens.accessToken, orderId);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.id).toBe(orderId);
    });

    it('Should allow admin to update own order status', async () => {
        const res = await updateOrderStatus(adminTokens.accessToken, orderId, 'PAID');
        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe('PAID');
    });
});