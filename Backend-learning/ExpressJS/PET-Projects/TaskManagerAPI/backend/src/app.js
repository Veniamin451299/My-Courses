// path: backend/src/app.js
const express = require('express');
const config = require('./config/env');
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

        server = app.listen(port, () => {
            console.log(`Server is started on pory ${port}`);
        });

        // проверка порта
        server.on('error', (error) => { 
            if(error.code === 'EADDRINUSE') {
                console.warn(`Port ${config.port} is already in use. Trying to find another free port.`);
            }
        }); 

        console.log('');
        console.log('TODO API Server');
        console.log(`Starting server on port ${port}...`);
        console.log(`Mode: ${config.nodeEnv}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log('');
    } catch (error) { 
        console.error('Failed to start server: ', error);
        process.exit(1);
    }
}

// Обработка завершения
process.on('SIGINT', async () => { 
    console.log('\nStopping server...');
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
});

process.on('SIGTERM', async () => { 
    console.log('\nStopping server...');
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
});

// Старт
startServer();