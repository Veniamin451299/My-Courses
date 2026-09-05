// path: /backend/tests/cart.test.js
const request = require('supertest');
const { app } = require('../src/app');
const redisClient = require('../src/config/redis');
const prisma = require('../src/config/prisma');
const hashId = require('../src/utils/hashid');
const cache = require('../src/utils/cache');
const { getCart, addItem, updateItemQuantity, deleteItem, clearCart } = require('./helpers/cart');
const { adminLogin, userLogin, createUserAndLogin } = require('./helpers/auth');
const { createProducts } = require('./helpers/product');

describe('Cart API', () => {
    let adminTokens, userTokens, newUserTokens, categoryId, productId, cartItemId;

    beforeAll(async () => {
        await redisClient.connect();
        await cache.delPattern('products:*'); 

        adminTokens = await adminLogin();
        userTokens = await userLogin("ivanov@email.com", "12345678");
        newUserTokens = await createUserAndLogin(`petrov${Date.now()}@email.com`, `12345678${Date.now()}`);
        if (!adminTokens || !userTokens || !newUserTokens) {
            logger.error('Failed to get auth tokens');
        }

        const category = await prisma.category.findFirst();
        if (!category) throw new Error('No category found in DB');
        categoryId = hashId.generateHash(category.id);

        const productRes = await createProducts(adminTokens.accessToken, `Cart Product${Date.now()}`, `desc${Date.now()}`, 10.3, 5, ['https://picsum.photos/200/300'], categoryId, true);
        productId = productRes.body.data.id;
    });

    afterAll(async () => {
        await redisClient.quit();
    });
// GET Cart test for all roles
    it('Should get empty cart for new user', async () => {
        const res = await getCart(newUserTokens.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.items).toBeInstanceOf(Array);
    });

    it('Should get cart for user', async () => {
        const res = await getCart(userTokens.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.items).toBeInstanceOf(Array);
    });

    it('Should get cart for admin', async () => {
        const res = await getCart(adminTokens.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.items).toBeInstanceOf(Array);
    });
// USER Role test
    it('Should add item to cart by user', async () => {
        const res = await addItem(userTokens.accessToken, productId, 2);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.items.length).toBeGreaterThan(0);
        cartItemId = res.body.data.items[0].id;
    });

    it('Should update item quantity', async () => {
        const res = await updateItemQuantity(userTokens.accessToken, cartItemId, 5);
        expect(res.statusCode).toBe(200);
        const item = res.body.data.items.find(i => i.id === cartItemId);
        expect(item.quantity).toBe(5);
    });

    it('Should delete item from cart', async () => {
        const res = await deleteItem(userTokens.accessToken, cartItemId);
        expect(res.statusCode).toBe(200);
        // Проверяем, что позиции больше нет
        const cart = await getCart(userTokens.accessToken);
        const exists = cart.body.data.items.some(i => i.id === cartItemId);
        expect(exists).toBe(false);
    });

    it('Should clear cart', async () => {
        // Сначала добавим несколько товаров
        await addItem(userTokens.accessToken, productId, 1);
        await addItem(userTokens.accessToken, productId, 2);

        const res = await clearCart(userTokens.accessToken);
        expect(res.statusCode).toBe(200);
        const cart = await getCart(userTokens.accessToken);
        expect(cart.body.data.items.length).toBe(0);
        expect(Number(cart.body.data.totalPrice)).toBe(0);
    });
// ADMIN Role test
    it('Should add item to cart by admin', async () => {
        const res = await addItem(adminTokens.accessToken, productId, 2);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.items.length).toBeGreaterThan(0);
        cartItemId = res.body.data.items[0].id;
    });

    it('Should update item quantity by admin', async () => {
        const res = await updateItemQuantity(adminTokens.accessToken, cartItemId, 5);
        expect(res.statusCode).toBe(200);
        const item = res.body.data.items.find(i => i.id === cartItemId);
        expect(item.quantity).toBe(5);
    });

    it('Should delete item from cart by admin', async () => {
        const res = await deleteItem(adminTokens.accessToken, cartItemId);
        expect(res.statusCode).toBe(200);
        // Проверяем, что позиции больше нет
        const cart = await getCart(adminTokens.accessToken);
        const exists = cart.body.data.items.some(i => i.id === cartItemId);
        expect(exists).toBe(false);
    });

    it('Should clear cart by admin', async () => {
        const res = await clearCart(adminTokens.accessToken);
        expect(res.statusCode).toBe(200);
        const cart = await getCart(adminTokens.accessToken);
        expect(cart.body.data.items.length).toBe(0);
        expect(Number(cart.body.data.totalPrice)).toBe(0);
    });
});