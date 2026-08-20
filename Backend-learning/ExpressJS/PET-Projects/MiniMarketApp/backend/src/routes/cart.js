// path: backend/src/routes/cart.js
const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/auth');
const validation = require('../middlewares/validation');
const { addItemSchema, updateItemQuantitySchema } = require('../validators/cartValidator');

router.get('/', authMiddleware, cartController.getCart);
router.post('/items', authMiddleware, validation(addItemSchema), cartController.addItem);
router.put('/items/:id', authMiddleware, validation(updateItemQuantitySchema), cartController.updateItemQuantity);
router.delete('/items/:id', authMiddleware, cartController.deleteCartItem);
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;