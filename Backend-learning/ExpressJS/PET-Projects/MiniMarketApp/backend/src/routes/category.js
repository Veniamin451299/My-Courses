// path: backend/src/routes/category.js
const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware,adminMiddleware} = require('../middlewares/auth');
const validation = require('../middlewares/validation');
const { createCategorySchema, updateCategorySchema } = require('../validators/categoryValidator');

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authMiddleware, adminMiddleware, validation(createCategorySchema), categoryController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, validation(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

module.exports = router;