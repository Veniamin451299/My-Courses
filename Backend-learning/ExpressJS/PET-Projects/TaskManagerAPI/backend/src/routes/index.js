// path: backend/src/routes/index.js
const { Router } = require('express');
const toDoRouter = require('./toDoRouter');
const authRouter = require('./authRouter');

const router = Router();

router.use('/health', (_req, res) => {
    res.json({ 
        status: 'OK',
        message: 'TODO API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'TODO POSTGRESQL DB',
    });
});

// Подключение роутов
router.use('/tasks', toDoRouter);
router.use('/auth', authRouter);

module.exports = router;