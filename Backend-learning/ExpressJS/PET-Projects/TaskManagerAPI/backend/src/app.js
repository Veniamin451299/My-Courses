// path: backend/src/app.js
const express = require('express');
const config = require('./config/env');
const redis = require('./config/redis');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorResponse');
const helmet = require('helmet');

const app = express();
let server = null;

// подключение json формата для POST реквестов
app.use(express.json());
app.use(helmet());

// логирование запросов в режиме разработки
if (config.nodeEnv === 'development') { 
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// подключение API роуты
app.use('/api', routes);

// подкючение обработка ошибок
app.use(errorHandler);

// Запуск сервера
async function startServer() { 
    try {
        const port = config.port;

        // 1. Сначала запускаем Redis, чтобы не занимать порт, если БД недоступна
        await redis.connect();

        // 2. Запускаем Express сервер
        server = app.listen(port, () => {
            console.log('');
            console.log('TODO API Server');
            console.log(`Server successfully started on port ${port}`);
            console.log(`Mode: ${config.nodeEnv}`);
            console.log(`Timestamp: ${new Date().toISOString()}`);
            console.log('');
        });

        // 3. Отслеживаем ошибки сокета (например, если порт занят)
        server.on('error', (error) => { 
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Please free the port or change config.`);
                process.exit(1);
            }
        }); 

    } catch (error) { 
        console.error('Failed to start server: ', error);
        process.exit(1);
    }
}

// Общая функция для безопасного завершения работы
const handleShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Stopping server...`);
    
    // Проверяем, запущен ли сервер на самом деле
    if (server && server.listening) {
        try {
            await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
            console.log('Server connection closed gracefully.');
        } catch (error) {
            console.error('Error during server close:', error);
        }
    } else {
        console.log('Server was not active, skipping socket close.');
    }
    
    // Закрываем соединение с Redis, если оно активно
    if (redis && redis.isOpen) {
        try {
            await redis.quit();
            console.log('Redis client disconnected.');
        } catch (err) {
            console.error('Error disconnecting Redis:', err);
        }
    }

    process.exit(0);
};

// Обработка завершения процесса
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

module.exports = {
    app,
    startServer
};
