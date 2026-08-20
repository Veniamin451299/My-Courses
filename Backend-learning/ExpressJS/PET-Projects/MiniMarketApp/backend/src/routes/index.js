// path: backend/src/routes/index.js
const router = require('express').Router();
const authRouter = require('./auth');
const productRouter = require('./products');
const cartRouter = require('./cart');

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
router.use('/products', productRouter);
router.use('/cart', cartRouter);

module.exports = router;