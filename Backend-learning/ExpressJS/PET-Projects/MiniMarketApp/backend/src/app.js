const express = require('express');
const config = require('./config/env');
const errorHandler = require('./middlewares/errors/errorResponse');
const helmet = require('helmet');
const router = require('./routes');
const redis = require('./config/redis');
const pino = require('./config/logger');
const limiter = require('./middlewares/rateLimiter');

const app = express();
let server = null;

app.use(express.json());
app.use(helmet());
app.use(pino());
app.use(limiter);


// Логирование запросов в devmode
if (config.nodeEnv === 'development') {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    })
}

app.use('/api', router);
app.use(errorHandler);

async function startServer() {
    try {
        const port = config.port;
        await redis.connect();

        server = app.listen(port, () => {
            console.log('');
            console.log('MimiMarketApp API Server');
            console.log(`Server successfully started on port ${port}`);
            console.log(`Local URL: http://localhost:${port}`);
            console.log('DATABASE_URL:', process.env.DATABASE_URL);
            console.log(`Mode: ${config.nodeEnv}`);
            console.log(`Timestamp: ${new Date().toISOString()}`);
            console.log('');
        });

        server.on('error', (err) => {
           if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use. Please free the port or change config.`);
            process.exit(1);
           }
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

// Общая функция для безопасной остановки сервера
const handleServerShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down server...`);

    // Проверяем, запущен ли сервер
    if (server && server.listening) {
        try {
            await new Promise((resolve, reject) => {
                server.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            console.log('Server connection closed gracefully.');
        } catch (err) {
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

// Обработка сигналов завершения
process.on('SIGINT', () => handleServerShutdown('SIGINT'));
process.on('SIGTERM', () => handleServerShutdown('SIGTERM'));

module.exports = { app, startServer };