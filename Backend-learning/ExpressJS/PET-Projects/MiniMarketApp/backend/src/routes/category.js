// path: backend/src/routes/category.js
const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const validation = require('../middlewares/validation');
const { createCategorySchema, updateCategorySchema } = require('../validators/categoryValidator');

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', validation(createCategorySchema), categoryController.createCategory);
router.put('/:id', validation(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;