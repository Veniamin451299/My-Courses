// path: backend/src/routes/index.js
const { Router } = require('express');
const booksRouter = require('./bookRouter');

const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Books API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        dataBase: 'object booksDatabase',
    });
});

// Подключение роутов
router.use('/books', booksRouter);

module.exports = router;
