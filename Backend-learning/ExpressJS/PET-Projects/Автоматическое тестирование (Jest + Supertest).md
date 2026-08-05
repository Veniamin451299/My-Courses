*Мы полностью собрали наш идеальный сервер (Express, Валидация Zod, Безопасность Helmet + Санитизация, База Postgres + Prisma, Авторизация JWT и Кэш Redis). Пришло время покрыть это тестами!*

В бэкенде тесты пишут для того, чтобы при добавлении новых фич случайно не сломать старые. Мы напишем **Интеграционные тесты** — они будут имитировать реальные действия пользователя.

Как это устроена архитектура тестов:
1. Мы используем фреймворк **Jest** (он запускает тесты и проверяет утверждения).
2. Мы используем библиотеку **Supertest** (она умеет запускать наше `app` в виртуальной среде и слать туда настоящие HTTP-запросы `.post()`, `.get()`, передавая заголовки и body).

# Шаг 1. Подготовка и установка

Чтобы тесты могли запускать наше приложение, в `app.js` нужно сделать одно изменение: перенеси вызов `startServer()` в отдельный файл (например, `src/server.js`), а из самого `app.js` просто сделай экспорт: `module.exports = app;`. Это нужно, чтобы Jest мог импортировать само приложение, но не запускал его на реальном порту при каждом тесте.

Установи пакеты:
```bash
npm install jest supertest --save-dev
```

# Шаг 2. Пишем наш первый тестовый сценарий

Создай файл `backend/tests/todo.test.js`. Давай напишем тест для эндпоинта проверки здоровья (Health Check), который не требует авторизации:
```javascript
const request = require('supertest');
const app = require('../src/app'); // Импортируем наше экспресс-приложение
const redisClient = require('../src/config/redis');

// Перед всеми тестами подключаем Redis
beforeAll(async () => {
    await redisClient.connect();
});

// После всех тестов закрываем Redis, чтобы Jest не зависал в консоли
afterAll(async () => {
    await redisClient.quit();
});

describe('GET /api/health', () => {
    it('Должен вернуть статус 200 и правильный JSON структуры', async () => {
        // Симулируем реальный HTTP-запрос!
        const response = await request(app)
            .get('/api/health');

        // Проверяем ожидания (Assertions)
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('OK');
        expect(response.body).toHaveProperty('database');
    });
});
```

# Шаг 3. Как тестировать роуты с JWT?

Для тестирования приватных роутов (например, `POST /api/tasks`) нам нужно в блоке `beforeAll` сначала сделать запрос на `/api/auth/register` или login, получить токен, сохранить его в переменную, а затем передавать его в заголовках:

```javascript
let authToken = '';

describe('POST /api/tasks', () => {
    it('Должен успешно создать задачу, если передан валидный токен', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`) // 🌟 Подкладываем токен!
            .send({
                title: 'Тестовая задача',
                description: 'Описание теста'
            });

        expect(response.statusCode).toBe(201); // Или 200, в зависимости от твоего контроллера
        expect(response.body.data).toHaveProperty('id'); // ID должен быть замаскирован
    });
});
```

---

# Твое финальное задание:

1. Вынеси `startServer()` из `app.js` в `server.js`, а в `app.js` в самом конце добавь `module.exports = app;`.
2. Настрой в `package.json` скрипт для запуска тестов: `"test": "jest"`.
3. Создай файл `backend/tests/todo.test.js` и попробуй написать тесты для:
    - Роута `/api/health`.
    - Ошибочного запроса на `/api/tasks` без токена (тест должен ожидать статус `401`).