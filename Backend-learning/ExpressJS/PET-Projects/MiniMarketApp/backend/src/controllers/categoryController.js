// path: backend/src/controller/categoryController.js
const categoryService = require('../services/categoriesService');
const { NotFoundError, BadRequestError } = require('../middlewares/errors/errorHandler');
const hashId = require('../utils/hashid');

class CategoryController {
    /** GET controller for get all categories
     * @route GET /categories
     * @access Public
     * **/
    async getCategories(req, res, next) {
        try {
            const result = await categoryService.getCategories(); // допустим, возвращает { data: [...] }
            const categories = result.data || result; // fallback, если вдруг массив
            if (!Array.isArray(categories)) {
                return next(new BadRequestError('Invalid data format'));
            }
            const hashed = categories.map(cat => ({ ...cat, id: hashId.generateHash(cat.id) }));
            res.json({ message: 'Categories retrieved', data: hashed });
        } catch (err) {
            next(new BadRequestError(err.message));
        }
    };

    /** GET controller for get category by id
     * @route GET /categories/:id
     * @access Public
     * **/ 
    async getCategoryById(req, res, next) {
        try {
            const decodedCategoryId = hashId.decodeHash(req.params.id);
            if (!decodedCategoryId) return next(new BadRequestError('Invalid category id'));

            const category = await categoryService.getCategoryById(decodedCategoryId);
            if (!category) return next(new NotFoundError('Category not found'));

            category.id = hashId.generateHash(category.id);
            res.json({
                message: "Get category successfully",
                data: category
            });
        } catch (error) {
            next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** (ADMIN) POST controller for create category
     * @route POST /categories
     * @access Private
     * **/
    async createCategory(req, res, next) {
        try {
            const createdCategory = await categoryService.createCategory(req.body);
            if (!createdCategory) return next(new BadRequestError('Create category failed'));

            createdCategory.id = hashId.generateHash(createdCategory.id);
            res.status(201).json({
                message: "Create category successfully",
                data: createdCategory
            });
        } catch (error) {
            next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** (ADMIN) PUT controller for update category
     * @route PUT /categories/:id
     * @access Private
     * **/
    async updateCategory(req, res, next) {
        try {
            const decodedCategoryId = hashId.decodeHash(req.params.id);
            if (!decodedCategoryId) return next(new BadRequestError('Invalid category id'));

            const updatedCategory = await categoryService.updateCategory(decodedCategoryId, req.body);
            if (!updatedCategory) return next(new NotFoundError('Category not found'));

            updatedCategory.id = hashId.generateHash(updatedCategory.id);
            res.status(200).json({
                message: "Update category successfully",
                data: updatedCategory
            });
        } catch (error) {
            next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** (ADMIN) DELETE controller for delete category
     * @route DELETE /categories/:id
     * @access Private
     * **/
    async deleteCategory(req, res, next) {
        try {
            const decodedCategoryId = hashId.decodeHash(req.params.id);
            if (!decodedCategoryId) return next(new BadRequestError('Invalid category id'));

            const deletedCategory = await categoryService.deleteCategory(decodedCategoryId);
            if (!deletedCategory) return next(new NotFoundError('Category not found'));
            
            deletedCategory.id = hashId.generateHash(deletedCategory.id);
            res.status(200).json({
                message: "Delete category successfully",
                data: deletedCategory
            });
        } catch (error) {
            next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };
}

module.exports = new CategoryController();