# 🛒 MiniMarket API

REST API для интернет-магазина с ролевой моделью (пользователь / администратор).
Реализованы все ключевые бизнес-процессы: товары, категории, корзина, заказы, аналитика.
Проект написан на Node.js + Express, использует Prisma ORM, PostgreSQL, Redis, контейнеризирован с помощью Docker.

## 🚀 Особенности
    🔐 Аутентификация через JWT с refresh‑токенами (хранятся в Redis)
    🔄 Логирование с Pino
    💾 Кеширование товаров и категорий в Redis
    📋 Запросы к базе данных в Prisma ORM
    🧑‍💼 Ролевая модель – обычные пользователи и администраторы
    📦 Товары и категории – CRUD, пагинация, фильтрация, поиск
    🛒 Корзина – добавление, изменение количества, удаление, очистка
    📋 Заказы – создание из корзины, история, получение по ID, обновление статуса (только админ)
    📊 Аналитика – топ продуктов, выручка по периодам, статистика пользователей (только админ)
    ⚡ Кеширование – Redis для часто запрашиваемых данных (товары, категории)
    🧪 Тестирование – интеграционные тесты (Jest + Supertest) покрывают все сценарии
    📄 Документация – Swagger UI (OpenAPI 3.0.4)
    🐳 Docker – готов к запуску в контейнере одной командой

## 🛠️ Технологии
Слой	Технологии
Backend	Node.js, Express.js, Prisma ORM
База данных	PostgreSQL, Redis
Аутентификация	JWT, bcrypt, helmet, express-rate-limit
Документация	Swagger / OpenAPI 3.0.4
Тестирование	Jest, Supertest
Логирование	Pino
Контейнеризация	Docker, Docker Compose
Валидация	Joi
📦 Установка и запуск
🔹 Через Docker (рекомендуется)

    Клонируйте репозиторий:

bash

git clone https://github.com/your-username/minimarket-api.git
cd minimarket-api/backend

    Скопируйте пример переменных окружения и настройте:

bash

cp .env.example .env

    Запустите контейнеры:

bash

docker-compose up -d

    Примените миграции и заполните БД тестовыми данными:

bash

docker-compose exec api npx prisma migrate deploy
docker-compose exec api npx prisma db seed

API будет доступно по адресу: http://localhost:3000
Swagger UI: http://localhost:3000/api-docs
🔹 Локальный запуск (без Docker)
bash

npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev

Убедитесь, что PostgreSQL и Redis запущены, а переменные окружения указаны в .env.
🧪 Тестирование

Все тесты написаны с использованием Jest и Supertest.
bash

# Все тесты
npm test

# Конкретный файл
npm test auth.test.js

Запуск тестов внутри Docker:
bash

docker-compose exec api npm test

📄 Swagger Документация

После запуска приложения откройте:
👉 http://localhost:3000/api-docs

Документация содержит описание всех эндпоинтов, схемы данных, примеры запросов и ответов.
Поддерживается авторизация через Bearer Token (кнопка Authorize в Swagger UI).
📁 Структура проекта
text

backend/
├── prisma/                     # Prisma схема, миграции, seed
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── src/
│   ├── config/                 # Конфигурации (env, prisma, redis, logger)
│   ├── controllers/            # Обработчики HTTP-запросов
│   ├── middlewares/            # Аутентификация, валидация, ошибки, rate limiting
│   ├── repositories/           # Слой доступа к данным (Prisma)
│   ├── routes/                 # Маршруты
│   ├── services/               # Бизнес-логика
│   ├── utils/                  # Утилиты (hashid, jwt, bcrypt, cache)
│   ├── validators/             # Joi-схемы
│   ├── app.js                  # Настройка Express
│   └── server.js               # Точка входа
├── tests/                      # Интеграционные тесты
│   ├── helpers/                # Вспомогательные функции для тестов
│   └── *.test.js
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md

🧠 Архитектура

Проект построен по принципам чистой архитектуры и SOLID:

    Репозитории – единственное место, где происходит взаимодействие с БД через Prisma.

    Сервисы – содержат бизнес-логику, транзакции, кеширование и инвалидацию.

    Контроллеры – обрабатывают запросы, вызывают сервисы и формируют ответ.

    Ми́длвари – аутентификация, валидация, rate limiting, обработка ошибок.

    Валидаторы – Joi-схемы для защиты от невалидных данных.

Такой подход обеспечивает тестируемость, масштабируемость и лёгкость поддержки.
🔐 Переменные окружения

Создайте файл .env в корне проекта и заполните:
env

# Сервер
PORT=3000
NODE_ENV=development

# База данных
DATABASE_URL=postgresql://postgres:password@postgres:5432/minimarket?schema=public

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-secret-key-min-32-characters
HASHID_SALT=your-hashid-salt

# Администратор (создаётся при seed)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!

📌 Планы по развитию

    □

    Добавить CI/CD (GitHub Actions)
    □

    Написать нагрузочные тесты (k6)
    □

    Перейти на NestJS + TypeScript
    □

    Внедрить GraphQL как альтернативный интерфейс
    □

    Настроить мониторинг (Prometheus + Grafana)
    □

    Деплой на облачную платформу (Render / Railway)

🤝 Автор

Ваше Имя
GitHub: @your-username
Telegram: @your-telegram

    Проект создан в рамках PET-проекта для портфолио.
    Любые вопросы и предложения приветствуются!