// path: backend/src/routes/products.js
const router = require('express').Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const validation = require('../middlewares/validation');
const { createProductSchema, updateProductSchema } = require('../validators/productValidator');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, adminMiddleware, validation(createProductSchema), productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, validation(updateProductSchema), productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;