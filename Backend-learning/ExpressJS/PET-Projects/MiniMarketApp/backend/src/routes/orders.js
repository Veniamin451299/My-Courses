// path: backend/src/routes/orders.js
const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const validation = require('../middlewares/validation');
const { updateOrderStatusSchema } = require('../validators/orderValidator');

router.get('/', authMiddleware, orderController.getAllOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.post('/', authMiddleware, orderController.createOrder);
router.put('/:id', authMiddleware, adminMiddleware, validation(updateOrderStatusSchema),
 orderController.updateOrderStatus);

module.exports = router;