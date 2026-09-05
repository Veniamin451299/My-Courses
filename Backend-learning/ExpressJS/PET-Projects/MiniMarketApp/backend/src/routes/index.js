// path: backend/src/routes/index.js
const router = require('express').Router();
const authRouter = require('./auth');
const productRouter = require('./products');
const cartRouter = require('./cart');
const orderRouter = require('./orders');
const analyticsRouter = require('./analytics');
const categoryRouter = require('./category');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

router.use('/health', (_req, res) => {
    res.json({
        status: '(200) OK',
        message: 'Mini-Market API server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'PostgreSQL'
    });
});

router.use(
  '/api-docs',
  (_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/analytics', analyticsRouter);

module.exports = router;