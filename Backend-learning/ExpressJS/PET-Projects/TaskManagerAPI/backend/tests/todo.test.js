const request = require('supertest');
const app = require('../src/app');
const redisClient = require('../src/config/redis');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

let authToken = 'None';

// Перед всеми тестами подключаем Redis и симулируем логин/ррегистрацию тестового пользователя
beforeAll(async () => {
  // 1. Подключаем Redis
  await redisClient.connect();

  // Генерируем уникальный email для этого прогона тестов, чтобы не было конфликтов в БД
  const testEmail = `testuser_${Date.now()}@test.com`;
  const testPassword = 'super-password-123';

  // 2. Шаг первый: Регистрируем нового пользователя
  await request(app)
    .post('/api/auth/register')
    .send({
      email: testEmail,
      password: testPassword
    });

  // 3. Шаг второй: Логинимся под этим же пользователем, чтобы получить токен
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: testEmail,
      password: testPassword
    });

  // 4. Вытаскиваем токен из структуры твоего authController.login
  // В твоём коде было: res.status(200).json({ data: { token: token } })
  if (loginResponse.body && loginResponse.body.data) {
    authToken = loginResponse.body.data.token;
  }

  console.log('\n==================================================');
  console.log('СГЕНЕРИРОВАННЫЙ ТОКЕН ДЛЯ ТЕСТОВ:', authToken);
  console.log('==================================================\n');
});

// После тестов отключаем Redis и БД
afterAll(async () => {
  redisClient.quit();
  await prisma.$disconnect();
});

describe('GET /api/health', () => {
    it('Должен вернуть 200 и правильный JSON структуру', async () => {
        // Симулируем реальный HTTP-запрос
        const response = await request(app)
            .get('/api/health');

        // Проверяем ожидания (Assertions)
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('OK');
        expect(response.body).toHaveProperty('database');
    });
});

describe('POST /api/tasks', () => { 
    it('Должен успешно создать задачу, если передан валидный токен', async () => { 
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Тестовая задача',
                description: 'Описание тестовой задачи',
            });
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id'); // ID должен быть замаскирован
    });
});