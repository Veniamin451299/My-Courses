// path: backend/src/app.js
const express = require('express');
const router = require('./routes/index');
const config = require('./config/env');
const errorHandler = require('./middleware/ErrorHandler');

const app = express();
let server = null;

app.use(express.json());

// Логирование запросов в режиме разработки
if(config.nodeEnv === 'development') {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// API роуты
app.use('/api', router);

// Обработка ошибок
app.use(errorHandler);

// Запуск сервера с повторами запуска
function listenWithFallback(startPort, maxRetries = 10) {
    return new Promise((resolve, reject) => {
        const tryListen = (port, retriesLeft) => {
            server = app.listen(port, () => {
                resolve(port);
            });

            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE' && maxRetries > 0) {
                    const nextPort = port + 1;
                    console.warn(`Port ${port} is already in use. Trying ${nextPort}...`);
                    tryListen(nextPort, retriesLeft - 1);
                    return;
                }
                reject(error);
            });
        }
        tryListen(startPort, maxRetries);
    });
}
// Запуск сервера
async function startServer() {
    try {
        const port = await listenWithFallback(config.port);
        console.log('');
        console.log('Books API Server');
        console.log(`Server started on port ${port}`);
        console.log(`Mode: ${config.nodeEnv}`);
        console.log(`Timestamp: ${new Date().toLocaleDateString('ru-RU')}`);
        console.log('');
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Обработка завершения
process.on('SIGINT', async () => {
    console.log('Server stopped!');
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) reject(error);
                else resolve();
             });
        });
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Server stopped!');
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) reject(error);
                else resolve();
             });
        });
    }
    process.exit(0);
});

// Запуск
startServer();