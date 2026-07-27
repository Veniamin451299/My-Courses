// path: backend/src/routes/index.js
const { Router } = require('express');
const toDoRouter = require('./toDoRouter');

const router = Router();

router.use('/health', (_req, res) => {
    res.json({ 
        status: 'OK',
        message: 'TODO API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'Object TODO DB', 
    });
});

// Подключение роутов
router.use('/todo', toDoRouter);

module.exports = router;