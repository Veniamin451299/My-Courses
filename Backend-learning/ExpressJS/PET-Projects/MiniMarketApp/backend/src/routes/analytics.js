// path: backend/src/routes/analytics.js
const router = require('express').Router()
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware, adminMiddleware} = require('../middlewares/auth');

router.post('/event', authMiddleware, adminMiddleware, analyticsController.createEventAnalytics);
router.get('/top-products', authMiddleware, adminMiddleware, analyticsController.getTopProducts);
router.get('/revenue', authMiddleware, adminMiddleware, analyticsController.getRevenue);
router.get('/user-stats', authMiddleware, adminMiddleware, analyticsController.getUserStats);

module.exports = router;