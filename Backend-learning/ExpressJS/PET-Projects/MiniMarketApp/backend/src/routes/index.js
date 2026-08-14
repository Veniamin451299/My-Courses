// path: backend/src/routes/index.js
const router = require('express').Router();
const authRouter = require('./auth');

router.use('/health', (_req, res) => {
    res.json({
        status: '(200) OK',
        message: 'Mini-Market API server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'PostgreSQL'
    });
});

router.use('/auth', authRouter);

module.exports = router;