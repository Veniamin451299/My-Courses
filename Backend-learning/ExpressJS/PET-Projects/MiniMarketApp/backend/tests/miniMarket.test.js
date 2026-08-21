// path: backend/tests/miniMarket.test.js
const request = require('supertest');
const {app} = require('../src/app');
const redisClient = require('../src/config/redis');
const prisma = require('../src/config/prisma');

let authToken = 'None';

beforeAll(async () => {
    await redisClient.connect();
    
    // Генерируем уникальный email для этого прогона тестов, чтобы не было конфликтов в БД
    const testEmail = `testuser${Date.now()}@email.com`;
    const testPassword = `secretPassword${Date.now()}`;
  
    // 2. Шаг первый: Регистрируем нового пользователя
    await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
      });

    // 3. Шаг второй: Логинимся под этим же пользователем, чтобы получить токен
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    if (loginResponse.body && loginResponse.body.data) {
        authToken = loginResponse.body.data.accessToken;
    }

    // 4. Вытаскиваем токен из структуры твоего authController.login
    // В твоём коде было: res.status(200).json({ data: { accessToken } })
    console.log('\n==================================================');
    console.log('СГЕНЕРИРОВАННЫЙ ТОКЕН ДЛЯ ТЕСТОВ:', authToken);
    console.log('==================================================\n'); 
});

// После тестов отключаем Redis и БД
afterAll(async () => {
    await redisClient.quit();
    await prisma.$disconnect();
});

describe('GET /api/health', () => {
    it('Should return 200 OK & correct JSON response', async () => {
        // Симулируем реальный HTTP-запрос
        const response = await request(app)
            .get('/api/health');
        // Проверяем ожидания (Assertions)
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('(200) OK');
        expect(response.body).toHaveProperty('database');
    });
});

describe('GET /api/auth/me', () => {
    it('Should return 200 OK & user data to JSON structure', async () => {
        // Симулируем реальный HTTP-запрос
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${authToken}`);
        // Проверяем ожидания (Assertions)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get user successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('role');
    });
});


